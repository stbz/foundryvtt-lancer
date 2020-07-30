/**
 * TypeScript entry file for Foundry VTT.
 * Registers custom settings, sheets, and constants using the Foundry API.
 * 
 * Author: Eranziel
 * Content License: LANCER is copyright 2019, Massif Press Inc.
 * Software License: GNU GPLv3
 */

// Import TypeScript modules
import { LANCER } from './module/config';
const lp = LANCER.log_prefix;
import { LancerGame } from './module/lancer-game';
import { LancerActor, lancerActorInit } from './module/actor/lancer-actor';
import { LancerItem, lancerItemInit, LancerNPCFeature } from './module/item/lancer-item';
import { DamageData, LancerPilotActorData, TagDataShort, LancerNPCActorData } from './module/interfaces';

// Import applications
import { LancerPilotSheet } from './module/actor/pilot-sheet';
import { LancerNPCSheet } from './module/actor/npc-sheet';
import { LancerDeployableSheet } from './module/actor/deployable-sheet';
import { LancerItemSheet } from './module/item/item-sheet';
import { LancerFrameSheet } from './module/item/frame-sheet';
import { LancerNPCClassSheet } from './module/item/npc-class-sheet';

// Import helpers
import { preloadTemplates } from './module/preloadTemplates';
import { registerSettings } from './module/settings';
import { renderCompactTag, renderChunkyTag, renderFullTag } from './module/item/tags';
import * as migrations from './module/migration.js';

// Import JSON data
import data from 'lancer-data';

/* ------------------------------------ */
/* Initialize system                    */
/* ------------------------------------ */
Hooks.once('init', async function() {
	console.log(`Initializing LANCER RPG System ${LANCER.ASCII}`); 

	// Assign custom classes and constants here
	// Create a Lancer namespace within the game global
	(game as LancerGame).lancer = {
		applications: {
			LancerPilotSheet,
			LancerNPCSheet,
			LancerDeployableSheet,
			LancerItemSheet,
		},
		entities: {
			LancerActor,
			LancerItem,
		},
		rollStatMacro: rollStatMacro,
		rollAttackMacro: rollAttackMacro,
		rollTechMacro: rollTechMacro,
    rollTriggerMacro: rollTriggerMacro,
		migrations: migrations,
	};

	// Record Configuration Values
	CONFIG.Actor.entityClass = LancerActor;
	CONFIG.Item.entityClass = LancerItem;

	// Register custom system settings
	registerSettings();

    // Register Web Components
    customElements.define('card-clipped', class LancerClippedCard extends HTMLDivElement {}, {extends: 'div'})

	// Preload Handlebars templates
	await preloadTemplates();

	// Register sheet application classes
	Actors.unregisterSheet("core", ActorSheet);
	Actors.registerSheet("lancer", LancerPilotSheet, { types: ["pilot"], makeDefault: true });
	Actors.registerSheet("lancer", LancerNPCSheet, { types: ["npc"], makeDefault: true });
	Actors.registerSheet("lancer", LancerDeployableSheet, { types: ["deployable"], makeDefault: true });
	Items.unregisterSheet("core", ItemSheet);
	Items.registerSheet("lancer", LancerItemSheet, { 
		types: ["skill", "talent", "license", "core_bonus", 
			"pilot_armor", "pilot_weapon", "pilot_gear", 
			"mech_system", "mech_weapon",
			"npc_template", "npc_feature"], 
		makeDefault: true 
	});
	Items.registerSheet("lancer", LancerFrameSheet, { types: ["frame"], makeDefault: true });
	Items.registerSheet("lancer", LancerNPCClassSheet, { types: ["npc_class"], makeDefault: true });

	// Register handlebars helpers

	// inc, for those off-by-one errors
	Handlebars.registerHelper('inc', function(value) {
		return parseInt(value) + 1;
	});

	// dec, for those off-by-one errors
	Handlebars.registerHelper('dec', function(value) {
		return parseInt(value) - 1;
	});

  // get an index from an array
  Handlebars.registerHelper('idx', function(array, index) {
    return array[index];
  });

	// invert the input
	Handlebars.registerHelper('neg', function(value) {
		return parseInt(value) * -1;
	});

	// double the input
	Handlebars.registerHelper('double', function(value) {
		return parseInt(value) * 2;
	});

	// Equal-to evaluation
	Handlebars.registerHelper('eq', function(val1, val2) {
		return val1 === val2;
	});

	// Equal-to evaluation
	Handlebars.registerHelper('neq', function(val1, val2) {
		return val1 !== val2;
	});

	// Greater-than evaluation
	Handlebars.registerHelper('gt', function(val1, val2) {
		return val1 > val2;
	});

	// Greater-than evaluation after applying parseInt to both values
	Handlebars.registerHelper('gtpi', function(val1, val2) {
    val1 = parseInt(val1);
    val2 = parseInt(val2);
		return val1 > val2;
	});

	// Less-than evaluation
	Handlebars.registerHelper('lt', function(val1, val2) {
		return val1 < val2;
	});

	// Greater-than evaluation after applying parseInt to both values
	Handlebars.registerHelper('ltpi', function(val1, val2) {
    val1 = parseInt(val1);
    val2 = parseInt(val2);
		return val1 < val2;
	});

	Handlebars.registerHelper('lower-case', function(str: string) {
		return str.toLowerCase();
	});

	Handlebars.registerHelper('upper-case', function(str: string) {
		return str.toUpperCase();
	});

  Handlebars.registerHelper('compact-tag', renderCompactTag);
  Handlebars.registerHelper('chunky-tag', renderChunkyTag);
	Handlebars.registerHelper('full-tag', renderFullTag);

	Handlebars.registerHelper('tier-selector', (tier, key) => {
		let template = `<select id="tier-type" class="tier-control" data-action="update">
		<option value="npc-tier-1" ${tier === 'npc-tier-1' ? 'selected' : ''}>TIER 1</option>
		<option value="npc-tier-2" ${tier === 'npc-tier-2' ? 'selected' : ''}>TIER 2</option>
		<option value="npc-tier-3" ${tier === 'npc-tier-3' ? 'selected' : ''}>TIER 3</option>
		<option value="npc-tier-custom" ${tier === 'npc-tier-custom' ? 'selected' : ''}>CUSTOM</option>
	</select>`
	return template;
	});
	
	// mount display mount
	Handlebars.registerHelper('mount-selector', (mount, key) => {
		let template = `<select id="mount-type" class="mounts-control" data-action="update" data-item-id=${key}>
	        <option value="Main" ${mount.type === 'Main' ? 'selected' : ''}>Main Mount</option>
	        <option value="Heavy" ${mount.type === 'Heavy' ? 'selected' : ''}>Heavy Mount</option>
	        <option value="Aux-Aux" ${mount.type === 'Aux-Aux' ? 'selected' : ''}>Aux/Aux Mount</option>
	        <option value="Main-Aux" ${mount.type === 'Main-Aux' ? 'selected' : ''}>Main/Aux Mount</option>
	        <option value="Flex" ${mount.type === 'Flex' ? 'selected' : ''}>Flexible Mount</option>
	        <option value="Integrated" ${mount.type === 'Integrated' ? 'selected' : ''}>Integrated Mount</option>
        </select>`
        return template;
  });
  
  Handlebars.registerPartial('mech-weapon-preview', 
    `<div class="flexcol clipped lancer-weapon-container weapon" style="max-height: fit-content;" data-item-id="{{key}}">
      <div class="lancer-weapon-header clipped-top item" style="grid-area: 1/1/2/3" data-item-id="{{weapon._id}}">
        <i class="cci cci-weapon i--m i--light"> </i>
        <span class="minor">{{weapon.name}} // {{upper-case weapon.data.mount}} {{upper-case weapon.data.weapon_type}}</span>
        <a class="stats-control i--light" data-action="delete"><i class="fas fa-trash"></i></a>
      </div> 
      <div class="lancer-weapon-body">
        <a class="roll-attack" style="grid-area: 1/1/2/2;"><i class="fas fa-dice-d20 i--m i--dark"></i></a>
        <div class="flexrow" style="grid-area: 1/2/2/3; text-align: left; white-space: nowrap;">
        {{#each weapon.data.range as |range rkey|}}
            {{#if range.val}}
            {{#if (gtpi rkey "0")}}<span class="flexrow" style="align-items: center; justify-content: center; max-width: min-content;"> // </span>{{/if}}
            <div class="compact-range">
                <i class="cci cci-{{lower-case range.type}} i--m i--dark"></i>
                <span class="medium">{{range.val}}</span>
            </div>
            {{/if}}
        {{/each}}
        <hr class="vsep">
        {{#each weapon.data.damage as |damage dkey|}}
            {{#if damage.type}}
            <div class="compact-damage">
                <i class="card clipped cci cci-{{lower-case damage.type}} i--m damage--{{damage.type}}"></i>
                <span class="medium">{{damage.val}}</span>
            </div>
            {{/if}}
        {{/each}}
        </div>
        {{#with weapon.data.effect as |effect|}}
        <div class="flexcol" style="grid-area: 2/1/2/3; text-align: left; white-space: wrap">
          {{#if effect.effect_type}}
            <h3 class="medium flexrow">{{upper-case effect.effect_type}} EFFECT</h3>
            <span class="effect-text">{{{effect.hit}}}</span>
          {{/if}}
          {{#unless effect.effect_type}}<span class="effect-text">{{{effect}}}</span>{{/unless}}
          </div>
        {{/with}}
        <div class="flexrow" style="justify-content: flex-end; grid-area: 4/1/5/3">
          {{#each weapon.data.tags as |tag tkey|}}
          {{{compact-tag tag}}}
          {{/each}}
        </div>
      </div>
    </div>`
  );
  
	/*
	* Repeat given markup with given times
	* provides @index for the repeated iteraction
	*/
	Handlebars.registerHelper("repeat", function (times, opts) {
	    var out = "";
	    var i;
	    var data = {};

	    if ( times ) {
	        for ( i = 0; i < times; i += 1 ) {
	            data["index"] = i;
	            out += opts.fn(this, {
	                data: data
	            });
	        }
	    } else {

	        out = opts.inverse(this);
	    }

	    return out;
	});
});

/* ------------------------------------ */
/* Setup system			            				*/
/* ------------------------------------ */
Hooks.once('setup', function() {
  // Do anything after initialization but before
  // ready
});

/* ------------------------------------ */
/* When ready                           */
/* ------------------------------------ */
Hooks.once('ready', function() {

  // Determine whether a system migration is required and feasible
  const currentVersion = game.settings.get("lancer", "systemMigrationVersion");
  // TODO: implement/import version comparison for semantic version numbers
  // const NEEDS_MIGRATION_VERSION = "0.0.4";
  // const COMPATIBLE_MIGRATION_VERSION = "0.0.4";
  // let needMigration = (currentVersion < NEEDS_MIGRATION_VERSION) || (currentVersion === null);

  // Perform the migration
  // TODO: replace game.system.version with needMigration once version number checking is implemented
  if ( currentVersion != game.system.data.version && game.user.isGM ) {
    // if ( currentVersion && (currentVersion < COMPATIBLE_MIGRATION_VERSION) ) {
      //   ui.notifications.error(`Your LANCER system data is from too old a Foundry version and cannot be reliably migrated to the latest version. The process will be attempted, but errors may occur.`, {permanent: true});
      // }
      migrations.migrateWorld();
    }

  });

// Add any additional hooks if necessary
Hooks.on("preCreateActor", lancerActorInit);
Hooks.on("preCreateItem", lancerItemInit);

function getMacroSpeaker(): Actor | null {
	// Determine which Actor to speak as
	const speaker = ChatMessage.getSpeaker();
	console.log(`${lp} Macro speaker`, speaker);
	let actor: Actor;
	// console.log(game.actors.tokens);
	try {
		if (speaker.token) actor = game.actors.tokens[speaker.token].actor;
	} catch (TypeError) {
		// Need anything here?
	}
	if (!actor) actor = game.actors.get(speaker.actor, {strict : false}) as Actor;
	if (!actor) {
		ui.notifications.warn(`Failed to find Actor for macro. Do you need to select a token?`);
		return null;
	}
	return actor;
}

async function renderMacro(actor: Actor, template: string, templateData: any) {
	const html = await renderTemplate(template, templateData)
	let chat_data = {
		user: game.user,
		type: CONST.CHAT_MESSAGE_TYPES.IC,
		speaker: {
			actor: actor
		},
		content: html
	};
	let cm = await ChatMessage.create(chat_data);
	cm.render();
	return Promise.resolve();
}

async function rollTriggerMacro(title: string, modifier: number, sheetMacro: boolean = false) {
  let actor: Actor = getMacroSpeaker();
  if (actor === null) return;
  console.log(`${lp} rollTriggerMacro actor`, actor);

  // Get accuracy/difficulty with a prompt
	let acc: number = 0;
	let abort: boolean = false;
	await promptAccDiffModifier().then(resolve => acc = resolve, reject => abort = true);
	if (abort) return;

  // Do the roll
  let acc_str = acc != 0 ? ` + ${acc}d6kh1` : '';
  let roll = new Roll(`1d20+${modifier}${acc_str}`).roll();

  const roll_tt = await roll.getTooltip();

  // Construct the template
  const templateData = {
    title: title,
    roll: roll,
    roll_tooltip: roll_tt,
    effect: null
  };

  const template = `systems/lancer/templates/chat/stat-roll-card.html`
  return renderMacro(actor, template, templateData);
}

async function rollStatMacro(title: string, statKey: string, effect?: string, sheetMacro: boolean = false) {
	// Determine which Actor to speak as
	let actor: Actor = getMacroSpeaker();
	if (actor === null) return;
	console.log(`${lp} rollStatMacro actor`, actor);

	let bonus: any;
	const statPath = statKey.split(".");
	// Macros rolled directly from the sheet provide a stat key referenced from actor.data
	if (sheetMacro) {
		bonus = actor.data;
		// bonus = actor[`data.${statKey}`];
		// console.log(`${lp} actor.data`, actor['data']['data']);
	}
	else {
		bonus = actor;
	}
	for (let i = 0; i < statPath.length; i++) {
		const p = statPath[i];
		bonus = bonus[`${p}`];
	}
	console.log(`${lp} rollStatMacro `, statKey, bonus);

  // Get accuracy/difficulty with a prompt
  let acc: number = 0;
	let abort: boolean = false;
	await promptAccDiffModifier().then(resolve => acc = resolve, reject => abort = true);
	if (abort) return;

	// Do the roll
	let acc_str = acc != 0 ? ` + ${acc}d6kh1` : '';
	let roll = new Roll(`1d20+${bonus}${acc_str}`).roll();

	const roll_tt = await roll.getTooltip();

	// Construct the template
	const templateData = {
		title: title,
		roll: roll,
		roll_tooltip: roll_tt,
		effect: effect ? effect : null
	};
	const template = `systems/lancer/templates/chat/stat-roll-card.html`
	return renderMacro(actor, template, templateData);
}

async function rollAttackMacro(w: string, a: string) {
  // Determine which Actor to speak as
  let actor: Actor = getMacroSpeaker();
  if (actor === null) return;

  // Get the item
  const item: Item = game.actors.get(a).getOwnedItem(w);
	console.log(`${lp} Rolling attack macro`, item, w, a);
	if (!item) {
    ui.notifications.error(`Error rolling attack macro - could not find Item ${w} owned by Actor ${a}!`);
    return Promise.resolve();
	}
  else if (!item.isOwned) {
    ui.notifications.error(`Error rolling attack macro - ${item.name} is not owned by an Actor!`);
    return Promise.resolve();
  }

  let title: string = item.name;
  let grit: number = 0;
  let acc: number = 0;
  let damage: DamageData[];
  let effect: string;
  let tags: TagDataShort[];
	const wData = item.data.data;
  if (item.type === "mech_weapon") {
    grit = (item.actor.data as LancerPilotActorData).data.pilot.grit;
    damage = wData.damage;
    tags = wData.tags;
    effect = wData.effect;
  }
  else if (item.type === "pilot_weapon") {
    grit = (item.actor.data as LancerPilotActorData).data.pilot.grit;
    damage = wData.damage;
    tags = wData.tags;
    effect = wData.effect;
  }
  else if (item.type === "npc_feature") {
		const tier = (item.actor.data as LancerNPCActorData).data.tier_num - 1;
		if (wData.attack_bonus && wData.attack_bonus[tier]) {
			grit = parseInt(wData.attack_bonus[tier]);
		}
		if (wData.accuracy && wData.accuracy[tier]) {
			acc = parseInt(wData.accuracy[tier]);
		}
		// Reduce damage values to only this tier
		damage = duplicate(wData.damage);
		damage.forEach(d => {
			d.val = d.val[tier];
		});
		tags = wData.tags;
		effect = wData.effect;
  }
  else {
    ui.notifications.error(`Error rolling attack macro - ${item.name} is not a weapon!`);
    return Promise.resolve();
  }
  console.log(`${lp} Attack Macro Item:`, item, grit, acc, damage);

  // Get accuracy/difficulty with a prompt
	let abort: boolean = false;
	await promptAccDiffModifier(acc).then(resolve => acc = resolve, reject => abort = true);
	if (abort) return;

  // Do the attack rolling
	let acc_str = acc != 0 ? ` + ${acc}d6kh1` : '';
	let atk_str = `1d20+${grit}${acc_str}`;
	console.log(`${lp} Attack roll string: ${atk_str}`)
  let attack_roll = new Roll(atk_str).roll();

  // Iterate through damage types, rolling each
  let damage_results = [];
  damage.forEach(async x => {
    const droll = new Roll(x.val.toString()).roll();
    const tt = await droll.getTooltip();
    damage_results.push({
      roll: droll,
      tt: tt,
      dtype: x.type,
    });
    return Promise.resolve();
  });

  // Output
	const attack_tt = await attack_roll.getTooltip();
  const templateData = {
    title: title,
    attack: attack_roll,
    attack_tooltip: attack_tt,
    damages: damage_results,
    effect: effect ? effect : null,
    tags: tags
  };

  const template = `systems/lancer/templates/chat/attack-card.html`;
  return renderMacro(actor, template, templateData);
}

async function rollTechMacro(t: string, a: string) {
  // Determine which Actor to speak as
  let actor: Actor = getMacroSpeaker();
  if (actor === null) return;

  // Get the item
  const item: Item = game.actors.get(a).getOwnedItem(t);
	console.log(`${lp} Rolling tech attack macro`, item, t, a);
	if (!item) {
    ui.notifications.error(`Error rolling tech attack macro - could not find Item ${t} owned by Actor ${a}!`);
    return Promise.resolve();
	}
  else if (!item.isOwned) {
    ui.notifications.error(`Error rolling tech attack macro - ${item.name} is not owned by an Actor!`);
    return Promise.resolve();
  }

  let title: string = item.name;
  let t_atk: number = 0;
  let acc: number = 0;
  let effect: string;
  let tags: TagDataShort[];
	const tData = item.data.data;
  if (item.type === "mech_system") {
    t_atk = (item.actor.data as LancerPilotActorData).data.mech.tech_attack;
    tags = tData.tags;
    effect = tData.effect;
  }
  else if (item.type === "npc_feature") {
		const tier = (item.actor.data as LancerNPCActorData).data.tier_num - 1;
		if (tData.attack_bonus && tData.attack_bonus[tier]) {
			t_atk = parseInt(tData.attack_bonus[tier]);
		}
		if (tData.accuracy && tData.accuracy[tier]) {
			acc = parseInt(tData.accuracy[tier]);
		}
		tags = tData.tags;
		effect = tData.effect;
  }
  else {
    ui.notifications.error(`Error rolling tech attack macro - ${item.name} does not a tech attack!`);
    return Promise.resolve();
  }
  console.log(`${lp} Tech Attack Macro Item:`, item, t_atk, acc);

  // Get accuracy/difficulty with a prompt
	let abort: boolean = false;
	await promptAccDiffModifier(acc).then(resolve => acc = resolve, reject => abort = true);
	if (abort) return;

  // Do the attack rolling
	let acc_str = acc != 0 ? ` + ${acc}d6kh1` : '';
	let atk_str = `1d20+${t_atk}${acc_str}`;
	console.log(`${lp} Tech Attack roll string: ${atk_str}`)
  let attack_roll = new Roll(atk_str).roll();

  // Output
	const attack_tt = await attack_roll.getTooltip();
  const templateData = {
    title: title,
    attack: attack_roll,
    attack_tooltip: attack_tt,
    effect: effect ? effect : null,
    tags: tags
  };

  const template = `systems/lancer/templates/chat/tech-attack-card.html`;
  return renderMacro(actor, template, templateData);
}

function promptAccDiffModifier(acc?: number) {
	if (!acc) acc = 0;
  let diff = 0;
  if (acc < 0) {
    diff = -acc;
    acc = 0;
  }
  let template = `
<form>
  <h2>Please enter your modifiers and submit, or close this window:</h2>
  <div class="flexcol">
    <label style="max-width: fit-content;">
      <i class="cci cci-accuracy i--m i--dark" style="vertical-align:middle;border:none"> </i> Accuracy:
      <input class="accuracy" type="number" min="0" value="${acc}">
    </label>
    <label style="max-width: fit-content;">
      <i class="cci cci-difficulty i--m i--dark" style="vertical-align:middle;border:none"> </i> Difficulty:
      <input class="difficulty" type="number" min="0" value="${diff}">
    </div>
</form>`
  return new Promise<number>((resolve, reject) => {
    new Dialog({
      title: "Accuracy and Difficulty",
      content: template,
      buttons: {
        submit: {
          icon: '<i class="fas fa-check"></i>',
          label: 'Submit',
          callback: async (dlg) => {
            let accuracy = <string>$(dlg).find('.accuracy').first().val();
            let difficulty = <string>$(dlg).find('.difficulty').first().val();
            let total = parseInt(accuracy) - parseInt(difficulty);
            console.log(`${lp} Dialog returned ${accuracy} accuracy and ${difficulty} resulting in a modifier of ${total}d6`);
            resolve(total);
          }
				},
				cancel: {
					icon: '<i class="fas fa-times"></i>',
					label: 'Cancel',
					callback: async () => {
						reject();
					}
				}
      },
      default: "submit",
      close: () => reject()
    }).render(true);
  });
}
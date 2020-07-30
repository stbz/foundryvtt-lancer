import { LancerSkill, 
  LancerTalent, 
  LancerCoreBonus, 
  LancerLicense, 
  LancerFrame, 
  LancerPilotArmor, 
  LancerPilotWeapon, 
  LancerPilotGear, 
  LancerMechWeapon, 
  LancerMechSystem,
  LancerNPCFeature, 
  LancerNPCClass, 
  LancerNPCTemplate } from './item/lancer-item';
import { DamageType, 
  RangeType, 
  WeaponSize, 
  WeaponType, 
  SystemType,
  MechType, 
  ItemType,
  NPCTag,
  NPCFeatureType } from './enums';
import { EffectData } from './item/effects'

// ------------------------------------------------------
// |       UTILITY DATA TYPES                           |
// ------------------------------------------------------

// TODO: several of these may be moved to classes later to enable specialized logic
// TODO: Range and Damage are good examples of objects that should be aware of their string representation and html representation

declare interface TagDataShort {
  id: string;
  val?: number | string;
}

declare interface TagData {
  id: string;
  name: string;
  description: string;
  val?: number | string;
  filter_ignore?: boolean;
  hidden?: boolean;
}

declare interface RangeData {
  type: RangeType;
  val: number;
  override?: boolean;
  bonus?: number;
}

declare interface DamageData {
  type: DamageType;
  val: string | number;
  override?: boolean;
}

declare interface NPCDamageData {
  type: DamageType;
  val: number[];
  override?: boolean;
}

// ------------------------------------------------------
// |       ACTOR DATA TYPES                             |
// ------------------------------------------------------

// ------- Actor data templates -------------------------
declare interface ResourceData {
  value: number;
  min: number;
  max: number;
}

declare interface LancerMechData {
  name: string;
  size: number;
  hull: number;
  agility: number;
  systems: number;
  engineering: number;
  hp: ResourceData;
  structure: ResourceData;
  heat: ResourceData;
  stress: ResourceData;
  repairs: ResourceData;
  armor: number;
  speed: number;
  evasion: number;
  edef: number;
  sensors: number;
  save: number;
  tech_attack: number;
  sp: number;
}

declare interface LancerMechLoadoutData {
  mounts: object[]; // TODO
  systems: LancerMechSystemData[];
}

// ------- Pilot data ----------------------------------
declare interface LancerPilotStatsData {
  size: number;
  hp: ResourceData;
  armor: number;
  evasion: number;
  edef: number;
  speed: number;
}

declare interface LancerPilotLoadoutData {
  armor: string;      // ID of armor Item
  weapons: string[];  // IDs of weapon Items
  gear: string[];     // IDs of gear Items
}

declare interface LancerPilotSubData {
  level: number;
  grit: number;
  callsign: string;
  name: string;
  status: string;
  notes: string;
  quirk: string;
  background: string;
  history: string;
  stats: LancerPilotStatsData;
  loadout: LancerPilotLoadoutData;
}

declare interface LancerPilotData {
  pilot: LancerPilotSubData;
  mech: LancerMechData;
  mech_loadout: LancerMechLoadoutData;
}

declare interface LancerPilotActorData extends ActorData {
  data: LancerPilotData;
}

declare interface LancerPilotSheetData extends ActorSheetData {
  actor: LancerPilotActorData;
  data: LancerPilotData;
  skills: LancerSkill[];
  talents: LancerTalent[];
  core_bonuses: LancerCoreBonus[];
  licenses: LancerLicense[];
  pilot_loadout: {
    armor: LancerPilotArmor[];
    weapons: LancerPilotWeapon[];
    gear: LancerPilotGear[];
  }
  frame: LancerFrame;
  frame_size: string;
  // TODO: subdivide into mounts
  mech_loadout: {
    weapons: LancerMechWeapon[];
    systems: LancerMechSystem[];
  }
  sp_used: number;
}

// ------- NPC data ---------------------------------------------
declare interface LancerNPCData {
  mech: LancerMechData;
  type: string;
  name: string;
  tier: string; //tier1-3 = 1-3 and custom = 4
  tier_num: number;
  tag: NPCTag;
  activations: number;
  npc_size: string;
}

declare interface LancerNPCActorData extends ActorData {
  data: LancerNPCData;
}

declare interface LancerNPCSheetData extends ActorSheetData {
  actor: LancerNPCActorData;
  data: LancerNPCData;
  npc_class: LancerNPCClass;
  npc_templates: LancerNPCTemplateData[];
  npc_features: LancerNPCFeature[];

}

// ------- Deployable data --------------------------------------
declare interface LancerDeployableData {
  name: string;
  size: number;
  hp: ResourceData;
  heat: ResourceData;
  armor: number;
  evasion: number;
  edef: number;
  description: string;
  effect: EffectData;
}

declare interface LancerDeployableActorData extends ActorData {
  data: LancerDeployableData;
}

declare interface LancerDeployableSheetData extends ActorSheetData {
  actor: LancerDeployableActorData;
  data: LancerDeployableData;
}

// ------------------------------------------------------
// |       ITEM DATA TYPES                             |
// ------------------------------------------------------

// -------- Item data templates -------------------------
declare interface LancerCompendiumItemData {
  id: string;
  name: string;
  description: string;
  note: string;
  item_type: ItemType;
  flavor_name: string;
  flavor_description: string;
}

declare interface LancerPilotEquipmentData {
  tags: TagData[];
}

declare interface LancerLicensedItemData extends LancerCompendiumItemData {
  source: string;
  license: string;
  license_level: number;
}

declare interface LancerMechEquipmentData {
  sp: number;
  uses: number;
  max_uses: number;
  max_use_override: number;
  destroyed: boolean;
  cascading: boolean;
  loaded: boolean;
  tags: TagData[];
  effect: EffectData;
  integrated: boolean;
  // TODO: not needed? Used in Comp/Con for some of its mech building logic.
  // talent_item: boolean; 
  // frame_id: boolean;
}


// -------- Skill Trigger data -----------------------------------
declare interface LancerSkillData {
  id: string;
  name: string;
  description: string;
  detail: string;
  rank: number;
}

declare interface LancerSkillItemData extends ItemData {
  data: LancerSkillData;
}

declare interface LancerSkillSheetData extends ItemSheetData {
  item?: LancerSkillItemData;
  data?: LancerSkillData;
}

// -------- Talent data ------------------------------------------
declare interface LancerTalentRank {
  name: string;
  description: string;
}

declare interface LancerTalentData {
  id: string;
  name: string;
  description: string;
  ranks: LancerTalentRank[];
  rank: number;
}

declare interface LancerTalentItemData extends ItemData {
  data: LancerTalentData;
}

declare interface LancerTalentSheetData extends ItemSheetData {
  item?: LancerTalentItemData;
  data?: LancerTalentData;
}

// -------- Core Bonus data --------------------------------------
declare interface LancerCoreBonusData {
  id: string;
  name: string;
  source: string;
  effect: EffectData;
  mounted_effect: string;
}

declare interface LancerCoreBonusItemData extends ItemData {
  data: LancerCoreBonusData;
}

declare interface LancerCoreBonusSheetData extends ItemSheetData {
  item?: LancerCoreBonusItemData;
  data?: LancerCoreBonusData;
}

// -------- License data -----------------------------------------
declare interface LancerLicenseRank {
  items: string[];
}

declare interface LancerLicenseData {
  name: string;
  source: string;
  ranks: LancerLicenseRank[];
  rank: number;
}

declare interface LancerLicenseItemData extends ItemData {
  data: LancerLicenseData;
}

declare interface LancerLicenseSheetData extends ItemSheetData {
  item?: LancerLicenseItemData;
  data?: LancerLicenseData;
}

// -------- Reserve data -----------------------------------------
// TODO: reserve data type

// -------- Pilot Armor data -------------------------------------
declare interface LancerPilotArmorData extends LancerCompendiumItemData, LancerPilotEquipmentData {
  hp_bonus: number;
  speed: number;
  speed_bonus: number;
  armor: number;
  edef: number;
  edef_bonus: number;
  evasion: number;
  evasion_bonus: number;
}

declare interface LancerPilotArmorItemData extends ItemData {
  data: LancerPilotArmorData;
}

declare interface LancerPilotArmorSheetData extends ItemSheetData {
  item?: LancerPilotArmorItemData;
  data?: LancerPilotArmorData;
}

// -------- Pilot Weapon data ------------------------------------
declare interface LancerPilotWeaponData extends LancerCompendiumItemData, LancerPilotEquipmentData {
  range: RangeData[];
  damage: DamageData[];
  effect: EffectData;
  custom_damage_type: DamageType;
}

declare interface LancerPilotWeaponItemData extends ItemData {
  data: LancerPilotWeaponData;
}

declare interface LancerPilotWeaponSheetData extends ItemSheetData {
  item?: LancerPilotWeaponItemData;
  data?: LancerPilotWeaponData;
}

// -------- Pilot Gear data --------------------------------------
declare interface LancerPilotGearData extends LancerCompendiumItemData, LancerPilotEquipmentData {
  uses: number;
  current_uses: number;
}

declare interface LancerPilotGearItemData extends ItemData {
  data: LancerPilotGearData;
}

declare interface LancerPilotGearSheetData extends ItemSheetData {
  item?: LancerPilotGearItemData;
  data?: LancerPilotGearData;
}

// -------- Frame data -------------------------------------------
declare interface LancerFrameStatsData {
  size: number;
  armor: number;
  hp: number;
  evasion: number;
  edef: number;
  heatcap: number;
  repcap: number;
  sensor_range: number;
  tech_attack: number;
  save: number;
  speed: number;
  sp: number;
}

declare interface LancerMechTraitData {
  name: string;
  description: string;
}

declare interface LancerCoreSystemData {
  name: string;
  description: string;
  integrated?: { id: string }
  passive_name?: string
  passive_effect?: string
  active_name: string;
  active_effect: string;
  tags: TagData[];
}

declare interface LancerFrameData extends LancerCompendiumItemData, LancerLicensedItemData {
  mechtype: MechType[];
  stats: LancerFrameStatsData;
  traits: LancerMechTraitData[];
  mounts: object[]; // TODO: replace with specific type
  core_system: LancerCoreSystemData;
}

declare interface LancerFrameItemData extends ItemData {
  data: LancerFrameData;
}

declare interface LancerFrameSheetData extends ItemSheetData {
  item?: LancerFrameItemData;
  data?: LancerFrameData;
}

// -------- Mech System data -------------------------------------
declare interface LancerMechSystemData extends LancerLicensedItemData, LancerMechEquipmentData {
  system_type: SystemType;
}

declare interface LancerMechSystemItemData extends ItemData {
  data: LancerMechSystemData;
}

declare interface LancerMechSystemSheetData extends ItemSheetData {
  item?: LancerMechSystemItemData;
  data?: LancerMechSystemData;
}

// -------- Mech Weapon data -------------------------------------
declare interface LancerMechWeaponData extends LancerLicensedItemData, LancerMechEquipmentData {
  mount: WeaponSize;
  weapon_type: WeaponType;
  damage: DamageData[];
  range: RangeData[];
  mod: object | null; // TODO: weapon mod type
  custom_damage_type: DamageType;
}

declare interface LancerMechWeaponItemData extends ItemData {
  data: LancerMechWeaponData;
}

declare interface LancerMechWeaponSheetData extends ItemSheetData {
  item?: LancerMechWeaponItemData;
  data?: LancerMechWeaponData;
}

// -------- NPC Class data -------------------------------------
declare interface LancerNPCClassStatsData {
  hp: number[];
  heatcap: number[];
  structure: number[];
  stress: number[];
  armor: number[];
  evasion: number[];
  edef: number[];
  speed: number[];
  sensor_range: number[];
  save: number[];
  activations: number[];
  size: number[];
  hull: number[];
  agility: number[];
  systems: number[];
  engineering: number[];
}

declare interface LancerNPCInfoData {
  flavour: string;
  tactics: string;
}

declare interface LancerNPCClassData extends LancerCompendiumItemData {
  mechtype: MechType;
  info: LancerNPCInfoData;
  stats: LancerNPCClassStatsData;
  base_features: string[];
  optional_features: string[];
}

declare interface LancerNPCClassItemData extends ItemData {
  data: LancerNPCClassData;
}

declare interface LancerNPCClassSheetData extends ItemSheetData {
  item?: LancerNPCClassItemData;
  data?: LancerNPCClassData;
}

// -------- NPC Template data -------------------------------------
declare interface LancerNPCTemplateData extends LancerCompendiumItemData{
  basefeatures: string[];
  optional_features: string[];
}

declare interface LancerNPCTemplateItemData extends ItemData {
  data: LancerNPCTemplateData;
}

declare interface LancerNPCTemplateSheetData extends ItemSheetData {
  item?: LancerNPCTemplateItemData;
  data?: LancerNPCTemplateData;
}

// -------- NPC Feature data -------------------------------------
declare interface LancerNPCFeatureData extends LancerCompendiumItemData{
  origin_type: string;
  origin_name: string;
  origin_base: boolean;
  feature_type: NPCFeatureType;
  effect?: string;
  bonus?: object;
  override?: object;
  tags: TagData[];
  destroyed: boolean;
  charged: boolean;
  uses: number;
  max_uses: number;
}

declare interface LancerNPCFeatureItemData extends ItemData {
  data: LancerNPCFeatureData;
}

declare interface LancerNPCFeatureSheetData extends ItemSheetData {
  item?: LancerNPCFeatureItemData;
  data?: LancerNPCFeatureData;
}

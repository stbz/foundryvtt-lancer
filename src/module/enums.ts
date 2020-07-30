enum MountType {
  Main = 'Main',
  Heavy = 'Heavy',
  AuxAux = 'Aux/Aux',
  Aux = 'Aux',
  MainAux = 'Main/Aux',
  Flex = 'Flex',
  Integrated = 'Integrated',
}

enum WeaponSize {
  Aux = 'Auxiliary',
  Main = 'Main',
  Heavy = 'Heavy',
  Superheavy = 'Superheavy',
}

enum WeaponType {
  Rifle = 'Rifle',
  Cannon = 'Cannon',
  Launcher = 'Launcher',
  CQB = 'CQB',
  Nexus = 'Nexus',
  Melee = 'Melee',
}

enum ItemType {
  None = '',
  Action = 'Action',
  CoreBonus = 'CoreBonus',
  Frame = 'Frame',
  PilotArmor = 'PilotArmor',
  PilotWeapon = 'PilotWeapon',
  PilotGear = 'PilotGear',
  Skill = 'Skill',
  Talent = 'Talent',
  Tag = 'Tag',
  MechWeapon = 'MechWeapon',
  MechSystem = 'MechSystem',
  WeaponMod = 'WeaponMod',
  NpcFeature = 'NpcFeature',
}

enum PilotEquipType {
  PilotArmor = 'armor',
  PilotWeapon = 'weapon',
  PilotGear = 'gear',
}

enum SystemType {
  System = 'System',
  AI = 'AI',
  Shield = 'Shield',
  Deployable = 'Deployable',
  Drone = 'Drone',
  Tech = 'Tech',
  Armor = 'Armor',
  FlightSystem = 'Flight System',
  Integrated = 'Integrated',
  Mod = 'Mod',
}

enum RangeType {
  Range = 'Range',
  Threat = 'Threat',
  Thrown = 'Thrown',
  Line = 'Line',
  Cone = 'Cone',
  Blast = 'Blast',
  Burst = 'Burst',
}

enum DamageType {
  Kinetic = 'Kinetic',
  Energy = 'Energy',
  Explosive = 'Explosive',
  Heat = 'Heat',
  Burn = 'Burn',
  Variable = 'Variable',
}

enum EffectType {
  Generic = 'Generic', // Covers old/fallback/simple
  Basic = 'Basic',
  Charge = 'Charge',
  Deployable = 'Deployable',
  AI = 'AI',
  Protocol = 'Protocol',
  Reaction = 'Reaction',
  Tech = 'Tech',
  Drone = 'Drone',
  Bonus = 'Bonus',
  Offensive = 'Offensive',
  Profile = 'Profile',
}

enum ActivationType {
  None = 'None',
  Passive = 'Passive',
  Quick = 'Quick',
  Full = 'Full',
  Other = 'Other',
  Reaction = 'Reaction',
  Protocol = 'Protocol',
}

enum ChargeType {
  Grenade = 'Grenade',
  Mine = 'Mine'
}

enum MechType {
  Balanced = 'Balanced',
  Artillery = 'Artillery',
  Striker = 'Striker',
  Controller = 'Controller',
  Support = 'Support',
  Defender = 'Defender',
}

enum HASE {
  H = 'hull',
  A = 'agi',
  S = 'sys',
  E = 'eng',
}

enum NPCTag{
  Mech = 'Mech',
  Vehicle = 'Vehicle',
  Ship = 'Ship',
  Biological = 'Biological',
  Squad = 'Squad'
}

enum NPCFeatureType {
  Trait = 'Trait',
  System = 'System',
  Reaction = 'Reaction',
  Weapon = 'Weapon',
  Tech = 'Tech',
}


export {
  MountType,
  WeaponSize,
  WeaponType,
  ItemType,
  PilotEquipType,
  SystemType,
  RangeType,
  DamageType,
  EffectType,
  ActivationType,
  ChargeType,
  HASE,
  MechType,
  NPCTag,
  NPCFeatureType
}

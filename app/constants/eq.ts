// Static EverQuest reference data for character creation.
// Fan project — names are lore references, no game assets redistributed.

export const EQ_CLASSES = [
  'Warrior',
  'Cleric',
  'Paladin',
  'Ranger',
  'Shadow Knight',
  'Druid',
  'Monk',
  'Bard',
  'Rogue',
  'Shaman',
  'Necromancer',
  'Wizard',
  'Magician',
  'Enchanter',
  'Beastlord',
  'Berserker',
] as const

export const EQ_RACES = [
  'Human',
  'Barbarian',
  'Erudite',
  'Wood Elf',
  'High Elf',
  'Dark Elf',
  'Half Elf',
  'Dwarf',
  'Troll',
  'Ogre',
  'Halfling',
  'Gnome',
  'Iksar',
  'Vah Shir',
  'Froglok',
  'Drakkin',
] as const

export const EQ_DEITIES = [
  'Agnostic',
  'Bertoxxulous',
  'Brell Serilis',
  'Bristlebane',
  'Cazic-Thule',
  'Erollisi Marr',
  'Innoruuk',
  'Karana',
  'Mithaniel Marr',
  'Prexus',
  'Quellious',
  'Rallos Zek',
  'Rodcet Nife',
  'Solusek Ro',
  'The Tribunal',
  'Tunare',
  'Veeshan',
] as const

// Common servers offered as datalist hints; server stays free-text since
// EQ servers merge/rename over time.
export const EQ_SERVER_HINTS = [
  'Aradune',
  'Bristlebane',
  'Cazic-Thule',
  'Drinal',
  'Erollisi Marr',
  'Firiona Vie',
  'Luclin',
  'Mangler',
  'Oakwynd',
  'Povar',
  'The Rathe',
  'Teek',
  'Tunare',
  'Vaniki',
  'Vox',
  'Xegony',
  'Yelinak',
  'Zek',
] as const

export const EQ_LEVEL_MIN = 1
export const EQ_LEVEL_MAX = 125

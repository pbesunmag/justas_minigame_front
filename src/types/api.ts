export interface AuthResponse {
  token: string
  username: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  password: string
}

export type BodyType = 'SLIM' | 'ATHLETIC' | 'ROBUST'
export type SkinTone = 'FAIR' | 'LIGHT' | 'OLIVE' | 'TAN' | 'DEEP'
export type HairStyle = 'SHORT' | 'LONG' | 'SHAVED' | 'BRAID'
export type HairColor = 'BLACK' | 'BROWN' | 'BLONDE' | 'RED' | 'WHITE'
export type HorseColor = 'BAY' | 'BLACK' | 'WHITE' | 'CHESTNUT' | 'GRAY'

export interface CreateSaveRequest {
  knightName: string
  age?: number
  bodyType?: string
  skinTone?: string
  hairStyle?: string
  hairColor?: string
  horseName?: string
  horseColor?: string
  initialArmorId?: string
  initialHorseId?: string
}

export interface SaveGameSummary {
  id: number
  knightName: string
  age: number
  bodyType: string
  skinTone: string
  hairStyle: string
  hairColor: string
  horseName: string
  horseColor: string
  level: number
  experience: number
  gold: number
  maxHp: number
  maxStamina: number
  mainWeaponId: string | null
  secondaryWeaponId: string | null
  armorId: string | null
  horseId: string | null
  defeatedBosses: string[]
  consumables: Record<string, number>
  lastSavedAt: string | null
}

export interface ArmoryItem {
  id: string
  name: string
  stats: Record<string, string | number>
  price: number
  requiredLevel: number
  requiredBossDefeat: string | null
  status: 'EQUIPPED' | 'OWNED' | 'AVAILABLE' | 'LOCKED' | string
  lockReason: string | null
}

export interface ArmoryCatalogResponse {
  weapons: ArmoryItem[]
  armors: ArmoryItem[]
  horses: ArmoryItem[]
}

export type RiderAction =
  | 'ATTACK'
  | 'DEFEND'
  | 'DODGE'
  | 'USE_ITEM'
  | 'SWITCH_WEAPON'
  | 'ULTIMATE'
  | 'SURRENDER'

export type TargetZone = 'HEAD' | 'CHEST' | 'SHIELD'

export type HorseOrder = 'ACCELERATE' | 'MAINTAIN' | 'DECELERATE' | 'PET'

export interface StartBattleRequest {
  enemyCode: 'KNIGHT_1' | 'KNIGHT_2' | 'ERK'
}

export interface TurnActionRequest {
  riderAction: RiderAction
  targetZone: TargetZone
  horseOrder: HorseOrder
  itemId: string | null
}

export interface KnightBattleStatus {
  name: string
  currentHp: number
  maxHp: number
  currentStamina: number
  maxStamina: number
  currentShieldHp: number
  maxShieldHp: number
  shieldBroken: boolean
  ultimateCharge: number
  currentSpeed: number
  currentFatigue: number
  horsePanicked: boolean
  activeWeapon: string
}

export interface RewardSummary {
  goldEarned: number
  xpEarned: number
  firstVictory: boolean
  leveledUp: boolean
  newLevel: number
  newlyAvailableItems: string[]
  logs: string[]
}

export interface BattleResponse {
  battleId: string
  turnNumber: number
  status: 'IN_PROGRESS' | 'FINISHED' | string
  player: KnightBattleStatus
  enemy: KnightBattleStatus
  turnNarrative: string[]
  reward: RewardSummary | null
  cassianTip: string
}

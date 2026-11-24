import axiosClient from './axiosClient'
import type {
  BattleResponse,
  StartBattleRequest,
  TurnActionRequest,
} from '../types/api'

export async function buyArmoryItem(
  saveId: number | string,
  itemId: string,
): Promise<{ message: string; goldRemaining: number }> {
  const { data } = await axiosClient.post<{ message: string; goldRemaining: number }>(
    `/saves/${saveId}/armory/buy/${itemId}`,
  )
  return data
}

export async function equipArmoryItem(
  saveId: number | string,
  itemId: string,
): Promise<{ message: string; equippedWeapon: string }> {
  const { data } = await axiosClient.post<{ message: string; equippedWeapon: string }>(
    `/saves/${saveId}/armory/equip/${itemId}`,
  )
  return data
}

export async function startBattle(
  saveId: number | string,
  payload: StartBattleRequest,
): Promise<BattleResponse> {
  const { data } = await axiosClient.post<BattleResponse>(
    `/saves/${saveId}/battles/start`,
    payload,
  )
  return data
}

export async function executeTurn(
  saveId: number | string,
  battleId: string,
  payload: TurnActionRequest,
): Promise<BattleResponse> {
  const { data } = await axiosClient.post<BattleResponse>(
    `/saves/${saveId}/battles/${battleId}/turn`,
    payload,
  )
  return data
}

export async function getBattleState(
  saveId: number | string,
  battleId: string,
): Promise<BattleResponse> {
  const { data } = await axiosClient.get<BattleResponse>(
    `/saves/${saveId}/battles/${battleId}`,
  )
  return data
}

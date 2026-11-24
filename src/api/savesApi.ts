import axiosClient from './axiosClient'
import type {
  ArmoryCatalogResponse,
  CreateSaveRequest,
  SaveGameSummary,
} from '../types/api'

export async function getSaves(): Promise<SaveGameSummary[]> {
  const { data } = await axiosClient.get<SaveGameSummary[]>('/saves')
  return data
}

export async function getSaveById(saveId: number | string): Promise<SaveGameSummary> {
  const { data } = await axiosClient.get<SaveGameSummary>(`/saves/${saveId}`)
  return data
}

export async function createSave(payload: CreateSaveRequest): Promise<SaveGameSummary> {
  const { data } = await axiosClient.post<SaveGameSummary>('/saves', payload)
  return data
}

export async function deleteSave(saveId: number): Promise<void> {
  await axiosClient.delete(`/saves/${saveId}`)
}

export async function getArmoryCatalog(saveId: number | string): Promise<ArmoryCatalogResponse> {
  const { data } = await axiosClient.get<ArmoryCatalogResponse>(`/saves/${saveId}/armory`)
  return data
}

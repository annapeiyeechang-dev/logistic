export interface CartonDetails {
  id: string
  name: string
  length: number
  width: number
  height: number
  quantity: number
  weight: number
}

export type ContainerType = '20ft' | '40ft' | '40ft-hc' | 'lcl' | 'pallet'

export interface ContainerDimensions {
  length: number
  width: number
  height: number
  maxWeight: number
  name: string
}

export interface PackedCarton {
  x: number
  y: number
  z: number
  length: number
  width: number
  height: number
  rotated: boolean
  cartonId: string
  cartonName: string
}

export interface SingleContainerResult {
  containerNumber: number
  containerType: ContainerType
  containerDimensions: ContainerDimensions
  cartonsFitted: number
  utilizationPercentage: number
  volumeUsed: number
  volumeRemaining: number
  totalWeight: number
  packedCartons: PackedCarton[]
  cartonBreakdown: { [cartonId: string]: number }
}

export interface PackingResult {
  containers: SingleContainerResult[]
  totalCartons: number
  totalContainersUsed: number
  cartonsRemaining: { [cartonId: string]: number }
  overallUtilization: number
}

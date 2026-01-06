export interface CartonDetails {
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
}

export interface PackingResult {
  containerType: ContainerType
  containerDimensions: ContainerDimensions
  cartonsFitted: number
  cartonsRemaining: number
  utilizationPercentage: number
  volumeUsed: number
  volumeRemaining: number
  totalWeight: number
  packedCartons: PackedCarton[]
}

export interface MultiContainerResult {
  containers: PackingResult[]
  totalCartonsFitted: number
  totalCartonsRemaining: number
  totalContainersUsed: number
  overallUtilization: number
}

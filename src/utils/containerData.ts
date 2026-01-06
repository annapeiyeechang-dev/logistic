import { ContainerType, ContainerDimensions } from '../types'

export const CONTAINER_DIMENSIONS: Record<ContainerType, ContainerDimensions> = {
  '20ft': {
    length: 589,
    width: 235,
    height: 239,
    maxWeight: 28000,
    name: '20ft Container'
  },
  '40ft': {
    length: 1203,
    width: 235,
    height: 239,
    maxWeight: 28500,
    name: '40ft Container'
  },
  '40ft-hc': {
    length: 1203,
    width: 235,
    height: 269,
    maxWeight: 28600,
    name: '40ft High Cube'
  },
  'lcl': {
    length: 300,
    width: 200,
    height: 200,
    maxWeight: 10000,
    name: 'LCL (Less Container Load)'
  },
  'pallet': {
    length: 120,
    width: 100,
    height: 150,
    maxWeight: 1000,
    name: 'Standard Pallet'
  }
}

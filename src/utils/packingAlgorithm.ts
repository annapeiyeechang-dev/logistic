import { CartonDetails, ContainerType, PackingResult, PackedCarton, SingleContainerResult } from '../types'
import { CONTAINER_DIMENSIONS } from './containerData'

interface Orientation {
  length: number
  width: number
  height: number
  rotated: boolean
}

function getOrientations(carton: CartonDetails): Orientation[] {
  return [
    { length: carton.length, width: carton.width, height: carton.height, rotated: false },
    { length: carton.width, width: carton.length, height: carton.height, rotated: true },
    { length: carton.length, width: carton.height, height: carton.width, rotated: true },
    { length: carton.height, width: carton.width, height: carton.length, rotated: true },
    { length: carton.width, width: carton.height, height: carton.length, rotated: true },
    { length: carton.height, width: carton.length, height: carton.width, rotated: true }
  ]
}

interface PackingSpace {
  x: number
  y: number
  z: number
  length: number
  width: number
  height: number
}

function packMultipleCartonTypes(
  cartonTypes: CartonDetails[],
  containerType: ContainerType,
  containerNumber: number,
  remainingQuantities: { [cartonId: string]: number }
): SingleContainerResult {
  const container = CONTAINER_DIMENSIONS[containerType]
  const packedCartons: PackedCarton[] = []
  const cartonBreakdown: { [cartonId: string]: number } = {}
  
  const spaces: PackingSpace[] = [{
    x: 0,
    y: 0,
    z: 0,
    length: container.length,
    width: container.width,
    height: container.height
  }]

  cartonTypes.forEach(carton => {
    cartonBreakdown[carton.id] = 0
  })

  let totalPacked = 0
  let continuesPacking = true

  while (continuesPacking && spaces.length > 0) {
    continuesPacking = false

    for (const carton of cartonTypes) {
      if (remainingQuantities[carton.id] <= 0) continue

      const orientations = getOrientations(carton)
      
      for (let i = 0; i < spaces.length; i++) {
        const space = spaces[i]
        let bestFit: { orientation: Orientation; space: PackingSpace } | null = null

        for (const orientation of orientations) {
          if (orientation.length <= space.length &&
              orientation.width <= space.width &&
              orientation.height <= space.height) {
            bestFit = { orientation, space }
            break
          }
        }

        if (bestFit) {
          const { orientation, space } = bestFit
          
          packedCartons.push({
            x: space.x,
            y: space.y,
            z: space.z,
            length: orientation.length,
            width: orientation.width,
            height: orientation.height,
            rotated: orientation.rotated,
            cartonId: carton.id,
            cartonName: carton.name
          })

          cartonBreakdown[carton.id]++
          remainingQuantities[carton.id]--
          totalPacked++
          continuesPacking = true

          spaces.splice(i, 1)

          if (space.length > orientation.length) {
            spaces.push({
              x: space.x + orientation.length,
              y: space.y,
              z: space.z,
              length: space.length - orientation.length,
              width: space.width,
              height: space.height
            })
          }

          if (space.width > orientation.width) {
            spaces.push({
              x: space.x,
              y: space.y + orientation.width,
              z: space.z,
              length: orientation.length,
              width: space.width - orientation.width,
              height: space.height
            })
          }

          if (space.height > orientation.height) {
            spaces.push({
              x: space.x,
              y: space.y,
              z: space.z + orientation.height,
              length: orientation.length,
              width: orientation.width,
              height: space.height - orientation.height
            })
          }

          break
        }
      }

      if (continuesPacking) break
    }
  }

  const totalVolume = cartonTypes.reduce((sum, carton) => {
    const cartonVolume = carton.length * carton.width * carton.height
    return sum + (cartonVolume * cartonBreakdown[carton.id])
  }, 0)

  const totalWeight = cartonTypes.reduce((sum, carton) => {
    return sum + (carton.weight * cartonBreakdown[carton.id])
  }, 0)

  const containerVolume = container.length * container.width * container.height
  const utilizationPercentage = (totalVolume / containerVolume) * 100

  return {
    containerNumber,
    containerType,
    containerDimensions: container,
    cartonsFitted: totalPacked,
    utilizationPercentage,
    volumeUsed: totalVolume,
    volumeRemaining: containerVolume - totalVolume,
    totalWeight,
    packedCartons,
    cartonBreakdown
  }
}

export function calculatePacking(
  cartonTypes: CartonDetails[],
  containerType: ContainerType
): PackingResult {
  const containers: SingleContainerResult[] = []
  const remainingQuantities: { [cartonId: string]: number } = {}
  
  cartonTypes.forEach(carton => {
    remainingQuantities[carton.id] = carton.quantity
  })

  let containerNumber = 1
  const totalCartons = cartonTypes.reduce((sum, c) => sum + c.quantity, 0)

  while (Object.values(remainingQuantities).some(q => q > 0)) {
    const containerResult = packMultipleCartonTypes(
      cartonTypes,
      containerType,
      containerNumber,
      remainingQuantities
    )
    
    if (containerResult.cartonsFitted === 0) {
      break
    }

    containers.push(containerResult)
    containerNumber++
  }

  const totalCartonsFitted = containers.reduce((sum, c) => sum + c.cartonsFitted, 0)
  const totalVolumeUsed = containers.reduce((sum, c) => sum + c.volumeUsed, 0)
  const totalContainerVolume = containers.reduce(
    (sum, c) => sum + (c.containerDimensions.length * c.containerDimensions.width * c.containerDimensions.height),
    0
  )
  const overallUtilization = totalContainerVolume > 0 ? (totalVolumeUsed / totalContainerVolume) * 100 : 0

  const cartonsRemaining: { [cartonId: string]: number } = {}
  cartonTypes.forEach(carton => {
    cartonsRemaining[carton.id] = Math.max(0, remainingQuantities[carton.id])
  })

  return {
    containers,
    totalCartons,
    totalContainersUsed: containers.length,
    cartonsRemaining,
    overallUtilization
  }
}

import { CartonDetails, ContainerType, PackingResult, PackedCarton, MultiContainerResult } from '../types'
import { CONTAINER_DIMENSIONS } from './containerData'

interface Orientation {
  length: number
  width: number
  height: number
  rotated: boolean
}

interface Position {
  x: number
  y: number
  z: number
}

interface SpaceNode {
  position: Position
  dimensions: {
    length: number
    width: number
    height: number
  }
}

function getOrientations(carton: CartonDetails): Orientation[] {
  // Only allow length/width swapping, height remains fixed
  return [
    { length: carton.length, width: carton.width, height: carton.height, rotated: false },
    { length: carton.width, width: carton.length, height: carton.height, rotated: true }
  ]
}

function canFitInSpace(carton: Orientation, space: SpaceNode): boolean {
  return (
    carton.length <= space.dimensions.length &&
    carton.width <= space.dimensions.width &&
    carton.height <= space.dimensions.height
  )
}

function splitSpace(space: SpaceNode, carton: Orientation): SpaceNode[] {
  const newSpaces: SpaceNode[] = []
  
  // Create space above the placed carton (vertical stacking)
  if (space.dimensions.height > carton.height) {
    newSpaces.push({
      position: {
        x: space.position.x,
        y: space.position.y,
        z: space.position.z + carton.height
      },
      dimensions: {
        length: carton.length,
        width: carton.width,
        height: space.dimensions.height - carton.height
      }
    })
  }
  
  // Create space to the right (along length)
  if (space.dimensions.length > carton.length) {
    newSpaces.push({
      position: {
        x: space.position.x + carton.length,
        y: space.position.y,
        z: space.position.z
      },
      dimensions: {
        length: space.dimensions.length - carton.length,
        width: space.dimensions.width,
        height: space.dimensions.height
      }
    })
  }
  
  // Create space to the back (along width)
  if (space.dimensions.width > carton.width) {
    newSpaces.push({
      position: {
        x: space.position.x,
        y: space.position.y + carton.width,
        z: space.position.z
      },
      dimensions: {
        length: carton.length,
        width: space.dimensions.width - carton.width,
        height: space.dimensions.height
      }
    })
  }
  
  return newSpaces
}

function removeOverlappingSpaces(spaces: SpaceNode[]): SpaceNode[] {
  const filtered: SpaceNode[] = []
  
  for (const space of spaces) {
    let isContained = false
    
    for (const other of spaces) {
      if (space === other) continue
      
      // Check if space is completely contained within other
      const spaceEnd = {
        x: space.position.x + space.dimensions.length,
        y: space.position.y + space.dimensions.width,
        z: space.position.z + space.dimensions.height
      }
      
      const otherEnd = {
        x: other.position.x + other.dimensions.length,
        y: other.position.y + other.dimensions.width,
        z: other.position.z + other.dimensions.height
      }
      
      if (
        space.position.x >= other.position.x &&
        space.position.y >= other.position.y &&
        space.position.z >= other.position.z &&
        spaceEnd.x <= otherEnd.x &&
        spaceEnd.y <= otherEnd.y &&
        spaceEnd.z <= otherEnd.z &&
        (space.dimensions.length < other.dimensions.length ||
         space.dimensions.width < other.dimensions.width ||
         space.dimensions.height < other.dimensions.height)
      ) {
        isContained = true
        break
      }
    }
    
    if (!isContained) {
      filtered.push(space)
    }
  }
  
  return filtered
}

function calculateSingleContainer(
  cartonDetails: CartonDetails,
  containerType: ContainerType,
  remainingQuantity: number
): PackingResult {
  const container = CONTAINER_DIMENSIONS[containerType]
  const orientations = getOrientations(cartonDetails)
  
  // Initialize available spaces with the entire container
  let availableSpaces: SpaceNode[] = [{
    position: { x: 0, y: 0, z: 0 },
    dimensions: {
      length: container.length,
      width: container.width,
      height: container.height
    }
  }]
  
  const packedCartons: PackedCarton[] = []
  let cartonsPlaced = 0
  
  // Pack cartons one by one
  while (cartonsPlaced < remainingQuantity && availableSpaces.length > 0) {
    let bestSpace: SpaceNode | null = null
    let bestOrientation: Orientation | null = null
    let bestSpaceIndex = -1
    let bestScore = Infinity
    
    // Find the best space and orientation for the next carton
    for (let i = 0; i < availableSpaces.length; i++) {
      const space = availableSpaces[i]
      
      for (const orientation of orientations) {
        if (canFitInSpace(orientation, space)) {
          // Score based on: lowest position (z), then smallest leftover volume
          const leftoverVolume = 
            (space.dimensions.length * space.dimensions.width * space.dimensions.height) -
            (orientation.length * orientation.width * orientation.height)
          
          const score = space.position.z * 1000000 + leftoverVolume
          
          if (score < bestScore) {
            bestScore = score
            bestSpace = space
            bestOrientation = orientation
            bestSpaceIndex = i
          }
        }
      }
    }
    
    // If we found a valid placement
    if (bestSpace && bestOrientation) {
      // Add the packed carton
      packedCartons.push({
        x: bestSpace.position.x,
        y: bestSpace.position.y,
        z: bestSpace.position.z,
        length: bestOrientation.length,
        width: bestOrientation.width,
        height: bestOrientation.height,
        rotated: bestOrientation.rotated
      })
      
      cartonsPlaced++
      
      // Remove the used space
      availableSpaces.splice(bestSpaceIndex, 1)
      
      // Add new spaces created by splitting
      const newSpaces = splitSpace(bestSpace, bestOrientation)
      availableSpaces.push(...newSpaces)
      
      // Remove overlapping/contained spaces to optimize
      availableSpaces = removeOverlappingSpaces(availableSpaces)
      
      // Sort spaces by z-position (prioritize lower positions)
      availableSpaces.sort((a, b) => {
        if (a.position.z !== b.position.z) return a.position.z - b.position.z
        if (a.position.x !== b.position.x) return a.position.x - b.position.x
        return a.position.y - b.position.y
      })
    } else {
      // No more space available
      break
    }
  }
  
  const cartonsFitted = cartonsPlaced
  const cartonsRemaining = Math.max(0, remainingQuantity - cartonsFitted)
  
  const cartonVolume = cartonDetails.length * cartonDetails.width * cartonDetails.height
  const containerVolume = container.length * container.width * container.height
  const volumeUsed = cartonsFitted * cartonVolume
  const volumeRemaining = containerVolume - volumeUsed
  const utilizationPercentage = (volumeUsed / containerVolume) * 100

  const totalWeight = cartonsFitted * cartonDetails.weight

  return {
    containerType,
    containerDimensions: container,
    cartonsFitted,
    cartonsRemaining,
    utilizationPercentage,
    volumeUsed,
    volumeRemaining,
    totalWeight,
    packedCartons
  }
}

export function calculatePacking(
  cartonDetails: CartonDetails,
  containerType: ContainerType
): PackingResult {
  return calculateSingleContainer(cartonDetails, containerType, cartonDetails.quantity)
}

export function calculateMultiContainerPacking(
  cartonDetails: CartonDetails,
  containerType: ContainerType
): MultiContainerResult {
  const containers: PackingResult[] = []
  let remainingQuantity = cartonDetails.quantity
  
  while (remainingQuantity > 0) {
    const result = calculateSingleContainer(cartonDetails, containerType, remainingQuantity)
    containers.push(result)
    remainingQuantity = result.cartonsRemaining
    
    if (result.cartonsFitted === 0) {
      break
    }
  }

  const totalCartonsFitted = containers.reduce((sum, c) => sum + c.cartonsFitted, 0)
  const totalCartonsRemaining = cartonDetails.quantity - totalCartonsFitted
  const totalContainersUsed = containers.length

  const totalVolumeUsed = containers.reduce((sum, c) => sum + c.volumeUsed, 0)
  const totalVolumeAvailable = containers.reduce((sum, c) => 
    sum + (c.containerDimensions.length * c.containerDimensions.width * c.containerDimensions.height), 0
  )
  const overallUtilization = (totalVolumeUsed / totalVolumeAvailable) * 100

  return {
    containers,
    totalCartonsFitted,
    totalCartonsRemaining,
    totalContainersUsed,
    overallUtilization
  }
}

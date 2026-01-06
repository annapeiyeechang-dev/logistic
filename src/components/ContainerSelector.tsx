import React from 'react'
import { ContainerType } from '../types'
import { CONTAINER_DIMENSIONS } from '../utils/containerData'
import './ContainerSelector.css'

interface ContainerSelectorProps {
  selected: ContainerType
  onChange: (type: ContainerType) => void
}

const ContainerSelector: React.FC<ContainerSelectorProps> = ({ selected, onChange }) => {
  const containerTypes: ContainerType[] = ['20ft', '40ft', '40ft-hc', 'lcl', 'pallet']

  return (
    <div className="container-selector">
      {containerTypes.map((type) => {
        const container = CONTAINER_DIMENSIONS[type]
        return (
          <button
            key={type}
            className={`container-option ${selected === type ? 'selected' : ''}`}
            onClick={() => onChange(type)}
          >
            <div className="container-name">{container.name}</div>
            <div className="container-dims">
              {container.length} × {container.width} × {container.height} cm
            </div>
            <div className="container-weight">Max: {container.maxWeight.toLocaleString()} kg</div>
          </button>
        )
      })}
    </div>
  )
}

export default ContainerSelector

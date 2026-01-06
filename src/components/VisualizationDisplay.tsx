import React, { useState } from 'react'
import { PackingResult, CartonDetails } from '../types'
import './VisualizationDisplay.css'

interface VisualizationDisplayProps {
  result: PackingResult
  cartonTypes: CartonDetails[]
}

const VisualizationDisplay: React.FC<VisualizationDisplayProps> = ({ result, cartonTypes }) => {
  const [selectedContainer, setSelectedContainer] = useState(0)
  
  const container = result.containers[selectedContainer]
  const containerDims = container.containerDimensions
  const scale = 0.3
  
  const containerWidth = containerDims.length * scale
  const containerHeight = containerDims.height * scale
  const containerDepth = containerDims.width * scale

  const maxDimension = Math.max(containerWidth, containerHeight, containerDepth)
  const viewScale = 400 / maxDimension

  const scaledWidth = containerWidth * viewScale
  const scaledHeight = containerHeight * viewScale

  const getCartonColor = (cartonId: string) => {
    const index = cartonTypes.findIndex(c => c.id === cartonId)
    const colors = [
      '#667eea',
      '#764ba2',
      '#f093fb',
      '#4facfe',
      '#43e97b',
      '#fa709a',
      '#fee140',
      '#30cfd0'
    ]
    return colors[index % colors.length]
  }

  return (
    <div className="visualization-display">
      {result.containers.length > 1 && (
        <div className="container-tabs">
          {result.containers.map((_, index) => (
            <button
              key={index}
              className={`container-tab ${selectedContainer === index ? 'active' : ''}`}
              onClick={() => setSelectedContainer(index)}
            >
              Container #{index + 1}
            </button>
          ))}
        </div>
      )}

      <div className="view-tabs">
        <div className="view-tab active">Front View</div>
      </div>

      <div className="visualization-container">
        <svg
          viewBox={`0 0 ${scaledWidth + 100} ${scaledHeight + 100}`}
          className="container-svg"
        >
          <rect
            x="50"
            y="50"
            width={scaledWidth}
            height={scaledHeight}
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="3"
            strokeDasharray="8,4"
            rx="4"
          />

          {container.packedCartons.map((carton, index) => {
            const x = 50 + (carton.x * scale * viewScale)
            const y = 50 + (carton.z * scale * viewScale)
            const width = carton.length * scale * viewScale
            const height = carton.height * scale * viewScale

            return (
              <g key={index}>
                <rect
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  fill={getCartonColor(carton.cartonId)}
                  stroke="white"
                  strokeWidth="1"
                  opacity="0.8"
                  rx="2"
                />
                <rect
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  fill="url(#cartonGradient)"
                  stroke="none"
                  opacity="0.3"
                  rx="2"
                />
              </g>
            )
          })}

          <defs>
            <linearGradient id="cartonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="white" stopOpacity="0.5" />
              <stop offset="100%" stopColor="black" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="visualization-info">
        <div className="info-item">
          <span className="info-label">Container:</span>
          <span className="info-value">{containerDims.name}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Dimensions:</span>
          <span className="info-value">
            {containerDims.length} × {containerDims.width} × {containerDims.height} cm
          </span>
        </div>
        <div className="info-item">
          <span className="info-label">Cartons in Container:</span>
          <span className="info-value">{container.cartonsFitted}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Utilization:</span>
          <span className="info-value">{container.utilizationPercentage.toFixed(1)}%</span>
        </div>
      </div>

      <div className="carton-legend">
        <h4>Carton Types</h4>
        <div className="legend-items">
          {cartonTypes.map((carton) => (
            <div key={carton.id} className="legend-item">
              <div 
                className="legend-color"
                style={{ background: getCartonColor(carton.id) }}
              />
              <span className="legend-name">{carton.name}</span>
              <span className="legend-dims">
                {carton.length}×{carton.width}×{carton.height} cm
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default VisualizationDisplay

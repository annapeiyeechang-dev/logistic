import React, { useState } from 'react'
import { PackingResult } from '../types'
import './VisualizationDisplay.css'

interface VisualizationDisplayProps {
  result: PackingResult
}

type ViewType = 'front' | 'side' | 'top'

const VisualizationDisplay: React.FC<VisualizationDisplayProps> = ({ result }) => {
  const [activeView, setActiveView] = useState<ViewType>('front')
  const container = result.containerDimensions
  const scale = 0.3
  
  const containerWidth = container.length * scale
  const containerHeight = container.height * scale
  const containerDepth = container.width * scale

  const maxDimension = Math.max(containerWidth, containerHeight, containerDepth)
  const viewScale = 400 / maxDimension

  const scaledWidth = containerWidth * viewScale
  const scaledHeight = containerHeight * viewScale
  const scaledDepth = containerDepth * viewScale

  const getCartonColor = (index: number) => {
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

  const getLayerOpacity = (zPosition: number) => {
    const maxZ = Math.max(...result.packedCartons.map(c => c.z))
    const layerRatio = zPosition / (maxZ || 1)
    return 0.6 + (layerRatio * 0.4) // Opacity from 0.6 to 1.0
  }

  const renderFrontView = () => (
    <svg
      viewBox={`0 0 ${scaledWidth + 100} ${scaledHeight + 100}`}
      className="container-svg"
    >
      {/* Container outline */}
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

      {/* Ground line */}
      <line
        x1="50"
        y1={50 + scaledHeight}
        x2={50 + scaledWidth}
        y2={50 + scaledHeight}
        stroke="#94a3b8"
        strokeWidth="2"
      />

      {/* Packed cartons - sorted by z position for proper layering */}
      {[...result.packedCartons]
        .sort((a, b) => a.z - b.z)
        .map((carton, index) => {
          const x = 50 + (carton.x * scale * viewScale)
          const y = 50 + (scaledHeight - (carton.z * scale * viewScale) - (carton.height * scale * viewScale))
          const width = carton.length * scale * viewScale
          const height = carton.height * scale * viewScale
          const opacity = getLayerOpacity(carton.z)

          return (
            <g key={index}>
              <rect
                x={x}
                y={y}
                width={width}
                height={height}
                fill={getCartonColor(index)}
                stroke="white"
                strokeWidth="1.5"
                opacity={opacity}
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
              {/* Elevation indicator for stacked cartons */}
              {carton.z > 0 && (
                <text
                  x={x + width / 2}
                  y={y + height / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize="10"
                  fontWeight="600"
                  opacity="0.8"
                >
                  L{Math.floor(carton.z / carton.height) + 1}
                </text>
              )}
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
  )

  const renderSideView = () => (
    <svg
      viewBox={`0 0 ${scaledDepth + 100} ${scaledHeight + 100}`}
      className="container-svg"
    >
      {/* Container outline */}
      <rect
        x="50"
        y="50"
        width={scaledDepth}
        height={scaledHeight}
        fill="none"
        stroke="#cbd5e1"
        strokeWidth="3"
        strokeDasharray="8,4"
        rx="4"
      />

      {/* Ground line */}
      <line
        x1="50"
        y1={50 + scaledHeight}
        x2={50 + scaledDepth}
        y2={50 + scaledHeight}
        stroke="#94a3b8"
        strokeWidth="2"
      />

      {/* Packed cartons */}
      {[...result.packedCartons]
        .sort((a, b) => a.y - b.y)
        .map((carton, index) => {
          const x = 50 + (carton.y * scale * viewScale)
          const y = 50 + (scaledHeight - (carton.z * scale * viewScale) - (carton.height * scale * viewScale))
          const width = carton.width * scale * viewScale
          const height = carton.height * scale * viewScale
          const opacity = getLayerOpacity(carton.z)

          return (
            <g key={index}>
              <rect
                x={x}
                y={y}
                width={width}
                height={height}
                fill={getCartonColor(index)}
                stroke="white"
                strokeWidth="1.5"
                opacity={opacity}
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
              {carton.z > 0 && (
                <text
                  x={x + width / 2}
                  y={y + height / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize="10"
                  fontWeight="600"
                  opacity="0.8"
                >
                  L{Math.floor(carton.z / carton.height) + 1}
                </text>
              )}
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
  )

  const renderTopView = () => (
    <svg
      viewBox={`0 0 ${scaledWidth + 100} ${scaledDepth + 100}`}
      className="container-svg"
    >
      {/* Container outline */}
      <rect
        x="50"
        y="50"
        width={scaledWidth}
        height={scaledDepth}
        fill="none"
        stroke="#cbd5e1"
        strokeWidth="3"
        strokeDasharray="8,4"
        rx="4"
      />

      {/* Packed cartons - sorted by z position (top layer shown on top) */}
      {[...result.packedCartons]
        .sort((a, b) => b.z - a.z)
        .map((carton, index) => {
          const x = 50 + (carton.x * scale * viewScale)
          const y = 50 + (carton.y * scale * viewScale)
          const width = carton.length * scale * viewScale
          const height = carton.width * scale * viewScale
          const opacity = getLayerOpacity(carton.z)

          return (
            <g key={index}>
              <rect
                x={x}
                y={y}
                width={width}
                height={height}
                fill={getCartonColor(index)}
                stroke="white"
                strokeWidth="1.5"
                opacity={opacity}
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
              {/* Show layer number */}
              <text
                x={x + width / 2}
                y={y + height / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontSize="10"
                fontWeight="600"
                opacity="0.9"
              >
                L{Math.floor(carton.z / carton.height) + 1}
              </text>
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
  )

  // Calculate layer statistics
  const layers = new Set(result.packedCartons.map(c => Math.floor(c.z / c.height)))
  const layerCount = layers.size

  return (
    <div className="visualization-display">
      <div className="view-tabs">
        <div 
          className={`view-tab ${activeView === 'front' ? 'active' : ''}`}
          onClick={() => setActiveView('front')}
        >
          Front View
        </div>
        <div 
          className={`view-tab ${activeView === 'side' ? 'active' : ''}`}
          onClick={() => setActiveView('side')}
        >
          Side View
        </div>
        <div 
          className={`view-tab ${activeView === 'top' ? 'active' : ''}`}
          onClick={() => setActiveView('top')}
        >
          Top View
        </div>
      </div>

      <div className="visualization-container">
        {activeView === 'front' && renderFrontView()}
        {activeView === 'side' && renderSideView()}
        {activeView === 'top' && renderTopView()}
      </div>

      <div className="visualization-info">
        <div className="info-item">
          <span className="info-label">Container:</span>
          <span className="info-value">{container.name}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Dimensions:</span>
          <span className="info-value">
            {container.length} × {container.width} × {container.height} cm
          </span>
        </div>
        <div className="info-item">
          <span className="info-label">Current View:</span>
          <span className="info-value">
            {activeView === 'front' && `Length × Height (${container.length} × ${container.height} cm)`}
            {activeView === 'side' && `Width × Height (${container.width} × ${container.height} cm)`}
            {activeView === 'top' && `Length × Width (${container.length} × ${container.width} cm)`}
          </span>
        </div>
        <div className="info-item">
          <span className="info-label">Cartons Shown:</span>
          <span className="info-value">{result.packedCartons.length}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Stacking Layers:</span>
          <span className="info-value">{layerCount}</span>
        </div>
      </div>
    </div>
  )
}

export default VisualizationDisplay

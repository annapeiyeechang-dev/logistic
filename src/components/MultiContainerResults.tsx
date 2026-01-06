import React, { useState } from 'react'
import { MultiContainerResult } from '../types'
import { Package, TrendingUp, Layers, Box, Weight } from 'lucide-react'
import VisualizationDisplay from './VisualizationDisplay'
import './MultiContainerResults.css'

interface MultiContainerResultsProps {
  result: MultiContainerResult
}

const MultiContainerResults: React.FC<MultiContainerResultsProps> = ({ result }) => {
  const [activeContainer, setActiveContainer] = useState(0)

  const currentContainer = result.containers[activeContainer]

  return (
    <div className="multi-container-results">
      {/* Overall Summary Card */}
      <div className="card summary-card">
        <div className="card-header">
          <Package size={20} />
          <h2>Overall Summary</h2>
        </div>
        <div className="summary-grid">
          <div className="summary-item">
            <div className="summary-icon">
              <Layers size={24} />
            </div>
            <div className="summary-content">
              <div className="summary-label">Total Containers</div>
              <div className="summary-value">{result.totalContainersUsed}</div>
            </div>
          </div>

          <div className="summary-item">
            <div className="summary-icon">
              <Package size={24} />
            </div>
            <div className="summary-content">
              <div className="summary-label">Total Cartons Fitted</div>
              <div className="summary-value">{result.totalCartonsFitted}</div>
            </div>
          </div>

          {result.totalCartonsRemaining > 0 && (
            <div className="summary-item warning">
              <div className="summary-icon">
                <Package size={24} />
              </div>
              <div className="summary-content">
                <div className="summary-label">Cartons Remaining</div>
                <div className="summary-value">{result.totalCartonsRemaining}</div>
              </div>
            </div>
          )}

          <div className="summary-item">
            <div className="summary-icon">
              <TrendingUp size={24} />
            </div>
            <div className="summary-content">
              <div className="summary-label">Overall Utilization</div>
              <div className="summary-value">{result.overallUtilization.toFixed(1)}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Container Banner */}
      <div className="container-banner">
        <div className="banner-title">
          <Layers size={18} />
          <span>All Containers</span>
        </div>
        <div className="banner-containers">
          {result.containers.map((container, index) => (
            <button
              key={index}
              className={`banner-container-card ${activeContainer === index ? 'active' : ''}`}
              onClick={() => setActiveContainer(index)}
            >
              <div className="banner-container-number">Container {index + 1}</div>
              <div className="banner-container-type">{container.containerDimensions.name}</div>
              <div className="banner-container-utilization">
                <div className="utilization-bar">
                  <div 
                    className="utilization-fill"
                    style={{ width: `${container.utilizationPercentage}%` }}
                  />
                </div>
                <span className="utilization-text">{container.utilizationPercentage.toFixed(1)}%</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Container Table Breakdown */}
      <div className="card">
        <div className="card-header">
          <Box size={20} />
          <h2>Container Breakdown</h2>
        </div>
        <div className="container-table-wrapper">
          <table className="container-table">
            <thead>
              <tr>
                <th>Container</th>
                <th>Type</th>
                <th>Cartons Loaded</th>
                <th>Utilization</th>
                <th>Remaining Space</th>
                <th>Est. Weight</th>
              </tr>
            </thead>
            <tbody>
              {result.containers.map((container, index) => (
                <tr 
                  key={index}
                  className={activeContainer === index ? 'active-row' : ''}
                  onClick={() => setActiveContainer(index)}
                >
                  <td className="container-number">
                    <div className="table-container-badge">#{index + 1}</div>
                  </td>
                  <td className="container-type">{container.containerDimensions.name}</td>
                  <td className="cartons-loaded">
                    <Package size={16} />
                    {container.cartonsFitted}
                  </td>
                  <td className="utilization">
                    <div className="table-utilization-bar">
                      <div 
                        className="table-utilization-fill"
                        style={{ width: `${container.utilizationPercentage}%` }}
                      />
                    </div>
                    <span>{container.utilizationPercentage.toFixed(1)}%</span>
                  </td>
                  <td className="remaining-space">
                    {(container.volumeRemaining / 1000000).toFixed(2)} m³
                  </td>
                  <td className="weight">
                    <Weight size={16} />
                    {container.totalWeight.toFixed(0)} kg
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visualization with Side Panel */}
      <div className="card visualization-section">
        <div className="card-header">
          <Package size={20} />
          <h2>Container Visualization</h2>
        </div>
        <div className="visualization-layout">
          {/* Side Panel */}
          <div className="side-panel">
            <div className="side-panel-title">Containers</div>
            {result.containers.map((container, index) => (
              <button
                key={index}
                className={`side-panel-item ${activeContainer === index ? 'active' : ''}`}
                onClick={() => setActiveContainer(index)}
              >
                <div className="side-panel-header">
                  <span className="side-panel-number">#{index + 1}</span>
                  <span className="side-panel-type">{container.containerType.toUpperCase()}</span>
                </div>
                <div className="side-panel-stats">
                  <div className="side-panel-stat">
                    <Package size={14} />
                    <span>{container.cartonsFitted}</span>
                  </div>
                  <div className="side-panel-stat">
                    <TrendingUp size={14} />
                    <span>{container.utilizationPercentage.toFixed(0)}%</span>
                  </div>
                </div>
                <div className="side-panel-preview">
                  <div className="preview-bar">
                    <div 
                      className="preview-fill"
                      style={{ width: `${container.utilizationPercentage}%` }}
                    />
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Main Visualization */}
          <div className="visualization-main">
            <div className="visualization-header">
              <h3>Container {activeContainer + 1}</h3>
              <div className="visualization-meta">
                <span className="meta-item">
                  <Package size={16} />
                  {currentContainer.cartonsFitted} cartons
                </span>
                <span className="meta-item">
                  <TrendingUp size={16} />
                  {currentContainer.utilizationPercentage.toFixed(1)}% utilized
                </span>
                <span className="meta-item">
                  <Weight size={16} />
                  {currentContainer.totalWeight.toFixed(0)} kg
                </span>
              </div>
            </div>
            <VisualizationDisplay result={currentContainer} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MultiContainerResults

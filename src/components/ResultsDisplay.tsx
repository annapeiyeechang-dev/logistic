import React from 'react'
import { PackingResult, CartonDetails } from '../types'
import { CheckCircle, XCircle, Package, TrendingUp, Weight, Layers } from 'lucide-react'
import './ResultsDisplay.css'

interface ResultsDisplayProps {
  result: PackingResult
  cartonTypes: CartonDetails[]
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, cartonTypes }) => {
  const formatVolume = (volume: number) => {
    return (volume / 1000000).toFixed(2)
  }

  const totalWeight = result.containers.reduce((sum, c) => sum + c.totalWeight, 0)
  const totalCartonsFitted = result.containers.reduce((sum, c) => sum + c.cartonsFitted, 0)
  const totalRemaining = Object.values(result.cartonsRemaining).reduce((sum, q) => sum + q, 0)

  const getCartonName = (cartonId: string) => {
    const carton = cartonTypes.find(c => c.id === cartonId)
    return carton?.name || cartonId
  }

  return (
    <div className="results-display">
      <div className="overall-summary">
        <h3>Overall Summary</h3>
        <div className="result-grid">
          <div className="result-item success">
            <div className="result-icon">
              <Layers size={24} />
            </div>
            <div className="result-content">
              <div className="result-label">Containers Used</div>
              <div className="result-value">{result.totalContainersUsed}</div>
            </div>
          </div>

          <div className="result-item success">
            <div className="result-icon">
              <CheckCircle size={24} />
            </div>
            <div className="result-content">
              <div className="result-label">Total Cartons Fitted</div>
              <div className="result-value">{totalCartonsFitted}</div>
            </div>
          </div>

          {totalRemaining > 0 && (
            <div className="result-item warning">
              <div className="result-icon">
                <XCircle size={24} />
              </div>
              <div className="result-content">
                <div className="result-label">Cartons Remaining</div>
                <div className="result-value">{totalRemaining}</div>
              </div>
            </div>
          )}

          <div className="result-item info">
            <div className="result-icon">
              <TrendingUp size={24} />
            </div>
            <div className="result-content">
              <div className="result-label">Overall Utilization</div>
              <div className="result-value">{result.overallUtilization.toFixed(1)}%</div>
            </div>
          </div>

          {totalWeight > 0 && (
            <div className="result-item">
              <div className="result-icon">
                <Weight size={24} />
              </div>
              <div className="result-content">
                <div className="result-label">Total Weight</div>
                <div className="result-value">{totalWeight.toLocaleString()} kg</div>
              </div>
            </div>
          )}
        </div>

        <div className="utilization-bar">
          <div className="utilization-label">
            <span>Overall Container Utilization</span>
            <span className="utilization-percentage">{result.overallUtilization.toFixed(1)}%</span>
          </div>
          <div className="utilization-track">
            <div 
              className="utilization-fill"
              style={{ width: `${Math.min(result.overallUtilization, 100)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="container-breakdown">
        <h3>Container Breakdown</h3>
        <div className="table-container">
          <table className="breakdown-table">
            <thead>
              <tr>
                <th>Container</th>
                <th>Type</th>
                <th>Total Cartons</th>
                <th>Utilization</th>
                <th>Volume Used</th>
                <th>Weight</th>
                <th>Carton Details</th>
              </tr>
            </thead>
            <tbody>
              {result.containers.map((container) => (
                <tr key={container.containerNumber}>
                  <td className="container-number">#{container.containerNumber}</td>
                  <td>
                    <span className="container-type-badge">
                      {container.containerDimensions.name}
                    </span>
                  </td>
                  <td className="cartons-count">{container.cartonsFitted}</td>
                  <td>
                    <div className="utilization-cell">
                      <span className="utilization-value">
                        {container.utilizationPercentage.toFixed(1)}%
                      </span>
                      <div className="mini-utilization-bar">
                        <div 
                          className="mini-utilization-fill"
                          style={{ width: `${Math.min(container.utilizationPercentage, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td>{formatVolume(container.volumeUsed)} m³</td>
                  <td>{container.totalWeight > 0 ? `${container.totalWeight.toLocaleString()} kg` : '-'}</td>
                  <td>
                    <div className="carton-breakdown-cell">
                      {Object.entries(container.cartonBreakdown)
                        .filter(([_, count]) => count > 0)
                        .map(([cartonId, count]) => (
                          <div key={cartonId} className="carton-breakdown-item">
                            <span className="carton-breakdown-name">{getCartonName(cartonId)}:</span>
                            <span className="carton-breakdown-count">{count}</span>
                          </div>
                        ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ResultsDisplay

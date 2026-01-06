import React from 'react'
import { PackingResult } from '../types'
import { CheckCircle, XCircle, Package, TrendingUp, Weight } from 'lucide-react'
import './ResultsDisplay.css'

interface ResultsDisplayProps {
  result: PackingResult
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
  const formatVolume = (volume: number) => {
    return (volume / 1000000).toFixed(2)
  }

  return (
    <div className="results-display">
      <div className="result-grid">
        <div className="result-item success">
          <div className="result-icon">
            <CheckCircle size={24} />
          </div>
          <div className="result-content">
            <div className="result-label">Cartons Fitted</div>
            <div className="result-value">{result.cartonsFitted}</div>
          </div>
        </div>

        {result.cartonsRemaining > 0 && (
          <div className="result-item warning">
            <div className="result-icon">
              <XCircle size={24} />
            </div>
            <div className="result-content">
              <div className="result-label">Cartons Remaining</div>
              <div className="result-value">{result.cartonsRemaining}</div>
            </div>
          </div>
        )}

        <div className="result-item info">
          <div className="result-icon">
            <TrendingUp size={24} />
          </div>
          <div className="result-content">
            <div className="result-label">Space Utilization</div>
            <div className="result-value">{result.utilizationPercentage.toFixed(1)}%</div>
          </div>
        </div>

        <div className="result-item">
          <div className="result-icon">
            <Package size={24} />
          </div>
          <div className="result-content">
            <div className="result-label">Volume Used</div>
            <div className="result-value">{formatVolume(result.volumeUsed)} m³</div>
          </div>
        </div>

        <div className="result-item">
          <div className="result-icon">
            <Package size={24} />
          </div>
          <div className="result-content">
            <div className="result-label">Volume Remaining</div>
            <div className="result-value">{formatVolume(result.volumeRemaining)} m³</div>
          </div>
        </div>

        {result.totalWeight > 0 && (
          <div className="result-item">
            <div className="result-icon">
              <Weight size={24} />
            </div>
            <div className="result-content">
              <div className="result-label">Total Weight</div>
              <div className="result-value">{result.totalWeight.toLocaleString()} kg</div>
            </div>
          </div>
        )}
      </div>

      <div className="utilization-bar">
        <div className="utilization-label">
          <span>Container Utilization</span>
          <span className="utilization-percentage">{result.utilizationPercentage.toFixed(1)}%</span>
        </div>
        <div className="utilization-track">
          <div 
            className="utilization-fill"
            style={{ width: `${Math.min(result.utilizationPercentage, 100)}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export default ResultsDisplay

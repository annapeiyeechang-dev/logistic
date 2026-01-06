import React from 'react'
import { CartonDetails } from '../types'
import './CartonInput.css'

interface CartonInputProps {
  cartonDetails: CartonDetails
  onChange: (details: CartonDetails) => void
}

const CartonInput: React.FC<CartonInputProps> = ({ cartonDetails, onChange }) => {
  const handleChange = (field: keyof CartonDetails, value: string) => {
    const numValue = parseFloat(value) || 0
    onChange({
      ...cartonDetails,
      [field]: numValue
    })
  }

  return (
    <div className="carton-input">
      <div className="input-group">
        <label>Dimensions (cm)</label>
        <div className="dimension-inputs">
          <input
            type="number"
            placeholder="Length"
            value={cartonDetails.length || ''}
            onChange={(e) => handleChange('length', e.target.value)}
            min="0"
            step="0.1"
          />
          <span className="separator">×</span>
          <input
            type="number"
            placeholder="Width"
            value={cartonDetails.width || ''}
            onChange={(e) => handleChange('width', e.target.value)}
            min="0"
            step="0.1"
          />
          <span className="separator">×</span>
          <input
            type="number"
            placeholder="Height"
            value={cartonDetails.height || ''}
            onChange={(e) => handleChange('height', e.target.value)}
            min="0"
            step="0.1"
          />
        </div>
      </div>

      <div className="input-group">
        <label>Quantity</label>
        <input
          type="number"
          placeholder="Number of cartons"
          value={cartonDetails.quantity || ''}
          onChange={(e) => handleChange('quantity', e.target.value)}
          min="1"
          step="1"
        />
      </div>

      <div className="input-group">
        <label>Weight per Carton (kg) <span className="optional">Optional</span></label>
        <input
          type="number"
          placeholder="Weight in kg"
          value={cartonDetails.weight || ''}
          onChange={(e) => handleChange('weight', e.target.value)}
          min="0"
          step="0.1"
        />
      </div>
    </div>
  )
}

export default CartonInput

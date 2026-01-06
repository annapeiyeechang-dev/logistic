import React from 'react'
import { CartonDetails } from '../types'
import { Plus, Trash2 } from 'lucide-react'
import './CartonInput.css'

interface CartonInputProps {
  cartonTypes: CartonDetails[]
  onChange: (cartons: CartonDetails[]) => void
}

const CartonInput: React.FC<CartonInputProps> = ({ cartonTypes, onChange }) => {
  const handleChange = (index: number, field: keyof CartonDetails, value: string) => {
    const updated = [...cartonTypes]
    if (field === 'name') {
      updated[index][field] = value
    } else {
      const numValue = parseFloat(value) || 0
      updated[index][field] = numValue as never
    }
    onChange(updated)
  }

  const addCartonType = () => {
    const newCarton: CartonDetails = {
      id: `carton-${Date.now()}`,
      name: `Carton ${cartonTypes.length + 1}`,
      length: 0,
      width: 0,
      height: 0,
      quantity: 0,
      weight: 0
    }
    onChange([...cartonTypes, newCarton])
  }

  const removeCartonType = (index: number) => {
    if (cartonTypes.length > 1) {
      const updated = cartonTypes.filter((_, i) => i !== index)
      onChange(updated)
    }
  }

  return (
    <div className="carton-input">
      {cartonTypes.map((carton, index) => (
        <div key={carton.id} className="carton-type-card">
          <div className="carton-type-header">
            <input
              type="text"
              className="carton-name-input"
              value={carton.name}
              onChange={(e) => handleChange(index, 'name', e.target.value)}
              placeholder="Carton name"
            />
            {cartonTypes.length > 1 && (
              <button
                className="remove-carton-btn"
                onClick={() => removeCartonType(index)}
                title="Remove carton type"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>

          <div className="input-group">
            <label>Dimensions (cm)</label>
            <div className="dimension-inputs">
              <input
                type="number"
                placeholder="Length"
                value={carton.length || ''}
                onChange={(e) => handleChange(index, 'length', e.target.value)}
                min="0"
                step="0.1"
              />
              <span className="separator">×</span>
              <input
                type="number"
                placeholder="Width"
                value={carton.width || ''}
                onChange={(e) => handleChange(index, 'width', e.target.value)}
                min="0"
                step="0.1"
              />
              <span className="separator">×</span>
              <input
                type="number"
                placeholder="Height"
                value={carton.height || ''}
                onChange={(e) => handleChange(index, 'height', e.target.value)}
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
              value={carton.quantity || ''}
              onChange={(e) => handleChange(index, 'quantity', e.target.value)}
              min="1"
              step="1"
            />
          </div>

          <div className="input-group">
            <label>Weight per Carton (kg) <span className="optional">Optional</span></label>
            <input
              type="number"
              placeholder="Weight in kg"
              value={carton.weight || ''}
              onChange={(e) => handleChange(index, 'weight', e.target.value)}
              min="0"
              step="0.1"
            />
          </div>
        </div>
      ))}

      <button className="add-carton-btn" onClick={addCartonType}>
        <Plus size={20} />
        Add Another Carton Type
      </button>
    </div>
  )
}

export default CartonInput

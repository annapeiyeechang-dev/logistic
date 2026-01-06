import React, { useState } from 'react'
import { Package, Box, Ruler } from 'lucide-react'
import CartonInput from './components/CartonInput'
import ContainerSelector from './components/ContainerSelector'
import ResultsDisplay from './components/ResultsDisplay'
import VisualizationDisplay from './components/VisualizationDisplay'
import { calculatePacking } from './utils/packingAlgorithm'
import { CartonDetails, ContainerType, PackingResult } from './types'
import './App.css'

function App() {
  const [cartonTypes, setCartonTypes] = useState<CartonDetails[]>([
    {
      id: 'carton-1',
      name: 'Carton 1',
      length: 0,
      width: 0,
      height: 0,
      quantity: 0,
      weight: 0
    }
  ])

  const [selectedContainer, setSelectedContainer] = useState<ContainerType>('20ft')
  const [packingResult, setPackingResult] = useState<PackingResult | null>(null)

  const handleCalculate = () => {
    const validCartons = cartonTypes.filter(
      c => c.length > 0 && c.width > 0 && c.height > 0 && c.quantity > 0
    )

    if (validCartons.length > 0) {
      const result = calculatePacking(validCartons, selectedContainer)
      setPackingResult(result)
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <Package size={32} />
            <h1>Container Loading Calculator</h1>
          </div>
          <p className="subtitle">Optimize your shipping container space</p>
        </div>
      </header>

      <main className="app-main">
        <div className="input-section">
          <div className="card">
            <div className="card-header">
              <Box size={20} />
              <h2>Carton Details</h2>
            </div>
            <CartonInput 
              cartonTypes={cartonTypes}
              onChange={setCartonTypes}
            />
          </div>

          <div className="card">
            <div className="card-header">
              <Ruler size={20} />
              <h2>Container Type</h2>
            </div>
            <ContainerSelector
              selected={selectedContainer}
              onChange={setSelectedContainer}
            />
          </div>

          <button className="calculate-btn" onClick={handleCalculate}>
            Calculate Loading
          </button>
        </div>

        <div className="results-section">
          {packingResult ? (
            <>
              <div className="card">
                <div className="card-header">
                  <Package size={20} />
                  <h2>Loading Results</h2>
                </div>
                <ResultsDisplay result={packingResult} cartonTypes={cartonTypes} />
              </div>

              <div className="card visualization-card">
                <div className="card-header">
                  <Box size={20} />
                  <h2>Container Visualization</h2>
                </div>
                <VisualizationDisplay result={packingResult} cartonTypes={cartonTypes} />
              </div>
            </>
          ) : (
            <div className="empty-state">
              <Package size={64} strokeWidth={1} />
              <h3>Enter carton details to calculate</h3>
              <p>Fill in the carton dimensions, quantity, and select a container type to see the packing results</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App

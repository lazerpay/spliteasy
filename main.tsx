import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Example from './App.billsplittingdashboard'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Example />
  </StrictMode>,
)
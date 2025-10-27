import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { RoleContextWrapper } from './context/roleContext.jsx'
import { seedJobs } from '../extendedDB/jobstore.js'


(async() => {
  await seedJobs();
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <BrowserRouter>
        <RoleContextWrapper>
          <App />
        </RoleContextWrapper>
      </BrowserRouter>
    </StrictMode>
  )
})()


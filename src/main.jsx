import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { RoleContextWrapper } from './context/roleContext.jsx'
import { seedAssessments, seedCandidates, seedHRs, seedJobs } from '../extendedDB/jobstore.js'


(async() => {
  await seedJobs();
  await seedHRs();
  await seedCandidates();
  await seedAssessments();
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


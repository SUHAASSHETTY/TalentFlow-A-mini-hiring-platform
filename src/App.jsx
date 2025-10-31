import './App.css'
import { Route, Routes } from 'react-router-dom'
import { JobServer } from '../mirage/jobserver'
import { Login } from './pages/login';
import { Jobs } from './pages/jobs/jobs';
import {JobEdit} from './pages/jobs/jobedit'
import { JobAdd } from './pages/jobs/jobadd';
import { Candidates } from './pages/candidate/candidates';
import { CandidateTimeline } from './pages/candidate/candidateTimeline';
import { AssessmentBuilderPage } from './pages/assessment/AssessmentBuilderPage';
import { AssessmentRuntimePage } from './pages/assessment/AssessmentRuntimePage';
import AssessmentBuilderDemo from './components/assessment/AssessmentBuilderDemo';
import { Recruiter } from './pages/Recruiter';




function App() {
  JobServer();
  return (
    <>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/recruiter' element={<Recruiter/>}/>
        <Route path='/jobs' element={<Jobs/>}/>
        <Route path='/jobadd' element={<JobAdd/>}/>
        <Route path='/editjob/:id' element={<JobEdit/>}/>
        <Route path='/candidates' element={<Candidates/>}/>
        <Route path='/candidates/:id' element={<CandidateTimeline/>}/>

        <Route path='/assessments' element={<AssessmentBuilderDemo/>}/>
        <Route path='/assessments/:jobId' element={<AssessmentBuilderPage />} />
        <Route path='/assessments/:jobId/fill/:candidateId' element={<AssessmentRuntimePage />} />

      </Routes>
    </>
  )
}

export default App

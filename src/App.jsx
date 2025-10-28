import './App.css'
import { Route, Routes } from 'react-router-dom'
import { JobServer } from '../mirage/jobserver'
import { Login } from './pages/login';
import { Jobs } from './pages/jobs/jobs';
import { JobAdd } from './pages/jobs/jobadd';
import { JobEdit } from './pages/jobs/jobedit';
import { Candidates } from './pages/candidate/candidates';
import { CandidateTimeline } from './pages/candidate/candidateTimeline';



function App() {
  JobServer();
  return (
    <>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/jobs' element={<Jobs/>}/>
        <Route path='/jobadd' element={<JobAdd/>}/>
        <Route path='/editjob/:id' element={<JobEdit/>}/>
        <Route path='/candidates' element={<Candidates/>}/>
        <Route path='/candidates/:id' element={<CandidateTimeline/>}/>
      </Routes>
    </>
  )
}

export default App

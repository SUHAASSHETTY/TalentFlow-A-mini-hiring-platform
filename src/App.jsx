import './App.css'
import { Route, Routes } from 'react-router-dom'
import { JobServer } from '../mirage/jobserver'
import { Login } from './pages/login';
import { Jobs } from './pages/jobs';
import { JobAdd } from './pages/jobadd';
import { JobEdit } from './pages/jobedit';

function App() {
  JobServer();
  return (
    <>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/jobs' element={<Jobs/>}/>
        <Route path='/jobadd' element={<JobAdd/>}/>
        <Route path='/editjob/:id' element={<JobEdit/>}/>
      </Routes>
    </>
  )
}

export default App

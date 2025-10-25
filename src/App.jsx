import './App.css'
import { Route, Routes } from 'react-router-dom'
import { Login } from './components/login'
import { Jobs } from './components/jobs'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/jobs' element={<Jobs/>}/>
      </Routes>
    </>
  )
}

export default App

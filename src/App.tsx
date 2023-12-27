import { Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import Dashboard from './Pages/Dashboard'
import Maps from './Pages/Maps'

import './App.css'


function App() {

  return (
    <>

    {/* Create routing for the page  */}
    <Routes>
    <Route path='/' element={<Home/>}/>
    <Route path='/maps' element={<Maps/>}/>
    <Route path='/Dashboard' element={<Dashboard/>}/>
    </Routes>
    
    </>
  )
}

export default App

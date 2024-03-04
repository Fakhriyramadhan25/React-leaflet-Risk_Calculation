import { Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import Signup from './Pages/Signup'
import Maps from './Pages/Maps'
import Signin from './Pages/Signin'

import './App.css'

function App() {

  return (
    <>

    {/* Create routing for the page  */}
    <Routes>
    <Route path='/' element={<Home/>}/>
    <Route path='/maps' element={<Maps/>}/>
    <Route path='/signup' element={<Signup/>}/>
    <Route path='/signin' element={<Signin/>}/>
    </Routes>
    
    </>
  )
}

export default App

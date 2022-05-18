import { Register } from './views/register/Register'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Login } from './views/login/Login'

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App

import { ClientPage, AdminPage, PaymentPage } from './pages'
import { Routes, Route } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<ClientPage/>}/>
      <Route path="*" element={<div>404</div>}/>
      <Route path="/admin" element={<AdminPage/>}/>
      <Route path="/payment/:seanceId" element={<PaymentPage/>}/>
    </Routes>
  )
}

export default App

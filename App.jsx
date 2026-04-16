import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Home'
import Centres from './pages/Centres'
import Groups from './pages/Groups'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/centres" element={<Centres />} />
        <Route path="/groups" element={<Groups />} />
      </Routes>
    </BrowserRouter>
  )
}

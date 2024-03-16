import React from 'react'
import Home from './pages/Home'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Ocr from './pages/Ocr';
import Hospital from './pages/Hospital/Hospital';


export default function App() {
  return (
    <>
    <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/scan" element={<Ocr />} />
          <Route path="/lab" element={<Hospital/>} />
        </Routes>
      </Router>
    </>
  )
}

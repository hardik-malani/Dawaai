import React from 'react'
import Home from './pages/Home'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Ocr from './pages/Ocr';
import Hospital from './pages/Hospital/Hospital';
import Location from './pages/Location';


export default function App() {
  return (
    <>
    <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/scan" element={<Ocr />} />
          <Route path="/lab" element={<Hospital/>} />
          <Route path="/test/:id" element={<Location/>} />
        </Routes>
      </Router>
    </>
  )
}

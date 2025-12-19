import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route } from "react-router-dom";
import Publier from './Publier';
import Ads from './Ads'
import GoogleAuth from './GoogleAuth'
import ScrollToTop from "./ScrollToTop";
function App() {

  return (
    <>
    <ScrollToTop />
    <Routes>
      <Route path="/" element={<Ads />} />
      <Route path="/publier" element={<Publier />} />
    </Routes>
    </>
  )
}

export default App

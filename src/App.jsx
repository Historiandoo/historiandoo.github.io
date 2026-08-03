import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SideNavigationBar from './components/SideNavigationBar';
import PageChegadaPortugueses from './pages/PageChegadaPortugueses';
import PageDecolonialidade from './pages/PageDecolonialidade';
import Home from './pages/Home';
import '../src/css/App.css'

function App() {
  
  return (
  
    <>
      <SideNavigationBar/>
      
      <div className='main-content'>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/chegadaPortuguesesBrasil" element={<PageChegadaPortugueses/>}/>
          <Route path="/decolonialidade" element={<PageDecolonialidade/>}/>
        </Routes>
      </div>
     
    </>

  );
}

export default App;

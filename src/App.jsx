import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SideNavigationBar from './components/SideNavigationBar';
import PageChegadaPortugueses from './pages/PageChegadaPortugueses';
import PageDecolonialidade from './pages/PageDecolonialidade';
import PageCartaPeroVaz from './pages/PageCartaPeroVaz';
import PageAntecedentesPreColonial from './pages/PageAntecedentesPreColonial';
import Home from './pages/Home';
import PageQuestoesVestibular from './pages/PageQuestoesVestibular';
import PageResponderQuestao from './pages/PageResponderQuestão';
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
          <Route path="/cartaPeroVaz" element={<PageCartaPeroVaz/>}/>
          <Route path="/antecedentesPreColonial" element={<PageAntecedentesPreColonial/>}/>
          <Route path="/questoesVestibular" element={<PageQuestoesVestibular/>}/>
          <Route path="/questaoResponder/:id" element={<PageResponderQuestao/>}/>
          

        </Routes>
      </div>
     
    </>

  );
}

export default App;

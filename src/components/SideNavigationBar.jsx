import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import logo from '../assets/brand/logo.svg';
import symbol from '../assets/brand/symbol.svg';
import '../css/SideNavigationBar.css';

export default function SideNavigationBar() {
    const [open, setOpen] = useState(false);
    const { pathname, hash } = useLocation();
    const close = () => setOpen(false);
    return (
        <header className="site-header">
            <Link className="brand" to="/" onClick={close} aria-label="Historiando — início"><img src={logo} alt="Historiando Pindorama" /></Link>
            <button className="menu-toggle" type="button" aria-expanded={open} aria-controls="site-navigation" onClick={() => setOpen(!open)}>{open ? 'Fechar ×' : 'Menu ☰'}</button>
            <nav id="site-navigation" className={`site-navigation ${open ? 'is-open' : ''}`} aria-label="Navegação principal">
                <Link to="/" onClick={close} className={pathname === '/' && !hash ? 'active' : ''}>Início</Link>
                <Link to="/#conteudos" onClick={close} className={hash === '#conteudos' ? 'active' : ''}>Conteúdos</Link>
                <NavLink to="/questoesVestibular" onClick={close}>Questões</NavLink>
                <Link to="/#mapas-mentais" onClick={close} className={hash === '#mapas-mentais' || pathname === '/mapaMental' ? 'active' : ''}>Mapas mentais</Link>
                <NavLink to="/feedback" onClick={close}>Feedback</NavLink>
            </nav>
            <span className="header-motto"><img src={symbol} alt="" /> Cada história, uma descoberta.</span>
        </header>
    );
}

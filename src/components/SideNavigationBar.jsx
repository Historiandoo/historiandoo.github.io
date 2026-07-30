import React from 'react';
import '../css/SideNavigationBar.css';
import { Link } from 'react-router-dom';

function SideNavigationBar() {
    return (
        <>
            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
            />

            {/* navbar como btn sanduíche(toggler) no header da página */}
            <nav className="navbar navbar-dark bg-dark d-sm-none">
                <div className="container-fluid">

                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#mobileSidebar"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                </div>
            </nav>

            {/* navbar exposta no mobile*/}
            <div
                className="offcanvas offcanvas-start"
                tabIndex="-1"
                id="mobileSidebar"
            >

                <div className="offcanvas-header">

                    <h5>Historiando</h5>

                    <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="offcanvas"
                    ></button>

                </div>

                <div className="offcanvas-body">

                    <Link className="nav-link mb-3"  to="/" >
                        <i className="fa fa-fw fa-home"></i> Home
                    </Link>

                    <a className="nav-link mb-3" href="#">
                        <i className="fa fa-fw fa-search"></i> Pesquisar
                    </a>

                    <a className="nav-link mb-3" href="#">
                        <i className="fa fa-fw fa-question"></i> Perguntas
                    </a>

                    <a className="nav-link mb-3" href="#">
                        <i className="fa fa-fw fa-book"></i> Conteúdo
                    </a>

                    <a className="nav-link" href="#">
                        <i className="fa fa-fw fa-map"></i> Mapa Mental
                    </a>

                </div>

            </div>

            {/* navbar em dimensões desktop */}
            <div className="sidenav d-none d-sm-block"> {/*esse d-sm-block significa que em dimensões small a navbar vai conseguir se tornar um "bloco" maleável*/}

                <Link to="/">
                    <i className="fa fa-fw fa-home" title="Home"></i>
                </Link>

                <a href="#">
                    <i className="fa fa-fw fa-search" title="Pesquisar"></i>
                </a>

                <a href="#">
                    <i className="fa fa-fw fa-question" title="Perguntas"></i>
                </a>

                <a href="#">
                    <i className="fa fa-fw fa-book" title="Conteúdo"></i>
                </a>

                <a href="#">
                    <i className="fa fa-fw fa-map" title="Mapa Mental"></i>
                </a>

            </div>
        </>
    );
}

export default SideNavigationBar;
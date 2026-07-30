import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Home.css'
import caravela from '../assets/caravela.png'

function Home() {

    return (
    <>
        <div className='container-fluid'>
           
            <h2>Bem vindo!</h2>
            <p>Para aprender mais, sempre pesquise!</p>
        
            <div className='row mb-5'>
                <div className='col'>
                    <div id='banner'>

                    </div>
                </div>
            </div>

            <div className='row g-4'>

                <div className='col-12 col-sm-6 col-md-4 col-lg-3'>
                    <div className='card'>
                        <img src={caravela} className='card-img-top' alt='Chegada dos portugueses'/>
                        <div className='card-body'>
                            <h5 className='card-title'> A chegada dos portugueses ao Brasil</h5>
                            <p className='card-text'> Algum texto </p>
                             <Link className='btn btn-primary' to="/chegadaPortuguesesBrasil">A chegada dos portugueses ao Brasil</Link>
                        </div>
                    </div>
                </div>

                <div className='col-12 col-sm-6 col-md-4 col-lg-3'>
                    <div className='card'>
                        <img src={caravela} className='card-img-top' alt='...'/>
                        <div className='card-body'>
                            <h5 className='card-title'> A chegada dos portugueses ao Brasil</h5>
                            <p className='card-text'> Algum texto </p>
                             <Link className='btn btn-primary' to="/chegadaPortuguesesBrasil">A chegada dos portugueses ao Brasil</Link>
                        </div>
                    </div>
                </div>

                <div className='col-12 col-sm-6 col-md-4 col-lg-3'>
                    <div className='card'>
                        <img src={caravela} className='card-img-top' alt='...'/>
                        <div className='card-body'>
                            <h5 className='card-title'> A chegada dos portugueses ao Brasil</h5>
                            <p className='card-text'> Algum texto </p>
                             <Link className='btn btn-primary' to="/chegadaPortuguesesBrasil">A chegada dos portugueses ao Brasil</Link>
                        </div>
                    </div>
                </div>

                <div className='col-12 col-sm-6 col-md-4 col-lg-3'>
                    <div className='card'>
                        <img src={caravela} className='card-img-top' alt='...'/>
                        <div className='card-body'>
                            <h5 className='card-title'> A chegada dos portugueses ao Brasil</h5>
                            <p className='card-text'> Algum texto </p>
                             <Link className='btn btn-primary' to="/chegadaPortuguesesBrasil">A chegada dos portugueses ao Brasil</Link>
                        </div>
                    </div>
                </div>

                <div className='col-12 col-sm-6 col-md-4 col-lg-3'>
                    <div className='card'>
                        <img src={caravela} className='card-img-top' alt='...'/>
                        <div className='card-body'>
                            <h5 className='card-title'> A chegada dos portugueses ao Brasil</h5>
                            <p className='card-text'> Algum texto </p>
                             <Link className='btn btn-primary' to="/chegadaPortuguesesBrasil">A chegada dos portugueses ao Brasil</Link>
                        </div>
                    </div>
                </div>

                <div className='col-12 col-sm-6 col-md-4 col-lg-3'>
                    <div className='card'>
                        <img src={caravela} className='card-img-top' alt='...'/>
                        <div className='card-body'>
                            <h5 className='card-title'> A chegada dos portugueses ao Brasil</h5>
                            <p className='card-text'> Algum texto </p>
                             <Link className='btn btn-primary' to="/chegadaPortuguesesBrasil">A chegada dos portugueses ao Brasil</Link>
                        </div>
                    </div>
                </div>

                <div className='col-12 col-sm-6 col-md-4 col-lg-3'>
                    <div className='card'>
                        <img src={caravela} className='card-img-top' alt='...'/>
                        <div className='card-body'>
                            <h5 className='card-title'> A chegada dos portugueses ao Brasil</h5>
                            <p className='card-text'> Algum texto </p>
                             <Link className='btn btn-primary' to="/chegadaPortuguesesBrasil">A chegada dos portugueses ao Brasil</Link>
                        </div>
                    </div>
                </div>

                <div className='col-12 col-sm-6 col-md-4 col-lg-3'>
                    <div className='card'>
                        <img src={caravela} className='card-img-top' alt='...'/>
                        <div className='card-body'>
                            <h5 className='card-title'> A chegada dos portugueses ao Brasil</h5>
                            <p className='card-text'> Algum texto </p>
                             <Link className='btn btn-primary' to="/chegadaPortuguesesBrasil">A chegada dos portugueses ao Brasil</Link>
                        </div>
                    </div>
                </div>

            </div>
            
        </div>

    </>
    ); 
}

export default Home;
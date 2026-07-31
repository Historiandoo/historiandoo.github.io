import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Home.css'
import cardsHome from '../data/contentCards';
import CardsContent from '../components/Card';


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
            
                {cardsHome.map(card => (

                    <div key={card.id} className='col-12 col-sm-6 col-md-4 col-lg-3'>

                        <CardsContent
                        title = {card.title}
                        image = {card.image}
                        description = {card.description}
                        route = {card.route}
                        />

                    </div>
                )
            )}

            </div>
            
        </div>

    </>
    ); 
}

export default Home;
import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Home.css'
import cardsData from '../data/contentCards';
import CardsContent from '../components/Cards';
import CarouselHome from '../components/Carousel';
import CardQuestaoVestibular from '../components/questions/CardQuestoesVestibular';
import CardMap from '../components/CardsMapasMentais';
import questionsData from '../data/dataQuestoesVestibular.json';
import mapsData from '../data/contentMaps';


export default function Home() {

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

           <section id='conteudos' className='home-section'>

            <h2 className='section-title'>
                Conteúdos 
            </h2>

            <CarouselHome>
                {cardsData.map(card => (
                    <div className='carousel-item-content' key={card.id}>
                        
                        <CardsContent
                            title={card.title}
                            image={card.image}
                            description={card.description}
                            route={card.route}
                        />

                    </div>
                ))}
            </CarouselHome>

           </section>

            <section id='questoes' className='home-section'>

            <h2 className='section-title'>
                Questões de Vestibular 
            </h2>

            <CarouselHome>
                {questionsData.map(question => (
                    <div className='carousel-item-content' key={question.question_id}>
                        
                        <CardQuestaoVestibular
                            question={question}
                        />

                    </div>
                ))}
            </CarouselHome>

           </section>

           <section id='mapas-mentais' className='home-section'>

            <h2 className='section-title'>
                Mapas Mentais
            </h2>

            <CarouselHome>
                {mapsData.map(map => (
                        <CardMap
                            key={map.id}
                            map={map}
                        />
                ))}
            </CarouselHome>

           </section>
            
        </div>

    </>
    ); 
}
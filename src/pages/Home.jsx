import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/Home.css';
import cardsData from '../data/contentCards';
import CardsContent from '../components/Cards';
import CardQuestaoVestibular from '../components/questions/CardQuestoesVestibular';
import CardMap from '../components/CardsMapasMentais';
import questionsData from '../data/dataQuestoesVestibular.json';
import mapsData from '../data/contentMaps';
import portal from '../assets/illustrations/portal.svg';

export default function Home() {
    const [search, setSearch] = useState('');
    const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const cards = cardsData.filter(card => normalize(`${card.title} ${card.description}`).includes(normalize(search)));
    return (
        <div className="home">
            <section className="hero" aria-labelledby="hero-title">
                <div className="hero-copy">
                    <p className="eyebrow"><span className="little-diamond" /> Sua jornada pelos tempos históricos </p>
                    <h1 id="hero-title">O conhecimento<br /><span>Abre portas</span></h1>
                    <p className="hero-description">Atravesse o tempo, conecte histórias e descubra novas formas de olhar para o mundo.</p>
                    <a href="#conteudos" className="comic-button">Começar a descoberta <span aria-hidden="true">↗</span></a>
                    <div className="hero-footnote"><span>HISTÓRIA ALÉM DO JOGO</span><span>Aprenda mais sobre o que te interessa!</span></div>
                </div>
                <div className="hero-art">
                    <img src={portal} alt="Paisagem geométrica de Pindorama, com montanhas, palmeiras e um portal em espiral" />
                    <span className="art-label">Uma aventura que vale a pena</span>
                    <span className="art-caption">Cada descoberta abre um novo caminho</span>
                </div>
            </section>
            <div className="journey-strip"><span>01 / Explore os conteúdos</span><span>02 / Conecte as ideias</span><span>03 / Teste seus conhecimentos</span></div>
            <section id="conteudos" className="home-section">
                <div className="section-heading"><div><p className="eyebrow">O próximo capítulo é seu</p><h2>Histórias para explorar<span></span></h2></div><span className="section-count">{String(cardsData.length).padStart(2, '0')} descobertas</span></div>
                <label className="content-search"><span>Encontre sua próxima descoberta</span><input type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Buscar um tema: Brasil, decolonialidade…" /></label>
                <div className="content-grid">{cards.map(card => <CardsContent key={card.id} {...card} />)}</div>
                {cards.length === 0 && <p role="status" className="empty-search">Nenhum conteúdo encontrado. Tente outro tema</p>}
            </section>
            <section id="mapas-mentais" className="home-section maps-section">
                <div className="section-heading"><div><p className="eyebrow">Uma ideia leva a outra</p><h2>Conecte a história<span></span></h2></div><span className="section-count">Mapas mentais</span></div>
                <p className="section-description">Veja o todo, siga as conexões e revise as ideias de cada tema</p>
                <div className="maps-grid">{mapsData.map(map => <CardMap key={map.id} map={map} />)}</div>
            </section>
            <section id="questoes" className="home-section questions-section">
                <div className="section-heading"><div><p className="eyebrow">Conhecimento em ação</p><h2>Seu próximo desafio<span></span></h2></div><Link to="/questoesVestibular" className="text-link">Ver todas as questões ↗</Link></div>
                <div className="question-grid">{questionsData.map(question => <CardQuestaoVestibular key={question.question_id} question={question} />)}</div>
            </section>
            <aside className="closing-note"><span aria-hidden="true">✦</span><p>Para aprender mais,<br /><strong>sempre pesquise.</strong></p><Link to="/feedback" className="comic-button secondary">Compartilhe sua opinião ↗</Link></aside>
        </div>
    );
}

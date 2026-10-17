import { Link } from 'react-router-dom';
import cardsData from '../data/contentCards';
import mapsData from '../data/contentMaps';

export default function ReadingPage({ id, content }) {
    const card = cardsData.find(item => item.id === id);
    const map = mapsData.find(item => item.route === card.route);
    return (
        <article>
            <div className="reading-hero">
                <div className="reading-breadcrumb"><Link to="/#conteudos">← Todas as descobertas</Link><span className="eyebrow">Explore a história / 0{id}</span></div>
                <img src={card.image} alt="" />
            </div>
            <div className="container"><div className="content-page">
                <h1 className="mb-5">{content.title}</h1>
                {content.paragraphs.map(({ text, subtitle }, index) => (
                    <div className="paragraph" key={index}>{subtitle && <h2>{subtitle}</h2>}<p>{text}</p></div>
                ))}
            </div></div>
            <div className="reading-resources">
                {map && <Link className="comic-button secondary" to={`/mapaMental?id=${map.id}`}>Conectar as ideias / mapa mental ↗</Link>}
                <Link className="text-link" to="/questoesVestibular">Teste seus conhecimentos ↗</Link>
            </div>
        </article>
    );
}

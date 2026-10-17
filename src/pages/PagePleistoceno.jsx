import { Link } from 'react-router-dom';
import illustration from '../assets/illustrations/pleistoceno.svg';

export default function PagePleistoceno() {
    return (
        <article className="content-page">
            <Link to="/#conteudos" className="back-question">← Todas as descobertas</Link>
            <div className="reading-hero"><img src={illustration} alt="Ilustração geométrica de um mamute diante de montanhas" /></div>
            <p className="eyebrow" style={{ marginTop: 30 }}>Explore a história / 05</p>
            <h1>Pleistoceno e a Megafauna</h1>
            <p>Uma nova descoberta está a caminho. O conteúdo deste capítulo está em preparação.</p>
            <Link to="/#conteudos" className="comic-button">Explorar outros conteúdos ↗</Link>
        </article>
    );
}

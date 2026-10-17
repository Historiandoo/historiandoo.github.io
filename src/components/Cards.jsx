import { Link } from 'react-router-dom';

export default function CardsContent({ id, title, image, description, route }) {
    return (
        <Link className="discovery-card" to={route}>
            <div className="discovery-art"><img src={image} alt="" loading="lazy" /><span className="chapter-number">{String(id).padStart(2, '0')}</span></div>
            <div className="discovery-body"><p className="eyebrow">Explore a história</p><h3>{title}</h3><p>{description}</p><span className="card-action">Explorar conteúdo <span aria-hidden="true">↗</span></span></div>
        </Link>
    );
}

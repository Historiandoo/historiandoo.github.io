import { Link } from 'react-router-dom';

export default function CardMap({ map }) {
    return (
        <Link to={`/mapaMental?id=${map.id}`} className="map-card">
            <div className="map-preview" aria-hidden="true">
                <svg viewBox="0 0 400 230"><path d="M200 115 75 53M200 115l125-62M200 115 75 177M200 115l125 62" /></svg>
                {map.branches.map((branch, index) => <span key={branch.title} className={`mini-node mini-node-${index}`}>{branch.title}</span>)}
                <img src={map.image} alt="" loading="lazy" />
            </div>
            <div className="map-card-body"><p className="eyebrow">Mapa mental / 0{map.id}</p><h3>{map.shortTitle}</h3><span className="card-action">Conectar as ideias <span aria-hidden="true">↗</span></span></div>
        </Link>
    );
}

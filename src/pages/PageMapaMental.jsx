import { useLocation, Link, useSearchParams } from 'react-router-dom';
import mapsData from '../data/contentMaps';
import MindMap from '../components/MindMap';
import { downloadMindMap } from '../utils/downloadMindMap';
import '../css/MindMap.css';

export default function PageMapaMental() {
    const location = useLocation();
    const [params] = useSearchParams();
    const id = Number(params.get('id') || location.state?.map?.id || 1);
    const map = mapsData.find(item => item.id === id);
    if (!map) return <div className="content-page"><h1>Mapa mental não encontrado</h1><Link to="/#mapas-mentais">Voltar aos mapas mentais</Link></div>;
    return (
        <div className="map-page">
            <Link className="back-question" to="/#mapas-mentais">← Todos os mapas mentais</Link>
            <div className="section-heading"><div><p className="eyebrow">Uma ideia leva a outra / mapa 0{map.id}</p><h1>{map.title}</h1></div><button type="button" className="comic-button secondary" onClick={() => downloadMindMap(map)}>Baixar mapa ↓</button></div>
            <nav className="map-tabs" aria-label="Escolher mapa mental">{mapsData.map(item => <Link key={item.id} to={`/mapaMental?id=${item.id}`} aria-current={id === item.id ? 'page' : undefined}>0{item.id} / {item.shortTitle}</Link>)}</nav>
            <MindMap map={map} />
            <div className="map-reading-link"><p>Continue a descoberta. Aprofunde as conexões deste mapa.</p><Link to={map.route} className="comic-button">Explorar o conteúdo ↗</Link></div>
        </div>
    );
}

import { useState } from 'react';
import { useLocation, Link, useSearchParams } from 'react-router-dom';
import mapsData from '../data/contentMaps';
import MindMap from '../components/MindMap';
import { downloadMindMap } from '../utils/downloadMindMap';
import '../css/MindMap.css';

export default function PageMapaMental() {
    const location = useLocation();
    const [params] = useSearchParams();
    const [downloading, setDownloading] = useState(false);
    const [downloadError, setDownloadError] = useState('');
    const id = Number(params.get('id') || location.state?.map?.id || 1);
    const map = mapsData.find(item => item.id === id);
    async function download() {
        setDownloading(true);
        setDownloadError('');
        try {
            await downloadMindMap(map);
        } catch (error) {
            setDownloadError(error.message || 'Não foi possível baixar o mapa. Tente novamente.');
        } finally {
            setDownloading(false);
        }
    }
    if (!map) return <div className="content-page"><h1>Mapa mental não encontrado</h1><Link to="/#mapas-mentais">Voltar aos mapas mentais</Link></div>;
    return (
        <div className="map-page">
            <Link className="back-question" to="/#mapas-mentais">← Todos os mapas mentais</Link>
            <div className="section-heading"><div><p className="eyebrow">Uma ideia leva a outra / mapa 0{map.id}</p><h1>{map.title}</h1></div><button type="button" className="comic-button secondary" onClick={download} disabled={downloading}>{downloading ? 'Gerando imagem…' : 'Baixar mapa PNG ↓'}</button></div>
            {downloadError && <p className="download-error" role="alert">{downloadError}</p>}
            <nav className="map-tabs" aria-label="Escolher mapa mental">{mapsData.map(item => <Link key={item.id} to={`/mapaMental?id=${item.id}`} aria-current={id === item.id ? 'page' : undefined}>0{item.id} / {item.shortTitle}</Link>)}</nav>
            <MindMap map={map} />
            <div className="map-reading-link"><p>Continue a descoberta. Aprofunde as conexões deste mapa.</p><Link to={map.route} className="comic-button">Explorar o conteúdo ↗</Link></div>
        </div>
    );
}

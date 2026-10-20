import { renderMindMap } from './renderMindMap';
import brandUrl from '../assets/brand/logo.svg';

/** Produce a complete PNG with vector artwork, connectors, text and branding. */
export async function downloadMindMap(map) {
    function image(url) {
        return new Promise((resolve, reject) => {
            const asset = new Image();
            asset.onload = () => resolve(asset);
            asset.onerror = () => reject(new Error('Não foi possível carregar as ilustrações do mapa.'));
            asset.src = url;
        });
    }
    await Promise.all([document.fonts.load('500 25px "Barlow Condensed"'), document.fonts.load('700 39px "Barlow Condensed"')]);
    const [artwork, brand] = await Promise.all([image(map.image), image(brandUrl)]);
    const canvas = renderMindMap(document.createElement('canvas'), map, artwork, brand);
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    if (!blob) throw new Error('Não foi possível gerar a imagem. Tente novamente.');
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `historiando-mapa-${map.id}.png`;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
    return blob;
}

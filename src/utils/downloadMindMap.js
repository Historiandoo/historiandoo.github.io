// Self-contained SVG: the downloaded diagram stays readable without site fonts or assets.
export function downloadMindMap(map) {
    const escape = text => text.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[char]));
    const wrap = (text, max) => {
        const lines = [''];
        text.split(' ').forEach(word => {
            if ((lines[lines.length - 1] + word).length > max) lines.push('');
            lines[lines.length - 1] += `${word} `;
        });
        return lines;
    };
    const textLines = (lines, x, y, size = 21) => `<text x="${x}" y="${y}" fill="#1a002c" font-family="Arial,sans-serif" font-size="${size}">${lines.map((line, i) => `<tspan x="${x}" dy="${i === 0 ? 0 : 29}">${escape(line.trim())}</tspan>`).join('')}</text>`;
    const positions = [[45, 140], [835, 140], [45, 490], [835, 490]];
    const nodes = map.branches.map((branch, index) => {
        const [x, y] = positions[index];
        const lines = branch.items ? branch.items.flatMap(item => wrap(`• ${item}`, 28)) : wrap(branch.text, 28);
        return `<rect x="${x + 8}" y="${y + 8}" width="320" height="270" fill="#0d0019"/><rect x="${x}" y="${y}" width="320" height="270" fill="${index % 2 ? '#dda63b' : '#dac7a7'}"/>${textLines([branch.title], x + 20, y + 42, 23)}${textLines(lines, x + 20, y + 84)}`;
    }).join('');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="840" viewBox="0 0 1200 840"><title>${escape(map.title)}</title><rect width="1200" height="840" fill="#1a002c"/><text x="45" y="65" fill="#dda63b" font-family="Arial,sans-serif" font-size="20">HISTORIANDO / MAPA MENTAL 0${map.id}</text><path d="M600 425 365 275M600 425 835 275M600 425 365 625M600 425 835 625" stroke="#dda63b" stroke-width="4"/><rect x="395" y="330" width="410" height="190" fill="#ce6035"/>${textLines(wrap(map.title, 24), 420, 380, 27)}${nodes}<text x="45" y="810" fill="#dac7a7" font-family="Arial,sans-serif" font-size="16">Cada história, uma nova descoberta. / historiandoo.github.io</text></svg>`;
    const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `historiando-mapa-${map.id}.svg`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

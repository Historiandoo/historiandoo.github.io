const colors = { ink: '#1a002c', cream: '#dac7a7', ochre: '#dda63b', terra: '#ce6035', background: '#241032' };
const font = (size, weight = 500) => `${weight} ${size}px "Barlow Condensed", sans-serif`;

export function wrapMapText(context, text, width) {
    const lines = [];
    for (const paragraph of text.split('\n')) {
        let line = '';
        for (const word of paragraph.split(/\s+/).filter(Boolean)) {
            const candidate = line ? `${line} ${word}` : word;
            if (line && context.measureText(candidate).width > width) { lines.push(line); line = word; }
            else line = candidate;
        }
        if (line) lines.push(line);
    }
    return lines;
}

/** Shared, deterministic drawing routine: no foreignObject or external image references. */
export function renderMindMap(canvas, map, artwork, brand, pixelRatio = 2) {
    const width = 1440;
    let context = canvas.getContext('2d');
    if (!context) throw new Error('Seu navegador não conseguiu criar a imagem.');
    const nodeWidth = 380;
    const nodeLayouts = map.branches.map(branch => {
        context.font = font(29, 700);
        const title = wrapMapText(context, branch.title, nodeWidth - 80);
        context.font = font(25);
        const content = (branch.items || [branch.text]).map(text => wrapMapText(context, text, nodeWidth - 66));
        const height = 50 + title.length * 34 + content.reduce((sum, lines) => sum + lines.length * 34 + 10, 0) + 26;
        return { title, content, height, bullet: Boolean(branch.items) };
    });
    const nodeHeight = Math.max(290, ...nodeLayouts.map(node => node.height));
    const top = 145;
    const gap = 66;
    const height = top + nodeHeight * 2 + gap + 85;
    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;
    context = canvas.getContext('2d');
    context.scale(pixelRatio, pixelRatio);
    context.textBaseline = 'top';
    context.fillStyle = colors.background;
    context.fillRect(0, 0, width, height);
    context.fillStyle = '#dac7a718';
    for (let y = 14; y < height; y += 18) for (let x = 14; x < width; x += 18) { context.beginPath(); context.arc(x, y, 1.5, 0, Math.PI * 2); context.fill(); }
    context.fillStyle = colors.ochre;
    context.font = font(24, 700);
    context.fillText(`HISTORIANDO / MAPA MENTAL 0${map.id}`, 48, 45);
    if (brand) context.drawImage(brand, width - 240, 27, 190, 57);
    context.strokeStyle = '#dac7a755';
    context.lineWidth = 1;
    context.beginPath(); context.moveTo(48, 107); context.lineTo(width - 48, 107); context.stroke();

    const middle = top + nodeHeight + gap / 2;
    const positions = [[48, top], [1012, top], [48, top + nodeHeight + gap], [1012, top + nodeHeight + gap]];
    context.strokeStyle = colors.ochre;
    context.lineWidth = 4;
    positions.forEach(([x, y]) => {
        const endX = x < width / 2 ? x + nodeWidth : x;
        context.beginPath(); context.moveTo(width / 2, middle); context.bezierCurveTo(endX, middle, width / 2, y + nodeHeight / 2, endX, y + nodeHeight / 2); context.stroke();
    });

    // Same center artwork and text as the interactive map, drawn before the nodes.
    const centerX = 480, centerWidth = 480;
    context.font = font(39, 700);
    const titleLines = wrapMapText(context, map.title, centerWidth - 64);
    const imageHeight = 312;
    const centerHeight = 90 + titleLines.length * 44 + imageHeight;
    const centerY = middle - centerHeight / 2;
    context.fillStyle = '#0d0019'; context.fillRect(centerX + 8, centerY + 8, centerWidth, centerHeight);
    context.fillStyle = colors.terra; context.fillRect(centerX, centerY, centerWidth, centerHeight);
    context.strokeStyle = colors.ink; context.lineWidth = 4; context.strokeRect(centerX, centerY, centerWidth, centerHeight);
    context.fillStyle = colors.ink; context.font = font(17, 700); context.textAlign = 'center';
    context.fillText('CONECTE A HISTÓRIA', width / 2, centerY + 22);
    context.font = font(39, 700);
    titleLines.forEach((line, index) => context.fillText(line, width / 2, centerY + 52 + index * 44));
    const imageY = centerY + 66 + titleLines.length * 44;
    context.drawImage(artwork, centerX + 32, imageY, centerWidth - 64, imageHeight);
    context.strokeStyle = colors.ink; context.lineWidth = 3; context.strokeRect(centerX + 32, imageY, centerWidth - 64, imageHeight);
    context.textAlign = 'left';

    positions.forEach(([x, y], index) => {
        const layout = nodeLayouts[index];
        context.fillStyle = '#0d0019'; context.fillRect(x + 7, y + 7, nodeWidth, nodeHeight);
        context.fillStyle = index === 1 || index === 2 ? colors.ochre : colors.cream; context.fillRect(x, y, nodeWidth, nodeHeight);
        context.strokeStyle = colors.ink; context.lineWidth = 3; context.strokeRect(x, y, nodeWidth, nodeHeight);
        context.fillStyle = '#1a002c70'; context.font = font(22, 700); context.fillText(`0${index + 1}`, x + nodeWidth - 42, y + 14);
        context.fillStyle = colors.ink; context.font = font(29, 700);
        layout.title.forEach((line, lineIndex) => context.fillText(line, x + 24, y + 25 + lineIndex * 34));
        context.font = font(25);
        let textY = y + 42 + layout.title.length * 34;
        layout.content.forEach(lines => {
            if (layout.bullet) { context.beginPath(); context.arc(x + 26, textY + 12, 3, 0, Math.PI * 2); context.fill(); }
            lines.forEach(line => { context.fillText(line, x + (layout.bullet ? 40 : 24), textY); textY += 34; });
            textY += 10;
        });
    });
    context.font = font(18); context.fillStyle = colors.cream;
    context.fillText('CADA HISTÓRIA, UMA NOVA DESCOBERTA.', 48, height - 43);
    context.textAlign = 'right'; context.fillStyle = colors.ochre;
    context.fillText('historiandoo.github.io', width - 48, height - 43);
    return canvas;
}

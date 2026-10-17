# Identidade visual do site Historiando

O site acompanha a interface do jogo em `../Historiando`, usando como referência
`docs/ui/01_inicio.png`, `docs/ui/02_capitulos.png` e `docs/ui/README.md` desse projeto.

## Paleta e tipografia

- Roxo: `#1A002C`; creme: `#DAC7A7`; ocre: `#DDA63B`;
  terracota: `#CE6035`; verde: `#2F5143`.
- Barlow Condensed Medium e Bold para navegação, leitura curta e títulos.
- Historiando Mosaico para os números dos capítulos.
- As fontes são locais em `public/fonts/`, com as respectivas licenças OFL.
  O texto dos artigos usa a fonte de sistema para facilitar leituras longas.

## Imagens e marca

`src/assets/brand/logo.svg` e `symbol.svg` são cópias dos arquivos originais
`brand_group_28.svg` e `brand_symbol.svg` do jogo, sem alteração no desenho.

As ilustrações em `src/assets/illustrations/` são vetores editáveis com a mesma
paleta e linguagem geométrica. O portal adapta a composição original de
`scenes/ui/comic_backdrop.gd` do jogo. Ele é um elemento de fantasia.
As imagens PNG anteriores continuam disponíveis em `src/assets/`.

## Páginas e mapas mentais

- `src/css/index.css`: fontes, cores e acessibilidade básica.
- `src/css/App.css`: estrutura e estilos compartilhados.
- `src/css/Home.css`: capa, conteúdos e miniaturas dos mapas.
- `src/components/ReadingPage.jsx`: apresentação compartilhada dos artigos.
- `src/data/contentMaps.jsx`: conteúdo textual dos três mapas.
- `src/components/MindMap.jsx` e `src/css/MindMap.css`: diagramas responsivos.
- `src/utils/downloadMindMap.js`: exportação SVG independente de fontes e imagens externas.

Os mapas abrem por `/mapaMental?id=1`, `?id=2` e `?id=3`, inclusive após atualizar
a página. Em telas estreitas, o tema central aparece antes das quatro conexões.
O capítulo do Pleistoceno, que ainda não tinha conteúdo, informa que está em preparação.

## Verificação

`npm run build` gera o site em `dist/`. A revisão desta alteração também verificou
a renderização de 13 URLs e a exportação dos três mapas. A revisão visual em navegador
permanece pendente porque não havia navegador conectado na sessão.

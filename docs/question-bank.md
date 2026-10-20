# Banco de questões e exportação dos mapas

## Banco de dados

O banco é SQLite, em `public/question-bank/history.sqlite`, consultado com SQL.js
no navegador. Ele funciona no GitHub Pages sem servidor adicional ou credenciais.
É um acervo compartilhado de leitura: não armazena contas ou respostas dos visitantes.
O rascunho de uma resposta escrita é salvo apenas no armazenamento local do navegador.

Acervo importado em 20/10/2026:

| Exame | Edições | Objetivas | Discursivas | Total |
| --- | --- | ---: | ---: | ---: |
| ENEM | 2016–2025 | 217 | 0 | 217 |
| FUVEST / USP | 2017–2026 | 124 | 64 | 188 |
| Unicamp | 2017–2026 | 101 | 73 | 174 |
| Unesp | 2017–2026 | 168 | 29 | 197 |
| Total | 10 por exame | 610 | 166 | 776 |

Há questões de História e interdisciplinares com conteúdo histórico. A seleção por
disciplina e os assuntos são editoriais; não se promete uma classificação oficial
exaustiva dos exames interdisciplinares. Provas diferentes de 2021/2022 e fases
específicas mantêm identificadores próprios. Os detalhes, exceções e fontes estão
nos arquivos de notas de cada vestibular em `data/question-bank/`.

Cada questão aponta para sua prova e gabarito ou resolução. As respostas oficiais
e os comentários do Curso Objetivo são identificados separadamente. Algumas questões
com letras de músicas ou textos de apoio compartilhados remetem à página original.
Os recortes em WebP mantêm gráficos, mapas, figuras e tabelas; há também texto para
pesquisa e leitura alternativa.

## Consulta e respostas

Filtros combináveis: vestibular, edição, assunto, fase e tipo. A busca exige todas
as palavras e ignora maiúsculas e acentos; pesquisa enunciado, alternativas e assuntos.
As consultas usam parâmetros SQL, com `%` e `_` tratados como texto literal.
Paginação e filtros ficam na URL e são preservados ao retornar de uma questão.

Questões objetivas comparam a alternativa escolhida ao gabarito publicado.
Questões discursivas revelam a resposta esperada e a resolução após o envio; não há
correção automática nem nota artificial para textos escritos.

## Atualizar o acervo

Os importadores são separados por vestibular em `scripts/import_*.py`. Consulte as
notas de cada fonte antes de reimportar. Eles usam os arquivos em cache quando
disponíveis e não são executados no navegador nem durante a compilação do site.

Depois de alterar os dados:

```powershell
npm run db:build
npm test
npm run build
```

O construtor valida IDs, alternativas, gabaritos, referências e integridade SQLite;
gera o banco, `manifest.json` e as questões em destaque na página inicial.
Para publicar a versão já validada, `npm run deploy` compila e envia `dist/` para
`gh-pages`. Alterações no código-fonte devem ser guardadas em `main`.

## Mapas PNG

O download utiliza `renderMindMap.js`: arte SVG original, marca, textos, conexões,
cores e retículas são desenhados em um canvas de alta resolução. A imagem tem
2880 pixels de largura; a altura é calculada para caber o texto completo. O navegador
carrega as fontes e ilustrações antes de gerar o PNG, inclusive em telas móveis.

`npm test` gera e verifica os três PNGs em `.cache/verification/`, além de testar o
banco real, filtros combinados, paginação e apresentação das questões. A revisão
visual desses PNGs foi feita. Não havia navegador conectado para testar a interação
com o diálogo de download ou as páginas em um navegador nesta sessão.

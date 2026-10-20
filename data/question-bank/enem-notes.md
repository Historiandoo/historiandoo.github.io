# ENEM — História e questões interdisciplinares

217 questões da aplicação regular, 2016–2025. Estas são as dez edições completas
mais recentes do ENEM em 20/10/2026. A edição é o ano do exame, inclusive a prova
ENEM 2020 aplicada em 2021.

O material foi obtido diretamente das páginas de provas e gabaritos do Inep e dos
PDFs oficiais. Foi usado exclusivamente o caderno 1 azul do primeiro dia. Em 2016,
Ciências Humanas ocupa as questões 1–45; a partir de 2017, as questões 46–90.
Os gabaritos vêm sempre do mesmo caderno e da aplicação regular.

`enem_history_selection.json` registra a seleção editorial de questões de História
e interdisciplinares com foco histórico, com assunto por questão. O ENEM reúne
História, Geografia, Sociologia e Filosofia na mesma área e não oferece, nesses PDFs,
uma classificação oficial de cada questão por disciplina. A seleção não é anunciada
como a totalidade oficial de questões de História.

## Reprodução e acessibilidade

As imagens locais preservam os mapas, ilustrações, textos de apoio e alternativas
originais; o texto pesquisável é extraído dos mesmos recortes. Os trechos de canções
em 2019 Q61, 2021 Q60, 2022 Q52 e 2025 Q51 são consultados pelo link da prova
original. Os demais textos dessas questões e suas alternativas permanecem disponíveis.

O PDF de 2021 tem fontes Arial com tabelas ToUnicode incompletas. O importador
restaura o texto a partir dos índices originais dos glifos e das fontes Arial do
Windows, sem alterar os desenhos da prova e sem gerar respostas.

## Reproduzir

```powershell
python scripts/import_enem.py
npm run db:build
```

O importador usa PyMuPDF, Pillow, BeautifulSoup, pypdf, fonttools e `curl.exe`.
Downloads ficam em `.cache/question-import/enem/`, ignorado pelo Git. Cada registro
retém os links oficiais e as páginas da questão e do gabarito.

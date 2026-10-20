# FUVEST / USP import

Imported on 2026-10-20 from the official FUVEST archive. The ten most recently
completed admission editions are **2017–2026**. The edition number is the admission
year; its first phase normally took place in the preceding calendar year.

## Coverage

| Edition | First phase | Written |
| --- | ---: | ---: |
| 2017 | 15 | 8 |
| 2018 | 11 | 8 |
| 2019 | 13 | 6 |
| 2020 | 10 | 6 |
| 2021 | 11 | 6 |
| 2022 | 12 | 6 |
| 2023 | 13 | 6 |
| 2024 | 15 | 6 |
| 2025 | 12 | 6 |
| 2026 | 12 | 6 |
| **Total** | **124** | **64** |

First-phase selection includes the History questions and questions with substantial
interdisciplinary historical content. FUVEST does not consistently label first-phase
questions by subject. Subject labels are editorial classifications, not official
FUVEST metadata; marginal interdisciplinary items from other subjects are not claimed
to be exhaustively included. The manifest explicitly lists every selected question.

Written coverage includes **H01–H06 for every edition**, plus general-knowledge
second-day questions 10 and 12 (2017), and 9 and 10 (2018). During those older
editions, specific-subject questions were administered on the third day. IDs beginning
with G denote the general-knowledge second day, avoiding collisions with H01–H06.

## Sources and answer provenance

- Entry point: <https://www.fuvest.br/acervo-vestibular/>
- Individual edition pages: `https://www.fuvest.br/acervo-vestibular-{year}/`.
- All question PDFs and every multiple-choice answer key are official FUVEST files.
- First-phase answer keys use **booklet V** for 2017–2024 and **V1** for 2025–2026.
  No answer is inferred from question text or a different booklet's numbering.
- For 2023–2026, written answers come from official expected-answer guides.
- For 2017–2022, the official edition pages did not provide written expected-answer
  guides. Solutions come from the corresponding **Curso Objetivo prova comentada**;
  `source.answerSourceType: "commentary"` and `source.answerProvider: "Curso Objetivo"`
  explicitly distinguish these from official examiner answers.
- Each record retains direct question/answer PDF URLs, one-based page references,
  booklet, and verification date. The manifest preserves all official URLs.

## Rendering and extraction

Question images are crops rendered directly from the source PDFs, retaining figures,
maps, tables, and typography. Questions spanning columns or pages are combined in
reading order. Text is extracted for search and accessibility. The 2021 first-phase
PDF has damaged body-text encoding; selected questions use Portuguese OCR and the
original crop remains authoritative. The 2018 first-phase headings also require OCR;
the selected History section uses inspected crop coordinates and original PDF text.
OCR may contain occasional spacing or spelling errors, especially inside tables.

The 2023 official expected answers are embedded raster content; their records provide
both OCR text and `expectedAnswerImages` (an array of local paths). Those original
crops preserve the complete answer and should be available alongside the text.

Two shared-source items direct students to the official context page through
`contextNotice` and `source.contextPage`: 2017 Q17 (Drummond poem) and 2019 Q79
(shared English text). The original question links remain available.

To avoid reproducing protected song lyrics, five records omit their lyric passages
and the corresponding complete-question crops, preserving the remaining task and
linking to the official context: 2020 Q65, 2025 Q90, 2019 H05, 2025 H03, and 2018
general Q09. These records have `source.contextOmitted: "song-lyrics"`.

## Rebuild

From the repository root:

```powershell
python scripts/fuvest_topics.py
python scripts/import_fuvest.py
```

Requires Python, PyMuPDF (`fitz`), Pillow, and curl. Downloads use curl's platform
certificate validation. PDFs and OCR results are cached in ignored
`.cache/question-import/fuvest/`; Portuguese tessdata is downloaded from the official
tesseract-ocr/tessdata_fast repository when OCR is needed. The importer downloads
missing source PDFs, matches booklet keys, renders assets, and rewrites `fuvest.json`.

Outputs are deterministic apart from underlying changes to remote source files.
Current validation confirms 188 unique IDs, all ten editions, five alternatives and
an official A–E key on every imported MC item, expected-answer text on all written
items, and an existing local file for each referenced image. No synthetic questions
or generated examiner answers are included.

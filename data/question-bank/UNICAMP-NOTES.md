# Unicamp / Comvest archive

Primary catalog: <https://www.comvest.unicamp.br/vestibulares-anteriores/1a-fase-2a-fase-comentadas/>

Scope: the latest ten **completed admission editions**, 2017–2026, as checked on 20 October 2026. The unfinished 2027 edition is excluded. Questions come from COMVEST's official *Provas comentadas*, where each prompt and its own answer are published together. Multiple-choice keys are transcribed from the corresponding commentary, never inferred or borrowed from a differently ordered booklet. Written answers are the official *Resposta Esperada*.

Validated output: **174 questions (101 multiple-choice and 73 written), 244 visual assets**. Counts by edition: 2017: 18; 2018: 18; 2019: 18; 2020: 20; 2021: 24; 2022: 16; 2023: 16; 2024: 15; 2025: 15; 2026: 14.

The database includes the dedicated History section in each phase, the interdisciplinary questions included in the 2017–2019 History commentaries, the explicit interdisciplinary History contexts selected in 2020, the common Human Sciences questions in second phase from 2020 onward, and the separate **2021 first-phase Biological/Health Sciences paper** used during the pandemic. The 2021 Biological paper has distinct IDs containing `bio`; common second-phase booklets for 2020/2021 have IDs containing `common`. Other booklet permutations of the same questions are not duplicated.

## Reproduction and attribution

The official catalog expressly allows nonexclusive **partial** reproduction of previous questions, provided that the source is cited as **Comvest / Vestibular Unicamp [year]**; it does not authorize reproduction of an entire examination. This archive reproduces History selections, not whole general examination booklets. Each record retains its official PDF URL, question page, answer page, provider, edition, and attribution.

Three song contexts have their lyrics omitted and direct readers to the official source page: 2019 first phase Q7 (*Bella Ciao*), 2023 first phase Q62 (Movimento do Custo de Vida), and 2023 second phase Q7 (Belchior). Their remaining question text/options and answer remain usable; their prompt images are omitted to avoid redistributing the lyrics inside screenshots.

## Rendering and text extraction

`questionImage` preserves diagrams, photographs, maps, layout, and alternatives from the official prompt. Multi-page prompts are vertically combined, stopping before the commentary/answer. `expectedAnswerImage` separately preserves the official expected response for display after submission. Searchable text accompanies the visual assets.

The 2017 PDF repeats glyphs at adjacent text-object boundaries. The importer restores searchable Portuguese by deduplicating identical glyphs at the same physical origin, without collapsing legitimate double letters. The 2019/2022 PDFs render section captions as image masks: the importer contains explicitly reviewed physical caption anchors and visually checked keys. These special cases are documented in the code rather than guessed at runtime.

Topic labels are editorial navigation metadata derived from historical keywords; they are not represented as classifications supplied by COMVEST. Official content and source pagination remain available for review.

## Rebuild

Install Python dependencies `requests beautifulsoup4 pymupdf Pillow`, then run:

```powershell
python scripts/import_unicamp.py
```

The script discovers current official commentary URLs, caches provider PDFs under `.cache/question-import/unicamp/`, validates required keys/answers and four-option question structure, renders WebP assets under `public/question-bank/images/unicamp-*`, and writes `data/question-bank/unicamp.json` only after the full import succeeds. Source PDFs remain local cache and are not included in the published site.

`python scripts/import_unicamp.py --inspect` provides extraction diagnostics from cached primary PDFs. No provider credentials, paid services, generated answers, commits, or deployment steps are involved.

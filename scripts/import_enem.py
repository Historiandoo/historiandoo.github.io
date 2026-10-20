"""Import original blue-booklet ENEM humanities questions from Inep PDFs.

The explicit history selection is maintained in enem_history_selection.json.
Download cache is ignored; source URLs and original-question crops are retained.
"""
from pathlib import Path
import concurrent.futures
import io
import json
import re
import subprocess
import unicodedata

import fitz
from bs4 import BeautifulSoup
from PIL import Image
from pypdf import PdfReader, PdfWriter
from pypdf.generic import DecodedStreamObject, NameObject
from fontTools.ttLib import TTFont
from fontTools.agl import toUnicode

ROOT = Path(__file__).resolve().parents[1]
CACHE = ROOT / '.cache/question-import/enem'
IMAGES = ROOT / 'public/question-bank/images'
HEAD = re.compile(r'^Quest.o\s*(\d+)\b', re.I)
LYRIC_CONTEXTS = {
    (2019, 61): ('TEXTO I', 'TEXTO II'),
    (2021, 60): ('Questão 60', 'Qual comportamento'),
    (2022, 52): ('QUESTÃO 52', 'A letra da canção'),
    (2025, 51): ('Questão 51', 'A letra da canção'),
}


def download(url, path):
    if not path.exists() or path.stat().st_size < 1000:
        subprocess.run(['curl.exe', '-fsSL', '--retry', '2', '--max-time', '90', '-o', str(path), url], check=True)
    return path


def source(year):
    archive = f'https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/provas-e-gabaritos/{year}'
    html = download(archive, CACHE / f'{year}.html').read_text(encoding='utf-8')
    links = [a['href'] for a in BeautifulSoup(html, 'html.parser').select('#content-core a[href]') if '.pdf' in a['href']]
    exam = next(url for url in links if 'PV_' in url and 'D1_CD1' in url and 'GB_' not in url)
    key = links[links.index(exam) + 1]
    return {'examUrl': exam, 'answerUrl': key, 'archiveUrl': archive, 'booklet': 'Aplicação regular — 1º dia — Caderno 1 azul', 'answerSourceType': 'official', 'verifiedAt': '2026-10-20'}


def lines(page):
    return [(fitz.Rect(line['bbox']), ''.join(span['text'] for span in line['spans']))
            for block in page.get_text('dict')['blocks'] if 'lines' in block for line in block['lines']]


def restore_glyph_mapping(path):
    """Repair missing ToUnicode entries in Inep's 2021 Arial subset fonts.

    Glyph names /gNNN are original Arial glyph indices. This restores text
    without OCR or changes to the original visible document.
    """
    output = path.with_name(path.stem + '-searchable.pdf')
    if output.exists():
        return output
    writer = PdfWriter(clone_from=path)
    seen = set()
    for page in writer.pages:
        for ref in page.get('/Resources', {}).get('/Font', {}).values():
            font = ref.get_object()
            key = str(font.indirect_reference)
            if key in seen or 'Arial' not in str(font.get('/BaseFont', '')):
                continue
            seen.add(key)
            name = str(font['/BaseFont'])
            filename = 'arialbd.ttf' if 'Bold' in name else 'ariali.ttf' if 'Italic' in name else 'arial.ttf'
            original = TTFont(Path('C:/Windows/Fonts') / filename)
            order = original.getGlyphOrder()
            reverse = {glyph: chr(code) for code, glyph in sorted(original.getBestCmap().items(), reverse=True)}
            encoding = font.get('/Encoding')
            if not encoding or not isinstance(encoding.get_object(), dict):
                continue
            pairs, code = [], 0
            for item in encoding.get_object().get('/Differences', []):
                if isinstance(item, int):
                    code = item; continue
                glyph = str(item).lstrip('/')
                if re.fullmatch(r'g\d+', glyph):
                    index = int(glyph[1:])
                    value = reverse.get(order[index], '') if index < len(order) else ''
                else:
                    value = toUnicode(glyph)
                if value:
                    pairs.append(f'<{code:02x}> <{value.encode("utf-16-be").hex()}>')
                code += 1
            stream = DecodedStreamObject()
            cmap = '/CIDInit /ProcSet findresource begin 12 dict begin begincmap /CIDSystemInfo << /Registry (Adobe) /Ordering (UCS) /Supplement 0 >> def /CMapName /RestoredArial def /CMapType 2 def 1 begincodespacerange <00> <ff> endcodespacerange\n'
            for offset in range(0, len(pairs), 90):
                chunk = pairs[offset:offset + 90]
                cmap += f'{len(chunk)} beginbfchar\n' + '\n'.join(chunk) + '\nendbfchar\n'
            cmap += 'endcmap CMapName currentdict /CMap defineresource pop end end'
            stream.set_data(cmap.encode('ascii'))
            font[NameObject('/ToUnicode')] = writer._add_object(stream)
    writer.write(output)
    return output


def extract(year):
    provenance = source(year)
    exam_path = download(provenance['examUrl'], CACHE / f'{year}-exam.pdf')
    exam = fitz.open(restore_glyph_mapping(exam_path) if year == 2021 else exam_path)
    key = fitz.open(download(provenance['answerUrl'], CACHE / f'{year}-key.pdf'))
    key_text = '\n'.join(page.get_text(sort=True) for page in key)
    answers = {int(number): letter for number, letter in re.findall(r'\b(\d{1,2})\s+([A-E])\b', key_text)}
    found = []
    current = None
    target = range(1, 46) if year == 2016 else range(46, 91)
    for page_index, page in enumerate(exam):
        if page_index == 0 or (year > 2016 and page_index < 15):
            continue
        page_lines = lines(page)
        footer_lines = [rect.y0 for rect, text in page_lines if rect.y0 > page.rect.height * .9 and ('CADERNO' in text.upper() or 'CH -' in text.upper())]
        bottom = min(footer_lines) - 3 if footer_lines else page.rect.height - 25
        body = [(rect, text) for rect, text in page_lines if 52 < rect.y0 < bottom]
        if not body:
            continue
        right_headings = any(HEAD.match(text) and rect.x0 > page.rect.width / 2 for rect, text in body)
        wide = not right_headings and any(rect.width > page.rect.width * .65 and rect.x0 < page.rect.width * .25 and len(text) > 45 for rect, text in body)
        columns = [(20, page.rect.width - 20)] if wide else [(20, page.rect.width / 2 - 1), (page.rect.width / 2 - 1, page.rect.width - 20)]
        for left, right in columns:
            headings = sorted([(rect, HEAD.match(text)) for rect, text in body if left <= rect.x0 < right and HEAD.match(text)], key=lambda item: item[0].y0)
            cursor = 54
            for rect, match in headings:
                if current and rect.y0 > cursor + 5:
                    current['parts'].append((page_index, fitz.Rect(left, cursor, right, rect.y0 - 2)))
                number = int(match.group(1))
                current = {'number': number, 'parts': []} if number in target else None
                if current:
                    found.append(current)
                cursor = rect.y0 - 3
            if current and cursor < bottom:
                current['parts'].append((page_index, fitz.Rect(left, cursor, right, bottom)))
    records = []
    for question in found:
        if question['number'] not in answers:
            continue
        parts = question['parts']
        text = '\n'.join(exam[index].get_text(clip=rect, sort=True) for index, rect in parts)
        text = re.sub(r'(?:ENEM\s*\d{4}|\d{4}\s*ENEM)', '', text)
        text = re.sub(r'\b(?:ENEN|ENE|EM)20\d{2}(?:ENE|EM)?\b|\bENEN\b', '', text)
        text = unicodedata.normalize('NFKC', text)
        text = re.sub(r'\*\w{7,}\*', '', text)
        number = question['number']
        matches = list(re.finditer(r'(?m)^\s*(?:2022\s*)?([A-E])\1?\s+', text))
        choices = []
        if [match.group(1) for match in matches[-5:]] == list('ABCDE'):
            matches = matches[-5:]
            choices = [{'letter': match.group(1), 'text': re.sub(r'\s+', ' ', text[match.end():matches[index + 1].start() if index < 4 else len(text)]).strip()} for index, match in enumerate(matches)]
        record = {'id': f'enem-{year}-1-{number}', 'exam': 'ENEM', 'institution': 'Inep', 'year': year, 'phase': '1º dia', 'number': str(number), 'type': 'multiple-choice', 'subject': 'História', 'topic': 'História e sociedade', 'tags': [], 'statement': text.strip(), 'alternatives': choices or [{'letter': letter, 'text': ''} for letter in 'ABCDE'], 'answer': answers[number], 'expectedAnswer': None, 'source': {**provenance, 'questionPage': parts[0][0] + 1, 'answerPage': 1}, 'images': []}
        if (year, number) in LYRIC_CONTEXTS:
            start, end = LYRIC_CONTEXTS[(year, number)]
            beginning = record['statement'].find(start)
            ending = record['statement'].find(end, beginning + len(start))
            assert beginning >= 0 and ending > beginning, (year, number)
            record['statement'] = record['statement'][:beginning] + '[Trecho da canção: consulte o texto de apoio na prova original.]\n\n' + record['statement'][ending:]
            record['contextNotice'] = 'Leia o trecho da canção no texto de apoio da prova original, pelo link acima. O restante do enunciado e as alternativas estão abaixo.'
        # Prefer the intact source crop: it retains illustrations, maps, quotations and alternatives.
        record['_parts'] = parts
        records.append(record)
    assert len(records) == 45, f'{year}: expected 45 humanities questions, got {len(records)}'
    return year, records, exam


def image(record, exam):
    if (record['year'], int(record['number'])) in LYRIC_CONTEXTS:
        record.pop('_parts')
        old = IMAGES / (record['id'] + '.webp')
        if old.exists():
            old.unlink()
        return
    strips = []
    for page_index, rect in record.pop('_parts'):
        pixmap = exam[page_index].get_pixmap(matrix=fitz.Matrix(2, 2), clip=rect, alpha=False)
        strip = Image.open(io.BytesIO(pixmap.tobytes('png'))).convert('RGB')
        width = 900
        strip = strip.resize((width, round(strip.height * width / strip.width)))
        strips.append(strip)
    result = Image.new('RGB', (940, sum(strip.height for strip in strips) + 20 * (len(strips) + 1)), 'white')
    y = 20
    for strip in strips:
        result.paste(strip, (20, y)); y += strip.height + 20
    filename = record['id'] + '.webp'
    result.save(IMAGES / filename, quality=86)
    record['questionImage'] = '/question-bank/images/' + filename


def main():
    CACHE.mkdir(parents=True, exist_ok=True)
    IMAGES.mkdir(parents=True, exist_ok=True)
    selection_path = ROOT / 'data/question-bank/enem_history_selection.json'
    selection = json.loads(selection_path.read_text(encoding='utf-8')) if selection_path.exists() else None
    all_questions, selected = [], []
    for year, records, exam in concurrent.futures.ThreadPoolExecutor(max_workers=3).map(extract, range(2016, 2026)):
        for record in records:
            all_questions.append({key: value for key, value in record.items() if key != '_parts'})
            if selection and str(record['number']) in selection[str(year)]:
                record['topic'] = selection[str(year)][record['number']]
                record['tags'] = [record['topic']]
                image(record, exam)
                selected.append(record)
        print(year, len(records), 'humanities extracted', flush=True)
        exam.close()
    (CACHE / 'all-humanities.json').write_text(json.dumps(all_questions, ensure_ascii=False, indent=2), encoding='utf-8')
    if selection:
        (ROOT / 'data/question-bank/enem.json').write_text(json.dumps(selected, ensure_ascii=False, indent=2), encoding='utf-8')
        print('Imported', len(selected), 'history questions.')


if __name__ == '__main__':
    main()

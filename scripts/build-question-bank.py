"""Validate curated imports and generate the SQLite database served by GitHub Pages."""
from collections import Counter, defaultdict
from datetime import date
from pathlib import Path
import hashlib
import json
import re
import sqlite3
import unicodedata

ROOT = Path(__file__).resolve().parents[1]
PROVIDERS = ['enem', 'fuvest', 'unicamp', 'unesp']


def normalize(text):
    return ''.join(char for char in unicodedata.normalize('NFKD', text) if not unicodedata.combining(char)).lower()


def topic_group(topic):
    value = normalize(topic)
    groups = [
        ('História das mulheres', ['mulher', 'feminin']),
        ('Povos indígenas', ['indigen', 'mesoamerican']),
        ('História da África', ['africa', 'african', 'axum', 'congo', 'etiopia', 'apartheid']),
        ('Escravidão e abolição', ['escravid', 'abolic', 'abolicao', 'males', 'escravo', 'trafico atlantico']),
        ('Antiguidade e Pré-História', ['antiga', 'antiguidade', 'neolitic', 'ateniense', 'grecia', 'helen', 'roma antig', 'imperio romano', 'cristianismo e imperio']),
        ('Idade Média', ['medieva', 'idade media', 'feudal', 'peste negra', 'bizantin', 'comercio transaariano']),
        ('Guerras mundiais e totalitarismos', ['guerra mundial', 'guerras mundiais', 'nazismo', 'fascismo', 'holocausto', 'hiroshima', 'totalitar']),
        ('Revoluções e industrialização', ['revolucao francesa', 'revolucao industrial', 'revolucao russa', 'revolucao gloriosa', 'operario', 'industrializacao', 'iluminismo']),
        ('Brasil Colônia', ['brasil colonia', 'brasil: coloniza', 'brasil holandes', 'economia colonial brasileira', 'economia colonial:', 'jesuita', 'pombalina', 'antonio vieira', 'uniao iberica', 'inconfidencia', 'revoltas coloniais']),
        ('Brasil Império e Independência', ['brasil imperio', 'brasil: imperio', 'brasil imperial', 'economia imperial', 'regencial', 'cabanagem', 'lei de terras', 'revolucao praieira', 'confederacao do equador', 'corte portuguesa', 'independencia e modernizacao', 'cafeicultura']),
        ('Brasil República', ['brasil republica', 'republica brasileira', 'primeira republica', 'republica oligarquica', 'proclamacao da republica', 'ditadura militar', 'vargas', 'kubitschek', 'golpe de 1964', 'crises politicas de 1945', 'canudos', 'revolta da vacina', 'brasil: ditadura', 'brasil: era']),
        ('História da América', ['america', 'allende', 'peronismo', 'estados unidos', 'asteca', 'conquista espanhola', 'independencias']),
        ('Idade Moderna', ['idade moderna', 'historia moderna', 'renascimento', 'renascentista', 'humanismo', 'barroca', 'antigo regime', 'absolutismo', 'reforma protestante', 'contrarreforma', 'navegacoes', 'revolucao cientifica']),
        ('Cidadania e direitos humanos', ['cidadania', 'direitos humanos', 'movimento negro']),
        ('Cultura, patrimônio e fontes históricas', ['cultura', 'patrimonio', 'modernismo', 'fontes', 'arte ', 'leitura', 'educacao', 'futebol', 'religiao']),
        ('Mundo do trabalho', ['trabalho', 'migracoes e retirantes', 'imigracao']),
        ('Guerra Fria e mundo contemporâneo', ['guerra fria', 'historia contemporanea', 'china contemporanea', 'uniao sovietica', 'revolucao cultural', 'revolucao iraniana', 'extrema direita', 'imperialismo', 'guerra do opio', 'liberalismo', 'ditaduras na historia']),
        ('História do Brasil', ['historia do brasil']),
    ]
    return next((label for label, terms in groups if any(term in value for term in terms)), 'História e sociedade')


def build():
    records = []
    for provider in PROVIDERS:
        path = ROOT / f'data/question-bank/{provider}.json'
        if not path.exists():
            raise ValueError(f'Missing provider import: {path}')
        values = json.loads(path.read_text(encoding='utf-8'))
        for original in values:
            item = dict(original)
            detail = item.get('topic', 'História e sociedade')
            item['detailedTopic'] = detail
            item['topic'] = topic_group(detail)
            item['tags'] = list(dict.fromkeys([detail, *item.get('tags', [])]))
            for key in ['statement', 'expectedAnswer']:
                if item.get(key):
                    item[key] = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f]', ' ', unicodedata.normalize('NFKC', item[key]))
            records.append(item)
    records.sort(key=lambda item: (-item['year'], item['exam'], item['phase'], str(item['number'])))
    ids = set()
    for item in records:
        assert item['id'] not in ids, f"Duplicate question: {item['id']}"
        ids.add(item['id'])
        assert item['statement'].strip() and item['source']['examUrl']
        assert 2016 <= item['year'] <= 2026
        assert item['type'] in ['multiple-choice', 'written']
        if item['type'] == 'multiple-choice':
            assert item['answer'] in 'ABCDE', f"Missing answer: {item['id']}"
            assert item['source'].get('answerUrl'), f"Missing answer provenance: {item['id']}"
        if item.get('questionImage', '').startswith('/'):
            assert (ROOT / 'public' / item['questionImage'].lstrip('/')).is_file(), item['questionImage']
        if item.get('expectedAnswer'):
            assert item['source'].get('answerUrl')
    target = ROOT / 'public/question-bank'
    target.mkdir(parents=True, exist_ok=True)
    temporary = target / 'history.next.sqlite'
    if temporary.exists():
        temporary.unlink()
    db = sqlite3.connect(temporary)
    db.executescript('''
        CREATE TABLE questions (
            id TEXT PRIMARY KEY, exam TEXT NOT NULL, year INTEGER NOT NULL,
            phase TEXT NOT NULL, type TEXT NOT NULL, topic TEXT NOT NULL,
            statement TEXT NOT NULL, search_text TEXT NOT NULL, payload TEXT NOT NULL
        );
        CREATE INDEX questions_filters ON questions(exam, year, topic, type);
        CREATE TABLE metadata (key TEXT PRIMARY KEY, value TEXT NOT NULL);
    ''')
    for item in records:
        alternatives = ' '.join(option.get('text', '') if isinstance(option, dict) else option for option in item.get('alternatives', []))
        search = normalize(' '.join([item['statement'], alternatives, item['exam'], item.get('institution', ''), item.get('topic', ''), ' '.join(item.get('tags', []))]))
        db.execute('INSERT INTO questions VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', (item['id'], item['exam'], item['year'], item['phase'], item['type'], item.get('topic') or 'História e sociedade', item['statement'], search, json.dumps(item, ensure_ascii=False)))
    db.execute('INSERT INTO metadata VALUES (?, ?)', ('schema_version', '1'))
    db.execute('INSERT INTO metadata VALUES (?, ?)', ('generated_on', date.today().isoformat()))
    db.commit()
    assert db.execute('PRAGMA integrity_check').fetchone()[0] == 'ok'
    db.execute('VACUUM')
    db.close()
    destination = target / 'history.sqlite'
    temporary.replace(destination)
    coverage = []
    for provider in PROVIDERS:
        group = [item for item in records if item['exam'].lower() == provider]
        years = sorted({item['year'] for item in group}, reverse=True)
        coverage.append({'exam': provider.upper(), 'years': years, 'total': len(group), 'multipleChoice': sum(item['type'] == 'multiple-choice' for item in group), 'written': sum(item['type'] == 'written' for item in group), 'withoutExpectedAnswer': sum(item['type'] == 'written' and not item.get('expectedAnswer') for item in group)})
    manifest = {'schemaVersion': 1, 'revision': hashlib.sha256(destination.read_bytes()).hexdigest()[:16], 'total': len(records), 'coverage': coverage, 'byYear': dict(sorted(Counter(item['year'] for item in records).items())), 'generatedOn': date.today().isoformat()}
    (target / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    featured = []
    for provider in PROVIDERS:
        item = next((item for item in records if item['exam'].lower() == provider and item['type'] == 'multiple-choice'), None)
        if item:
            featured.append(item)
    (ROOT / 'src/data/featuredQuestions.json').write_text(json.dumps(featured, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps(manifest, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    build()

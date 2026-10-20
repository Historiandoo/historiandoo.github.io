import assert from 'node:assert/strict';
import { before, after, test } from 'node:test';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';
import initSqlJs from 'sql.js';
import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { renderMindMap } from '../src/utils/renderMindMap.js';

let server, repository, database, maps, records, QuestionAttempt;
const root = process.cwd();
before(async () => {
    server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
    repository = await server.ssrLoadModule('/src/lib/questionDatabase.js');
    maps = (await server.ssrLoadModule('/src/data/contentMaps.jsx')).default;
    QuestionAttempt = (await server.ssrLoadModule('/src/pages/PageResponderQuestão.jsx')).QuestionAttempt;
    const SQL = await initSqlJs({ locateFile: file => path.join(root, 'node_modules/sql.js/dist', file) });
    database = new SQL.Database(await readFile('public/question-bank/history.sqlite'));
    records = database.exec('SELECT payload FROM questions')[0].values.map(([payload]) => JSON.parse(payload));
    GlobalFonts.registerFromPath(path.join(root, 'public/fonts/BarlowCondensed-Medium.ttf'), 'Barlow Condensed');
    GlobalFonts.registerFromPath(path.join(root, 'public/fonts/BarlowCondensed-Bold.ttf'), 'Barlow Condensed');
});
after(async () => { database?.close(); await server?.close(); });

test('all four exams have ten completed editions, valid keys and complete written answers', async () => {
    const manifest = JSON.parse(await readFile('public/question-bank/manifest.json', 'utf8'));
    assert.equal(records.length, manifest.total);
    assert.ok(records.length > 700);
    for (const coverage of manifest.coverage) {
        assert.equal(coverage.years.length, 10, coverage.exam);
        assert.equal(coverage.withoutExpectedAnswer, 0);
    }
    for (const question of records) {
        assert.ok(question.source.examUrl.startsWith('https://'));
        assert.ok(question.source.answerUrl.startsWith('https://'));
        if (question.type === 'multiple-choice') assert.ok(question.alternatives.some(option => option.letter === question.answer), question.id);
        else assert.ok(question.expectedAnswer || question.expectedAnswerImage || question.expectedAnswerImages?.length, question.id);
    }
});

test('exam, year, subject, type and keyword filters work together against the actual database', () => {
    for (const exam of ['ENEM', 'FUVEST', 'UNICAMP', 'UNESP']) {
        const candidate = records.find(question => question.exam === exam && question.statement.includes(' '));
        const keyword = repository.normalizeSearch(candidate.statement).split(/\s+/).find(word => word.length > 6 && /^[a-z]+$/.test(word));
        const filters = { exam, year: String(candidate.year), topic: candidate.topic, type: candidate.type, search: keyword };
        const result = repository.queryDatabase(database, filters, 1, 2000);
        assert.ok(result.questions.some(question => question.id === candidate.id), `${exam}: combined filter excludes its own match`);
        assert.ok(result.questions.every(question => question.exam === exam && question.year === candidate.year && question.topic === candidate.topic && question.type === candidate.type));
    }
    const accented = repository.queryDatabase(database, { search: 'escravidão' }, 1, 1000);
    const unaccented = repository.queryDatabase(database, { search: 'ESCRAVIDAO' }, 1, 1000);
    assert.equal(accented.total, unaccented.total);
    assert.ok(accented.total > 20);
    assert.equal(repository.queryDatabase(database, { search: "' OR 1=1 --" }).total, 0);
    assert.equal(repository.queryDatabase(database, { search: '%' }).total, records.filter(question => `${question.statement} ${question.alternatives.map(option => option.text).join(' ')}`.includes('%')).length);
});

test('pagination is stable, has no duplicates, and retains filter counts', () => {
    const first = repository.queryDatabase(database, { exam: 'UNESP' }, 1, 12);
    const second = repository.queryDatabase(database, { exam: 'UNESP' }, 2, 12);
    assert.equal(first.total, second.total);
    assert.equal(first.questions.length, 12);
    assert.equal(second.questions.length, 12);
    assert.ok(!first.questions.some(question => second.questions.some(other => other.id === question.id)));
});

test('question views preserve source images and keep expected answers hidden before submission', () => {
    const written = records.find(question => question.type === 'written' && question.expectedAnswer && question.questionImage);
    const html = renderToStaticMarkup(React.createElement(MemoryRouter, {}, React.createElement(QuestionAttempt, { question: written, from: '/questoesVestibular?exam=FUVEST' })));
    assert.ok(html.includes('<textarea'));
    assert.ok(html.includes('Enviar e ver resposta esperada'));
    assert.ok(html.includes(written.questionImage));
    assert.ok(!html.includes('class="expected-answer"'));
    const objective = records.find(question => question.type === 'multiple-choice' && question.exam === 'UNICAMP');
    const objectiveHtml = renderToStaticMarkup(React.createElement(MemoryRouter, {}, React.createElement(QuestionAttempt, { question: objective, from: '/questoesVestibular' })));
    assert.equal((objectiveHtml.match(/type="radio"/g) || []).length, 4);
    assert.ok(!objectiveHtml.includes('<textarea'));
});

test('all three PNG exports contain full artwork and text at high resolution', async () => {
    await mkdir('.cache/verification', { recursive: true });
    const brand = await loadImage(await readFile('src/assets/brand/logo.svg'));
    for (const map of maps) {
        const imageBytes = map.image.startsWith('data:')
            ? Buffer.from(decodeURIComponent(map.image.slice(map.image.indexOf(',') + 1)))
            : await readFile(path.join(root, map.image.replace(/^\//, '')));
        const artwork = await loadImage(imageBytes);
        const canvas = renderMindMap(createCanvas(1, 1), map, artwork, brand);
        const png = canvas.toBuffer('image/png');
        assert.equal(png.subarray(1, 4).toString(), 'PNG');
        assert.equal(canvas.width, 2880);
        assert.ok(canvas.height >= 1600);
        assert.ok(png.length > 80000, 'expected a complete image rather than a blank canvas');
        const pixels = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
        let greenPixels = 0;
        for (let index = 0; index < pixels.length; index += 4) if (pixels[index] < 100 && pixels[index + 1] > 60 && pixels[index + 1] > pixels[index] * 1.25 && pixels[index + 2] < 110) greenPixels++;
        assert.ok(greenPixels > 10000, 'vector illustration was missing from the exported diagram');
        await writeFile(`.cache/verification/map-${map.id}.png`, png);
    }
});

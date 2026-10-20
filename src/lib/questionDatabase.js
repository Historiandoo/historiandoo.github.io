import initSqlJs from 'sql.js';
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url';

let databasePromise;
let manifest;

export const normalizeSearch = value => value.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase().trim();

export function loadQuestionDatabase() {
    if (!databasePromise) {
        databasePromise = (async () => {
            const metadata = await fetch(`${import.meta.env.BASE_URL}question-bank/manifest.json`, { cache: 'no-cache' });
            if (!metadata.ok) throw new Error('Não foi possível carregar o catálogo de questões.');
            manifest = await metadata.json();
            const [SQL, response] = await Promise.all([
                initSqlJs({ locateFile: () => wasmUrl }),
                fetch(`${import.meta.env.BASE_URL}question-bank/history.sqlite?v=${manifest.revision}`),
            ]);
            if (!response.ok) throw new Error('Não foi possível carregar o banco de questões.');
            return new SQL.Database(new Uint8Array(await response.arrayBuffer()));
        })().catch(error => { databasePromise = undefined; throw error; });
    }
    return databasePromise;
}

function select(db, sql, values = []) {
    const statement = db.prepare(sql);
    try {
        statement.bind(values);
        const results = [];
        while (statement.step()) results.push(statement.getAsObject());
        return results;
    } finally { statement.free(); }
}

export function createQuestionQuery(filters = {}) {
    const conditions = [];
    const values = [];
    for (const column of ['exam', 'year', 'topic', 'type', 'phase']) {
        if (filters[column]) { conditions.push(`${column} = ?`); values.push(column === 'year' ? Number(filters[column]) : filters[column]); }
    }
    for (const word of normalizeSearch(filters.search || '').split(/\s+/).filter(Boolean).slice(0, 30)) {
        conditions.push("search_text LIKE ? ESCAPE '\\'");
        values.push(`%${word.replace(/[\\%_]/g, char => `\\${char}`)}%`);
    }
    return { where: conditions.length ? ` WHERE ${conditions.join(' AND ')}` : '', values };
}

export function queryDatabase(db, filters = {}, page = 1, pageSize = 12) {
    const { where, values } = createQuestionQuery(filters);
    const total = select(db, `SELECT COUNT(*) AS count FROM questions${where}`, values)[0].count;
    const rows = select(db, `SELECT payload FROM questions${where} ORDER BY year DESC, exam, phase, id LIMIT ? OFFSET ?`, [...values, pageSize, Math.max(0, page - 1) * pageSize]);
    return { total, questions: rows.map(row => JSON.parse(row.payload)) };
}

export async function searchQuestions(filters = {}, page = 1, pageSize = 12) {
    const db = await loadQuestionDatabase();
    return { ...queryDatabase(db, filters, page, pageSize), manifest };
}

export async function getQuestion(id) {
    const db = await loadQuestionDatabase();
    // Preserve the two question links that existed before the archive import.
    const legacy = /^enem_(\d{2})_1Dia_Q(\d+)$/.exec(id);
    if (legacy) id = `enem-20${legacy[1]}-1-${legacy[2]}`;
    const row = select(db, 'SELECT payload FROM questions WHERE id = ?', [id])[0];
    return row ? JSON.parse(row.payload) : null;
}

export async function getQuestionFacets() {
    const db = await loadQuestionDatabase();
    return {
        exams: select(db, 'SELECT DISTINCT exam AS value FROM questions ORDER BY exam').map(row => row.value),
        years: select(db, 'SELECT DISTINCT year AS value FROM questions ORDER BY year DESC').map(row => row.value),
        topics: select(db, 'SELECT DISTINCT topic AS value FROM questions ORDER BY topic').map(row => row.value),
        phases: select(db, 'SELECT DISTINCT phase AS value FROM questions ORDER BY phase').map(row => row.value),
        manifest,
    };
}

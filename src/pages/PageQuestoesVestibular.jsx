import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CardQuestaoVestibular from '../components/questions/CardQuestoesVestibular';
import FilterQuestion from '../components/questions/FilterQuestoes';
import { getQuestionFacets, searchQuestions } from '../lib/questionDatabase';
import '../css/QuestionBank.css';

const emptyFacets = { exams: [], years: [], topics: [], phases: [] };
export default function PageQuestoesVestibular() {
    const [params, setParams] = useSearchParams();
    const [facets, setFacets] = useState(emptyFacets);
    const [result, setResult] = useState({ total: 0, questions: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [retry, setRetry] = useState(0);
    const query = params.toString();
    const filters = useMemo(() => {
        const values = new URLSearchParams(query);
        return Object.fromEntries(['search', 'exam', 'year', 'topic', 'type', 'phase'].map(key => [key, values.get(key) || '']));
    }, [query]);
    const page = Math.max(1, Math.min(1000000, Number.parseInt(params.get('page') || '1', 10) || 1));
    const pageSize = 12;
    useEffect(() => {
        let active = true;
        getQuestionFacets().then(value => { if (active) setFacets(value); }).catch(() => {});
        return () => { active = false; };
    }, [retry]);
    useEffect(() => {
        let active = true;
        setLoading(true);
        setError('');
        searchQuestions(filters, page, pageSize).then(value => {
            if (active) { setResult(value); setLoading(false); }
        }).catch(failure => { if (active) { setError(failure.message); setLoading(false); } });
        return () => { active = false; };
    }, [filters, page, retry]);
    function update(key, value) {
        setParams(previous => { const next = new URLSearchParams(previous); if (value) next.set(key, value); else next.delete(key); if (key !== 'page') next.delete('page'); return next; }, { replace: key === 'search' });
    }
    const pages = Math.max(1, Math.ceil(result.total / pageSize));
    const from = `/questoesVestibular${query ? `?${query}` : ''}`;
    return (
        <div className="question-bank-page">
            <p className="eyebrow">Conhecimento em ação</p><h1>Banco de questões de História</h1>
            <p className="intro-questions">Explore questões reais de ENEM, FUVEST/USP, Unicamp e Unesp. Responda e compare com o gabarito ou a resolução publicada.</p>
            {facets.manifest && <details className="bank-coverage"><summary>{facets.manifest.total} questões · 10 edições por vestibular · consultar acervo</summary><div className="coverage-grid">{facets.manifest.coverage.map(item => <div key={item.exam}><strong>{item.exam === 'FUVEST' ? 'FUVEST / USP' : item.exam}</strong><span>{item.years.at(-1)}–{item.years[0]} · {item.total} questões</span><small>{item.multipleChoice} objetivas · {item.written} discursivas</small>{item.withoutExpectedAnswer > 0 && <small>{item.withoutExpectedAnswer} sem resposta esperada publicada</small>}</div>)}</div><p>O ano identifica a edição do vestibular. Questões de História e interdisciplinares com conteúdo histórico. As fontes de cada enunciado e correção estão na página da questão.</p></details>}
            <FilterQuestion filters={filters} facets={facets} onChange={update} onClear={() => setParams({})} />
            <p className="question-count" role="status" aria-live="polite">{loading ? 'Buscando questões…' : `${result.total} ${result.total === 1 ? 'questão encontrada' : 'questões encontradas'}`}</p>
            {error ? <div role="alert" className="bank-error"><p>{error}</p><button type="button" className="comic-button" onClick={() => setRetry(retry + 1)}>Tentar novamente</button></div> : <>
                <div className="question-results" aria-busy={loading}>{result.questions.map(question => <CardQuestaoVestibular key={question.id} question={question} from={from} />)}</div>
                {!loading && result.total === 0 && <div className="empty-questions"><h2>Nenhuma questão encontrada</h2><p>Tente outra palavra ou remova um dos filtros.</p></div>}
                {!loading && pages > 1 && <nav className="question-pagination" aria-label="Páginas das questões"><button type="button" disabled={page <= 1} onClick={() => update('page', String(page - 1))}>← Anterior</button><span>Página {page} de {pages}</span><button type="button" disabled={page >= pages} onClick={() => setParams(previous => { const next = new URLSearchParams(previous); next.set('page', String(page + 1)); return next; })}>Próxima →</button></nav>}
            </>}
        </div>
    );
}

import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { getQuestion } from '../lib/questionDatabase';
import QuestionSource from '../components/questions/QuestionSource';
import '../css/PageResponderQuestao.css';
import '../css/QuestionBank.css';

export function QuestionAttempt({ question, from }) {
    const [selected, setSelected] = useState('');
    const [draft, setDraft] = useState(() => { try { return localStorage.getItem(`historiando-answer-${question.id}`) || ''; } catch { return ''; } });
    const [answered, setAnswered] = useState(false);
    const [view, setView] = useState(question.questionImage ? 'original' : 'text');
    const written = question.type === 'written';
    const correct = selected === question.answer;
    const options = question.alternatives?.length ? question.alternatives.map((option, index) => typeof option === 'string' ? { letter: String.fromCharCode(65 + index), text: option.replace(/^[A-E]\s*[-.)]\s*/, '') } : option) : 'ABCDE'.split('').map(letter => ({ letter, text: '' }));
    function write(value) { setDraft(value); try { localStorage.setItem(`historiando-answer-${question.id}`, value); } catch { /* Private browsing can disable storage. */ } }
    return (
        <article className="question-attempt">
            <Link to={from} className="back-question">← Voltar para questões</Link>
            <header className="question-header"><div><span className="badge text-bg-primary">{question.exam === 'FUVEST' ? 'FUVEST / USP' : question.exam}</span><span className="question-year">{question.year}</span></div><h1>Questão {question.number}</h1><p>{question.phase} · {written ? 'Resposta escrita' : 'Múltipla escolha'} · {question.topic}</p></header>
            <QuestionSource source={question.source} />
            <p className="source-attribution">{question.source.attribution || `${question.source.provider || question.source.answerProvider || question.exam} · ${question.year} · ${question.source.booklet || question.phase}`}</p>
            {question.contextNotice && <p className="context-notice">{question.contextNotice}</p>}
            {question.source.contextPage && <p className="context-notice">O texto de apoio está na página {question.source.contextPage} da <a href={`${question.source.examUrl.split('#')[0]}#page=${question.source.contextPage}`} target="_blank" rel="noreferrer">prova original ↗</a>.</p>}
            {question.questionImage && <div className="statement-tabs" role="group" aria-label="Apresentação do enunciado"><button type="button" aria-pressed={view === 'original'} onClick={() => setView('original')}>Enunciado original com imagens</button><button type="button" aria-pressed={view === 'text'} onClick={() => setView('text')}>Versão em texto</button></div>}
            {view === 'original' && question.questionImage ? <div className="original-question"><img src={question.questionImage} alt={`Enunciado original completo da questão ${question.number}, ${question.exam} ${question.year}. Use a versão em texto para leitura alternativa.`} /></div> : <div className="question-statement"><p>{question.statement}</p>{question.images?.map((image, index) => <img key={index} src={typeof image === 'string' ? image : image.src} alt={image.alt || 'Imagem de apoio da questão'} />)}</div>}
            <form className="attempt-form" onSubmit={event => { event.preventDefault(); if (written ? draft.trim() : selected) setAnswered(true); }}>
                {written ? <div className="written-answer"><label htmlFor="written-response">Sua resposta</label><p>Responda todos os itens do enunciado. Depois, compare com a resposta esperada.</p><textarea id="written-response" rows={10} maxLength={20000} value={draft} readOnly={answered} onChange={event => write(event.target.value)} placeholder="Escreva sua resposta aqui. Se houver itens a), b) e c), identifique cada um…" /><small>Rascunho guardado somente neste dispositivo.</small></div> : <fieldset className="question-alternatives"><legend>Escolha uma alternativa</legend>{options.map(option => <label key={option.letter} className={`alternative ${selected === option.letter ? 'selected' : ''} ${answered && option.letter === question.answer ? 'correct' : ''} ${answered && selected === option.letter && !correct ? 'incorrect' : ''}`}><input type="radio" name="answer" value={option.letter} checked={selected === option.letter} onChange={() => setSelected(option.letter)} disabled={answered} /><span><strong>{option.letter}</strong>{option.text ? ` — ${option.text}` : ' — conforme o enunciado original'}</span></label>)}</fieldset>}
                {!answered && <button type="submit" className="comic-button" disabled={written ? !draft.trim() : !selected}>{written ? 'Enviar e ver resposta esperada' : 'Conferir resposta'}</button>}
            </form>
            {answered && <section className={`answer-result ${written ? 'written-result' : correct ? 'correct-result' : 'incorrect-result'}`} role="status">
                <h2>{written ? 'Compare com a resposta esperada' : correct ? '✓ Resposta correta!' : 'Resposta incorreta'}</h2>
                {!written && <p><strong>Gabarito: {question.answer}</strong> · Sua escolha: {selected}</p>}
                {written && <p className="self-review-note">Esta é uma comparação para estudo. A resposta escrita não recebe uma nota automática.</p>}
                {question.expectedAnswer ? <div className="expected-answer">{question.expectedAnswer}</div> : written && <p>A resposta esperada não foi disponibilizada neste acervo. Consulte a prova e a correção no link abaixo.</p>}
                {question.source.answerTextNote && <p className="self-review-note">{question.source.answerTextNote}</p>}
                {question.expectedAnswerImage && <img className="expected-answer-image" src={question.expectedAnswerImage} alt="Resposta esperada publicada pela banca" />}
                {question.expectedAnswerImages?.map((image, index) => <img key={index} className="expected-answer-image" src={typeof image === 'string' ? image : image.src} alt="Continuação da resposta esperada" />)}
                <QuestionSource source={question.source} answer />
                <button type="button" className="retry-answer" onClick={() => { setAnswered(false); if (!written) setSelected(''); }}>Tentar novamente</button>
            </section>}
        </article>
    );
}

export default function PageResponderQuestao() {
    const { id } = useParams();
    const { state } = useLocation();
    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [retry, setRetry] = useState(0);
    const from = state?.from?.startsWith('/questoesVestibular') ? state.from : '/questoesVestibular';
    useEffect(() => {
        let active = true;
        setLoading(true); setError('');
        getQuestion(id).then(value => { if (active) { setQuestion(value); setLoading(false); } }).catch(failure => { if (active) { setError(failure.message); setLoading(false); } });
        return () => { active = false; };
    }, [id, retry]);
    return <div className="container page-question"><div className="content-page">{loading ? <p role="status">Carregando questão…</p> : error ? <div role="alert"><p>{error}</p><button type="button" className="comic-button" onClick={() => setRetry(retry + 1)}>Tentar novamente</button></div> : question ? <QuestionAttempt key={question.id} question={question} from={from} /> : <><h1>Questão não encontrada</h1><Link to={from}>Voltar para questões</Link></>}</div></div>;
}

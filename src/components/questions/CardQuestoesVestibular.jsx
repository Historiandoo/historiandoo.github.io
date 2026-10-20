import { Link } from 'react-router-dom';
import '../../css/CardQuestoesVestibular.css';

export default function CardQuestaoVestibular({ question, from = '/questoesVestibular' }) {
    const exam = question.exam || question.vestibular;
    const phase = question.phase || question.fase;
    const id = question.id || question.question_id;
    const summary = question.statement.replace(/(?:QUESTÃO|Questão)\s*\d+\s*/, '').replace(/\s+/g, ' ').slice(0, 180);
    return (
        <article className="card card-question h-100">
            <div className="card-body d-flex flex-column">
                <div className="d-flex justify-content-between align-items-center mb-2"><span className="badge text-bg-primary">{exam === 'FUVEST' ? 'FUVEST / USP' : exam}</span><span className="text-muted">{question.year}</span></div>
                <h2 className="card-title">Questão {question.number}</h2>
                <p className="text-muted">{phase} · {question.type === 'written' ? 'Discursiva' : 'Múltipla escolha'}</p>
                <p className="question-preview">{summary}…</p>
                <div className="tags-container mb-3"><span className="tag">{question.topic || question.period || 'História'}</span></div>
                <Link to={`/questaoResponder/${id}`} state={{ from }} className="btn btn-primary mt-auto">{question.type === 'written' ? 'Escrever resposta' : 'Responder questão'} ↗</Link>
            </div>
        </article>
    );
}

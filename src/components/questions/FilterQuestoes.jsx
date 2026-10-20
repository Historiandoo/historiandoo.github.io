import '../../css/FilterQuestions.css';

export default function FilterQuestion({ filters, facets, onChange, onClear }) {
    return (
        <form className="filters-questions mb-4" role="search" onSubmit={event => event.preventDefault()}>
            <h2>Encontre sua próxima questão</h2>
            <label className="form-label" htmlFor="question-search">Palavras do enunciado</label>
            <input id="question-search" className="form-control mb-4" type="search" maxLength={300} placeholder="Ex.: escravidão, Revolução Francesa, povos indígenas…" value={filters.search} onChange={event => onChange('search', event.target.value)} />
            <div className="question-filter-grid">
                <div><label className="form-label" htmlFor="filter-exam">Vestibular</label><select className="form-select" id="filter-exam" value={filters.exam} onChange={event => onChange('exam', event.target.value)}><option value="">Todos os vestibulares</option>{facets.exams.map(exam => <option key={exam} value={exam}>{exam === 'FUVEST' ? 'FUVEST / USP' : exam}</option>)}</select></div>
                <div><label className="form-label" htmlFor="filter-year">Ano da edição</label><select className="form-select" id="filter-year" value={filters.year} onChange={event => onChange('year', event.target.value)}><option value="">Todos os anos</option>{facets.years.map(year => <option key={year} value={year}>{year}</option>)}</select></div>
                <div><label className="form-label" htmlFor="filter-topic">Assunto de História</label><select className="form-select" id="filter-topic" value={filters.topic} onChange={event => onChange('topic', event.target.value)}><option value="">Todos os assuntos</option>{facets.topics.map(topic => <option key={topic} value={topic}>{topic}</option>)}</select></div>
                <div><label className="form-label" htmlFor="filter-type">Tipo de resposta</label><select className="form-select" id="filter-type" value={filters.type} onChange={event => onChange('type', event.target.value)}><option value="">Objetivas e discursivas</option><option value="multiple-choice">Múltipla escolha</option><option value="written">Resposta escrita</option></select></div>
                <div><label className="form-label" htmlFor="filter-phase">Fase / dia</label><select className="form-select" id="filter-phase" value={filters.phase} onChange={event => onChange('phase', event.target.value)}><option value="">Todas as fases</option>{facets.phases.map(phase => <option key={phase} value={phase}>{phase}</option>)}</select></div>
            </div>
            <button type="button" className="btn btn-outline-secondary mt-3" onClick={onClear}>Limpar filtros</button>
        </form>
    );
}

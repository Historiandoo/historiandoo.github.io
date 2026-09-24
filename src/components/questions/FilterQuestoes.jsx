import React from 'react';

import '../../css/FilterQuestions.css';

export default function FilterQuestion({ search, setSearch, vestibular, setVestibular, year, setYear, period, setPeriod, tagsSelected, toogleTag, tagsAvailable, cleanFilters}) {

    return (
        <div className="filters-questions mb-4">

            <h3>Filtrar questões</h3>

            <div className="mb-4">

                <label className="form-label">
                    Pesquisar
                </label>

                <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar por tema, vestibular ou palavra-chave..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

            </div>

            <div className="row g-3">

                <div className="col-md-4">

                    <label className="form-label">
                        Vestibular
                    </label>

                    <select
                        className="form-select"
                        value={vestibular}
                        onChange={(e) => setVestibular(e.target.value)}
                    >
                        <option value="Todos">
                            Todos
                        </option>

                        <option value="Fuvest">
                            Fuvest
                        </option>

                        <option value="ENEM">
                            ENEM
                        </option>

                        <option value="Comvest">
                            Comvest
                        </option>

                    </select>

                </div>

                <div className="col-md-4">

                    <label className="form-label">
                        Ano
                    </label>

                    <input
                        type="number"
                        className="form-control"
                        placeholder="Digite o ano"
                        value={year === 'All' ? '' : year}
                        onChange={(e) => setYear(e.target.value)}
                        min="1998"
                        max="2050"
                    />

                </div>

                <div className="col-md-4">

                    <label className="form-label">
                        Período histórico
                    </label>

                    <select
                        className="form-select"
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                    >

                        <option value="Todos">
                            Todos
                        </option>

                        <option value="Brasil Pré-colonial">
                            Brasil Pré-colonial
                        </option>

                        <option value="Brasil Colonial">
                            Brasil Colonial
                        </option>

                        <option value="Brasil Imperial">
                            Brasil Imperial
                        </option>

                        <option value="Atualidade">
                            Atualidade
                        </option>

                    </select>

                </div>

            </div>

            <div className="mt-4">

                <label className="form-label">
                    Temas
                </label>

                <div className="tags-container">

                    {tagsAvailable.map((tag) => (

                        <button
                            key={tag}
                            type="button"
                            className={`tag-button ${
                                tagsSelected.includes(tag)
                                    ? 'selected'
                                    : ''
                            }`}
                            onClick={() => toogleTag(tag)}
                        >
                            {tag}
                        </button>

                    ))}

                </div>

            </div>

            <button
                type="button"
                className="btn btn-outline-secondary mt-3"
                onClick={cleanFilters}
            >
                Limpar filtros
            </button>

        </div>
    );
}


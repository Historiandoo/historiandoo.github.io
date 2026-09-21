import React from "react";
import { Link } from "react-router-dom";
import '../css/CardQuestoesVestibular.css';

function CardQuestaoVestibular ({question}) {

    return (
        <div className="card card-question h-100">
            <div className="card-body d-flex flex-column">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    
                    <span className="badge text-bg-primary">
                        {question.vestibular}
                    </span>

                    <span className="text-muted">
                        {question.year}
                    </span>

                </div>

                <h5 className="card-title">
                    Questão {question.number}
                </h5>

                <p className="texte-muted">
                    {question.fase} • {question.subject}
                </p>

                <p className="card-text">
                    <strong>Período Histórico:</strong> {''}
                    {question.period}
                </p>

                <div className="tags-conatiner"mb-3>
                    {question.tags.map((tag) => (
                        
                        <span className="tag" key={tag}>
                            {tag}
                        </span>
                    ))}
                </div>

                <Link to={`/questions/${question.question_id}`} className="btn btn-primary mt-auto">
                    Respoder questão
                </Link>

            </div>

        </div>
    );
}

export default CardQuestaoVestibular;
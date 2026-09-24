import React from "react";

export default function HeaderQuestao ({question}) {

    return (
        <div className="question-header">
            <div>
                <span className="badge text-bg-primary">
                    {question.vestibular}
                </span>

                <span className="question-year">
                    {question.year}
                </span>
            </div>

            <h1>
                Questão {question.number}
            </h1>

            <p>
                {question.fase} • {question.subject}
            </p>

        </div>
    );

}
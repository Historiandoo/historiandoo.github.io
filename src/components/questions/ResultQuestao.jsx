import React from "react";

export default function ResultQuestao({isCorrect, correctAnswer}) {

    return (
        <div className={`answer-result ${
                isCorrect
                    ? 'correct-result'
                    : 'incorrect-result'
            }`}
        >

            <h3>
                {isCorrect 
                    ? '✓ Resposta correta!'
                    : '✕ Resposta incorreta'
                }
            </h3>

            <p>
                <strong> Resposta correta: </strong> {' '}
                {correctAnswer}
            </p>

        </div>
    );
}
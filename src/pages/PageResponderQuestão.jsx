import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import questions from '../data/dataQuestoesVestibular.json';
import HeaderQuestao from '../components/questions/HeaderQuestao.jsx';
import StatementQuestao from '../components/questions/StatementQuestao.jsx';
import AlternativesQuestao from '../components/questions/AlternativesQuestao.jsx';
import ResultQuestao from '../components/questions/ResultQuestao.jsx';

import '../css/PageResponderQuestao.css';

export default function PageResponderQuestao () {

    const { id } = useParams();

    const question = questions.find(
        (question) => question.question_id === id
    );

    const [selectedAlternative, setSelectedAlternative] = useState(null);
    const [answered, setAnswered] = useState(false);

    if (!question) {
        return (
            <main className="conatiner page-question">
                <div className="content-page text-center">
                    <h1> Questão não encontrada !</h1>

                    <p> Não foi possível encontrar a questão solicitada </p>
                
                    <Link to="/questoesVestibular" className="btn btn-primary mt-auto">
                        Voltar para questões
                    </Link>
                </div>
            </main>
        );
    }

    const handleAnswer = () => {
        
        if (!selectedAlternative) {
            return;
        }

        setAnswered(true);
    };

    const isCorrect = selectedAlternative === question.answer;

    return (
        <main className="container page-question">
            <div className="content-page">
                <Link to="/questoesVestibular" className="back-question">
                     ← Voltar para questões
                </Link>

                <HeaderQuestao question={question}/>

                <StatementQuestao statement={question.statement}/>

                <AlternativesQuestao 
                    alternatives={question.alternatives}
                    selectedAlternative={selectedAlternative}
                    setSelectedAlternative={setSelectedAlternative}
                    answered={answered}
                    correctAnswer={question.answer}
                />

                {!answered && (
                    <button 
                        className="btn btn-primary answer-button"
                        onClick={handleAnswer}
                        disabled={!selectedAlternative}
                    >
                        Responder questão :)
                    </button>
                )}

                {answered && (
                    <ResultQuestao 
                        isCorrect={isCorrect}
                        correctAnswer={question.answer}
                    />
                )
                }
            </div>
        </main>
    );
}


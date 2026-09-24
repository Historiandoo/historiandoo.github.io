import React from "react";

export default function AlternativesQuestao({alternatives, selectedAlternative, setSelectedAlternative, answered, correctAnswer}) {

return (
    <div className="question-alternatives">
        <h3>
            Escolha a melhor alternativa ;)
        </h3>

        {alternatives.map((alternative) => {

            const letter = alternative.charAt(0);

            const isSelected = selectedAlternative === letter;

            const isCorrect = answered && letter === correctAnswer;

            const isIncorrect =
                answered &&
                isSelected &&
                letter !== correctAnswer;

            return (
                <label 
                    key={alternative}
                    className={`alternative
                      ${isSelected ? 'selected' : ''}
                      ${isCorrect ? 'correct' : ''}
                      ${isIncorrect ? 'incorrect' : ''}  
                    `}
                >

                    <input
                        type="radio"
                        name="alternative"
                        value={letter}
                        checked={isSelected}
                        onChange={() =>
                            setSelectedAlternative(letter)
                        }
                        disabled={answered}
                    />

                    <span>
                        {alternative}
                    </span>

                </label>
            );
        }
        
        )}
        
    </div>
);

}
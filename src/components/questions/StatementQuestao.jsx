import React from "react";

export default function StatementQuestao({statement}) {

    return (
        <div className="question-statement">
            <p>
                {statement}
            </p>
        </div>
    );
}
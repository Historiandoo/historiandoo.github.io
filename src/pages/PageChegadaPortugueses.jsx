import React from 'react';
import '../css/PageChegadaPortugueses.css';

import content from '../data/textChegadaPortugueses.json';

function PageChegadaPortugueses() {

    return (
        <>
            <div className='container'>
                <div className='content-page'>
                    <h1 className='text-center mb-5'> {content.title} </h1>
                        {content.paragraphs.map( (paragraph) => (
                            <div className='paragraph mb-4' key={paragraph.id}>
                                <p>{paragraph.text}</p>
                            </div>
                        ))}
                </div>
            </div>

        </>
    )
}

export default PageChegadaPortugueses;
import React from 'react';
import '../css/PageChegadaPortugueses.css';
import content from '../data/textCartaPeroVaz.json';

function PageCartaPeroVaz() {

    return (
        <>
            <div className='container'>
                <div className='content-page'>
                    <h1 className='text-center mb-5'> {content.title} </h1>
                        {content.paragraphs.map( ({text, subtitle}, index) => (
                            <div className='paragraph mb-4' key={index}>
                                {subtitle && <h3>{subtitle}</h3>}
                                <p>{text}</p>
                            </div>
                        ))}
                </div>
            </div>

        </>
    )
}

export default PageCartaPeroVaz;
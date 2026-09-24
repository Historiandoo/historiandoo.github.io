import React from 'react';
import '../css/PageChegadaPortugueses.css';
import content from '../data/textChegadaPortugueses.json';

export default function PageChegadaPortugueses() {

    return (
        <>
            <div className='container'>
                <div className='content-page'>
                    <h1 className='text-center mb-5'> {content.title} </h1>
                        {content.paragraphs.map( ({text}, index) => (
                            <div className='paragraph mb-4' key={index}>
                                <p>{text}</p>
                            </div>
                        ))}
                </div>
            </div>

        </>
    )
}
import React from 'react';
import { Link } from 'react-router-dom';

export default function CardMap ({map}) {

    return (
        <Link 
            to="/mapaMental"
            state={{map}}
            className='map-card'
        >

            <img
                src={map.image}
                alt={map.title}
            />
        
        </Link>
    );
}
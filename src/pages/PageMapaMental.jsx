import React from 'react';
import { useLocation, Link } from 'react-router-dom';

export default function PageMapaMental() {

    const location = useLocation();
    const map = location.state?.map;

    if (!map) {
        return(
            <div className='container text-center mt-5'>
                <h2>Mapa mental não encontrado!</h2>

                <Link to="/">
                    Voltar para Home
                </Link>
            </div>
        );
    }

    return (
        <div className='container text-center'>
           <h1 className="mb-4">
                {map.title}
            </h1>

            <img
                src={map.image}
                alt={map.title}
                className="img-fluid"
            />
        </div>
    );
}
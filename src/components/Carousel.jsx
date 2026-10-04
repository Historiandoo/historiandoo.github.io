import React, { useRef } from 'react';
import '../css/Carousel.css';

export default function CarouselHome ({children}) {

    const carouselRef = useRef(null);

    const scrollLeft = () => {
        carouselRef.current.scrollBy({
            left: -400,
            behavior: 'smooth'
        });
    };

    const scrollRight = () => {
        carouselRef.current.scrollBy({
            left: 400,
            behavior: 'smooth'
        });
    };

    return (
        <div className='carousel-wrapper'>

            <button
                className='carousel-button carousel-button-left'
                onClick={scrollLeft}
                aria-label='Anterior'
            >
                &#10094;
            </button>

            <div className='carousel-container' ref={carouselRef}>
                {children}
            </div>

            <button
                className='carousel-button carousel-button-right'
                onClick={scrollRight}
                aria-label='Próximo'
            >
                &#10095;
            </button>

        </div>
    )
}
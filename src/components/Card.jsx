import { Link } from "react-router-dom";
import '../css/Card.css'

export default function CardsContent ({title, image, description, route}) {

    return (
        <div className='card h-100'>

            <img src={image} 
            className='card-img-top' 
            alt='Chegada dos portugueses'
            />
            
            <div className='card-body'>
                <h5 className='card-title text center'>{title}</h5>
                <p className='card-text'>{description || "\u00A0"}</p>
                <Link className='btn btn-primary' to={route}>Veja mais aqui!</Link>
            </div>

        </div>
    );

}
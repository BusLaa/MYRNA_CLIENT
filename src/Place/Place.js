import React from 'react';

import "./Place.css";

import placeImg from '../img/pizzakiosk.jpg';

function Place (props) {

    return(
        <div className='place' id={props.place.id} onClick={() => {props.onChoose(props.place.id); props.onChoose2()}}>
            <div className="place">
                <img src={placeImg} alt="avatar"></img>
                <div className='placeInfo'>
                    <p> {props.user.name}</p> 
                    <p className='placeParadigm'> {props.place.paradigm} </p>
                </div>
            </div>
        </div>
    )
}

export default Place;
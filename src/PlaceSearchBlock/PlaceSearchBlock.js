import React, {useEffect, useState} from 'react';
import { gql } from 'graphql-request';

import './PlaceSearchBlock.css';

import stockAvatar from '../img/avatars/avatar1.jpg';

function PlaceSearchBlock(props) {

    const [placeImg, setPlaceImg] = useState(stockAvatar);

    useEffect(() => {
        if (props.place.images.length > 0) {
            setPlaceImg(process.env.REACT_APP_SERVER_IP + "static/" + props.place.images[0].path);
        }
    }, [props.place]);

  return (

    <div className="placeSearchBlock" id={props.place.id} onClick={() => {props.onChoose(props.place.id); props.onChoose2(props.place)}}>
        <div className="placeSearchBlockTop">
            <div className="placeSearchBlockInfo">
                <div className="placeSearchBlockAvatar">
                    <img src={placeImg} alt="avatar"></img>
                </div>
                <div className="placeSearchBlockName">
                    <p> {props.place.name} </p> 
                </div>  
            </div>
        </div>
    </div>

  );

}

export default PlaceSearchBlock;

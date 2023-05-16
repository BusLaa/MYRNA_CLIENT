import React, {useEffect, useState} from 'react';
import { gql } from 'graphql-request';

import './PlaceFoundBlock.css';

import stockAvatar from '../img/avatars/avatar1.jpg';

import cross from '../img/cross2.svg';

function PlaceFoundBlock(props) {

    const [placeImg, setPlaceImg] = useState(stockAvatar);

    useEffect(() => {
        if (props?.place?.images?.length > 0) {
            setPlaceImg(process.env.REACT_APP_SERVER_IP + "static/" + props.place.images[0].path);
        }
    }, [props?.place]);

  return (
    <div className="placeFoundBlock" id={props?.place?.id}>
        <div className="placeFoundBlockTop">
            <div className="placeFoundBlockInfo">
                <div className="placeFoundBlockAvatar">
                    <img src={placeImg} alt="avatar"></img>
                </div>
                <div className="placeFoundBlockName">
                    <p> {props?.place?.name} </p> 
                </div>  
            </div>
            <div>
                <img onClick={() => {props.onDechoose()}} src={cross} alt="cross"></img> 
            </div>
        </div>
    </div>
  );
}

export default PlaceFoundBlock;
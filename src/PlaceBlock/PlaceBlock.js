import React, {useEffect, useState} from 'react';
import { gql } from 'graphql-request';
import {Link} from 'react-router-dom';

import './PlaceBlock.css';

import DotsImg from '../img/dots.svg'

import stockAvatar from '../img/pizzakiosk.jpg';

function PlaceBlock(props) {

    const [avatar, setAvatar] = useState(stockAvatar);

    useEffect(() => {
        if (props.place.images.length > 0) {
            setAvatar(process.env.REACT_APP_SERVER_IP + "static/" + props.place.images[0].path);
        }
    }, [props.place]);

    const [dotsMenuStyle, setDotsMenuStyle] = useState("hidden dotsMenu")
    const [dotsMenuButtonStyle, ] = useState("dotsMenuButton")

    function addToCorner(e) {
        e.preventDefault();
        try {
            return fetch(process.env.REACT_APP_SERVER_IP, {
                headers: {'Content-Type': 'application/json', 'verify-token': localStorage.getItem("token")},
                method: 'POST',
                body: JSON.stringify({"query": query})
            }).then((a) =>{
                return a.json();
            }).then((b) => {
                return b;
            })
        } catch (err) {
            console.log(err)
        } 
    }

    function addToBlacklist(e) {
        e.preventDefault();
        try {
            return fetch(process.env.REACT_APP_SERVER_IP, {
                headers: {'Content-Type': 'application/json', 'verify-token': localStorage.getItem("token")},
                method: 'POST',
                body: JSON.stringify({"query": query2})
            }).then((a) =>{
                return a.json();
            }).then((b) => {
                return b;
            })
        } catch (err) {
            console.log(err)
        } 
    }

    let query = gql`
        mutation AddPlaceToCorner {
            addPlaceToCorner(placeId: ${props.place.id}, userId: ${localStorage.getItem("user_id")})
        }
    `;
    
    let query2 = gql`
        mutation AddPlaceToBlacklist {
            AddPlaceToBlacklist(placeId: ${props.place.id}, userId: ${localStorage.getItem("user_id")})
        }
    `;

    function placeBlockDots() {
        if (dotsMenuStyle != "dotsMenu") {
            setDotsMenuStyle("dotsMenu");
        } else {
            setDotsMenuStyle("hidden dotsMenu");
        }
    }

  return (

    <div className="placeBlock" id={props.place.id}>
        <div className="placeBlockTop">
            <div className="placeBlockInfo">
                <Link to="/place" state={{placeId: props.place.id}} >
                    <div className="placeBlockAvatar">
                        <img src={avatar} alt="avatar"></img>
                    </div>
                    <div className="placeBlockName">
                        <p> {props.place.name} </p> 
                    </div>  
                </Link>
            </div>
            <div className="placeBlockDots">
                <div style={{borderRight: "solid 0.1vw #E9E9E9", height: '30px'}}></div>
                <img onClick={placeBlockDots} src={DotsImg} alt="dots"></img>
                <div className={dotsMenuStyle}>
                    <div onClick={addToCorner} className={dotsMenuButtonStyle}> Add to corner ⭐</div>
                    <div onClick={addToBlacklist} className={dotsMenuButtonStyle}> Hide and forget ⛔️ </div>
                </div>
            </div>
        </div>
    </div>

  );

}

export default PlaceBlock;

import React, { useState, useEffect } from 'react';
import "./MeetingMessage.css"

import stockAvatar from '../img/avatars/avatar1.jpg';

import {Link} from 'react-router-dom';

function MeetingMessage (props) {

    const [avatar, setAvatar] = useState(stockAvatar);

    useEffect(() => {
        if (props.message.author.avatar) {
            setAvatar(process.env.REACT_APP_SERVER_IP + "static/" + props.message.author.avatar.path);
        }
    }, [props.message]);


    return(
        <div className='meetingMessage' id={props.message.id}>
            <div className="meetingMessageTop">
                <img src={avatar} alt="avatar"></img>
                <Link to="/profile" state={{ userId: props.message.author.id }} > <p>{props.message.author.first_name} {props.message.author.last_name}</p> </Link>
            </div>
            <div className="meetingMessageContent">
                <p> — {props.message.content} </p>
            </div>
        </div>
    )
}

export default MeetingMessage;
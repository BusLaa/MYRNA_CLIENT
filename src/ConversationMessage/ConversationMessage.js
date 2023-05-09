import React, { useState, useEffect } from 'react';
import "./ConversationMessage.css"

import stockAvatar from '../img/avatars/avatar1.jpg';

import {Link} from 'react-router-dom';

function ConversationMessage (props) {

    const [avatar, setAvatar] = useState(stockAvatar);

    useEffect(() => {
        if (props.message.author.avatar) {
            setAvatar(process.env.REACT_APP_SERVER_IP + "static/" + props.message.author.avatar.path)
        }
    }, [props.message]);

    return(
        <div className='conversationMessage' id={props.message.id}>
            <div className="conversationMessageTop">
                <div className="conversationMessageTopLeft">
                    <img src={avatar} alt="avatar"></img>
                    <Link to="/profile" state={{ userId: props.message.author.id }} > <p>{props.message.author.firstName} {props.message.author.lastName}</p> </Link>
                </div>
                <div className="conversationMessageTopRight">
                    <p title={new Date(props.message.createdAt * 1).toDateString()}>  { new Date(props.message.createdAt * 1).toTimeString().split(' ')[0].substring(0, 5) } </p>
                </div>
            </div>
            <div className="conversationMessageContent">
                <p> — {props.message.content} </p>
            </div>
        </div>
    )
}

export default ConversationMessage;
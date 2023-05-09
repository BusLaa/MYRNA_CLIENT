import React, { useState, useEffect } from 'react';
import "./ChatMessage.css"

import stockAvatar from '../img/avatars/avatar1.jpg';

import {Link} from 'react-router-dom';

function ChatMessage (props) {

    const [avatar, setAvatar] = useState(stockAvatar);

    useEffect(() => {
        if (props.message.author.avatar) {
            setAvatar(process.env.REACT_APP_SERVER_IP + "static/" + props.message.author.avatar.path)
        }
    }, [avatar]);

    return(
        <div className='message' id={props.message.id}>
            <div className="messageTop">
                <div className="messageTopLeft">
                    <img src={avatar} alt="avatar"></img>
                    <Link to="/profile" state={{ userId: props.message.author.id }} > <p>{props.message.author.firstName} {props.message.author.lastName}</p> </Link>
                </div>
                <div className="messageTopRight">
                    <p title={new Date(props.message.createdAt * 1).toDateString()}>  { new Date(props.message.createdAt * 1).toTimeString().split(' ')[0].substring(0, 5) } </p>
                </div>
            </div>
            <div className="messageContent">
                <p> — {props.message.content} </p>
            </div>
        </div>
    )
}

export default ChatMessage;
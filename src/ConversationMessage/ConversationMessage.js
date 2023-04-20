import React, {useState} from 'react';
import "./ConversationMessage.css"
import { gql } from 'graphql-request';

import avatar1 from '../img/avatars/avatar1.jpg';
import avatar2 from '../img/avatars/avatar2.jpg';
import avatar3 from '../img/avatars/avatar3.jpg';
import avatar4 from '../img/avatars/avatar4.jpg';
import avatar5 from '../img/avatars/avatar5.jpg';
import avatar6 from '../img/avatars/avatar6.jpg';

import {Link} from 'react-router-dom';

function ConversationMessage (props) {

    const [avatars, setAvatars] = useState([avatar1, avatar2, avatar3, avatar4, avatar5, avatar6]);

    useState(() => {
        console.log(props.message)
    }, [])

    return(
        <div className='conversationMessage' id={props.message.id}>
            <div className="conversationMessageTop">
                <div className="conversationMessageTopLeft">
                    <img src={avatars[props.message.author.avatar]}></img>
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
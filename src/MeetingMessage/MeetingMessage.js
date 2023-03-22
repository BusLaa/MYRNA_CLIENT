import React, {useState} from 'react';
import "./MeetingMessage.css"
import { gql } from 'graphql-request';

import avatar1 from '../img/avatars/avatar1.jpg';
import avatar2 from '../img/avatars/avatar2.jpg';
import avatar3 from '../img/avatars/avatar3.jpg';
import avatar4 from '../img/avatars/avatar4.jpg';
import avatar5 from '../img/avatars/avatar5.jpg';
import avatar6 from '../img/avatars/avatar6.jpg';

import {Link} from 'react-router-dom';

function MeetingMessage (props) {

    const [avatars, setAvatars] = useState([avatar1, avatar2, avatar3, avatar4, avatar5, avatar6]);

    useState(() => {
        
    }, [])

    return(
        <div className='meetingMessage' id={props.message.id}>
            <div className="meetingMessageTop">
                <img src={avatars[5]}></img>
                <Link to="/profile" state={{ userId: 6 }} > <p> Georg Laabe </p> </Link>
            </div>
            <div className="meetingMessageContent">
                <p> — {props.message.content} </p>
            </div>
        </div>
    )
}

export default MeetingMessage;
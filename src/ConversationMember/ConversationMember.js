import React, {useEffect, useState} from 'react';
import "./ConversationMember.css"

import stockAvatar from '../img/avatars/avatar1.jpg';

import {Link} from 'react-router-dom';

function ConversationMember (props) {

    const [avatar, setAvatar] = useState(stockAvatar);

    useEffect(() => {
        if (props.member.avatar) {
            setAvatar(process.env.REACT_APP_SERVER_IP + "static/" + props.member.avatar.path)
        }
    }, [props.member]);

    return(
        <div className='member' id={props.member.id}>
            <div className="memberTop">
                <img src={avatar} alt="avatar"></img>
                <Link to="/profile" state={{ userId: props.member.id }} > <p> {props.member.firstName} </p> <p> {props.member.lastName} </p> </Link>
            </div>
        </div>
    )
}

export default ConversationMember;
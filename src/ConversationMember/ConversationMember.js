import React, {useEffect, useState} from 'react';
import "./ConversationMember.css"

import avatar1 from '../img/avatars/avatar1.jpg';
import avatar2 from '../img/avatars/avatar2.jpg';
import avatar3 from '../img/avatars/avatar3.jpg';
import avatar4 from '../img/avatars/avatar4.jpg';
import avatar5 from '../img/avatars/avatar5.jpg';
import avatar6 from '../img/avatars/avatar6.jpg';

import {Link} from 'react-router-dom';

function ConversationMember (props) {

    const [avatars, ] = useState([avatar1, avatar2, avatar3, avatar4, avatar5, avatar6]);
    const [avatar, setAvatar] = useState(avatars[5]);

    useEffect(() => {
        if (props.member.avatar) {
            setAvatar(process.env.REACT_APP_SERVER_IP + "static/" + props.member.avatar.path)
        }
    }, [avatar]);

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
import React, {useEffect, useState} from 'react';
import "./MeetingMember.css"

import avatar1 from '../img/avatars/avatar1.jpg';
import avatar2 from '../img/avatars/avatar2.jpg';
import avatar3 from '../img/avatars/avatar3.jpg';
import avatar4 from '../img/avatars/avatar4.jpg';
import avatar5 from '../img/avatars/avatar5.jpg';
import avatar6 from '../img/avatars/avatar6.jpg';

import {Link} from 'react-router-dom';

function MeetingMember (props) {

    const [avatars, ] = useState([avatar1, avatar2, avatar3, avatar4, avatar5, avatar6]);

    const [crownStyle, setCrownStyle] = useState("hidden");

    useEffect(() => {
        if (props.chief.id === props.member.id) {
            setCrownStyle("");
        }
    }, [props.chief.id, props.member.id])

    return(
        <div className='member' id={props.member.id}>
            <div className="memberTop">
                <img src={avatars[props.member.avatar]} alt="avatar"></img>
                <Link to="/profile" state={{ userId: props.member.id }} > <p> {props.member.first_name} </p> <p> {props.member.last_name} </p> <p className={crownStyle}> 👑 </p> </Link>
            </div>
        </div>
    )
}

export default MeetingMember;
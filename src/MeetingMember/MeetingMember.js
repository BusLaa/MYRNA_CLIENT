import React, {useEffect, useState} from 'react';
import "./MeetingMember.css"

import stockAvatar from '../img/avatars/avatar1.jpg';

import {Link} from 'react-router-dom';

function MeetingMember (props) {

    const [avatar, setAvatar] = useState(stockAvatar);

    useEffect(() => {
        if (props.member.avatar) {
            setAvatar(process.env.REACT_APP_SERVER_IP + "static/" + props.member.avatar.path);
        }
    }, [props.member]);

    const [crownStyle, setCrownStyle] = useState("hidden");

    useEffect(() => {
        if (props.chief.id === props.member.id) {
            setCrownStyle("");
        }
    }, [props.chief.id, props.member.id])

    return(
        <div className='member' id={props.member.id}>
            <div className="memberTop">
                <img src={avatar} alt="avatar"></img>
                <Link to="/profile" state={{ userId: props.member.id }} > <p> {props.member.first_name} </p> <p> {props.member.last_name} </p> <p className={crownStyle}> 👑 </p> </Link>
            </div>
        </div>
    )
}

export default MeetingMember;
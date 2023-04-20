import React, {useEffect, useState} from 'react';
import "./User.css"

import avatar1 from '../img/avatars/avatar1.jpg';
import avatar2 from '../img/avatars/avatar2.jpg';
import avatar3 from '../img/avatars/avatar3.jpg';
import avatar4 from '../img/avatars/avatar4.jpg';
import avatar5 from '../img/avatars/avatar5.jpg';
import avatar6 from '../img/avatars/avatar6.jpg';

//import {Link} from 'react-router-dom';

function User (props) {

    const [avatars, ] = useState([avatar1, avatar2, avatar3, avatar4, avatar5, avatar6]);

    useEffect(() => {
    }, [])

    return(
        <div className='user' id={props.user.id} onClick={() => {props.onChoose(props.user.id); props.onChoose2()}}>
            <div className="userTop">
                <img src={avatars[props.user.avatar]} alt="avatar"></img>
                <div className='userInfo'>
                    <p> {props.user.first_name} {props.user.last_name} </p> 
                    <p className='userEmail'> {props.user.email} </p>
                </div>

            </div>
        </div>
    )
}

export default User;
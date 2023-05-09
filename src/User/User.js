import React, {useEffect, useState} from 'react';
import "./User.css"

import stockAvatar from '../img/avatars/avatar1.jpg';

function User (props) {

    const [avatar, setAvatar] = useState(stockAvatar);

    useEffect(() => {
        if (props.user.avatar) {
            setAvatar(process.env.REACT_APP_SERVER_IP + "static/" + props.user.avatar.path)
        }
    }, [props.user])

    return(
        <div className='user' id={props.user.id} onClick={() => {props.onChoose(props.user.id); props.onChoose2()}}>
            <div className="userTop">
                <img src={avatar} alt="avatar"></img>
                <div className='userInfo'>
                    <p> {props.user.firstName} {props.user.lastName} </p> 
                    <p className='userEmail'> {props.user.email} </p>
                </div>

            </div>
        </div>
    )
}

export default User;
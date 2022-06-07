import React, {useState} from 'react';
import "./Comment.css"
import { gql } from 'graphql-request';

import avatar1 from '../img/avatars/avatar1.jpg';
import avatar2 from '../img/avatars/avatar2.jpg';
import avatar3 from '../img/avatars/avatar3.jpg';
import avatar4 from '../img/avatars/avatar4.jpg';
import avatar5 from '../img/avatars/avatar5.jpg';
import avatar6 from '../img/avatars/avatar6.jpg';

import DotsImg from '../img/dots.svg'

import {Link} from 'react-router-dom';

function Comment (props) {

    const [avatars, setAvatars] = useState([avatar1, avatar2, avatar3, avatar4, avatar5, avatar6]);

    const [dotsMenuStyle, setDotsMenuStyle] = useState("hidden dotsMenu");

    const [hiddenMe, setHiddenMe] = useState("hidden dotsMenuButton");
    const [hiddenSub, setHiddenSub] = useState("hidden dotsMenuButton");

    let query = gql`
        mutation DeleteComment {
            deleteComment(comment_id: ${props.comment.id})
        }
    `; 

    function commentDots() {
        if (dotsMenuStyle != "dotsMenu") {
            if (props.comment.author.id == localStorage.getItem("user_id")) {
                setHiddenMe("dotsMenuButton");
                setHiddenSub("hidden dotsMenuButton")
            } else {
                setHiddenMe("hidden dotsMenuButton");
                setHiddenSub("dotsMenuButton")
            }
            setDotsMenuStyle("dotsMenu");
        } else {
            setDotsMenuStyle("hidden dotsMenu");
        }
    }

    function deleteComment() {
        try {
            return fetch(process.env.REACT_APP_SERVER_IP, {
                headers: {'Content-Type': 'application/json', 'verify-token': localStorage.getItem("token")},
                method: 'POST',
                body: JSON.stringify({"query": query})
            }).then((a) =>{
                return a.json()
            }).then((b) => {
                if (b.data.deleteComment) {
                    props.setDeleteId(props.comment.id)
                }
                return b
            })
        } catch (err) {
            console.log(err)
        }         
    }


    return(
        <div className='comment' id={props.comment.id}>
            <div className="commentTop">
                <img src={avatars[props.comment.author.avatar]}></img>
                <Link to="/profile" state={{ userId: props.comment.author.id }} > <p> {props.comment.author.first_name} </p> <p> {props.comment.author.last_name} </p> </Link>
                <div className="commentDots">
                    <img onClick={commentDots} src={DotsImg}></img>
                    <div className={dotsMenuStyle}>
                        <div className={hiddenSub}> Compain 😠 </div>
                        <div onClick={deleteComment} className={hiddenMe}> Delete 🗑️ </div>
                    </div>
                </div>
            </div>
            <div className="commentContent">
                <p> — {props.comment.content} </p>
            </div>
        </div>
    )
}

export default Comment;
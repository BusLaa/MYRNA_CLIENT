import React, {useEffect, useState} from 'react';
import { gql } from 'graphql-request';
import {Link} from 'react-router-dom';

import './ConversationBlock.css';

import DotsImg from '../img/dots.svg';

function ConversationBlock(props) {

    const [dotsMenuStyle, setDotsMenuStyle] = useState("hidden dotsMenu");
    const [hiddenMe, setHiddenMe] = useState("hidden dotsMenuButton");
    const [hiddenSub, setHiddenSub] = useState("hidden dotsMenuButton");

    let query = gql`
        mutation DeleteConversation {
            deleteConversation(conversation_id: ${props.conversation.id}, user_id: ${localStorage.getItem("user_id")})
        }
    `;  

    function conversationBlockDots() {
        if (dotsMenuStyle != "dotsMenu") {
            setHiddenMe("dotsMenuButton")
            setDotsMenuStyle("dotsMenu");
        } else {
            setDotsMenuStyle("hidden dotsMenu");
            setHiddenMe("hidden dotsMenuButton")
        }
    }

    function deleteConversation() {
        try {
            return fetch(process.env.REACT_APP_SERVER_IP, {
                headers: {'Content-Type': 'application/json', 'verify-token': localStorage.getItem("token")},
                method: 'POST',
                body: JSON.stringify({"query": query})
            }).then((a) =>{
                return a.json()
            }).then((b) => {
                console.log(b.data)
                return b
            })
        } catch (err) {
            console.log(err)
        }         
    }

  return (

    <div className="conversationBlock" id={props.meeting.id}>
        <div className="conversationBlockTop">
            <Link to="/conversation" state={{ conversationId: props.conversation.id }} >
                <div className="conversationBlockName">
                    <p> {props.conversation.name} </p> 
                </div>
            </Link>
            <div className="conversationBlockDots">
                <img onClick={conversationBlockDots} src={DotsImg}></img>
                <div className={dotsMenuStyle}>
                    <div onClick={deleteConversation} className={hiddenMe}> Delete 🗑️ </div>
                </div>
            </div>
        </div>
    </div>  

  );

}

export default ConversationBlock;

import React, { useState } from 'react';
import { gql } from 'graphql-request';
import {Link} from 'react-router-dom';

import './ConversationBlock.css';

import DotsImg from '../img/dots.svg';

function ConversationBlock(props) {

    const [dotsMenuStyle, setDotsMenuStyle] = useState("hidden dotsMenu");
    const [hiddenMe, setHiddenMe] = useState("hidden dotsMenuButton");

    let query = gql`
        mutation DeleteConversation {
            deleteConversation(conversationId: ${props.conversation.id}, userId: ${localStorage.getItem("user_id")})
        }
    `;  

    function conversationBlockDots() {
        if (dotsMenuStyle !== "dotsMenu") {
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
                if (b.data.deleteConversation) {
                    props.setDeleteId(props.conversation.id);
                } 
                return b
            })
        } catch (err) {
            console.log(err)
        }         
    }

  return (

    <div className="conversationBlock" id={props.conversation.id}>
        <div className="conversationBlockTop">
            <Link to="/conversation" state={{ conversationId: props.conversation.id }} >
                <div className="conversationBlockName">
                    <p className="conversationTitle"> {props.conversation.name} </p> 
                    <p className="conversationIdea"> {props.conversation.idea} </p> 
                </div>
            </Link>
            <div className="conversationBlockDots">
                <img onClick={conversationBlockDots} src={DotsImg} alt="settings"></img>
                <div className={dotsMenuStyle}>
                    <div onClick={deleteConversation} className={hiddenMe}> Delete 🗑️ </div>
                </div>
            </div>
        </div>
    </div>  

  );

}

export default ConversationBlock;

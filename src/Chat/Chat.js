import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import "./Chat.css";

import ChatMessage from '../ChatMessage/ChatMessage';

import { socket } from '../Socket/Socket';

function Chat (props) {

    const [events] = useState([]);

    let a = new Date();
    a.toISOString();
    
    const [messages, setMessages] = useState([]);

    const [content, setContent] = useState("");

    const location = useLocation();
    const [state] = useState(location.state || localStorage.getItem("state"));  
    
    useEffect(() => {
        return () => {
            console.log("Disconnected")
            socket.disconnect();
            document.addEventListener("keypress", (e) => addMessageOnEnter(e)); 
        }
    }, []);

    useEffect(() => {
        if (props.conversation) {
            socket.connect();
            console.log("Connected");
            setMessages(props.conversation.messages);
        }
    }, [props.conversation]);

    useEffect(() => {
        function onConnect(value) {
            if (props.conversation?.id) {
                socket.emit("askForRoom", {"userId": localStorage.getItem("user_id"), "conversationId": props.conversation.id});
            }
        }
        function onGotId(args) {
            if (args === "roomundefined") {
                socket.emit("askForRoom", {"userId": localStorage.getItem("user_id"), "conversationId": props.conversation.id});
            } else {
                console.log("Got room: " + args);
                document.addEventListener("keypress", (e) => addMessageOnEnter(e));                
            }
        }
        function onNewMessage(message) {
            message.createdAt = new Date(message.createdAt).getTime();
            setMessages(messages => [...messages, message]);
            if (message.authorId === localStorage.getItem("user_id")) {
                setContent("");
                document.getElementById("messageInput").value = "";             
                setTimeout(() => {
                    document.querySelector(".chatMessages").scroll({
                        top: document.querySelector(".chatMessages").scrollHeight,
                        behavior: "smooth",
                    });
                }, 100);                
            }
        }

        socket.on('connect', onConnect);
        socket.on('gotId', onGotId);
        socket.on('newMessage', onNewMessage);

        return () => {
            socket.off('connect', onConnect)
            socket.off('gotId', onGotId);
            socket.off('newMessage', onNewMessage);
        }
    }, [events, props.conversation?.id])

    useEffect(() => {
        if (messages) {
            console.log(messages);
        }
    }, [messages])

    async function addMessage(e) {
        e.preventDefault();
        if (content.length !== 0) {
            socket.emit("sentMessage", {"conversationId": props.conversation.id, "authorId": localStorage.getItem("user_id"), "content": content.trim()});
        }
    }

    function addMessageOnEnter(e) {       
        if (e.key === "Enter") {
            addMessage(e);
        }
    }

    return(
        <div className='chat'>
            <div className='chatMessages'>
                {messages?.map((message) => <ChatMessage key={message.id} message={message}/>)}
            </div>
            <div className='chatInput'>
                <input id="messageInput" onChange={(e) => {setContent(e.target.value)}} placeholder='Wassup?'></input>
                <i onClick={(e) => {addMessage(e)}} className="fa fa-paper-plane" aria-hidden='true'></i>
            </div>
        </div>     
    )
}

export default Chat;
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import "./Chat.css";

import ChatMessage from '../ChatMessage/ChatMessage';

import { socket } from '../Socket/Socket';

function Chat (props) {

    const [events] = useState([]);

    const [conversationId, setConversationId] = useState(props.id);

    //const [isConnected, setIsConnected] = useState(socket.connected)

    let a = new Date();
    a.toISOString();
    
    const [messages, setMessages] = useState([]);

    const [content, setContent] = useState("");

    const location = useLocation();
    const [state] = useState(location.state || localStorage.getItem("state"));  

    function onConnect(value) {
        console.log("onConnect")
        socket.emit("askForRoom", {"userId": localStorage.getItem("user_id"), "conversationId": props.id, "type": props.type});
    }

    function onGotId(args) {
        if (args.search("undefined") !== -1) {
            socket.emit("askForRoom", {"userId": localStorage.getItem("user_id"), "conversationId": props.id, "type": props.type});
        } else {
            console.log("Got room: " + args);
            document.addEventListener("keypress", (e) => addMessageOnEnter(e));                
        }
    }

    function onNewMessage(message) {
        message.createdAt = new Date(message.createdAt).getTime();
        setMessages(messages => [...messages, message]);
        console.log(message);
        if (message.authorId === localStorage.getItem("user_id")) {
            setContent("");
            document.getElementById("messageInput").value = "";     
        }
        let div = document.querySelector(".chatMessages");
        if (div.scrollTop + 1 + div.clientHeight >= div.scrollHeight) {
            setTimeout(() => {
                document.querySelector(".chatMessages").scroll({
                    top: document.querySelector(".chatMessages").scrollHeight,
                    behavior: "smooth",
                });
            }, 100);   
        }   
    }                    

    useEffect(() => {
        return () => {
            console.log("Disconnected");
            socket.disconnect();
        }
    }, [])
    
    useEffect(() => {

        if (!props.id) {
            console.log("No Id");
        } else {
            socket.on('connect', onConnect);
            socket.on('gotId', onGotId);
            socket.on('newMessage', onNewMessage);
            socket.connect();
        }

        return () => {
            socket.off('connect', onConnect)
            socket.off('gotId', onGotId);
            socket.off('newMessage', onNewMessage);
            document.addEventListener("keypress", (e) => addMessageOnEnter(e)); 
        }
    }, [props.id]);

    useEffect(() => {
        if (props.messages) {
            setMessages(props.messages);
        }
    }, [props.messages])

    useEffect(() => {
        if (messages.length != 0) {
            setTimeout(() => {
                document.querySelector(".chatMessages").scroll({
                    top: document.querySelector(".chatMessages").scrollHeight,
                    behavior: "smooth",
                });
            }, 100);    
        }
    }, [messages]);

    async function addMessage(e) {
        e.preventDefault();
        if (content.length !== 0) {
            socket.emit("sentMessage", {"conversationId": props.id, "authorId": localStorage.getItem("user_id"), "content": content.trim(), "type": props.type});
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
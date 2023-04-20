import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';

import "./Conversation.css";

import ConversationMember from '../ConversationMember/ConversationMember';
import ConversationMessage from '../ConversationMessage/ConversationMessage';
import SearchUsers from '../SearchUsers/SearchUsers';

import { gql } from 'graphql-request';

import { io } from "socket.io-client";


function Conversation (props) {

    const [socket, setSocket] = useState(
        io(process.env.REACT_APP_SERVER_IP, {
            reconnectionDelayMax: 10000,
            auth: {
                token: "123"
            },
            query: {
                "my-key": "my-value"
            }
        }));

    


    //const [date, setDate] = useState(new Date());
    //const [datePhrase, setDatePhrase] = useState("");

    let a = new Date();
    a.toISOString();
    
    const [conversation, setConversation] = useState({});
    const [members, setMembers] = useState([]);
    const [messages, setMessages] = useState([]);

    const [content, setContent] = useState("");

    const location = useLocation();
    const [state, ] = useState(location.state || localStorage.getItem("state"));
    
    const [conversationPageTextStyle, setConversationPageTextStyle] = useState("conversationName");
    const [conversationPageTextChangeStyle, setConversationPageTextChangeStyle] = useState("hidden conversationPageTextChange");

    const [inviteUserStyle, setInviteUserStyle] = useState("inviteUser hidden");
    const [blackStyle, setBlackStyle] = useState("black hidden");

    const [chooseId, setChooseId] = useState(0);
    const [deleteId, setDeleteId] = useState(0);

    useEffect(() => {
        if (!socket || !conversation.id) return
        socket.on('connect', () => {
            console.log("connection established Front");
            console.log("conversationId "+ conversation.id); 
            socket.emit("askForRoom", {"userId": localStorage.getItem("user_id"), "conversationId": conversation.id});
        });
        socket.on('gotId', (args) => {
            console.log("Sex: " + args);
        });
        socket.on('newMessage', (message) => {

            setMessages((messages) => [...messages, message])
            
        });

    }, [socket, conversation.id])

    // useEffect(() =>{
        
    // }, [messages])

    useEffect(() => {
        if (deleteId !== -1) {
            //const newList = members.filter((item) => item.id !== deleteId);
            setMembers((members) => members.filter((item) => item.id !== deleteId))
            //setMembers(newList);
            setDeleteId(-1);
        }
    },[deleteId])


    useEffect(() =>{
        if (conversation.members != null) {
            setMembers(setMembersFast());           
        }
        if (conversation.messages != null) {
            setMessages(setMessagesFast());
        }
        console.log(conversation);
    }, [conversation])

    function setMembersFast() {
        console.log([].concat(conversation.members));
        return [].concat(conversation.members);
    }

    function setMessagesFast() {
        console.log([].concat(conversation.messages));
        return [].concat(conversation.messages);
    }
    
    function setConversationFast(a) {
        return a.conversations.find((x) => x.id === state.conversationId);
    }
      
    const saveState = (e) => {
        e.preventDefault();
        localStorage.setItem("state", location.state);
    };

    let query = gql`
        query GetUserById {
            getUserById(id: ${localStorage.getItem("user_id")}) {
                id
                conversations {
                    id
                    name
                    idea
                    expandable
                    members {
                        id 
                        firstName
                        lastName
                        avatar
                    }
                    messages {
                        id
                        content
                        createdAt
                        author {
                            id
                            firstName
                            lastName
                            avatar
                        }
                    }
                }
            }
        }
    `;

    let query2 = gql`
        mutation InviteUserToConversation {
            inviteUserToConversation(conversationId: ${conversation.id}, userId: ${chooseId}) {
                id  
                firstName
                lastName
                avatar
            }
        }
    `;

    async function getData() {
        try {
            return await fetch(process.env.REACT_APP_SERVER_IP, {
                headers: {'Content-Type': 'application/json', 'verify-token': localStorage.getItem("token")},
                method: 'POST',
                body: JSON.stringify({"query": query})
            }).then((a) =>{
                return a.json()
            }).then((b) => { 
                return b
            })
        } catch (err) {
            console.log(err)
        }       
    }

    async function inviteUser() {
        try {
            return await fetch(process.env.REACT_APP_SERVER_IP, {
                headers: {'Content-Type': 'application/json', 'verify-token': localStorage.getItem("token")},
                method: 'POST',
                body: JSON.stringify({"query": query2})
            }).then((a) =>{
                return a.json()
            }).then((b) => { 
                return b
            })
        } catch (err) {
            console.log(err)
        }       
    }

    function clickOnCancel() {
        setConversationPageTextStyle("conversationName");
        setConversationPageTextChangeStyle("hidden conversationPageTextChange");
    }

    function clickOnName() {
        setConversationPageTextStyle("hidden conversationName");
        setConversationPageTextChangeStyle("conversationPageTextChange");
    }

    function editName() {
    }

    function editIdea() {
    }

    async function addMessage(e) {
        e.preventDefault();
        console.log("We are in addMessage")
        socket.emit("sentMessage", {"conversationId": conversation.id, "authorId": localStorage.getItem("user_id"), "content": content});

        setContent("");
            document.getElementById("messageInput").value = "";             
            setTimeout(() => {
                document.querySelector(".conversationMessages").scroll({
                    top: document.querySelector(".conversationMessages").scrollHeight,
                    behavior: "smooth",
                });
            }, 100);
        // try {
        //     setContent(content.trim());
        //     if (content == null || content === "" || content.slice(0,1) === " ") return;
        //     return fetch(process.env.REACT_APP_SERVER_IP, {
        //         headers: {'Content-Type': 'application/json', 'verify-token': localStorage.getItem("token")},
        //         method: 'POST',
        //         body: JSON.stringify({"query": query3})
        //     }).then((a) => {
        //         return a.json();
        //     }).then((b) => {
        //         console.log(b);
        //         setMessages([].concat(messages, b.data.createConversationMessage))
        //         setContent("");
        //         document.getElementById("messageInput").value = "";             
        //         setTimeout(() => {
        //             document.querySelector(".conversationMessages").scroll({
        //                 top: document.querySelector(".conversationMessages").scrollHeight,
        //                 behavior: "smooth",
        //             });
        //         }, 100);
        //         return b;
        //     })
        // } catch (err) {
        //     console.log(err);
        // } 
    }

    function toggleInviteUser() {
        if (inviteUserStyle === "inviteUser") {
            setInviteUserStyle("inviteUser hidden");
            setBlackStyle("black hidden");
        } else {
            setInviteUserStyle("inviteUser");
            setBlackStyle("black");
        }
    }

    function toggleBlack() {
        if (blackStyle === "black") {
            toggleInviteUser();
            setBlackStyle("black hidden");
        } else {
            setBlackStyle("black");
        }
    }

    useEffect(() =>{
        getData()
            .then((a) => {
                a = a.data.getUserById;
                if (a.conversations.length === 0) {
                    return;
                } else {
                    setConversation(setConversationFast(a));
                }
            })
    }, [])

    function onChoose(a) {
        setChooseId(a);
    }

    useEffect(() =>{
        if (conversation != null) {
            inviteUser().then((b) => {
                console.log(b);
                setMembers([].concat(members, b.data.inviteUserToConversation))
            })
        }
        if (blackStyle === "black") {
            toggleBlack();
        }
    }, [chooseId])

    // useEffect(() =>{
    //     console.log(messages)
    // }, [messages])


    return(

            <div className='conversationPage'>

                <div className={blackStyle} onClick={toggleBlack}></div>

                <div className="conversationDiv">

                    <div className="conversation">

                        <div className={inviteUserStyle}>
                            <p> Invite user to Conversation </p>
                            <SearchUsers onChoose={onChoose} members={conversation.members ? conversation.members : []}></SearchUsers>
                        </div>

                        <div className="conversationData">

                            <div className="conversationInfo">

                            <p onClick={clickOnName} className={conversationPageTextStyle} title={conversation.id}> {conversation.name}  </p>
                            <input type="text" className={conversationPageTextChangeStyle} defaultValue={conversation.name} ></input>
                            <input onClick={clickOnCancel} id="cancel" type="button" className={conversationPageTextChangeStyle} value=" Cancel "></input>
                            <input onClick={editName} type="button" className={conversationPageTextChangeStyle} value=" Save "></input>

                                <p className="conversationIdea"> { conversation.idea } </p>

                                <div className="conversationHr">
                                    <hr></hr>    
                                </div>

                                <div className="conversationMembersHeader">
                                    <p className="conversationMembersText"> Members </p>
                                    <input onClick={toggleInviteUser} type="button" className="conversationMembersInvite" value=" Invite "></input>
                                </div>

                                <div className='conversationMembers'>
                                    {members.map((member) => <ConversationMember setDeleteId={setDeleteId} key={member.id} member={member}/>)}
                                </div>    

                            </div>

                        </div>

                        <div className='conversationChat'>
                            <div className='conversationMessages'>
                                {messages.map((message) => <ConversationMessage key={message.id} message={message}/>)}
                            </div>
                            <div className='conversationChatInput'>
                                <input id="messageInput" onChange={(e) => {setContent(e.target.value)}} placeholder='Wassup?'></input>
                                <i onClick={addMessage} className="fa fa-paper-plane" aria-hidden='true'></i>
                            </div>
                        </div>      

                    </div>

                </div>

            </div>

    )
}

export default Conversation;
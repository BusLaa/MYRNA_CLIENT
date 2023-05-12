import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import "./Conversation.css";

import ConversationMember from '../ConversationMember/ConversationMember';
import SearchUsers from '../SearchUsers/SearchUsers';
import Chat from '../Chat/Chat';

import { gql } from 'graphql-request';

function Conversation (props) {

    let a = new Date();
    a.toISOString();
    
    const [conversation, setConversation] = useState(null);
    const [members, setMembers] = useState([]);

    const location = useLocation();
    const [state] = useState(location.state || localStorage.getItem("state"));
    
    const [conversationPageTextStyle, setConversationPageTextStyle] = useState("conversationName");
    const [conversationPageTextChangeStyle, setConversationPageTextChangeStyle] = useState("hidden conversationPageTextChange");

    const [inviteUserStyle, setInviteUserStyle] = useState("inviteUser hidden");
    const [blackStyle, setBlackStyle] = useState("black hidden");

    const [chooseId, setChooseId] = useState(0);
    const [deleteId, setDeleteId] = useState(0);

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
    }, []);
    
    
    useEffect(() => {
        if (deleteId !== -1) {
            //const newList = members.filter((item) => item.id !== deleteId);
            setMembers((members) => members.filter((item) => item.id !== deleteId))
            //setMembers(newList);
            setDeleteId(-1);
        }
    },[deleteId])

    useEffect(() => {
        if (conversation) {
            if (conversation.members != null) {
                setTimeout(() => {
                    setMembers([].concat(members, conversation.members)); 
                }, 0)     
            }
        }
    }, [conversation])

    useEffect(() => {
        if (members.length !== 0) {
            console.log(members);
        }
    }, [members])
    
    function setConversationFast(a) {
        return a.conversations.find((x) => x.id === state.conversationId);
    }

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
                        avatar {
                            id
                            path
                        }
                    }
                    messages {
                        id
                        content
                        createdAt
                        author {
                            id
                            firstName
                            lastName
                            avatar {
                                id
                                path
                            }
                        }
                    }
                }
            }
        }
    `;

    let query2 = gql`
        mutation InviteUserToConversation {
            inviteUserToConversation(conversationId: ${conversation?.id}, userId: ${chooseId}) {
                id  
                firstName
                lastName
                avatar {
                    id
                    path
                }
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

    function onChoose(a) {
        setChooseId(a);
    }

    useEffect(() =>{
        if (chooseId != 0) {
            if (conversation != null) {
                inviteUser().then((b) => {
                    console.log(b);
                    setMembers([].concat(members, b.data.inviteUserToConversation))
                })
            }
            if (blackStyle === "black") {
                toggleBlack();
            }
        }
    }, [chooseId])

    return(

            <div className='conversationPage'>

                <div className={blackStyle} onClick={toggleBlack}></div>

                <div className="conversationDiv">

                    <div className="conversation">

                        <div className={inviteUserStyle}>
                            <p> Invite user to Conversation </p>
                            <SearchUsers onChoose={onChoose} members={conversation?.members || []}></SearchUsers>
                        </div>

                        <div className="conversationData">

                            <div className="conversationInfo">

                            <p onClick={clickOnName} className={conversationPageTextStyle} title={conversation?.id}> {conversation?.name}  </p>
                            <input type="text" className={conversationPageTextChangeStyle} defaultValue={conversation?.name} ></input>
                            <input onClick={clickOnCancel} id="cancel" type="button" className={conversationPageTextChangeStyle} value=" Cancel "></input>
                            <input onClick={editName} type="button" className={conversationPageTextChangeStyle} value=" Save "></input>

                                <p className="conversationIdea"> { conversation?.idea } </p>

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

                        <Chat id={conversation?.id} messages={conversation?.messages} type="conversation"/>

                    </div>

                </div>

            </div>

    )
}

export default Conversation;
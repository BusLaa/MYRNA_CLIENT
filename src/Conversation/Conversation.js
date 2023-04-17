import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';

import "./Conversation.css";

import Member from '../MeetingMember/MeetingMember';
import ConversationMessage from '../ConversationMessage/ConversationMessage';
import SearchUsers from '../SearchUsers/SearchUsers';

import { gql } from 'graphql-request';

import placeImg from '../img/pizzakiosk.jpg';
import { flushSync } from 'react-dom';

function Conversation (props) {

    const [date, setDate] = useState(new Date());
    const [datePhrase, setDatePhrase] = useState("");

    let a = new Date();
    a.toISOString();
    
    const [Conversation, setConversation] = useState({});
    const [members, setMembers] = useState([]);
    const [messages, setMessages] = useState([]);

    const location = useLocation();

    const [content, setContent] = useState("");

    const [state, setState] = useState(location.state || localStorage.getItem("state"));
    
    const [ConversationPageTextStyle, setConversationPageTextStyle] = useState("ConversationPageText");
    const [ConversationPageTextChangeStyle, setConversationPageTextChangeStyle] = useState("hidden ConversationPageTextChange");

    const [inviteUserStyle, setInviteUserStyle] = useState("inviteUser hidden");
    const [blackStyle, setBlackStyle] = useState("black hidden");

    const [chooseId, setChooseId] = useState(0);
    const [deleteId, setDeleteId] = useState(0);

    useEffect(() => {
        if (deleteId != -1) {
            const newList = members.filter((item) => item.id !== deleteId);
            setMembers(newList);
            setDeleteId(-1);
        }
    },[deleteId])


    useEffect(() =>{
        if (Conversation.members != null) {
            setMembers(setMembersFast());           
        }
        if (Conversation.messages != null) {
            setMessages(setMessagesFast());
        }
        let b = new Date(parseInt(Conversation.date));
        setDate(b);
        console.log(Conversation);
        setDatePhrase("The Conversation is going to happen on ");
    }, [Conversation])

    function setMembersFast() {
        console.log(members.concat(Conversation.members));
        return members.concat(Conversation.members);
    }

    function setMessagesFast() {
        console.log(messages.concat(Conversation.messages));
        return messages.concat(Conversation.messages);
    }
    
    function setConversationFast(a) {
        return a.Conversations.find((x) => x.id === state.ConversationId);
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
                        content
                        id
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
            inviteUserToConversation(conversationId: ${Conversation.id}, userId: ${chooseId}) {
                id  
                first_name
                last_name
                avatar
            }
        }
    `;

    let query3 = gql`
        mutation CreateConversationMessage {
            createConversationMessage(conversationId: ${Conversation.id}, author: ${localStorage.getItem("user_id")}, content: "${content}") {
                id
                content
                author {
                    id
                    first_name
                    last_name
                    avatar
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
        setConversationPageTextStyle("ConversationPageText");
        setConversationPageTextChangeStyle("hidden ConversationPageTextChange");
    }

    function clickOnName() {
        setConversationPageTextStyle("hidden ConversationPageText");
        setConversationPageTextChangeStyle("ConversationPageTextChange");
    }

    function editName() {
    }

    function editIdea() {
    }

    async function addMessage(e) {
        e.preventDefault();
        try {
            setContent(content.trim());
            if (content == null || content === "" || content.slice(0,1) === " ") return;
            return fetch(process.env.REACT_APP_SERVER_IP, {
                headers: {'Content-Type': 'application/json', 'verify-token': localStorage.getItem("token")},
                method: 'POST',
                body: JSON.stringify({"query": query3})
            }).then((a) => {
                return a.json();
            }).then((b) => {
                console.log(b);
                setMessages([].concat(messages, b.data.createConversationMessage))
                setContent("");
                document.getElementById("messageInput").value = "";             
                setTimeout(() => {
                    document.querySelector(".ConversationMessages").scroll({
                        top: document.querySelector(".ConversationMessages").scrollHeight,
                        behavior: "smooth",
                    });
                }, 100);
                return b;
            })
        } catch (err) {
            console.log(err);
        } 
    }

    function toggleInviteUser() {
        if (inviteUserStyle == "inviteUser") {
            setInviteUserStyle("inviteUser hidden");
            setBlackStyle("black hidden");
        } else {
            setInviteUserStyle("inviteUser");
            setBlackStyle("black");
        }
    }

    function toggleBlack() {
        if (blackStyle == "black") {
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
                if (a.Conversations.length === 0) {
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
        if (Conversation != null) {
            inviteUser().then((b) => {
                console.log(b);
                setMembers([].concat(members, b.data.inviteUserToConversation))
            })
        }
        if (blackStyle == "black") {
            toggleBlack();
        }
    }, [chooseId])


    return(

            <div className='ConversationPage'>

                <div className={blackStyle} onClick={toggleBlack}></div>

                <p onClick={clickOnName} className={ConversationPageTextStyle} title={Conversation.id}> {Conversation.name}  </p>
                <input type="text" className={ConversationPageTextChangeStyle} defaultValue={Conversation.name} ></input>
                <input onClick={clickOnCancel} id="cancel" type="button" className={ConversationPageTextChangeStyle} value=" Cancel "></input>
                <input onClick={editName} type="button" className={ConversationPageTextChangeStyle} value=" Save "></input>

                <div className="ConversationDiv">

                    <div className={inviteUserStyle}>
                        <p> Invite user to Conversation </p>
                        <SearchUsers onChoose={onChoose} members={Conversation.members ? Conversation.members : []}></SearchUsers>
                    </div>

                    <div className="Conversation">
                        <div className="ConversationInfo">
                            <p className="ConversationDateText"> { datePhrase } { date.toLocaleDateString() } </p>

                            <div className="ConversationHr">
                                <hr></hr>    
                            </div>

                            <p className="ConversationPlaceText"> {Conversation.places ? Conversation.places[0].name : ""} </p>
                            <div className='ConversationPlace'>
                                <img className='ConversationPlaceImg' src={placeImg}></img>
                                <div className='ConversationPlaceDesc'>                                
                                    <i> <p className='ConversationPlaceTextContent'> Location: {Conversation.places ? Conversation.places[0].location.country : ""}, {Conversation.places ? Conversation.places[0].location.city : ""} </p> </i>   
                                    <i> <p className='ConversationPlaceTextContent'> Paradigm: {Conversation.places ? Conversation.places[0].paradigm :  ""} </p> </i>         
                                    <i> <p className='ConversationPlaceTextContent'> Rating: {Conversation.places ? Conversation.places[0].rating :  ""} </p> </i>
                                </div>
                            </div>

                            <div className="ConversationHr">
                                <hr></hr>    
                            </div>

                            <div className="ConversationMembersHeader">
                                <p className="ConversationMembersText"> Members </p>
                                <input onClick={toggleInviteUser} type="button" className="ConversationMembersInvite" value=" Invite "></input>
                            </div>

                            <div className='ConversationMembers'>
                                {members.map((member) => <Member setDeleteId={setDeleteId} chief={Conversation.chief} key={member.id} member={member}/>)}
                            </div>    

                        </div>

                    </div>

                    <div className='ConversationChat'>
                        <div className='ConversationMessages'>
                            {messages.map((message) => <ConversationMessage key={message.id} message={message}/>)}
                        </div>
                        <div className='ConversationChatInput'>
                            <input id="messageInput" onChange={(e) => {setContent(e.target.value)}} placeholder='Wassup?'></input>
                            <i onClick={addMessage} className="fa fa-paper-plane" aria-hidden='true'></i>
                        </div>
                    </div>      

                </div>

            </div>

    )
}

export default Conversation;
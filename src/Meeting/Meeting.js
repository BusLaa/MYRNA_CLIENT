import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';

import "./Meeting.css";

import Member from '../MeetingMember/MeetingMember';
import MeetingMessage from '../MeetingMessage/MeetingMessage';
import SearchUsers from '../SearchUsers/SearchUsers';

import { gql } from 'graphql-request';

import placeImg from '../img/pizzakiosk.jpg';
//import { flushSync } from 'react-dom';

function Meeting (props) {

    const [date, setDate] = useState(new Date());
    const [datePhrase, setDatePhrase] = useState("");

    let a = new Date();
    a.toISOString();
    
    const [meeting, setMeeting] = useState({});
    const [members, setMembers] = useState([]);
    const [messages, setMessages] = useState([]);

    const location = useLocation();

    const [content, setContent] = useState("");

    const [state, ] = useState(location.state || localStorage.getItem("state"));
    
    const [meetingPageTextStyle, setMeetingPageTextStyle] = useState("meetingPageText");
    const [meetingPageTextChangeStyle, setMeetingPageTextChangeStyle] = useState("hidden meetingPageTextChange");

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
        if (meeting.members != null) {
            setMembers(setMembersFast());           
        }
        if (meeting.messages != null) {
            setMessages(setMessagesFast());
        }
        let b = new Date(parseInt(meeting.date));
        setDate(b);
        console.log(meeting);
        setDatePhrase("The meeting is going to happen on ");
    }, [meeting])

    // useEffect(() =>{
    //     if (members.length != 0) {
    //         console.log(members)
    //     }
    // }, [members])

    function setMembersFast() {
        console.log(members.concat(meeting.members));
        return members.concat(meeting.members);
    }

    function setMessagesFast() {
        console.log(messages.concat(meeting.messages));
        return messages.concat(meeting.messages);
    }
    
    function setMeetingFast(a) {
        return a.meetings.find((x) => x.id === state.meetingId);
    }
      
    const saveState = (e) => {
        e.preventDefault();
        localStorage.setItem("state", location.state);
    };

    let query = gql`
        query GetUserById {
            getUserById(id: ${localStorage.getItem("user_id")}) {
                id
                meetings {
                    id
                    name
                    date
                    type
                    status
                    creator {
                        id
                    }
                    chief {
                         id
                    }
                    members {
                        id 
                        firstName
                        lastName
                        avatar
                    }
                    places {
                        id
                        name
                        paradigm
                        location {
                            id
                            city
                            country
                            postalCode
                        }
                        rating
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
        mutation InviteUserToMeeting {
            inviteUserToMeeting(meeting_id: ${meeting.id}, user_id: ${chooseId}) {
                id  
                first_name
                last_name
                avatar
            }
        }
    `;

    let query3 = gql`
        mutation CreateMeetingMessage {
            createMeetingMessage(meeting_id: ${meeting.id}, author: ${localStorage.getItem("user_id")}, content: "${content}") {
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
        setMeetingPageTextStyle("meetingPageText");
        setMeetingPageTextChangeStyle("hidden meetingPageTextChange");
    }

    function clickOnName() {
        setMeetingPageTextStyle("hidden meetingPageText");
        setMeetingPageTextChangeStyle("meetingPageTextChange");
    }

    function editName() {
    }
    
    function editDate() {
    }

    function editPlace() {
    }

    async function addMessage(e) {
        console.log("AddMessage!");
        e.preventDefault();
        try {
            setContent(content.trim());
            if (content == null || content === "" || content.slice(0,1) === " ") return;
            console.log("AddMessage2!");
            return fetch(process.env.REACT_APP_SERVER_IP, {
                headers: {'Content-Type': 'application/json', 'verify-token': localStorage.getItem("token")},
                method: 'POST',
                body: JSON.stringify({"query": query3})
            }).then((a) => {
                return a.json();
            }).then((b) => {
                console.log(b);
                setMessages([].concat(messages, b.data.createMeetingMessage))
                setContent("");
                document.getElementById("messageInput").value = "";             
                setTimeout(() => {
                    document.querySelector(".meetingMessages").scroll({
                        top: document.querySelector(".meetingMessages").scrollHeight,
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
                if (a.meetings.length === 0) {
                    return;
                } else {
                    setMeeting(setMeetingFast(a));
                }
            })
    }, [])

    function onChoose(a) {
        setChooseId(a);
    }

    useEffect(() =>{
        if (meeting != null) {
            inviteUser().then((b) => {
                console.log(b);
                setMembers([].concat(members, b.data.inviteUserToMeeting))
            })
        }
        if (blackStyle === "black") {
            toggleBlack();
        }
    }, [chooseId])


    return(

            <div className='meetingPage'>

                <div className={blackStyle} onClick={toggleBlack}>

                </div>

                <p onClick={clickOnName} className={meetingPageTextStyle} title={meeting.id}> {meeting.name}  </p>
                <input type="text" className={meetingPageTextChangeStyle} defaultValue={meeting.name} ></input>
                <input onClick={clickOnCancel} id="cancel" type="button" className={meetingPageTextChangeStyle} value=" Cancel "></input>
                <input onClick={editName} type="button" className={meetingPageTextChangeStyle} value=" Save "></input>

                <div className="meetingDiv">

                    <div className={inviteUserStyle}>
                        <p> Invite user to meeting </p>
                        <SearchUsers onChoose={onChoose} members={meeting.members ? meeting.members : []}></SearchUsers>
                    </div>

                    <div className="meeting">
                        <div className="meetingInfo">
                            <p className="meetingDateText"> { datePhrase } { date.toLocaleDateString() } </p>

                            <div className="meetingHr">
                                <hr></hr>    
                            </div>

                            <p className="meetingPlaceText"> {meeting.places ? meeting.places[0].name : ""} </p>
                            <div className='meetingPlace'>
                                <img className='meetingPlaceImg' src={placeImg} alt="place"></img>
                                <div className='meetingPlaceDesc'>                                
                                    <i> <p className='meetingPlaceTextContent'> Location: {meeting.places ? meeting.places[0].location.country : ""}, {meeting.places ? meeting.places[0].location.city : ""} </p> </i>   
                                    <i> <p className='meetingPlaceTextContent'> Paradigm: {meeting.places ? meeting.places[0].paradigm :  ""} </p> </i>         
                                    <i> <p className='meetingPlaceTextContent'> Rating: {meeting.places ? meeting.places[0].rating :  ""} </p> </i>
                                </div>
                            </div>

                            <div className="meetingHr">
                                <hr></hr>    
                            </div>

                            <div className="meetingMembersHeader">
                                <p className="meetingMembersText"> Members </p>
                                <input onClick={toggleInviteUser} type="button" className="meetingMembersInvite" value=" Invite "></input>
                            </div>

                            <div className='meetingMembers'>
                                {members.map((member) => <Member setDeleteId={setDeleteId} chief={meeting.chief} key={member.id} member={member}/>)}
                            </div>    

                        </div>

                    </div>

                    <div className='meetingChat'>
                        <div className='meetingMessages'>
                            {messages.map((message) => <MeetingMessage key={message.id} message={message}/>)}
                        </div>
                        <div className='meetingChatInput'>
                            <input id="messageInput" onChange={(e) => {setContent(e.target.value)}} placeholder='Wassup?'></input>
                            <i onClick={addMessage} className="fa fa-paper-plane" aria-hidden='true'></i>
                        </div>
                    </div>      

                </div>

            </div>

    )
}

export default Meeting;
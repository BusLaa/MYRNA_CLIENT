import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import "./Meeting.css";

import Member from '../MeetingMember/MeetingMember';
import SearchUsers from '../SearchUsers/SearchUsers';
import Chat from '../Chat/Chat';

import { gql } from 'graphql-request';

import placeImg from '../img/pizzakiosk.jpg';

function Meeting (props) {

    const [date, setDate] = useState(new Date());
    const [datePhrase, setDatePhrase] = useState("");

    let a = new Date();
    a.toISOString();
    
    const [meeting, setMeeting] = useState(null);
    const [members, setMembers] = useState([]);

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
        if (deleteId !== -1) {
            setMembers((members) => 
                members.filter((item) => item.id !== deleteId))
            setDeleteId(-1);
        }
    },[deleteId])


    useEffect(() => {
        if (meeting?.members != null) {
            setMembers(setMembersFast());           
        }
        let b = new Date(parseInt(meeting?.date));
        setDate(b);
        setDatePhrase("The meeting is going to happen on ");
    }, [meeting])

    function setMembersFast() {
        return members.concat(meeting?.members);
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
                    image {
                        id
                        path
                    }
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
                        avatar {
                            id
                            path
                        }
                    }
                    place {
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
        mutation InviteUserToMeeting {
            inviteUserToMeeting(meetingId: ${meeting?.id}, userId: ${chooseId}) {
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

    let query3 = gql`
        mutation CreateMeetingMessage {
            createMeetingMessage(meeting_id: ${meeting?.id}, author: ${localStorage.getItem("user_id")}, content: "${content}") {
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
        if (meeting) {
            inviteUser().then((b) => {
                setMembers([].concat(b.data.inviteUserToMeeting, members))
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
                <p onClick={clickOnName} className={meetingPageTextStyle} title={meeting?.id}> {meeting?.name}  </p>
                <input type="text" className={meetingPageTextChangeStyle} defaultValue={meeting?.name} ></input>
                <input onClick={clickOnCancel} id="cancel" type="button" className={meetingPageTextChangeStyle} value=" Cancel "></input>
                <input onClick={editName} type="button" className={meetingPageTextChangeStyle} value=" Save "></input>
                <div className="meetingDiv">
                    <div className={inviteUserStyle}>
                        <p> Invite user to meeting </p>
                        <SearchUsers onChoose={onChoose} meetingId={meeting?.id} members={meeting?.members || []}></SearchUsers>
                    </div>
                    <div className="meeting">
                        <div className="meetingInfo">
                            <p className="meetingDateText"> { datePhrase } { date.toLocaleDateString() } </p>
                            <div className="meetingHr">
                                <hr></hr>    
                            </div>
                            <p className="meetingPlaceText"> {meeting?.places || ""} </p>
                            <div className='meetingPlace'>
                                <img className='meetingPlaceImg' src={placeImg} alt="place"></img>
                                <div className='meetingPlaceDesc'>                                
                                    <i> <p className='meetingPlaceTextContent'> Location: {meeting?.place.location.country || "No data"}, {meeting?.place.location.city || ""} </p> </i>   
                                    <i> <p className='meetingPlaceTextContent'> Paradigm: {meeting?.place.paradigm || "No data"} </p> </i>         
                                    <i> <p className='meetingPlaceTextContent'> Rating: {meeting?.place.rating} </p> </i>
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
                                {members.sort((a,b) => a.chief && !b.chief ? 1 : -1).map((member) => <Member setDeleteId={setDeleteId} chief={meeting?.chief} key={member.id} member={member}/>)}
                            </div>    
                        </div>
                    </div>
                    <Chat messages={meeting?.messages} id={meeting?.id} type="meeting"/>    
                </div>
            </div>
    )
}

export default Meeting;
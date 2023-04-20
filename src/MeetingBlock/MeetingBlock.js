import React, {useEffect, useState} from 'react';
import { gql } from 'graphql-request';
import {Link} from 'react-router-dom';

import './MeetingBlock.css';

import DotsImg from '../img/dots.svg';

function MeetingBlock(props) {

    const [dotsMenuStyle, setDotsMenuStyle] = useState("hidden dotsMenu");
    const [hiddenMe, setHiddenMe] = useState("hidden dotsMenuButton");

    const [makeImportantText, SetMakeImportantText] = useState("");

    const [date, setDate] = useState(new Date());

    let query = gql`
        mutation DeleteMeeting {
            deleteMeeting(meetingId: ${props.meeting.id}, userId: ${localStorage.getItem("user_id")})
        }
    `;  

    let query2 = gql`
        mutation MakeImportant {
            makeImportant(meetingId: ${props.meeting.id}, userId: ${localStorage.getItem("user_id")})
        }
    `;  

function meetingBlockDots() {
    if (dotsMenuStyle !== "dotsMenu") {
        setHiddenMe("dotsMenuButton")
        setDotsMenuStyle("dotsMenu");
    } else {
        setDotsMenuStyle("hidden dotsMenu");
        setHiddenMe("hidden dotsMenuButton")
    }
}

function deleteMeeting() {
    try {
        return fetch(process.env.REACT_APP_SERVER_IP, {
            headers: {'Content-Type': 'application/json', 'verify-token': localStorage.getItem("token")},
            method: 'POST',
            body: JSON.stringify({"query": query})
        }).then((a) =>{
            return a.json()
        }).then((b) => {
            console.log(b.data)
            if (b.data.deleteMeeting) {
                props.setDeleteId(props.meeting.id);
            } 
            return b
        })
    } catch (err) {
        console.log(err)
    }         
}

function makeImportant() {
    try {
        return fetch(process.env.REACT_APP_SERVER_IP, {
            headers: {'Content-Type': 'application/json', 'verify-token': localStorage.getItem("token")},
            method: 'POST',
            body: JSON.stringify({"query": query2})
        }).then((a) =>{
            return a.json()
        }).then((b) => {
            console.log(b.data)
            if (!b.data.makeImportant) {
                SetMakeImportantText("Make Trivial ❕");
            } else {
                SetMakeImportantText("Make Important ❗");
            }
            return b
        })
    } catch (err) {
        console.log(err)
    }         
}

useEffect(() =>{

    console.log(props.meeting.important);
    if (props.meeting.important) {
        SetMakeImportantText("Make Trivial ❕");
    } else {
        SetMakeImportantText("Make Important ❗");
    }

    let b = new Date(parseInt(props.meeting.date));
    setDate(b);

}, [props.meeting.important, props.meeting.date]);


  return (

    <div className="meetingBlock" id={props.meeting.id}>
        <div className="meetingBlockTop">
            <Link to="/meeting" state={{ meetingId: props.meeting.id }} >
                <div className="meetingBlockName">
                    <p> {props.meeting.name} </p> 
                </div>
            </Link>
            <div className="meetingBlockDots">
                <p className='date'> { date.toLocaleDateString() } </p>
                <div style={{borderRight: "solid 0.1vw #E9E9E9", height: '30px'}}></div>
                <img onClick={meetingBlockDots} src={DotsImg} alt="settings"></img>
                <div className={dotsMenuStyle}>
                    <div onClick={makeImportant} className={hiddenMe}> {makeImportantText} </div>
                    <div onClick={deleteMeeting} className={hiddenMe}> Delete 🗑️ </div>
                </div>
            </div>
        </div>
    </div>  

  );

}

export default MeetingBlock;

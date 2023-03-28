import React, {useState, useEffect} from 'react';
import MeetingBlock from '../MeetingBlock/MeetingBlock';
import "./Meetings.css"

import { Link } from 'react-router-dom'

import { gql } from 'graphql-request';

function Meetings (props) {

    const [meetings, setMeetings] = useState([]);

    const [noMeetingsDivStyle, setNoMeetingsDivStyle] = useState("hidden noMeetingsDiv");
    const [yesMeetingsDivStyle, setYesMeetingsDivStyle] = useState("hidden yesMeetingsDiv")

    const [deleteId, setDeleteId] = useState(-1);

    useEffect(() => {
        if (deleteId != -1) {
            const newList = meetings.filter((item) => item.id !== deleteId);
            setMeetings(newList);    
            if (newList.length === 0) {
                setNoMeetingsDivStyle("noMeetingsDiv");
                setYesMeetingsDivStyle("hidden yesMeetingsDiv")                
            }
            setDeleteId(-1);
        }
    },[deleteId])
    
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
                    members {
                        id
                    }
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

    useEffect(() => {
        getData()
        .then((a) => {
            console.log(a.data.getUserById.meetings);
            if (a.data.getUserById.meetings == null || a.data.getUserById.meetings.length == 0) {
                setNoMeetingsDivStyle("noMeetingsDiv");
                setYesMeetingsDivStyle("hidden yesMeetingsDiv")
            } else {
                setMeetings(a.data.getUserById.meetings);
                setNoMeetingsDivStyle("hidden noMeetingsDiv");
                setYesMeetingsDivStyle("yesMeetingsDiv")
            }
        })
        
    }, [])

    return(

            <div className='meetingsPage'>

                <p className='meetingsPageText'> Meetings </p>

                <div className={yesMeetingsDivStyle}>
                    <Link to="/addMeeting"> <button> Create a Meeting </button> </Link>
                </div>

                <div className="meetingsPageMeetingsDiv">
                    <div className='meetingsPageMeetings'>
                        <div className={noMeetingsDivStyle}>
                            <p> There are no any meetings yet </p>
                            <Link to="/addMeeting"> <button> Create one </button> </Link>
                        </div>
                        {meetings.map((meeting) => <MeetingBlock setDeleteId={setDeleteId} key={meeting.id} meeting={meeting}/>)}
                    </div>
                </div>

            </div>

    )
}

export default Meetings;
import React, {useEffect, useState} from 'react';
import "./SearchUsers.css"

import { gql } from 'graphql-request';

import User from '../User/User';

function SearchUsers (props) {

    const [users, setUsers] = useState([]);
    const [searchString, setSearchString] = useState("");

    let query = gql`
        query GetUsersByName {
            getUsersByName(search: "${searchString}", excludeMeeting: ${props.meetingId || null}, excludeConversation: ${props.conversationId || null}) {
                id
                email
                firstName
                lastName
                avatar {
                    id
                    path
                }
            }
        }     
    `;

    async function getUsers() {
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
        if (searchString.length > 2) {
            getUsers().then((a) => {
                setUsers(a.data.getUsersByName);
            });            
        }
    }, [searchString])

    function onChoose2 () {
        setUsers([]);
        setSearchString("");
    }


    return(
        <div className='users'>
            <input onChange={(e) => setSearchString(e.target.value)} value={searchString} type="text" placeholder='Type to search'></input>
            <div style={{height: '300px', overflowX: 'hidden', overflowY: 'auto', scrollbarGutter: "stable"}}>
                {users.map((user) => <User onChoose2={onChoose2} onChoose={props.onChoose} key={user.id} user={user}/>)}
            </div>
        </div>
    )
}

export default SearchUsers;
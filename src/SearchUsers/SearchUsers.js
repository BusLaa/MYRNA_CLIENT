import React, {useEffect, useState} from 'react';
import "./SearchUsers.css"

import { gql } from 'graphql-request';

import User from '../User/User';

import avatar1 from '../img/avatars/avatar1.jpg';
import avatar2 from '../img/avatars/avatar2.jpg';
import avatar3 from '../img/avatars/avatar3.jpg';
import avatar4 from '../img/avatars/avatar4.jpg';
import avatar5 from '../img/avatars/avatar5.jpg';
import avatar6 from '../img/avatars/avatar6.jpg';

//import {Link, useResolvedPath} from 'react-router-dom';

function SearchUsers (props) {

    const [avatars, setAvatars] = useState([avatar1, avatar2, avatar3, avatar4, avatar5, avatar6]);

    const [users, setUsers] = useState([]);
    //const [members, setMembers] = useState(props.members || []);

    const [searchString, setSearchString] = useState("");

    let query = gql`
        query GetUsersByName {
            getUsersByName(search: "${searchString}") {
                id
                email
                firstName
                lastName
                avatar
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
                setUsers((users) => [...users, a.data.getUsersByName]);
                //console.log(a.data.getUsersByName);
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

//{/* <img src={avatars[props.member.avatar]}></img>
//<Link to="/profile" state={{ userId: 1 }} > <p> Georg </p> </Link> */}
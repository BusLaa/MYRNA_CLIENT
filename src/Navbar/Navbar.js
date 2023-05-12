import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {gql} from 'graphql-request';

import userImg from '../img/user.svg';
import homeImg from '../img/home.svg';
import conversationImg from '../img/conversations.svg';
import mapImg from '../img/map.svg';
import meetingsImg from '../img/meetings.svg';
import burgerImg from '../img/burger.svg'
import notifyImg from '../img/bell.svg'
import addPostImg from '../img/addpost.svg'

import "./Navbar.css";

function Navbar (props) {

    const [hidden, setHidden] = useState("hidden");

    let query = gql`
        query GetUserById {
            getUserById(id: ${localStorage.getItem("user_id")}) {
                roles
            }
        }
    `;

    async function getData() {
        try {
            if (localStorage.getItem("user_id") == null) return;
            return await fetch(process.env.REACT_APP_SERVER_IP, {
                headers: {'Content-Type': 'application/json', 'verify-token': localStorage.getItem("token")},
                method: 'POST',
                body: JSON.stringify({"query": query})
            }).then((a) =>{
                return a.json();
            }).then((b) => {
                return b;
            })
        } catch (err) {
            console.log(err)
        }       
    }

    useEffect(() => {
        getData().then((a) => {
            if (a.data.getUserById.roles.indexOf('USER') === -1) {
                setHidden("hidden");
            } else {
                setHidden("");
            }
        });
    }, [])

    let notifyOnClick = () => {
        props.setNotify(true)
        props.setNotifyText("No notifications yet!");
    }

    let loginOnClick = () =>{
        window.history.replaceState({}, document.title);
        getData().then((a) =>{
            try {
                if (a.data.getUserById.roles.indexOf('USER') === -1) {
                    window.location.href = "http://localhost:3000/login";
                } else {
                    window.location.href = "http://localhost:3000/profile"
                }                
            } catch(e) {
                window.location.href = "http://localhost:3000/login";
            }
        });
    }

    return(

        <nav className="navbar">
            <div className="navbar-mobile">
                <div>
                    <img src={burgerImg} alt="navBar"></img>
                </div>       
            </div>
            <div className="navbar-left">
                <div>
                    <img src={homeImg} alt="home"></img> <Link className="navlink" to="/allPosts"> Home </Link>
                </div>
                <div className={hidden}>
                    <img src={conversationImg} alt="conversation"></img> <Link className="navlink" to="/conversations"> Messenger </Link>
                </div>
                <div className={hidden}>
                    <img src={meetingsImg} alt="meetings"></img> <Link className="navlink" to="/meetings"> Meetings </Link>
                </div>
                <div className={hidden}>
                    <img style={{width: '16px'}} src={mapImg} alt="map"></img> <Link className="navlink" to="/map"> Places </Link>
                </div>
            </div>

            <div className="navbar-right">
                <div className={hidden}>
                    <Link className="navlink" to="/addPost"> <img src={addPostImg} alt="addPost"></img> </Link>
                </div>       
                <div className={hidden} onClick={notifyOnClick}>
                    <img src={notifyImg} alt="notify"></img>
                </div>
                <div onClick={loginOnClick}>
                    <img src={userImg} alt="user"></img>
                </div>
            </div>
        </nav>

    )
}

export default Navbar;
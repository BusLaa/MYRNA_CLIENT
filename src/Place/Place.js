import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { gql } from 'graphql-request';

import "./Place.css";

import stockAvatar from '../img/avatars/avatar1.jpg';

import Post from '../Post/Post';

function Place () {

    const [avatar, setAvatar] = useState(stockAvatar);

    const [place, setPlace] = useState({});

    const location = useLocation();
    const [state, ] = useState(location.state || localStorage.getItem("state"));

    const [subscribeStyle, setSubscribeStyle] = useState("");
    const [subsribeText, setSubsribeText] = useState("Subscribe");

    const [userPosts, setUserPosts] = useState([]);

    const [deleteId, setDeleteId] = useState(0);

    useEffect(() => {
        if (deleteId !== -1) {
            const newList = userPosts.filter((item) => item.id !== deleteId);
            setUserPosts(newList);    
            setDeleteId(-1);
        }
    },[deleteId])


    useEffect(() => {
        console.log(state);
        getData().then((a) => {
            a = a.data.getAllPlaces;
            if (a === 0) {
                return;
            } else {
                setPlace(setPlaceFast(a));
                getData2().then((b) => {
                    b = b.data.getUserById.placeSubscriptions;
                    if (b.length === 0) {
                        setSubsribeText("Subscribe");
                        setSubscribeStyle("");  
                    } else {
                        if (b.find((x) => x.id === state.placeId)) {
                            setSubsribeText("Unsubscribe");
                            setSubscribeStyle("backGrey");                        
                        } else {
                            setSubsribeText("Subscribe");
                            setSubscribeStyle("");  
                        }                               
                    }   
                });
            }
        });
        
    }, [state]);

    useEffect(() => {
        if (place?.images) {
            setAvatar(process.env.REACT_APP_SERVER_IP + "static/" + place.images[0].path);
        }
    }, [place]);

    function setPlaceFast(a) {
        return a.find((x) => x.id === state.placeId);
    }

    let query = gql`
        query GetAllPlaces {
            getAllPlaces {
                id
                images {
                    id
                    path
                }
                location {
                    city
                    country
                    details
                    id
                    latitude
                    longitude
                    postalCode
                }
                name
                paradigm
                rating
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
                return a.json();
            }).then((b) => { 
                return b;
            })
        } catch (err) {
            console.log(err);
        }       
    }

    async function getData2() {
        try {
            return await fetch(process.env.REACT_APP_SERVER_IP, {
                headers: {'Content-Type': 'application/json', 'verify-token': localStorage.getItem("token")},
                method: 'POST',
                body: JSON.stringify({"query": query3})
            }).then((a) =>{
                return a.json();
            }).then((b) => { 
                return b;
            })
        } catch (err) {
            console.log(err);
        }       
    }


    let query2 = gql`
        mutation AddNewPlaceSubscription {
            addNewPlaceSubscription(userId: ${localStorage.getItem("user_id")}, placeId: ${state.placeId})
        }
    `;

    async function subsribe() {
        try {
            return await fetch(process.env.REACT_APP_SERVER_IP, {
                headers: {'Content-Type': 'application/json', 'verify-token': localStorage.getItem("token")},
                method: 'POST',
                body: JSON.stringify({"query": query2})
            }).then((a) =>{
                return a.json()
            }).then((b) => {
                if (b.data.addNewPlaceSubscription) {
                    setSubsribeText("Unsubscribe");
                    setSubscribeStyle("backGrey");
                } else {
                    setSubsribeText("Subscribe");
                    setSubscribeStyle("");
                }
                return b
            })
        } catch (err) {
            console.log(err)
        } 
    }

    let query3 = gql`
        query GetUserById {
            getUserById(id: ${localStorage.getItem("user_id")}) {
                id
                placeSubscriptions {
                    id
                }
            }
        }
    `;

    return(
        <div className='profilePage slide'>
            <div className="profileDiv">
                <div className="profile">
                    <p className="profileName" title={place?.id}> {place?.name} </p>
                    <div className="profileInfo">
                        <img className="avatar" src={avatar} alt="avatar"></img>
                        <div>
                            <p className="userInfo"> Paradigm: { place?.paradigm }</p>
                            <p className="userInfo"> Location: { place?.location?.country }, { place?.location?.city } </p> 
                            <p className="userInfo"> Rating: { place?.rating } / 5 </p>             
                        </div>               
                    </div>
                    {/* <input type="button" onClick={logout} value="Logout"></input>
                    <input type="button" onClick={goToEditUser} value="Edit"></input> */}
                    <input className={subscribeStyle} type="button" onClick={subsribe} value={subsribeText}></input>
                </div>
            </div>
            <div className='profileUserPostsDiv'>
                <div className="profileUserPosts">
                    {userPosts?.map((post) => <Post setDeleteId={setDeleteId} key={post.id} post={post}/>)}
                </div>
            </div>
        </div>
    )
}

export default Place;
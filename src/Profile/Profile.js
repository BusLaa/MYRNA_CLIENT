import React, {useState, useEffect} from 'react';
import { useLocation, Link } from 'react-router-dom'

import "./Profile.css"

import { gql } from 'graphql-request';

import Post from '../Post/Post';

import avatar1 from '../img/avatars/avatar1.jpg';
import avatar2 from '../img/avatars/avatar2.jpg';
import avatar3 from '../img/avatars/avatar3.jpg';
import avatar4 from '../img/avatars/avatar4.jpg';
import avatar5 from '../img/avatars/avatar5.jpg';
import avatar6 from '../img/avatars/avatar6.jpg';

function Profile (props) {

    const [avatars, setAvatars] = useState([avatar1, avatar2, avatar3, avatar4, avatar5, avatar6]);

    const [user, setUser] = useState({});
    const [userPosts, setUserPosts] = useState([]);

    const [birthday, setBirthday] = useState(new Date());
    const [location, setLocation] = useState({});

    const [birthdayStyle, setBirthdayStyle] = useState("userInfo hidden");
    const [locationStyle, setLocationStyle] = useState("userInfo hidden");

    const [userPostsStyle, setUserPostsStyle] = useState("profileUserPosts");
    const [userCornerStyle, setUserCornerStyle] = useState("profileUserCorner hidden");
    
    const [profileTumblerPostsStyle, setProfileTumblerPostsStyle] = useState("profileTumblerPosts blue");
    const [profileTumblerCornerStyle, setProfileTumblerCornerStyle] = useState("profileTumblerCorner");

    const [subsribeText, setSubsribeText] = useState("Subscribe");

    const loc = useLocation();

    let a = new Date();
    a.toISOString();

    const [state, setState] = useState(loc.state || {userId: localStorage.getItem("user_id")});

    const [hiddenMe, setHiddenMe] = useState("");
    const [hiddenSub, setHiddenSub] = useState("hidden");
    const [subscribeStyle, setSubscribeStyle] = useState("hidden");

    const [deleteId, setDeleteId] = useState(0);

    useEffect(() => {
        if (deleteId != -1) {
            const newList = userPosts.filter((item) => item.id !== deleteId);
            setUserPosts(newList);    
            setDeleteId(-1);
        }
    },[deleteId])


    let query = gql`
        query GetUserById {
            getUserById(id: ${state.userId}) {
                id
                firstName
                lastName
                birthday
                subscribed {
                    id                    
                }
                location {
                    id
                    city
                    country
                    postalCode
                }
                avatar
                posts {
                    id
                    header
                    content
                    author {
                        id
                        firstName
                        lastName
                        avatar
                    }
                    comments {
                        id
                        content
                        author {
                            id
                            firstName
                            lastName
                            avatar
                        }
                    }
                    likes
                }
            }
        }
    `;

    let query2 = gql`
        mutation AddNewSubscription {
            addNewSubscription(user_id: 2, subscribed_id: 1)
        }
        `;

    async function getUser() {
        try {
            return await fetch(process.env.REACT_APP_SERVER_IP, {
                headers: {'Content-Type': 'application/json', 'verify-token': localStorage.getItem("token")},
                method: 'POST',
                body: JSON.stringify({"query": query})
            }).then((a) =>{
                console.log(a);
                return a.json()
            }).then((b) => {
                console.log(b);
                return b
            })
        } catch (err) {
            console.log(err)
        }       
    }

    function logout() {
        localStorage.removeItem("user_id");
        localStorage.removeItem("token");
        window.location.href = "http://localhost:3000/login";
    }

    useEffect(() =>{
        //window.history.replaceState({}, document.title);
        getUser()
            .then((b) => {
                let a = b.data.getUserById;
                if (a.length === 0) {
                    window.location.href = "http://localhost:3000/login";
                } else {
                    setUser(a);
                                        
                    setUserPosts([].concat([], a.posts));

                    if (a.id == localStorage.getItem("user_id")) {
                        setHiddenMe("");
                        setHiddenSub("hidden");
                        setSubscribeStyle("hidden");
                    } else {
                        setHiddenMe("hidden");
                        setHiddenSub("");
                        if (a.subscribed.length == 0) {
                            setSubsribeText("Subscribe");
                            setSubscribeStyle("");  
                        } else {
                            if (a.subscribed.find((x) => x.id == localStorage.getItem("user_id")).id == localStorage.getItem("user_id")) {
                                setSubsribeText("Unsubscribe");
                                setSubscribeStyle("backGrey");                        
                            } else {
                                setSubsribeText("Subscribe");
                                setSubscribeStyle("");  
                            }                               
                        }              
                    }

                    if (a.birthday == null) {
                        setBirthdayStyle("userInfo hidden");  
                    } else {
                        let b = new Date(parseInt(a.birthday));
                        setBirthday(b);            
                        setBirthdayStyle("userInfo");            
                    }

                    if (a.location == null) {
                        setLocationStyle("userInfo hidden");  
                    } else {      
                        setLocation(a.location);
                        setLocationStyle("userInfo");            
                    }

                }
            })
        
    }, [])


    async function subsribe() {
        try {
            return await fetch(process.env.REACT_APP_SERVER_IP, {
                headers: {'Content-Type': 'application/json', 'verify-token': localStorage.getItem("token")},
                method: 'POST',
                body: JSON.stringify({"query": query2})
            }).then((a) =>{
                return a.json()
            }).then((b) => {
                if (b.data.addNewSubscription) {
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

    function editProfile() {
    }

    function enablePosts() {
        if (profileTumblerPostsStyle == "profileTumblerPosts") {

            setProfileTumblerPostsStyle("profileTumblerPosts blue");
            setUserPostsStyle("profileUserPosts");

            setProfileTumblerCornerStyle("profileTumblerCorner");
            setUserCornerStyle("profileUserCorner hidden");

        }
    }

    function enableCorner() {
        if (profileTumblerCornerStyle == "profileTumblerCorner") {

            setProfileTumblerCornerStyle("profileTumblerCorner blue");
            setUserCornerStyle("profileUserCorner");

            setProfileTumblerPostsStyle("profileTumblerPosts");
            setUserPostsStyle("profileUserPosts hidden");

        }
    }

    return(

            <div className='profilePage'>

                <p className='profilePageText'> Profile </p>

                <div className="profileDiv">

                    <div className="profile">
                        <p className="name" title={user.id}> {user.first_name} {user.last_name} </p>
                        <div className="profileInfo">
                            <img className="avatar" src={avatars[user.avatar]}></img>
                            <div>
                                <p className={birthdayStyle}> Birthday: { birthday.toLocaleDateString() }</p>
                                <p className={locationStyle}> Location: { location.country }, {location.city} </p>             
                            </div>               
                        </div>
                        <input className={hiddenMe} type="button" onClick={logout} value="Logout"></input>
                        <input className={hiddenMe} type="button" onClick={editProfile} value="Edit"></input>
                        <input className={subscribeStyle} type="button" onClick={subsribe} value={subsribeText}></input>
                    </div>

                </div>

                <div className='profileTumblerDiv'>
                    <div className='profileTumbler'>
                        <div onClick={enablePosts} className={profileTumblerPostsStyle}>
                            <p> Posts 📄 </p>
                        </div>
                        <div style={{borderRight: "solid 0.1vw #E9E9E9", height: '30px'}}></div>
                        <div onClick={enableCorner} className={profileTumblerCornerStyle}>
                            <p> Corner ⭐ </p>
                        </div>
                    </div>
                </div>
                
                <div className='profileUserPostsDiv'>
                    <div className={userPostsStyle}>
                        {userPosts.map((post) => <Post setDeleteId={setDeleteId} key={post.id} post={post}/>)}
                    </div>
                </div>

                <div className='profileUserCornerDiv'>
                    <div className={userCornerStyle}>
                        
                    </div>
                </div>

            </div>

    )
}

export default Profile;
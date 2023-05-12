import React, {useState, useEffect} from 'react';
import { useLocation} from 'react-router-dom'

import "./Profile.css"

import { gql } from 'graphql-request';

import Post from '../Post/Post';

import stockAvatar from '../img/avatars/avatar1.jpg';

function Profile (props) {

    const [avatar, setAvatar] = useState(stockAvatar);

    const [user, setUser] = useState({});

    useEffect(() => {
        if (user.avatar) {
            setAvatar(process.env.REACT_APP_SERVER_IP + "static/" + user.avatar.path)
        }
    }, [user]);


    const [userPosts, setUserPosts] = useState([]);
    const [userCorner, setUserCorner] = useState([]);

    const [birthday, setBirthday] = useState(new Date());
    const [location, setLocation] = useState({});

    const [birthdayStyle, setBirthdayStyle] = useState("userInfo hidden");
    const [locationStyle, setLocationStyle] = useState("userInfo hidden");

    const [userPostsStyle, setUserPostsStyle] = useState("profileUserPosts");
    const [userCornerStyle, setUserCornerStyle] = useState("profileUserCorner hidden");
    
    const [profileTumblerStyle, setProfileTumblerStyle] = useState("hidden");
    const [profileTumblerPostsStyle, setProfileTumblerPostsStyle] = useState("profileTumblerPosts blue");
    const [profileTumblerCornerStyle, setProfileTumblerCornerStyle] = useState("profileTumblerCorner");

    const [subsribeText, setSubsribeText] = useState("Subscribe");

    const loc = useLocation();

    let a = new Date();
    a.toISOString();

    const [state, ] = useState(loc.state || {userId: localStorage.getItem("user_id")});

    const [hiddenMe, setHiddenMe] = useState("");
    const [hiddenSub, setHiddenSub] = useState("hidden");
    const [subscribeStyle, setSubscribeStyle] = useState("hidden");

    const [deleteId, setDeleteId] = useState(0);

    useEffect(() => {
        if (deleteId !== -1) {
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
                corner {
                    posts {
                        id
                        header
                        isLiked
                        isCornered
                        content
                        images {
                            id 
                            path
                        }
                        author {
                            id
                            firstName
                            lastName
                            avatar {
                                id
                                path
                            }
                        }
                        comments {
                            id
                            content
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
                        likes
                    }
                }
                avatar {
                    id
                    path
                }
                subscribed {
                    id                    
                }
                location {
                    id
                    city
                    country
                    postalCode
                }
                posts {
                    id
                    header
                    content
                    isLiked
                    images {
                        id 
                        path
                    }
                    author {
                        id
                        firstName
                        lastName
                        avatar {
                            id
                            path
                        }
                    }
                    comments {
                        id
                        content
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
                    likes
                }
            }
        }
    `;

    let query2 = gql`
        mutation AddNewSubscription {
            addNewSubscription(userId: ${localStorage.getItem("user_id")}, subscribedId: ${state.userId})
        }
    `;

    async function getUser() {
        try {
            return await fetch(process.env.REACT_APP_SERVER_IP, {
                headers: {'Content-Type': 'application/json', 'verify-token': localStorage.getItem("token")},
                method: 'POST',
                body: JSON.stringify({"query": query})
            }).then((a) =>{
                return a.json()
            }).then((b) => {
                console.log(b.data.getUserById.corner);
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
        getUser()
            .then((b) => {
                let a = b.data.getUserById;
                if (a.length === 0) {
                    window.location.href = "http://localhost:3000/login";
                } else {
                    setUser(a);           
                    console.log(a.posts);                      
                    setUserPosts(a.posts);
                    setUserCorner(a.corner.posts);
                    if (a.id === parseInt(localStorage.getItem("user_id"))) {
                        setHiddenMe("");
                        setHiddenSub("hidden");
                        setSubscribeStyle("hidden");    
                        setProfileTumblerStyle("profileTumblerDiv")             
                    } else {
                        setHiddenMe("hidden");
                        setHiddenSub("");
                        if (a.subscribed.length === 0) {
                            setSubsribeText("Subscribe");
                            setSubscribeStyle("");  
                        } else {
                            if (a.subscribed.find((x) => x.id === parseInt(localStorage.getItem("user_id"))).id === parseInt(localStorage.getItem("user_id"))) {
                                setSubsribeText("Unsubscribe");
                                setSubscribeStyle("backGrey");                        
                            } else {
                                setSubsribeText("Subscribe");
                                setSubscribeStyle("");  
                            }                               
                        }              
                    }

                    if (!a.birthday) {
                        setBirthdayStyle("userInfo hidden");  
                    } else {
                        let b = new Date(parseInt(a.birthday));
                        setBirthday(b);            
                        setBirthdayStyle("userInfo");            
                    }

                    if (!a.location) {
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
        if (profileTumblerPostsStyle === "profileTumblerPosts") {

            setProfileTumblerPostsStyle("profileTumblerPosts blue");
            setUserPostsStyle("profileUserPosts");

            setProfileTumblerCornerStyle("profileTumblerCorner");
            setUserCornerStyle("profileUserCorner hidden");

        }
    }

    function enableCorner() {
        if (profileTumblerCornerStyle === "profileTumblerCorner") {

            setProfileTumblerCornerStyle("profileTumblerCorner blue");
            setUserCornerStyle("profileUserCorner");

            setProfileTumblerPostsStyle("profileTumblerPosts");
            setUserPostsStyle("profileUserPosts hidden");

        }
    }

    return(

            <div className='profilePage slide'>

                <div className="profileDiv">

                    <div className="profile">
                        <p className="profileName" title={user.id}> {user.firstName} {user.lastName} </p>
                        <div className="profileInfo">
                            <img className="avatar" src={avatar} alt="avatar"></img>
                            <div>
                                <p className={birthdayStyle}> Birthday: { birthday.toLocaleDateString() }</p>
                                <p className={locationStyle}> Location: { location.country }, {location.city} </p>             
                            </div>               
                        </div>
                        <input className={hiddenMe} type="button" onClick={logout} value="Logout"></input>
                        {/* <input className={hiddenMe} type="button" onClick={editProfile} value="Edit"></input> */}
                        <input className={subscribeStyle} type="button" onClick={subsribe} value={subsribeText}></input>
                    </div>

                </div>

                <div className={profileTumblerStyle}>
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
                        {userPosts?.map((post) => <Post setDeleteId={setDeleteId} key={post.id} post={post}/>)}
                    </div>
                </div>

                <div className='profileUserCornerDiv'>
                    <div className={userCornerStyle}>
                        {userCorner?.map((post) => <Post setDeleteId={setDeleteId} key={post.id} post={post}/>)}
                    </div>
                </div>

            </div>

    )
}

export default Profile;
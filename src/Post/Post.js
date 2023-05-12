import React, {useEffect, useState} from 'react';
import Comment from '../Comment/Comment'
import { gql } from 'graphql-request';

import './Post.css';

import {Link} from 'react-router-dom';

import DotsImg from '../img/dots.svg'
import PacmanImg from '../img/pacman.svg'

import stockAvatar from '../img/avatars/avatar1.jpg';

function Post(props) {

    const [avatar, setAvatar] = useState(stockAvatar);

    const [addToCornerText, setAddToCornerText] = useState("");

    useEffect(() => {
        if (props.post.author.avatar) {
            setAvatar(process.env.REACT_APP_SERVER_IP + "static/" + props.post.author.avatar.path)
        }
    }, [props.post]);

    const [comments, setComments] = useState(props.post.comments)

    const [content, setContent] = useState("");
    
    const [like, setLike] = useState(props.post.likes);
    const [likeTitle, setLikeTitle] = useState(props.post.likes);
    const [likeStyle, setLikeStyle] = useState("");

    const [dotsMenuStyle, setDotsMenuStyle] = useState("hidden dotsMenu");

    const [hiddenMe, setHiddenMe] = useState("hidden dotsMenuButton");
    const [hiddenSub, setHiddenSub] = useState("hidden dotsMenuButton");

    const [deleteId, setDeleteId] = useState(0);

    useEffect(() => {
        if (deleteId !== -1) {
            const newList = comments.filter((item) => item.id !== deleteId);
            setComments(newList);    
            setDeleteId(-1);
        }
    },[deleteId]);

    useEffect(() => {
        if (likeTitle > 999) {
            setLike(likeTitle & 1000 + "k");
        } else {
            setLike(likeTitle);
        }
    }, [likeTitle]);

    useEffect(() => {
        if (props.post.isLiked) {
            setLikeStyle("blue");
        } else {
            setLikeStyle("");
        }
        if (props.post.isCornered) {
            setAddToCornerText("Throw out of corner 👋");
        } else {
            setAddToCornerText("Add to corner ⭐");
        }    
    }, [])

    let query = gql`
        mutation AddNewComment {
            addNewComment(userId: ${localStorage.getItem("user_id")}, postId: ${props.post.id}, content: "${content}") {
            id
            author {
                id
                firstName
                lastName
                avatar {
                    id
                    path
                }
            }
            content
            }
        }  
    `;  

    let query2 = gql`
        mutation LikePost {
            likePost(userId: ${localStorage.getItem("user_id")}, postId: ${props.post.id})
        }
    `; 

    let query3 = gql`
        mutation DeletePost {
            deletePost(postId: ${props.post.id})
        }
    `; 

    let query4 = gql`
        mutation AddPostToCorner {
            addPostToCorner(postId: ${props.post.id}, userId: ${localStorage.getItem("user_id")})
        }
    `; 

    function addComment(e) {
        e.preventDefault();
        try {
            setContent(content.trim());
            if (content == null || content === "" || content.slice(0,1) === " ") return;
            return fetch(process.env.REACT_APP_SERVER_IP, {
                headers: {'Content-Type': 'application/json', 'verify-token': localStorage.getItem("token")},
                method: 'POST',
                body: JSON.stringify({"query": query})
            }).then((a) =>{
                return a.json()
            }).then((b) => {
                setComments([].concat(comments, b.data.addNewComment))
                document.getElementById("commentInput").value = "";
                setContent("");
                return b
            })
        } catch (err) {
            console.log(err)
        } 
    }

    function likePost() { 
        try {
            return fetch(process.env.REACT_APP_SERVER_IP, {
                headers: {'Content-Type': 'application/json', 'verify-token': localStorage.getItem("token")},
                method: 'POST',
                body: JSON.stringify({"query": query2})
            }).then((a) =>{
                return a.json()
            }).then((b) => {
                if(typeof b.data.likePost !== 'boolean') throw new Error("likePost returned not boolean")
                if (b.data.likePost) {
                    setLikeStyle("blue");
                    setLikeTitle(likeTitle + 1);
                } else {
                    setLikeStyle("");   
                    setLikeTitle(likeTitle - 1);       
                }
            })     
        } catch (err) {
            console.log(err)
        }
    }
    
    function addToCorner() {
        try {
            return fetch(process.env.REACT_APP_SERVER_IP, {
                headers: {'Content-Type': 'application/json', 'verify-token': localStorage.getItem("token")},
                method: 'POST',
                body: JSON.stringify({"query": query4})
            }).then((a) =>{
                return a.json();
            }).then((b) => {
                if (b.data.addPostToCorner) {
                    setAddToCornerText("Throw out of corner 👋");
                } else {
                    setAddToCornerText("Add to corner ⭐");
                }
                return b
            })
        } catch (err) {
            console.log(err)
        }         
    }

    function postDots() {
        if (dotsMenuStyle !== "dotsMenu") {
            if (props.post.author.id === parseInt(localStorage.getItem("user_id"))) {
                setHiddenMe("dotsMenuButton");
                setHiddenSub("hidden dotsMenuButton")
            } else {
                setHiddenMe("hidden dotsMenuButton");
                setHiddenSub("dotsMenuButton")
            }
            setDotsMenuStyle("dotsMenu");
        } else {
            setDotsMenuStyle("hidden dotsMenu");
        }
    }

    function deletePost() {
        try {
            return fetch(process.env.REACT_APP_SERVER_IP, {
                headers: {'Content-Type': 'application/json', 'verify-token': localStorage.getItem("token")},
                method: 'POST',
                body: JSON.stringify({"query": query3})
            }).then((a) =>{
                return a.json()
            }).then((b) => {
                if (b.data.deletePost) {
                    props.setDeleteId(props.post.id)
                }
                return b
            })
        } catch (err) {
            console.log(err)
        }         
    }

    function watchImage(e) {
        if (!e.target.classList.contains('watchPhoto')) {
            disableScroll();
            e.target.classList.add('watchPhoto');
            document.body.setAttribute('style', 'overflow: hidden');
            document.querySelector('.watchPhotoBack').classList.remove('hidden');
            document.querySelector('.watchPhotoBack').setAttribute('style', 'opacity: 100%');
        } else {
            enableScroll();
            document.querySelector('.watchPhotoBack').classList.add("hidden");
            e.target.classList.remove('watchPhoto');
            document.body.setAttribute('style', 'overflow: auto');
            document.querySelector('.watchPhotoBack').setAttribute('style', 'opacity: 0%');
        }
    }

    var keys = {37: 1, 38: 1, 39: 1, 40: 1};

    function preventDefault(e) {
        e.preventDefault();
    }

    function preventDefaultForScrollKeys(e) {
        if (keys[e.keyCode]) {
            preventDefault(e);
            return false;
        }
    }

    var supportsPassive = false;
    try {
        window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
          get: function () { supportsPassive = true; return 0; } 
        }));
      } catch(e) {}

    var wheelOpt = supportsPassive ? { passive: false } : false;
    var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

    function disableScroll() {
        window.addEventListener('DOMMouseScroll', preventDefault, false); 
        window.addEventListener(wheelEvent, preventDefault, wheelOpt); 
        window.addEventListener('touchmove', preventDefault, wheelOpt); 
        window.addEventListener('keydown', preventDefaultForScrollKeys, false);
    }
      
    function enableScroll() {
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
        window.removeEventListener(wheelEvent, preventDefault, wheelOpt); 
        window.removeEventListener('touchmove', preventDefault, wheelOpt);
        window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
    }

  return (

    <div className="post" id={props.post.id}>
        <div className="postTop">
            <div className="postAuthor">
                <Link to="/profile" state={{ userId: props.post.author.id }} >
                <img src={avatar} alt="avatar"></img>
                <p> {props.post.author.firstName} </p> 
                <p> {props.post.author.lastName} </p>
                </Link>
            </div>
            <div className="postDots">
                <img alt="settings" onClick={postDots} src={DotsImg}></img>
                <div className={dotsMenuStyle}>
                    <div onClick={addToCorner} className={hiddenSub}> {addToCornerText} </div>
                    {/* <div className={hiddenSub}> Compain 😠 </div> */}
                    <div onClick={deletePost} className={hiddenMe}> Delete 🗑️ </div>
                </div>
            </div>
        </div>
        <div className="postHr">
            <hr></hr>    
        </div>
        <div className="postHeader">
            <p> {props.post.header} </p>
        </div>
        <div className="postContent">
            <p> {props.post.content} </p>
        </div>
        <div className="postImages">
            <div className='watchPhotoBack slide hidden'></div>
            {props.post.images.map((image) => <img className='postImagesImage' onClick={(e) => {watchImage(e)}} key={image.id} src={process.env.REACT_APP_SERVER_IP + "static/" + image.path} alt="suka"></img>)}
        </div>  
        <div className="postLike">
            <img className={likeStyle} onClick={likePost} src={PacmanImg} alt="Like"></img>
            <p title={likeTitle} className={likeStyle}> {like} </p>
        </div>
        <div className="postComments">
            {comments.map((comment) => <Comment setDeleteId={setDeleteId} key={comment.id} comment={comment}/>)}
        </div>
        <div className="postComment">
            <input id="commentInput" onChange={(e) => {setContent(e.target.value)}} className='inputcont' placeholder='Express your opinion' type="text"></input>
            <i onClick={addComment} className="fa fa-paper-plane" aria-hidden='true'></i>
        </div>
    </div>

  );
}

export default Post;

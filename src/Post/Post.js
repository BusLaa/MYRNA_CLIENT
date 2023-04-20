import React, {useEffect, useState} from 'react';
import Comment from '../Comment/Comment'
import { gql } from 'graphql-request';

import './Post.css';

import {Link} from 'react-router-dom';

import DotsImg from '../img/dots.svg'
import PacmanImg from '../img/pacman.svg'

import avatar1 from '../img/avatars/avatar1.jpg';
import avatar2 from '../img/avatars/avatar2.jpg';
import avatar3 from '../img/avatars/avatar3.jpg';
import avatar4 from '../img/avatars/avatar4.jpg';
import avatar5 from '../img/avatars/avatar5.jpg';
import avatar6 from '../img/avatars/avatar6.jpg';

function Post(props) {

    const [avatars, setAvatars] = useState([avatar1, avatar2, avatar3, avatar4, avatar5, avatar6]);

    const [comments, setComments] = useState(props.post.comments)

    const [content, setContent] = useState("");

    const [like, setLike] = useState(props.post.likes);
    const [likeStyle, setLikeStyle] = useState("");

    const [dotsMenuStyle, setDotsMenuStyle] = useState("hidden dotsMenu");

    const [hiddenMe, setHiddenMe] = useState("hidden dotsMenuButton");
    const [hiddenSub, setHiddenSub] = useState("hidden dotsMenuButton");

    const [deleteId, setDeleteId] = useState(0);

    useEffect(() => {
        if (deleteId != -1) {
            const newList = comments.filter((item) => item.id !== deleteId);
            setComments(newList);    
            setDeleteId(-1);
        }
    },[deleteId]);


    let query = gql`
        mutation AddNewComment {
            addNewComment(userId: ${localStorage.getItem("user_id")}, postId: ${props.post.id}, content: "${content}") {
            id
            author {
                id
                firstName
                lastName
                avatar
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
        query Query {
            isPostLikedByUser(postId: ${props.post.id}, userId: ${localStorage.getItem("user_id")})
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
                console.log(comments)
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
                    setLike(like + 1);
                } else {
                    setLikeStyle("");   
                    setLike(like - 1);           
                }
            })     
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() =>{
        setLikeStyleOnSetup().then((a) => {
            if (a.data.isPostLikedByUser) {
                setLikeStyle("blue");
            } else {
                setLikeStyle("");                    
            }
        })
    }, [])

    function setLikeStyleOnSetup() {
        try {
            return fetch(process.env.REACT_APP_SERVER_IP, {
                headers: {'Content-Type': 'application/json', 'verify-token': localStorage.getItem("token")},
                method: 'POST',
                body: JSON.stringify({"query": query4})
            }).then((a) =>{
                return a.json()
            }).then((b) => {
                return b
            })     
        } catch (err) {
            console.log(err)
        }       
    }

    function postDots() {
        if (dotsMenuStyle !== "dotsMenu") {
            if (props.post.author.id === localStorage.getItem("user_id")) {
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

  return (

    <div className="post" id={props.post.id}>
        <div className="postTop">
            <div className="postAuthor">
                <Link to="/profile" state={{ userId: props.post.author.id }} >
                <img src={avatars[props.post.author.avatar]}></img>
                <p> {props.post.author.firstName} </p> 
                <p> {props.post.author.lastName} </p>
                </Link>
            </div>
            <div className="postDots">
                <img onClick={postDots} src={DotsImg}></img>
                <div className={dotsMenuStyle}>
                    <div className={hiddenSub}> Add to corner ⭐</div>
                    <div className={hiddenSub}> Compain 😠 </div>
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
        <div className="postLike">
            <img className={likeStyle} onClick={likePost} src={PacmanImg} alt="Like"></img>
            <p> {like} </p>
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

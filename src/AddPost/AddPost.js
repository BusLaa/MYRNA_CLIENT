import React, { useState, useEffect } from 'react';
import { gql } from 'graphql-request';
import './AddPost.css';

function AddPost (props) {

    const [header, setHeader] = useState("");
    const [content, setContent] = useState("");

    let header_2;
    let content_2;

    const [errorStyle, setErrorStyle] = useState("addPostError hidden");
    const [errorText, setErrorText] = useState("");

    const [imageFile, setImageFile] = useState(null);

    async function addPost(e) {

        if (header === "" || header.trim().slice(0, 1) === " " || content === "" || content.trim().slice(0, 1) === " ") {
            setErrorText("You need to fill all the fields!")
            setErrorStyle("addPostError");
            return;
        }

        header_2 = header.replaceAll('"', "''");
        content_2 = content.replaceAll('"', "''");

        let query = gql`
        mutation AddNewPost {
            addNewPost(userId: ${localStorage.getItem("user_id")}, 
                header: """${header_2}""", 
                content: """${content_2}""") {
                    id
                }
            }    
        `; 

        try {
            return await fetch(process.env.REACT_APP_SERVER_IP, {
                headers: {'Content-Type': 'application/json'},
                method: 'POST',
                body: JSON.stringify({"query": query})
            }).then((a) =>{
                return a.json()
            }).then((b) => {
                let postId = b.data.addNewPost.id;
                if (imageFile) {
                    uploadImage().then((a) => {
                        let imageId = a.id;
                        addImageToPost(postId, imageId).then((a) => {
                            console.log(a);
                            window.location.href = "http://localhost:3000/allPosts";  
                        });
                    });
                } else {
                    window.location.href = "http://localhost:3000/allPosts";  
                }
            })

        } catch (err) {
            setErrorText(err)
            setErrorStyle("logFormError");
        }   


    }

    async function uploadImage() {
        try {
            const data = new FormData();
            data.append("image", imageFile);
            return await fetch(process.env.REACT_APP_SERVER_IP + "upload", {
                headers: {'verify-token': localStorage.getItem("token")},
                method: 'POST',
                body: data
            }).then((a) =>{
                return a.json();
            }).then((b) => {
                return b;
            })
        } catch (err) {
            throw new Error(err);
        }    
    }

    async function addImageToPost(postId, imageId) {
        if (postId && imageId) {
            try {
                let query2 = gql`
                    mutation AddImageToPost {
                        addImageToPost(postId: ${postId}, imageId: ${imageId})
                    }  
                `;          
                return await fetch(process.env.REACT_APP_SERVER_IP, {
                    headers: {'Content-Type': 'application/json', 'verify-token': localStorage.getItem("token")},
                    method: 'POST',
                    body: JSON.stringify({"query": query2})
                }).then((a) =>{
                    return a.json()
                }).then((b) => {
                    return b;
                }) 
            } catch (err) {
                throw new Error(err);
            }
        }
    }

    function updateImage() {
        if (document.getElementById("image")) {
            let files = document.getElementById("image")?.files;
            setImageFile(files[0])
        }
    }

    return(

        <div className='addPostPage'>

            <div className='addPost'>

                <p className='addPostText'> Add a New Post </p> 

                    <form method="POST" encType="multipart/form-data" onSubmit={async (e) => {e.preventDefault(); addPost(e);}}>

                        <div className={errorStyle}>
                            <p className="addPostErrorText">{errorText}</p>
                        </div>

                        <div className='addPostForm'>
                            
                            <div className='addPostFormText'>
                                <textarea required onChange={(e) => {setHeader(e.target.value); console.log(e.target.value)}} onKeyDown={(e) => {if(e.keyCode === 13) { e.preventDefault();} }} maxLength="128" placeholder="My last dinner" name="header"></textarea>
                                <textarea required onChange={(e) => {setContent(e.target.value)}} maxLength="4096" placeholder="This pie was so finger lickin' good..." name="content"></textarea>    
                            </div>

                            <div className='addPostFormImage'>
                                <input multiple="multiple" maxLength={3} id="image" name="image" accept="image/png, image/jpeg" onChange={(e) => {updateImage(e)}} type="file"></input>
                            </div>
                            
                            <div className='addPostFormSubmit'>
                                <input type="submit" value=" Here we go "></input>
                            </div>
                            

                        </div>

                    </form>

            </div>

        </div>
    )
}

export default AddPost
import React, { useEffect, useState } from 'react';
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

    useEffect(() => {
        console.log(imageFile);
    }, [imageFile]);

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

    // function imageDrag() {
    //     const imageArea = this.document.querySelector('.image-area');
    //     const inputFile = this.document.querySelector('.image-input') as HTMLInputElement;
    
    //     if (imageArea?.eventListeners?.().length! > 1) {
    //       return;
    //     }
    
    //     const active = (): void => imageArea?.classList.add('image-area-drag-active');
    //     const inactive = (): void => imageArea?.classList.remove('image-area-drag-active');
    //     const prevents = (e: Event): void => e.preventDefault();
    
    //     ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((evtName) => {
    //       imageArea!.addEventListener(evtName, prevents);
    //     });
    
    //     ['dragenter', 'dragover'].forEach((evtName) => {
    //       imageArea!.addEventListener(evtName, active);
    //     });
    
    //     ['dragleave', 'drop'].forEach((evtName) => {
    //       imageArea!.addEventListener(evtName, inactive);
    //     });
    
    //     imageArea!.addEventListener('drop', (e: any) => {
    //       const dt = e.dataTransfer;
    //       inputFile.files = dt.files;
    //       const image = dt.files[0];
    //       const reader = new FileReader();
    //       reader.onload = (): void => {
    //         const imgUrl = reader.result;
    //         if (!imageArea?.classList.contains('image-area-preview')) {
    //           imageArea?.classList.add('image-area-preview');
    //         }
    //         imageArea?.setAttribute(
    //           'style',
    //           "background-image: url('" +
    //             imgUrl +
    //             "'); background-repeat: no-repeat; background-size: cover; background-blend-mode: lighten;"
    //         );
    //       };
    //       reader.readAsDataURL(image);
    //     });
    //   }

    function imagePreview() {
        const imageArea = document.querySelector('.addPostFormImageArea');
        const inputFile = document.getElementById("image");
        if (inputFile != null) {
          inputFile.click();
          inputFile.addEventListener(
            'change', () => {
              const image = inputFile.files[0];
              setImageFile(image);
              const reader = new FileReader();
              reader.onload = () => {
                const imgUrl = reader.result;
                if (!imageArea.classList.contains('addPostFormImagePreview')) {
                  imageArea.classList.add('addPostFormImagePreview');
                }
                imageArea.setAttribute('style', "background-image: url('" + imgUrl + "'); background-repeat: no-repeat; background-size: cover; background-blend-mode: hard-light");
            };
              reader.readAsDataURL(image);
            },
            { once: true }
          );
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
                    return a.json();
                }).then((b) => {
                    return b;
                }) 
            } catch (err) {
                throw new Error(err);
            }
        }
    }

    return(
        <div className='addPostPage slide'>
            <div className='addPost'>
                <p className='addPostText'> Add a New Post </p> 
                    <form method="POST" encType="multipart/form-data" onSubmit={async (e) => {e.preventDefault(); addPost(e);}}>
                        <div className={errorStyle}>
                            <p className="addPostErrorText">{errorText}</p>
                        </div>
                        <div className='addPostForm'>                           
                            <div className='addPostFormText'>
                                <p className='addPostFormPrompt'> Post Header </p>
                                <textarea required onChange={(e) => {setHeader(e.target.value)}} onKeyDown={(e) => {if(e.keyCode === 13) { e.preventDefault();} }} maxLength="128" placeholder="My last dinner" name="header"></textarea>
                                <p className='addPostFormPrompt'> Description in Detail </p>
                                <textarea required onChange={(e) => {setContent(e.target.value)}} maxLength="4096" placeholder="This pie was so finger lickin' good..." name="content"></textarea>    
                            </div>
                            <div className='addPostFormImage'>
                                <div>
                                    <div onClick={(e) => {imagePreview(e)}} className='addPostFormImageArea'>
                                        <input  multiple="multiple" maxLength={3} className='addPostFormImageInput' id="image" name="image" accept="image/png, image/jpeg" type="file" hidden></input>
                                        <i className="fa fa-upload"></i>
                                        <p> Upload a picture </p>
                                    </div>
                                </div>
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

export default AddPost;
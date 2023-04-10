import React, {useState, useEffect} from 'react';
import Post from '../Post/Post';
import "./AllPosts.css"
import { gql } from 'graphql-request';

import avatar1 from '../img/avatars/avatar1.jpg';
import avatar2 from '../img/avatars/avatar2.jpg';
import avatar3 from '../img/avatars/avatar3.jpg';
import avatar4 from '../img/avatars/avatar4.jpg';
import avatar5 from '../img/avatars/avatar5.jpg';
import avatar6 from '../img/avatars/avatar6.jpg';

function AllPosts (props) {

    const [avatars, setAvatars] = useState([avatar1, avatar2, avatar3, avatar4, avatar5, avatar6]);

    const [posts, setPosts] = useState([]);
    const [deleteId, setDeleteId] = useState(0);

    useEffect(() => {
        if (deleteId != -1) {
            const newList = posts.filter((item) => item.id !== deleteId);
            setPosts(newList);    
            setDeleteId(-1);
        }
    },[deleteId])
    
    let query = gql`
        query GetAllPosts {
            getAllPosts {
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
    `;

    async function getData() {

        try {

            return await fetch(process.env.REACT_APP_SERVER_IP, {
                headers: {'Content-Type': 'application/json'},
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

    useEffect(() =>{
        getData()
            .then((a) =>{
                a = a.data.getAllPosts;
                if (a) {
                    setPosts(a);
                    console.log(a);                   
                }
            })
    }, [])

    return(

            <div className='homePage'>

                <p className='homePageText'>Home</p>

                <div className="homePagePostsDiv">
                    <div className='homePagePosts'>
                        {posts.map((post) => <Post setDeleteId={setDeleteId} key={post.id} post={post}/>)}
                    </div>
                </div>

                <p className='homePageEndText'> We reached the end </p>

            </div>

    )
}

export default AllPosts
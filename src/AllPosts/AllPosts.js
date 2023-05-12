import React, {useState, useEffect} from 'react';
import Post from '../Post/Post';
import "./AllPosts.css"
import { gql } from 'graphql-request';

function AllPosts (props) {

    const [posts, setPosts] = useState([]);
    const [deleteId, setDeleteId] = useState(0);

    useEffect(() => {
        if (deleteId !== -1) {
            const newList = posts.filter((item) => item.id !== deleteId);
            setPosts(newList);    
            setDeleteId(-1);
        }
    }, [deleteId])
    
    let query = gql`
        query GetAllPosts {
            getAllPosts {
                id
                header
                content
                isLiked
                isCornered
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
    `;

    async function getData() {
        try {
            return await fetch(process.env.REACT_APP_SERVER_IP, {
                headers: {'Content-Type': 'application/json', 'verify-token': localStorage.getItem("token") || null},
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
        <div className='homePage slide'>
            {/* <p className='homePageText'>Home</p> */}
            <div className="homePagePostsDiv">
                <div className='homePagePosts'>
                    {posts.map((post) => <Post setDeleteId={setDeleteId} key={post.id} post={post}/>)}
                </div>
            </div>
            <p className='homePageEndText'> We reached the end </p>
        </div>
    )
}

export default AllPosts;
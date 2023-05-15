import React, {useState, useEffect} from 'react';
import ConversationBlock from '../ConversationBlock/ConversationBlock';
import "./Conversations.css"
import { Link } from 'react-router-dom'
import { gql } from 'graphql-request';

function Conversations (props) {

    const [conversations, setConversations] = useState([]);

    const [noConversationsDivStyle, setNoConversationsDivStyle] = useState("hidden noConversationDiv");
    const [yesConversationsDivStyle, setYesConversationsDivStyle] = useState("hidden yesConversationDiv")

    const [deleteId, setDeleteId] = useState(0);

    useEffect(() => {
        if (deleteId != -1) {
            const newList = conversations.filter((item) => item.id !== deleteId);
            setConversations(newList);   
            if (newList.length === 0) {
                setNoConversationsDivStyle("noMeetingsDiv");
                setYesConversationsDivStyle("hidden yesMeetingsDiv")                
            } 
            setDeleteId(-1);
        }
    },[deleteId])
    
    let query = gql`
        query GetUserById {
            getUserById(id: ${localStorage.getItem("user_id")}) {
                id
                conversations {
                    id
                    name
                    idea
                }
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
                return a.json()
            }).then((b) => {
                return b
            })
        } catch (err) {
            console.log(err)
        }       
    }

    useEffect(() => {
        getData()
        .then((a) => {
            console.log(a.data.getUserById.conversations);
            if (a.data.getUserById.conversations == null || a.data.getUserById.conversations.length == 0) {
                setNoConversationsDivStyle("noConversationsDiv");
                setYesConversationsDivStyle("hidden yesConversationsDiv")
            } else {
                setConversations(a.data.getUserById.conversations);
                setNoConversationsDivStyle("hidden noConversationsDiv");
                setYesConversationsDivStyle("yesConversationsDiv")
            }
        })
        
    }, [])

    return(
            <div className='conversationsPage slide'>
                {/* <p className='conversationsPageText'> Conversations </p> */}
                <div className={yesConversationsDivStyle}>
                    <Link to="/addConversation"> <button> Create a Conversation </button> </Link>
                </div>
                <div className="conversationsPageConversationsDiv">
                    <div className='conversationsPageConversations'>
                        <div className={noConversationsDivStyle}>
                            <p> There are no any conversations yet </p>
                            <Link to="/addConversation"> <button> Create one </button> </Link>
                        </div>
                        {conversations.map((conversation) => <ConversationBlock setDeleteId={setDeleteId} key={conversation.id} conversation={conversation}/>)}
                    </div>
                </div>
            </div>
    )
}

export default Conversations;
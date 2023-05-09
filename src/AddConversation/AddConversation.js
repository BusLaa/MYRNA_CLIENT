import React, { useState } from 'react';
import { gql } from 'graphql-request';
import './AddConversation.css';

function AddConversation (props) {

    const [title, setTitle] = useState("");
    const [idea, setIdea] = useState("");
    const [expandable, setExpandable] = useState(true);

    let title_2;
    let idea_2;

    const [errorStyle, setErrorStyle] = useState("addConversationError hidden");
    const [errorText, setErrorText] = useState("");

    async function addConversation(e) {
        
        if (title === "" || title.trim().slice(0, 1) === " "
            || idea === "" || idea.trim().slice(0, 1) === " ") {
            setErrorText("You need to fill all the fields!")
            setErrorStyle("addConversationError");
            return;
        }

        title_2 = title.replaceAll('"', "''");
        idea_2 = idea.replaceAll('"', "''");

        let query = gql`
            mutation CreateConversation {
                createConversation(name: "${title_2}", idea: "${idea_2}", expandable: ${expandable}) {
                    expandable
                }
            }    
        `; 

        try {
            return await fetch(process.env.REACT_APP_SERVER_IP, {
                headers: {'Content-Type': 'application/json', 'verify-token': localStorage.getItem("token")},
                method: 'Post',
                body: JSON.stringify({"query": query})
            }).then((a) =>{
                return a.json()
            }).then((b) => {
                window.location.href = "http://localhost:3000/conversations";
                return  b
            })
        } catch (err) {
            setErrorText(err)
            setErrorStyle("logFormError");
        }   
    }
   
    return(
        <div className='addConversationPage  slide'>
            <div className='addConversation'>
                <p className='addConversationText'> Add a New Conversation </p> 
                    <form method="Conversation" onSubmit={async (e) => {e.preventDefault(); addConversation(e);}}>
                        <div className={errorStyle}>
                            <p className="addConversationErrorText">{errorText}</p>
                        </div>
                        <div className='addConversationForm'>
                            <div className='addConversationFormText'>
                                <p> Title </p>
                                <textarea required onChange={(e) => {setTitle(e.target.value); console.log(e.target.value)}} onKeyDown={(e) => {if(e.keyCode === 13) { e.preventDefault();} }} maxLength="128" placeholder="Soldering Iron Brotherhood" name="title"></textarea>
                                <p> Idea </p>
                                <textarea required onChange={(e) => {setIdea(e.target.value)}} maxLength="4096" placeholder="Let's discuss some politics" name="idea"></textarea>    
                            </div>                  
                            <div className='addConversationFormSubmit'>
                                <input type="submit" value=" Here we go "></input>
                            </div>
                        </div>
                    </form>
            </div>
        </div>
    )
}

export default AddConversation;
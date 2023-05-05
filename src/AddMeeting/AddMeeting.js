import React, {useState, useEffect} from 'react';
import { gql } from 'graphql-request';
import './AddMeeting.css';

function AddMeeting (props) {

    const [header, setHeader] = useState("");
    const [date, setDate] = useState("");
    const [type, setType] = useState("1");

    const [errorStyle, setErrorStyle] = useState("addMeetingFormError hidden");
    const [errorText, setErrorText] = useState("");

    let query = gql`
        mutation CreateNewMeeting {
            createNewMeeting(name: "${header}", date: "${date}", type: ${type}, creator: ${localStorage.getItem("user_id")}) {
                id
            }
        }
    `; 

    async function addMeeting(e) {

        e.preventDefault();

        setHeader(header.trim());

        if (header == "" || header.slice(0, 1) == " " || date == "") {
            setErrorText("Fill all the fields correctly!")
            setErrorStyle("addMeetingFormError");
            return;
        }

        try {

            return await fetch(process.env.REACT_APP_SERVER_IP, {
                headers: {'Content-Type': 'application/json'},
                method: 'POST',
                body: JSON.stringify({"query": query})
            }).then((a) =>{
                return a.json()
            }).then((b) => {
                window.location.href = "http://localhost:3000/meetings";
                return b
            })

        } catch (err) {

            console.log(err)

        }   
    }
   
    return(

        <div className='addMeetingPage'>

            <div className='addMeeting'>

                <p className='addMeetingText'> Add Meeting </p> 

                    <form method="Meeting" onSubmit={addMeeting}>

                        <div className='addMeetingForm'>

                            <div className={errorStyle}>
                            <p onClick={(e) => {setErrorStyle("addMeetingFormError hidden");}} className="addMeetingFormErrorText">{errorText}</p>
                            </div>

                            <div className='addMeetingFormText'>
                                <textarea onChange={(e) => {setHeader(e.target.value); console.log(e.target.value)}} onKeyDown={(e) => {if(e.keyCode === 13) { e.preventDefault();} }} maxLength="50" placeholder="" name="header"></textarea>              
                            </div>

                            <div className='addMeetingFormTypeAndDate'>

                                <div className='addMeetingFormType'>
                                    <select onChange={(e) => {setType(e.target.value); console.log(e.target.value)}} id="meetingTypes">
                                        <option value="1"> Hang Out </option>
                                        <option value="2"> Business </option>
                                        <option value="3"> Date </option>
                                    </select>
                                </div>

                                <div className='addMeetingFormDate'>
                                    <input onChange={(e) => {setDate(e.target.value); console.log(e.target.value)}} type="date"></input>
                                </div>

                            </div>
                            
                            <div className='addMeetingFormSubmit'>
                                <input type="submit" value=" Here we go "></input>
                            </div>

                        </div>

                    </form>

            </div>

        </div>
    )
}

export default AddMeeting;
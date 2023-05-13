import './App.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from '../Navbar/Navbar';
import AllPosts from '../AllPosts/AllPosts';
import AllUpdates from '../AllUpdates/AllUpdates';
import Registration from '../Registration/Registration';
import Login from '../Login/Login';
import Map from '../Map/Map';
import Notification from '../Notification/Notification';
import AddPost from '../AddPost/AddPost';
import Profile from '../Profile/Profile';
import Meetings from '../Meetings/Meetings';
import AddMeeting from '../AddMeeting/AddMeeting';
import Meeting from '../Meeting/Meeting';
import Place from '../Place/Place';
import Conversations from '../Conversations/Conversations';
import Conversation from '../Conversation/Conversation';
import AddConversation from '../AddConversation/AddConversation';
import EditProfile from '../EditProfile/EditProfile';

function App() {

  const [notify, setNotify] = useState(false);
  const [notifyText, setNotifyText] = useState("");

  const returnNotify = (bool) => {
    return (bool) ? <Notification notifyText={notifyText} setNotify={setNotify}/>: '';
  }

  return (
    <div>
      <Router>  
        <Navbar setNotify={setNotify} setNotifyText={setNotifyText}/> 
        {returnNotify(notify)}  
        <Routes>
          <Route path='/' exact/>
          <Route path='/allPosts' element={<AllPosts/>} />
          <Route path='/addPost' element={<AddPost/>} />
          <Route path='/allUpdates' element={<AllUpdates/>} />
          <Route path='/map' element={<Map/>} />
          <Route path='/profile' element={<Profile/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/registration' element={<Registration/>} />
          <Route path='/meetings' element={<Meetings/>} />
          <Route path='/addMeeting' element={<AddMeeting/>} />
          <Route path='/meeting' element={<Meeting/>} />
          <Route path='/place' element={<Place/>} />
          <Route path='/conversations' element={<Conversations/>} />
          <Route path='/addConversation' element={<AddConversation/>} />
          <Route path='/conversation' element={<Conversation/>} />
          <Route path='/editProfile' element={<EditProfile/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App
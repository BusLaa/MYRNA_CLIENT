import React, {useEffect, useState} from 'react';
import { useLocation } from 'react-router-dom';
import {gql} from 'graphql-request';

import "./EditProfile.css"

function EditProfile (props) {

  const location = useLocation();
  const [state, ] = useState(location.state);

  useEffect(() => {
    if (state) {
      setEmail(state.email);
      setFirstname(state.firstName);
      setLastname(state.lastName);
      setUserId(state.id);
      if (state.birthday) {
        setBirthday(new Date(parseInt(state.birthday)).toISOString().split('T')[0]);
      }
      if (state.location) {
        setCountry(state.location.country);
        setCity(state.location.city);
        setPostalCode(state.location.postalCode);
      }

    }
  }, [state])

  const [email, setEmail] = useState("");
  const [firstName, setFirstname] = useState("");
  const [lastName, setLastname] = useState("");
  const [userId, setUserId] = useState(localStorage.getItem("user_id"));
  const [birthday, setBirthday] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [locationId, setLocationId] = useState(null);

  const [imageFile, setImageFile] = useState(null);
  const [imageId, setImageId] = useState(null);

  const [errorStyle, setErrorStyle] = useState("");
  const [errorText, setErrorText] = useState("");

  let query = gql`
    mutation ChangeUser {
      changeUser(userId: ${userId}, email: "${email}", birthday: "${birthday}", firstName: "${firstName}", lastName: "${lastName}", location: ${locationId === -1 ? null : locationId}, imageId: ${imageId === -1 ? null : imageId}) {     
        id     
      }
    } 
  `;

  let query2 = gql`
    mutation CreateLocation {
      createLocation(country: "${country}", city: "${city}", postalCode: "${postalCode}") {
        id
      }
    }  
  `;

  async function imagePreview() {
    const imageArea = document.querySelector('.editFormImageArea');
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
            if (!imageArea.classList.contains('editFormImagePreview')) {
              imageArea.classList.add('editFormImagePreview');
            }
            imageArea.setAttribute('style', "background-image: url('" + imgUrl + "'); background-repeat: no-repeat; background-size: cover; background-blend-mode: hard-light");
        };
          reader.readAsDataURL(image);
        },
        { once: true }
      );
    }
  }

  async function uploadImage() {
    if (imageFile) {
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
            setImageId(b.id);
        })
      } catch (err) {
          setImageId(-1);
          throw new Error(err);
      }    
    } else {
      setImageId(state.avatar?.id);
    }
  }

  async function createLocation() {
    if (country.trim().slice(0,1) === " " || country === ""
      || city.trim().slice(0,1) === " " || city === ""
      || postalCode.trim().slice(0,1) === " " || postalCode === "") {
        setLocationId(-1);
        return;
      }
    if (country.trim() === state.location?.country.trim()
      && city.trim() === state.location?.city.trim()
      && postalCode.trim() === state.location?.postalCode.trim()) {
        setLocationId(state.location?.id);
        return;
    }
    try {
      const res = await fetch(process.env.REACT_APP_SERVER_IP, {
          headers: {'Content-Type': 'application/json'},
          method: 'POST',
          body: JSON.stringify({"query": query2})
      })
      const res_json = await res.json();
      try {
        setLocationId(res_json.data.createLocation.id);
      } catch (e) {
        setErrorText(res_json.errors[0].message);
        setErrorStyle("editFormError"); 
        setLocationId(-1);
      }
    } catch (e) {
      setLocationId(-1);
    }
  }

  async function submitForm(e) {
    e.preventDefault();
    uploadImage();
    createLocation();
  }

  useEffect(() => {
    if (locationId && imageId) {
      editProfile();
    }
  }, [locationId, imageId]);

  async function editProfile() {
    try {
      return fetch(process.env.REACT_APP_SERVER_IP, {
          headers: {'Content-Type': 'application/json', 'verify-token': localStorage.getItem("token") || null},
          method: 'POST',
          body: JSON.stringify({"query": query})
      }).then((res) =>{
          return res.json();
      }).then((b) => {
        window.location.href = "http://localhost:3000/profile";
        return b;
      })
    } catch (err) {
      setErrorText(err);
      setErrorStyle("editFormError");
    }
  }

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }

  function handleFirstnameChange(e) {
    setFirstname(e.target.value);
  }

  function handleLastnameChange(e) {
    setLastname(e.target.value);
  }

  function handleBirthdayChange(e) {
    setBirthday(e.target.value);
  }

  function handleCountryChange(e) {
    setCountry(e.target.value);
  }

  function handleCityChange(e) {
    setCity(e.target.value);
  }

  function handlePostalCodeChange(e) {
    setPostalCode(e.target.value);
  }
    
  return (
    <div className='modal slide'>
      <div className="editPage">
          <div className="editFormDiv">
            <div className="editFormTitle">
              <p className="editFormTitleText"> Edit profile </p>
            </div>
            <div className={errorStyle}>
              <p className="editFormErrorText">{errorText}</p>
            </div>
            <form className='editForm' method='POST' onSubmit={(e) => submitForm(e)}>
              <input type="email" name="email" onChange={handleEmailChange} value={email} placeholder='Email' required></input><br></br>
              <input type="text" name="firstname" onChange={handleFirstnameChange} value={firstName} placeholder='First Name' required></input><br></br>
              <input type="text" name="lastname" onChange={handleLastnameChange} value={lastName} placeholder='Last Name' required></input><br></br>
              <input  type="date" name="birthday" onChange={handleBirthdayChange} value={birthday}></input>
              <input type="text" placeholder="Country" name="country" onChange={handleCountryChange} value={country}></input>
              <input type="text" placeholder="City" name="city" onChange={handleCityChange} value={city}></input>
              <input type="text" placeholder="Postal Code" name="postalCode" onChange={handlePostalCodeChange} value={postalCode}></input>
              <div className="editFormImage">
                  <div>
                      <div onClick={imagePreview} className="editFormImageArea">
                          <input  multiple="multiple" maxLength={3} className='editFormImageInput' id="image" name="image" accept="image/png, image/jpeg" type="file" hidden></input>
                          <i className="fa fa-upload"></i>
                          <p> Upload a picture </p>
                      </div>
                  </div>
              </div>       
              <div className="editFormButtonsDiv">
                <div className='editFormButtons'>
                  <input type="submit" value="Change an account"></input>
                </div>
              </div>
            </form>
          </div>
      </div>
    </div>
  );
}

export default EditProfile;
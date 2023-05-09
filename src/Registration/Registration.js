import React, {useEffect, useState} from 'react';
import {gql} from 'graphql-request';
import "./Registration.css"

function Registration (props) {

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [firstName, setFirstname] = useState("");
  const [lastName, setLastname] = useState("");

  const [birthday, setBirthday] = useState(null);
  const [birthdayStyle, setBirthdayStyle] = useState("hidden");

  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [locationStyle, setLocationStyle] = useState("hidden");
  const [locationId, setLocationId] = useState(null);

  const [avatarStyle, setAvatarStyle] = useState("regFormImage hidden");
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
      console.log(imageFile);
  }, [imageFile]);

  const [dateRequire, setDateRequire] = useState("");
  const [locationRequire, setLocationRequire] = useState("");
  const [avatarRequire, setAvatarRequire] = useState("");

  const [errorStyle, setErrorStyle] = useState("");
  const [errorText, setErrorText] = useState("");

  let query = gql`
    mutation Signup {
      signup(email: "${email}", password: "${pass}", firstName: "${firstName}", lastName: "${lastName}", birthday: "${birthday}", locationId: ${locationId}) {
        token
        user {
          id
          email
          firstName
          lastName
          birthday
          location {
            id
            country
            city
            postalCode
          }
        }
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

  async function signUp2() {
    try {

      const res = await fetch(process.env.REACT_APP_SERVER_IP, {
          headers: {'Content-Type': 'application/json'},
          method: 'POST',
          body: JSON.stringify({"query": query})
      })

      const res_json = await res.json();

      try {

        localStorage.setItem("user_id", res_json.data.signup.user.id);
        localStorage.setItem("token", res_json.data.signup.token);

        if (imageFile) {
          uploadImage().then((a) => {
            let imageId = a.id;
            addImageToUser(res_json.data.signup.user.id, imageId).then((a) => {
              console.log(a);
              window.location.href = "http://localhost:3000/profile";  
          });
        });
        } else {
          window.location.href = "http://localhost:3000/profile";
        }

      } catch (err) {

        setErrorText(res_json.errors[0].message);
        setErrorStyle("regFormError");

      }

    } catch (err) {

      setErrorText(err);
      setErrorStyle("regFormError");

    } 
  }

  function imagePreview() {
    const imageArea = document.querySelector('.regFormImageArea');
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
            if (!imageArea.classList.contains('regFormImagePreview')) {
              imageArea.classList.add('regFormImagePreview');
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

  useEffect(() => {
    if (locationId != null) {
      signUp2();
    }
  }, [locationId])


  async function signUp(e) {
    e.preventDefault();

    if (locationStyle !== "hidden") {

      if (country.trim().slice(0,1) === " " || country === ""
        || city.trim().slice(0,1) === " " || city === ""
        || postalCode.trim().slice(0,1) === " " || postalCode === "") return;

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
          setErrorStyle("regFormError");  

        }

      } catch (e) {

        console.log(e)

      }

    } else {
      signUp2();
    }
    
  }

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }

  function handlePassChange(e) {
    setPass(e.target.value);
  }

  function handleFirstnameChange(e) {
    setFirstname(e.target.value);
  }

  function handleLastnameChange(e) {
    setLastname(e.target.value);
  }

  function handleBirthdayChange(e) {
    setBirthday(e.target.value);
    console.log(e.target.value);
  }

  function handleCountryChange(e) {
    setCountry(e.target.value);
    console.log(e.target.value);
  }

  function handleCityChange(e) {
    setCity(e.target.value);
    console.log(e.target.value);
  }

  function handlePostalCodeChange(e) {
    setPostalCode(e.target.value);
    console.log(e.target.value);
  }


  function toggleBirthday(e) {
    if (birthdayStyle === "hidden") {
      setDateRequire("required");
      setBirthdayStyle("");
    } else {
      setDateRequire("");
      setBirthday("");
      setBirthdayStyle("hidden");
    }
  }

  function toggleLocation(e) {
    if (locationStyle === "hidden") {
      setLocationRequire("required");
      setLocationStyle("");
    } else {
      setLocationRequire("");
      setCountry("");
      setCity("");
      setPostalCode("");
      setLocationStyle("hidden");
    }
  }

  function toggleAvatar(e) {
    if (avatarStyle === "regFormImage hidden") {
      setAvatarRequire("required");
      setAvatarStyle("regFormImage");
    } else {
      setAvatarRequire("");
      setImageFile(null);
      setAvatarStyle("regFormImage hidden");
    }
  }

  async function addImageToUser(userId, imageId) {
    if (userId && imageId) {
        try {
            let query2 = gql`
              mutation ChangeUser() {
                changeUser(userId: ${userId}, imageId: ${imageId}) {          
                }
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
    
  return (

    <div className='modal'>

      <div className="regPage">

          <div className="regFormDiv">

            <div className="regFormTitle">
              <p className="regFormTitleText"> Sign Up </p>
            </div>

            <div className={errorStyle}>
              <p className="regFormErrorText">{errorText}</p>
            </div>

            <form className='regForm' method='POST' onSubmit={(e) => {signUp(e)}}>
              <input type="email" name="email" onChange={handleEmailChange} value={email} placeholder='Email' required></input><br></br>
              <input type="password"  name="pass" minLength={9} onChange={handlePassChange} value={pass} placeholder='Password' required></input><br></br>
              <input type="text" name="firstname" onChange={handleFirstnameChange} value={firstName} placeholder='First Name' required></input><br></br>
              <input type="text" name="lastname" onChange={handleLastnameChange} value={lastName} placeholder='Last Name' required></input><br></br>
              <div className="birthdayCheck">
                <input className="birthdayCheckbox" type="checkbox" onChange={toggleBirthday}></input>
                <p> Add birthday </p>
              </div>
              <input className={birthdayStyle} type="date" name="birthday" onChange={handleBirthdayChange} value={birthday} required={dateRequire}></input>
              <div className="locationCheck">
                <input className="locationCheckbox" type="checkbox" onChange={toggleLocation}></input>
                <p> Add location </p>
              </div>
              <input className={locationStyle} type="text" placeholder="Country" name="country" onChange={handleCountryChange} value={country} required={locationRequire}></input>
              <input className={locationStyle} type="text" placeholder="City" name="city" onChange={handleCityChange} value={city} required={locationRequire}></input>
              <input className={locationStyle} type="text" placeholder="Postal Code" name="postalCode" onChange={handlePostalCodeChange} value={postalCode} required={locationRequire}></input>
              <div className="avatarCheck">
                <input className="avatarCheckbox" type="checkbox" onChange={toggleAvatar}></input>
                <p> Add avatar </p>
              </div>
              <div className={avatarStyle}>
                  <div>
                      <div onClick={(e) => {imagePreview(e)}} className='regFormImageArea'>
                          <input  multiple="multiple" maxLength={3} className='regFormImageInput' id="image" name="image" accept="image/png, image/jpeg" type="file" hidden required={avatarRequire}></input>
                          <i className="fa fa-upload"></i>
                          <p> Upload a picture </p>
                      </div>
                  </div>
              </div>       
              <div className="regFormButtonsDiv">
                <div className='regFormButtons'>
                  <input type="submit" value="Let's create an account"></input>
                </div>
              </div>
            </form>

          </div>

      </div>
      
    </div>

  );
}

export default Registration;
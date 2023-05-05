import React, {useEffect, useState} from 'react';
import {gql} from 'graphql-request';
import "./Registration.css"
//import { flushSync } from 'react-dom';

function Registration (props) {

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [firstName, setFirstname] = useState("");
  const [lastName, setLastname] = useState("");

  const [birthday, setBirthday] = useState("");
  const [birthdayStyle, setBirthdayStyle] = useState("hidden");

  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [locationStyle, setLocationStyle] = useState("hidden");
  const [locationId, setLocationId] = useState(null);

  const [dateRequire, setDateRequire] = useState("");
  const [locationRequire, setLocationRequire] = useState("");

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

        window.location.href = "http://localhost:3000/profile";

      } catch (err) {

        setErrorText(res_json.errors[0].message);
        setErrorStyle("regFormError");

      }

    } catch (err) {

      setErrorText(err);
      setErrorStyle("regFormError");

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

            <form className='regForm' method='POST' onSubmit={signUp}>
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
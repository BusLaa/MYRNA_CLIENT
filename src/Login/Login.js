import React, {useState} from 'react';
import {gql} from 'graphql-request';
import "./Login.css"
import {Link} from 'react-router-dom';

function Login(props) {

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const [errorStyle, setErrorStyle] = useState("logFormError hidden");
  const [errorText, setErrorText] = useState("");

  let query = gql`
    mutation Signin {
      signin(email: "${email}", password: "${pass}") {
        token
        user {
          id
        }
      }
    }
  `;

  async function signIn(e) {

    e.preventDefault();

    try {
      const res = await fetch(process.env.REACT_APP_SERVER_IP, {
          headers: {'Content-Type': 'application/json'},
          method: 'POST',
          body: JSON.stringify({"query": query})
      })

      let a = await res.json();
      console.log(a.data.signin.user.id);
      localStorage.setItem("user_id", a.data.signin.user.id);
      localStorage.setItem("token", a.data.signin.token);
      window.location.href = "http://localhost:3000/allPosts";

    } catch (err) {
      if (err.toString().search("reading 'user'") != -1) {
        setErrorText("Wrong Email or Password!")
      } else {
        setErrorText("Something went wrong!")
      }
      setErrorStyle("logFormError");
    } 
  }

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }

  function handlePassChange(e) {
    setPass(e.target.value);
  }

  return (

    <div className='modal'>

      <div className="logPage">

          {/* <div className="logXDiv">
            <div className="logX" onClick={closeModal} to="/"> <img src={crossImg}></img> </div>
          </div> */}

          <div className="logFormDiv">

            <div className="logFormTitle">
              <p className="logFormTitleText"> Sign In </p>
            </div>

            <div className={errorStyle}>
              <p className="logFormErrorText">{errorText}</p>
            </div>

            <form className='logForm' method='POST' onSubmit={signIn}>
              <input type="email" name="email" onChange={handleEmailChange} value={email} placeholder='Email' required></input><br></br>
              <input type="password"  name="pass" onChange={handlePassChange} value={pass} placeholder='Password' required></input><br></br>
              <div className="logFormButtonsDiv">
                <div className='logFormButtons'>
                  <input type="submit" value="Log In"></input>
                  <p>I forgot my password</p>
                </div>
              </div>
            </form>

          </div>

          <hr></hr>

          <div className="logRegDiv">

            <p> Don't have an account yet? </p>

            <Link to="/registration"> <button> Register </button> </Link>

          </div>

      </div>
      
    </div>

  );
}

export default Login;
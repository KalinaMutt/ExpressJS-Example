import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/Login.css"

export default function Login() {
  async function loginUser(credentials) {
    document.querySelector("#log").innerText = "processing...";
    document.querySelector("#axiosnotif").style.display = "none";
    if (window.navigator.onLine === true) {
      document.querySelector("#connectionnotif").style.display = "none";
      await axios
        .post("http://localhost:8000/login", JSON.stringify(credentials), {
          mode: "cors",
        })
        .then((data) => {
          document.querySelector("#log").innerText = "Submit";
          if (!data.data) {
            document.querySelector("#loginerror").innerText = "User not found";
          } else {
            localStorage.setItem("user-token", data.data.id);
            localStorage.setItem("auth-token", "authed");
            localStorage.setItem("admin-token", data.data.admin);
            localStorage.setItem(data.data.password.toString(), data.data.password.toString());
            if (data.data.admin === 0) {
              navi("/SHome");
            } else if (data.data.admin === 1) {
              navi("/AHome");
            } else {
              console.log(
                "User is neither admin or staff, contact your supervisor"
              );
            }
            return true;
          }
        })
        .catch((error) => {
          document.querySelector("#axiosnotif").style.display = "block";
        });
    } else {
      document.querySelector("#connectionnotif").style.display = "block";
    }
  }
  const navi = useNavigate();
  var admin = false;

  async function login(e) {
    e.preventDefault();
    var borderc = "light-dark(rgb(118, 118, 118), rgb(133, 133, 133))";

    const idInput = document.querySelector("#ID");
    const firstNameInput = document.querySelector("#FNAME");
    const lastNameInput = document.querySelector("#LNAME");
    const passWordInput = document.querySelector("#PASSWORD");

    idInput.style.borderColor = borderc;
    firstNameInput.style.borderColor = borderc;
    lastNameInput.style.borderColor = borderc;
    passWordInput.style.borderColor = borderc;
    
    var describer = document.querySelector("#loginerror");
    describer.innerText = "";

    if (idInput.value.trim() === "") {
      describer.innerText = "Organisation cannot be blank";
      idInput.style.borderColor = "red";
    } else if (Number.isFinite(parseInt(idInput.value.trim())) === false) {
      idInput.style.borderColor = "red";
      describer.innerText = "Organisation should be a number";
    } else if (firstNameInput.value.trim() === "") {
      idInput.style.borderColor = borderc;
      firstNameInput.style.borderColor = "red";
      describer.innerText = "First name cannot be blank";
    } else if (lastNameInput.value.trim() === "") {
      describer.innerText = "Last name cannot be blank";
      firstNameInput.style.borderColor = borderc;
      lastNameInput.style.borderColor = "red";
    } else if (passWordInput.value.trim() === "") {
      describer.innerText = "Password cannot be blank";
      lastNameInput.style.borderColor = borderc;
      passWordInput.style.borderColor = "red";
    } else {
      passWordInput.style.borderColor = "none";
      var hash = 0;
      for (var i = 0; i < passWordInput.value.length; i++) {
        var atbl = passWordInput.value.charCodeAt(i);
        hash += atbl * Math.floor(atbl / 5) * (i + 1);
      }
      await loginUser({
        firstName: firstNameInput.value.toString(),
        lastName: lastNameInput.value.toString(),
        password: hash,
        organisation: parseInt(idInput.value),
      });
    }
  }
  return (
    <div id="login">
      <main>
      <h>Welcome</h>
      <p>Organisation ID</p>
      <input id="ID" autoComplete="off"></input>
      <p>First name</p>
      <input id="FNAME" autoComplete="off"></input>
      <p>Last name</p>
      <input id="LNAME" autoComplete="off"></input>
      <p>Password</p>
      <input type="password" autoComplete="off" id="PASSWORD"></input>
      <p id="loginerror"></p>
      <button id="log" onClick={login}>
        Login
      </button>
      </main>  
    </div>
  );
}


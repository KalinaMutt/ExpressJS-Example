import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Logout() {
  const navi = useNavigate();
  function exi(e) {
    e.preventDefault();
    e.target.innerText="processing"
    axios
        .post(
          "http://localhost:8000/person",
          { id: localStorage.getItem("user-token") },
          { mode: "cors" }
        )
        .then((data) => {
          localStorage.clear()
          document.querySelector("#axiosnotif").style.display = "none";
          document.querySelector("#connectionnotif").style.display = "none";
          navi("/");
        })
  }
  return <button id="logout" onClick={exi}>Logout</button>;
}

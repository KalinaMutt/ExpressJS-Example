import { useEffect } from "react";
import Logout from "../js/Logout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/SProfile.css"

const L = require("leaflet");
/*MAP CREDITS---
OpenStreetMap for map data
https://www.openstreetmap.org/copyright
©OpenStreetMap Contributors

Leaflet js for map scripting
https://leafletjs.com/
*/

export default function Sprofile() {
  const navi = useNavigate();
  let user = 0;
  let mapp = null;
  useEffect(() => {
    document.querySelector("#axiosnotif").style.display = "none";
    if (window.navigator.onLine === true) {
      document.querySelector("#connectionnotif").style.display = "none";
      axios
        .post(
          "http://localhost:8000/person",
          { id: localStorage.getItem("user-token") },
          { mode: "cors" }
        )
        .then((data) => {
          if (localStorage.getItem(data.data.password.toString())!==data.data.password.toString()) {
          localStorage.clear()
          document.querySelector("#axiosnotif").style.display = "none";
          document.querySelector("#connectionnotif").style.display = "none";
          navi("/");
          return;
          }
          var info = data.data;
          user = data.data.id;
          document.querySelector("#fullName").innerText =
            info.firstname + " " + info.lastname;
          if (info.status === 1) {
            document.querySelector("#status").innerText = "Active";
            document.querySelector("#status").style.backgroundColor = "green";
          }
          if (info.inoffice === 1) {
            document.querySelector("#office").innerText = "Yes";
            document.querySelector("#office").style.backgroundColor = "green";
          }
          document.querySelector("#profileLoader").style.display = "none";
          document.querySelector("#profileContent").style.display = "block";

          try {
            var map = L.map("map").setView([0, 0], 14);
            L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
              maxZoom: 19,
              attribution:
                '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            }).addTo(map);
            if (mapp == undefined) {
              mapp = map;
            }
          } catch (error) {}
          mapp.setView([info.lat, info.long], 14);
        })
        .catch((error) => {
          document.querySelector("#axiosnotif").style.display = "block";
        });
    } else {
      document.querySelector("#connectionnotif").style.display = "block";
    }
  });
  async function status(e) {
    if (e.target.innerText !== "Updating...") {
    document.querySelector("#axiosnotif").style.display = "none";
    if (window.navigator.onLine === true) {
      document.querySelector("#connectionnotif").style.display = "none";
      let cstat = 0;
      e.preventDefault();

      if (e.target.innerText === "Inactive") {
        cstat = 1;
      }
      e.target.innerText = "Updating...";
      e.target.style.backgroundColor = "grey";

      await axios
        .post(
          "http://localhost:8000/statuschange",
          JSON.stringify({
            id: localStorage.getItem("user-token"),
            status: cstat,
          }),
          { mode: "cors" }
        )
        .then((data) => {
          if (cstat === 0) {
            e.target.innerText = "Inactive";
            e.target.style.backgroundColor = "red";
          } else {
            e.target.innerText = "Active";
            e.target.style.backgroundColor = "green";
          }
        })
        .catch((error) => {
          document.querySelector("#axiosnotif").style.display = "block";
        });
    } else {
      document.querySelector("#connectionnotif").style.display = "block";
    }
  }
  }

  async function office(e) {
    if (e.target.innerText !== "Updating...") {
    document.querySelector("#axiosnotif").style.display = "none";
    if (window.navigator.onLine === true) {
      document.querySelector("#connectionnotif").style.display = "none";
      let cstat = 0;
      e.preventDefault();
      if (e.target.innerText === "No") {
        cstat = 1;
      }
      e.target.innerText = "Updating...";
      e.target.style.backgroundColor = "grey";
      await axios
        .post(
          "http://localhost:8000/officechange",
          JSON.stringify({
            id: localStorage.getItem("user-token"),
            inoffice: cstat,
          }),
          { mode: "cors" }
        )
        .then((data) => {
          if (cstat === 1) {
            e.target.innerText = "Yes";
            e.target.style.backgroundColor = "green";
          } else {
            e.target.innerText = "No";
            e.target.style.backgroundColor = "red";
          }
        })
        .catch((error) => {
          document.querySelector("#axiosnotif").style.display = "block";
        });
    } else {
      document.querySelector("#connectionnotif").style.display = "block";
    }
  }
  }

  function geo() {
    if (document.querySelector("#locationButton").innerText !== "Updating...") {
    document.querySelector("#axiosnotif").style.display = "none";
    if (window.navigator.onLine === true) {
      document.querySelector("#locationButton").innerText = "Updating....";
      document.querySelector("#connectionnotif").style.display = "none";

      navigator.geolocation.getCurrentPosition(printo, maperror, {
        enableHighAccuracy: true,
      });
      
    } else {
      document.querySelector("#connectionnotif").style.display = "block";
    }
  }
  async function printo(position) {
    await axios
      .post("http://localhost:8000/updatecoord", {
        lat: position.coords.latitude,
        long: position.coords.longitude,
        id: user,
      })
      .then((data) => {
        document.querySelector("#locationButton").innerText = "Update";
        mapp.setView([position.coords.latitude, position.coords.longitude], 14);
      })
      .catch((error) => {
        document.querySelector("#axiosnotif").style.display = "block";
      });
    }
  }
  function maperror(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        alert("User denied the request for Geolocation.");
        break;
      case error.POSITION_UNAVAILABLE:
        alert("Location information is unavailable.");
        break;
      case error.TIMEOUT:
        alert("The request to get user location timed out.");
        break;
      case error.UNKNOWN_ERROR:
        alert("An unknown error occurred.");
        break;
    }
  }
  return (
    <div style={{ display: "block" }} id="profile" className="tabchangerhide">
      <p id="profileLoader">Loading...</p>
      <div id="profileContent" style={{ display: "none" }}>
        <div> 
          <p id="fullName">Name</p>
        </div>
        <div>
          <p style={{ display: "inline" }}>Status:</p>
          <button
            id="status"
            onClick={status}
            style={{ display: "inline", backgroundColor: "red" }}
          >
            Inactive
          </button>
        </div>

        <div>
          <p style={{ display: "inline" }}>In office:</p>
          <button
            id="office"
            onClick={office}
            style={{ display: "inline", backgroundColor: "red" }}
          >
            No
          </button>
        </div>

        <div>
          <p style={{ display: "inline" }}>Location:</p>
          <button
            onClick={geo}
            style={{ display: "inline" }}
            id="locationButton"
          >
            Update
          </button>
          <div style={{ height: 200 + "px", width: 100 + "%" }} id="map"></div>
        </div>
      </div>
    </div>
  );
}

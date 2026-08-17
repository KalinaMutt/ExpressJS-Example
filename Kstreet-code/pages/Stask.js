import Filler from "../js/Filler";
import Tasktab from "../js/Tasktab";
import axios from "axios";
import Tabs from "../js/Tabs";

export default function Stask() {
  async function postnote(e) {
    document.querySelector("#axiosnotif").style.display = "none";
    document.querySelector("#noteValue").style.borderColor =
      "light-dark(rgb(118, 118, 118), rgb(133, 133, 133))";
    
      if (window.navigator.onLine === true) {
      document.querySelector("#connectionnotif").style.display = "none";
      e.preventDefault();
      var id = document.querySelector("#noteTitle").title;
      var note = document.querySelector("#noteValue").value;
      if (!note.trim() === "") {
        e.target.innerText = "sending...";
        await axios
          .post(
            "http://localhost:8000/newnote",
            JSON.stringify({ task: id, description: note }),
            { mode: "cors" }
          )
          .then((data) => {
            closer();
          })
          .catch((error) => {
            document.querySelector("#axiosnotif").style.display = "block";
          });
      } else {
        document.querySelector("#noteValue").style.borderColor = "red";
      }
    } else {
      document.querySelector("#connectionnotif").style.display = "block";
    }
  }
  function closer() {
    document.querySelector("#notePopup").style.display = "none";
    document.querySelector("#noteValue").style.borderColor =
      "light-dark(rgb(118, 118, 118), rgb(133, 133, 133))";
    document.querySelector("#noteGallery").style.display = "none";
    var notes = document.querySelectorAll(".tempnote");
    for (var i = 0; i < notes.length; i++) {
      notes[i].remove();
    }
    document.querySelector("#nonPopup").style.display = "block";
    document.querySelector("#noteValue").value = "";
  }
  return (
    <div style={{ display: "none" }} id="task" className="tabchangerhide">
      <div id="nonPopup">
        <div>
        <Tabs id="Urgentwrappertab" className="filler" text="Urgent"></Tabs>
      <Tabs id="Routinewrappertab" className="filler" text="Routine"></Tabs>
      <Tabs id="Otherwrappertab" className="filler" text="Other"></Tabs>
          {/*<Tasktab text="Urgent" colour="black"></Tasktab>
          <Tasktab text="Routine" colour="white"></Tasktab>
  <Tasktab text="Other" colour="white"></Tasktab>*/}
        </div>
        <div>
          <Filler id="Urgent" display="block"></Filler>
          <Filler id="Routine" display="none"></Filler>
          <Filler id="Other" display="none"></Filler>
        </div>
      </div>
      <div style={{ display: "none" }} id="notePopup">
        <p id="noteTitle"></p>
        <p>Details</p>
        <textarea id="noteValue"></textarea>
        <br>
        </br>
        <button onClick={closer}>Close</button>
        <button onClick={postnote}>Submit</button>
      </div>
      <div style={{ display: "none" }} id="noteGallery">
        <p id="noteTitleTwo"></p>
        <button id="gallerycloser" onClick={closer}>
          Close
        </button>
      </div>
    </div>
  );
}

import { useEffect } from "react";
import axios from "axios";

export default function Filler(props) {
  let hasFetched = false;
  function opener() {
    document.querySelector("#noteTitle").innerText =
      this.parentElement.parentElement.querySelector(".titleid").innerText;
    document.querySelector("#noteTitle").title =
      this.parentElement.parentElement.id;
    document.querySelector("#noteGallery").style.display = "none";
    document.querySelector("#notePopup").style.display = "block";
    document.querySelector("#nonPopup").style.display = "none";
  }
  async function openertwo() {
    document.querySelector("#axiosnotif").style.display = "none";

    if (window.navigator.onLine === true) {
      document.querySelector("#connectionnotif").style.display = "none";
      this.innerText = "Loading";
      var id = this.parentElement.parentElement.id;
      document.querySelector("#noteTitleTwo").title = id;
      document.querySelector("#noteTitleTwo").innerText =
        this.parentElement.parentElement.querySelector(".titleid").innerText;

      await axios
        .post("http://localhost:8000/notes", JSON.stringify({ id: id }), {
          mode: "cors",
        })
        .then((data) => {
          var notesList = data.data;
          for (var w = 0; w < notesList.length; w++) {
            var tempNote = document.createElement("p");
            tempNote.classList.add("tempNote");
            tempNote.innerText =
              "note " + (w + 1).toString() + ": " + notesList[w].description;

            document
              .querySelector("#noteGallery")
              .insertBefore(tempNote, document.querySelector("#gallerycloser"));
          }
        });
      document.querySelector("#noteGallery").style.display = "block";
      document.querySelector("#nonPopup").style.display = "none";
      this.innerText = "View notes";
    } else {
      document.querySelector("#connectionnotif").style.display = "block";
    }
  }

  async function completer() {
    var id = this.parentElement.parentElement.id;
    this.innerText = "sending...";
    document.querySelector("#axiosnotif").style.display = "none";
    if (window.navigator.onLine === true) {
      document.querySelector("#connectionnotif").style.display = "none";
      await axios
        .post(
          "http://localhost:8000/completetask",
          JSON.stringify({ id: id }),
          { mode: "cors" }
        )
        .then((data) => {
          this.parentElement.parentElement.remove();
        })
        .catch((error) => {
          document.querySelector("#axiosnotif").style.display = "block";
        });
    } else {
      document.querySelector("#connectionnotif").style.display = "block";
    }
  }

  useEffect(() => {
    async function tasker() {
      document.querySelector("#axiosnotif").style.display = "none";
      if (window.navigator.onLine === true) {
        document.querySelector("#connectionnotif").style.display = "none";
        hasFetched = true;
        await axios
          .post("http://localhost:8000/tasks", JSON.stringify(props.id), {
            mode: "cors",
          })
          .then(async (data) => {
            let taskList = data.data;
            let dateObject = new Date();
            for (var i = 0; i < taskList.length; i++) {
              let tempDiv = document.createElement("div");
              tempDiv.id = taskList[i].id;

              let tempTitle = document.createElement("p");
              tempTitle.classList.add("titleid");
              tempTitle.innerText = taskList[i].title;
              let tempDesc = document.createElement("p");
              tempDesc.innerText = taskList[i].description;
              tempDiv.appendChild(tempTitle);
              tempDiv.appendChild(tempDesc);

              let tempProgress = document.createElement("p");
              taskList[i].startdate = taskList[i].startdate.replace(
                "T00:00:00.000Z",
                ""
              );
              var beginDate = new Date(taskList[i].startdate).getTime();
              var targetDate = dateObject.getTime();
              var dateString =
                dateObject.getFullYear().toString() +
                "-" +
                (dateObject.getMonth() + 1).toString() +
                "-" +
                (dateObject.getDate() + 1).toString();
              if (props.id == "Routine") {
                if (
                  beginDate + taskList[i].duration - targetDate.toFixed(2) <=
                  0
                ) {
                  beginDate =
                    new Date(new Date().setHours(0, 0, 0, 0)).getTime() -
                    new Date().getTimezoneOffset() * 60 * 1000;
                  await axios
                    .post(
                      "http://localhost:8000/timereset",
                      JSON.stringify({ date: dateString, id: taskList[i].id }),
                      { mode: "cors" }
                    )
                    .then((data) => {});
                }
              }
              tempProgress.innerText =
                (
                  (beginDate + taskList[i].duration - targetDate) /
                    1000 /
                    60 /
                    60 +
                  new Date().getTimezoneOffset() / 60
                ).toFixed(2) + " hours remaining";

              var inDiv = document.createElement("div");
              var viewNote = document.createElement("button");
              viewNote.innerText = "View notes";
              viewNote.style.display = "inline";
              viewNote.onclick = openertwo;

              var addNote = document.createElement("button");
              addNote.innerText = "Add note";
              addNote.style.display = "inline";
              addNote.onclick = opener;

              var complete = document.createElement("button");
              complete.style.display = "inline";
              complete.innerText = "Complete task";
              complete.onclick = completer;

              inDiv.appendChild(viewNote);
              inDiv.appendChild(addNote);
              inDiv.appendChild(complete);

              tempDiv.appendChild(tempProgress);
              tempDiv.appendChild(inDiv);

              //document.querySelector("#" + props.id).appendChild(tempDiv);
              let entries = document.querySelector("#" + props.id).children;
              let inserted = false;
              for (let w = 0; w < entries.length; w++) {
                if (
                  parseInt(
                    tempProgress.innerText.replace("hours remaining", "")
                  ) <
                    parseInt(
                      entries[w].children[2].innerText.replace(
                        "hours remaining",
                        ""
                      )
                    ) &&
                  inserted === false
                ) {
                  document
                    .querySelector("#" + props.id)
                    .insertBefore(tempDiv, entries[w]);
                  inserted = true;
                }
              }
              if (inserted === false) {
                document.querySelector("#" + props.id).appendChild(tempDiv);
              }
            }
            document.querySelector("#" + props.id).style.display = "block";
            document.querySelector("#" + props.id + "loader").style.display =
              "none";
          })
          .catch((error) => {
            document.querySelector("#axiosnotif").style.display = "block";
          });
      } else {
        document.querySelector("#connectionnotif").style.display = "block";
      }
    }
    if (hasFetched === false) {
      tasker();
    }
  });
  return (
    <div
      id={props.id + "wrapper"}
      style={{ display: props.display }}
      className="fillerhide"
    >
      <p id={props.id + "loader"}>Loading....</p>
      <div
        id={props.id}
        style={{ display: "none", overflowY: "scroll", height: 75 + "vh" }}
      ></div>
    </div>
  );
}

export default function Tasktab(props) {
  function select(e) {
    e.preventDefault();
    let tabs = document.querySelectorAll(".tasktab");
    let fillers = document.querySelectorAll(".filler");
    for (var x = 0; x < tabs.length; x++) {
      tabs[x].style.backgroundColor = "white";
    }
    for (var y = 0; y < fillers.length; y++) {
      fillers[y].style.display = "none";
    }
    e.target.style.backgroundColor = "black";
    document.querySelector("#" + e.target.innerText + "wrapper").style.display =
      "block";
  }
  return (
    <button
      className="tasktab"
      style={{ backgroundColor: props.colour }}
      onClick={select}
    >
      {props.text}
    </button>
  );
}

export default function Tabs(props) {
  function tabswitch(e) {
    e.preventDefault();
    let tabs=document.querySelectorAll("." + e.target.className)
    for (let i=0;i<tabs.length;i++) {
      tabs[i].style.backgroundColor="white"
    }
    let hide=document.querySelectorAll("."+e.target.className +"hide") 
    for (let x=0;x<hide.length;x++) {
      hide[x].style.display="none"
    }
    e.target.style.backgroundColor="Gray";
    document.querySelector("#" + e.target.id.replace("tab","")).style.display="block"
  }
  return (
      <button id={props.id}  style={props.style} className={props.className} onClick={tabswitch}>
        {props.text}
      </button>

  );
}

import { useEffect } from "react";
import Logout from "../js/Logout";
import Tabs from "../js/Tabs";
import Sprofile from "./Sprofile";
import Stask from "./Stask";
import axios from "axios";
import "../css/SHome.css"
export default function SHome() {
  return (
    <div id="outer">
      <outermain>
      <orgname>Organisation Name</orgname>
      <Tabs id="tasktab" className="tabchanger" text="Tasks"> </Tabs>
      <Tabs id="profiletab" className="tabchanger" text="Profile"></Tabs>
      <div id="rootx">
        <Stask></Stask>
        <Sprofile></Sprofile>
      </div>
      <Logout></Logout>
      </outermain>
    </div>
  );
}

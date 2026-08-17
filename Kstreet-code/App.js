//import logo from './logo.svg';
import axios from "axios";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./js/protectedroute";

import SHome from "./pages/SHome";
import Login from "./pages/Login";
import Ahome from "./pages/Ahome";

function App() {
  return (
    <>
      <p style={{ display: "none" }} id="connectionnotif">
        No internet connection
      </p>
      <p style={{ display: "none" }} id="axiosnotif">
        Server connection error
      </p>
      <Routes>
        <Route
          path="/SHome"
          element={
            <ProtectedRoute>
              <SHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Login />
            </ProtectedRoute>
          }
        />

        <Route
          path="/Ahome"
          element={
            <ProtectedRoute>
              <Ahome />
            </ProtectedRoute>
          }
        />
        
        <Route
        path="*"
          element={
            <ProtectedRoute>
              <Login />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;

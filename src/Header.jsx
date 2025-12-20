import React,{useState} from 'react'
import Logo from '/logo.png'
import "./Header.css"
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import GoogleAuth from './GoogleAuth'
function Header() {
            const navigate = useNavigate();

    const [user, setUser] = useState(() => {
  const savedUser = localStorage.getItem("user");
  return savedUser ? JSON.parse(savedUser) : null;
});

const logout = () => {
    localStorage.removeItem("user");

    setUser(null);
    navigate("/");

  };
  return (
    <header style={{position:'fixed',top:'0',width:'100%',zIndex:'50',backgroundColor:'#fff'}}>
      <Link to="/"><div id="logo">
        <img width='50' src={Logo}/>
        <h1>harfa</h1>
      </div>
      </Link>
      <div id="divers">
         {!user ? (
        <GoogleAuth onLogin={setUser}/>
      ) : (<>
        <span
          onClick={logout}
          style={{ cursor: "pointer", margin: "10px" }}
        >
          LOGOUT
        </span>
        <div style={{cursor:'pointer',width: 'max-content',borderRadius:'10px',backgroundColor:"#ff4c59",color:"white",padding:'10px'}}>
            <i className="fa-solid fa-plus"></i>
            <Link id='share' to="/publier"><span>Publier annonce</span></Link>
        </div></>
      )}
      </div>
    </header>
  )
}

export default Header

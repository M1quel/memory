import './App.scss';
import {Router} from "@reach/router"
import Startmenu from "./views/StartMenu";
import Game from './views/Game';
import { useEffect } from 'react';
import { useState } from 'react';
// import { useState } from 'react';

function App() {
  var [highscore, setHighscore] = useState(0);
  var [brightness, setBrightness] = useState(100)
  var [theme, setTheme] = useState("")
  var [lampConfig, setLampConfig] = useState({})
  useEffect(function () {
    if(window.localStorage.getItem("theme")) {
      setTheme(window.localStorage.getItem("theme"))
    } else {
      return
    }
  }, [setTheme])

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  useEffect(function () {
    if(getCookie("username") && getCookie("lampIP") && getCookie("lampID")) {
      setLampConfig({
        username: getCookie("username"),
        ip: getCookie("lampIP"),
        id: getCookie("lampID")
      })
    }
  }, [])
  


  return (
    <div id={`theme-${theme ? theme : "light"}`} className="wrapper">
      <Router>
        <Startmenu path="/" config={{lampConfig, setLampConfig}} themeState={{theme, setTheme}} brightnessState={{brightness, setBrightness}} highscoreState={{highscore, setHighscore}}/>
        <Game path="/game" config={{lampConfig, setLampConfig}} brightness={{brightness}} highscoreState={{highscore, setHighscore}}/>
      </Router>
    </div>

  );
}

export default App;

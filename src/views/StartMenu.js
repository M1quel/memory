import { Link } from '@reach/router'
import React from 'react';
import { useEffect } from 'react';
import setColors from '../helpers/setColors';
import "./StartMenu.scss";
import { Slider } from '@material-ui/core';
import { useState } from 'react';
import axios from 'axios';

export default function Startmenu(props) {
    var lampThemeColors = [
        {
            name: "green",
            sat: 254,
            hue: 20000,
            bri: props.brightnessState.brightness
        },
        {
            name: "light",
            sat: 0,
            hue: 45000,
            bri: props.brightnessState.brightness
        }, 
        {
            name: "blue",
            sat: 254,
            hue: 45000,
            bri: props.brightnessState.brightness
        },
        {
            name: "dark",
            sat: 0,
            hue: 45000,
            bri: 1
        }
    ]
    var [currentLampState, setCurrentLampState] = useState({})
    useEffect(function () {
        if(!props.config.lampConfig.username || !props.config.lampConfig.ip || !props.config.lampConfig.id) return;
        var username = props.config.lampConfig?.username
        var bridgeIP = props.config.lampConfig?.ip
        var lightID = props.config.lampConfig?.id;
        var url = `http://${bridgeIP}/api/${username}/lights/${lightID}`;
        var currentTheme = window.localStorage.getItem("theme");
        if(currentTheme === "green") {
            axios.get(url).then(response => setCurrentLampState({bri: props.brightnessState.brightness, sat: response.data.state.sat, hue: 20000})).catch(error => alert("Der kunne ikke findes en lampe med denne konfiguration", error))
        } else if (currentTheme === "blue") {
            axios.get(url).then(response => setCurrentLampState({bri: props.brightnessState.brightness, sat: 254, hue: 45000}))

        } else if (currentTheme === "light") {
            axios.get(url).then(response => setCurrentLampState({bri: props.brightnessState.brightness, sat: 0, hue: 45000}))

        } else if (currentTheme === "dark") {
            setCurrentLampState({name: "dark", hue: 45000, sat: 0, bri: props.brightnessState.brightness * .3})

        }



        var localStorageHighscore = window.localStorage.getItem("highscore");
        if(localStorageHighscore) {
            props.highscoreState.setHighscore(localStorageHighscore * 1)
        }
        
    }, [props.config.lampConfig])

    useEffect(function () {
        if(!currentLampState) return
        if(currentLampState.name === "off") {
            setColors("off", currentLampState.hue, currentLampState.sat, props.brightnessState.brightness, props.config.lampConfig)

        } else {
            setColors("setBrightness", currentLampState.hue, currentLampState.sat, props.themeState.theme === "dark" ? Math.floor(props.brightnessState.brightness * .3) : props.brightnessState.brightness, props.config.lampConfig)
        }
    }, [props.brightnessState.brightness, currentLampState])
    
    function ifChecked (checkbox) {
        var currentTheme = document.querySelector(".wrapper").getAttribute("id");
        var colorWord = currentTheme.split("-")[1];
        var theme = lampThemeColors.filter(theme => theme.name === colorWord)[0]
        if(checkbox.checked) {
            setColors(theme.name, theme.hue, theme.sat, theme.bri, props.config.lampConfig)
            document.querySelector(`.${colorWord}`).style.border = "2px solid black"
        } else {
            var allThemeBTNS = document.querySelectorAll(".colorThemes span");
            allThemeBTNS.forEach(themeBTN => {
                themeBTN.style.border = "0"
            })
            
        }
    }


    function switchTheme (e) {
        var newTheme = e.target;
        var allThemeBTNS = document.querySelectorAll(".colorThemes span");
        allThemeBTNS.forEach(themeBTN => {
            themeBTN.style.border = "0"
        })
        newTheme.style.border = "2px solid black";
        document.querySelector(".wrapper").setAttribute("id", `theme-${e.target.className}`)
        var currentTheme = document.querySelector(".wrapper").getAttribute("id");
        var colorWord = currentTheme.split("-")[1];
        props.themeState.setTheme(colorWord)
        var theme = lampThemeColors.filter(theme => theme.name === colorWord)[0]
        if(e.target.className === "dark") {
            setColors("off", theme.hue, theme.sat, theme.bri, props.config.lampConfig)
            setCurrentLampState({name: "off", hue: theme.hue, sat: theme.sat, bri: theme.bri})
            
        }
        setCurrentLampState(theme)
        if(window.localStorage.getItem("theme")) {
            window.localStorage.removeItem("theme");
        }
        window.localStorage.setItem("theme", theme.name)

    }

    function submitConfig (e) {
        e.preventDefault();
        if(e.target.saveConfig.checked) {
            var expiryDate = new Date();
            expiryDate.setMonth(expiryDate.getMonth() + 1);
            document.cookie = `username=${e.target.username.value}; expires=${expiryDate}`
            document.cookie = `lampIP=${e.target.lampIP.value}; expires=${expiryDate}`
            document.cookie = `lampID=${e.target.lampID.value}; expires=${expiryDate}`
            props.config.setLampConfig({
                username: e.target.username.value,
                ip: e.target.lampIP.value,
                id: e.target.lampID.value
            })
        } else {
            var expiryDate = new Date();
            expiryDate.setMonth(expiryDate.getMonth() - 1);
            document.cookie = `username=; expires=${expiryDate}`
            document.cookie = `lampIP=; expires=${expiryDate}`
            document.cookie = `lampID=; expires=${expiryDate}`
            props.config.setLampConfig({
                username: e.target.username.value,
                ip: e.target.lampIP.value,
                id: e.target.lampID.vlaue
            })

        }

    }

    function setConfig(e) {
        if(e.target.checked) {
            if(props.config.lampConfig) {
                var configForm = document.querySelector(".configForm");
                configForm.lampIP.value = props.config.lampConfig.ip ? props.config.lampConfig.ip : null;
                configForm.username.value = props.config.lampConfig.username ? props.config.lampConfig.username : null;
                configForm.lampID.value = props.config.lampConfig.id ? props.config.lampConfig.id : null;
            }
        }
    }


    return (
        <>
            <div className="startMenu">
                <p className="">{props.highscoreState.highscore ? `Din nuværende highscore: ${props.highscoreState.highscore}` : "Du har endnu ikke en highscore"}</p>
                <h1 className="startMenu__heading">Velkommen til memory</h1>
                <Link to="/game" className="startmenuSectionHeading startMenu__btn"><h1 className="startMenu__btnHeading">Start Spil</h1></Link>
                <div className="startMenuOptions startMenu__btn">
                    <input onChange={(e) => {ifChecked(e.target)}} type="checkbox" name="optionCheck" id="optionCheck" />
                    <label htmlFor="optionCheck" className="startMenuOptions__heading startMenu__btnHeading">Indstillinger</label>
                    <div className="startMenuOptions__content">
                        <div className="colorScheme">
                            <h1 className="colorScheme__heading">Tema</h1>
                            <div className="colorThemes">
                                <span onClick={(e) => {switchTheme(e)}} className="green" value="20000"></span>
                                <span onClick={(e) => {switchTheme(e)}} className="blue" value="20000"></span>
                                <span onClick={(e) => {switchTheme(e)}} className="light" value="20000"></span>
                                <span onClick={(e) => {switchTheme(e)}} className="dark" value="20000"></span>
                            </div>
                        </div>

                        <div style={{backgroundColor: props.themeState.theme === "blue" ? "rgba(0, 0, 0, .2)" : "transparent"}} className="brightnessSelector">
                            {props.brightnessState.brightness ? <Slider
                                orientation="horizontal"
                                key={props.brightnessState.brightness}
                                min={1}
                                max={254}
                                defaultValue={props.brightnessState.brightness}
                                onChangeCommitted={(value, newValue) => {props.brightnessState.setBrightness(newValue)}}
                                aria-labelledby="vertical-slider"
                            /> : null}
                        </div>


                    </div>
                </div>



                <div className="startMenuConfig startMenu__btn">
                    <input onChange={setConfig} type="checkbox" name="configCheck" id="configCheck" />
                    <label htmlFor="configCheck" className="startMenuConfig__heading startMenu__btnHeading">Konfiguration</label>
                    <div className="startMenuConfig__content">
                        
                        <form onSubmit={submitConfig} className="configForm">
                            <input type="text" name="username" id="username" placeholder="Indsæt brugernavn"/>
                            <input type="text" name="lampIP" id="lampIP" placeholder="Tast IP til broen"/>
                            <input type="number" name="lampID" id="lampID" placeholder="Tast id på lampen"/>
                            <div className="saveConfig">
                                <input type="checkbox" name="saveConfig" id="saveConfig"/>
                                <label htmlFor="saveConfig">Husk konfiguration</label>
                            </div>
                            <button type="submit">Gem konfiguration</button>
                        </form>

                    </div>
                </div>
            </div>
        </>
    )
}

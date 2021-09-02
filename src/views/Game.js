import React from 'react';
import "./Game.scss";
import { Link, navigate } from '@reach/router';
import { useEffect } from 'react';
import { useState } from 'react';
import setColors from '../helpers/setColors';
import addToSequence from '../helpers/addToSequence';
import axios from 'axios';
import validateUserInputs from '../helpers/validateUserInput';

export default function Game(props) {
    var [lightFlashing, setLightFlashing] = useState(true);
    var [sequence, setSequence] = useState([]);
    var [userAnswer, setUserAnswer] = useState([])
    var [gameOver, setGameOver] = useState(false)
    var loopIndex = 1;
    var colors = [
        {
            "name": "white",
            "hue": 15000,
            sat: 0
        },
        {
            "name": "green",
            "hue": 20000
        },
        {
            "name": "blue",
            "hue": 45000
        },
        {
            "name": "purple",
            "hue": 50000
        },
        {
            "name": "yellow",
            "hue": 10000
        },
        {
            "name": "orange",
            "hue": 5000
        },
        {
            "name": "cyan",
            "hue": 35000
        },
        {
            "name": "pink",
            "hue": 57000
        },
        {
            "name": "red",
            "hue": 0
        }
    ]

    useEffect(function() {
        if(userAnswer.length > 0 && userAnswer.length === sequence.length) {
            validateUserInputs(userAnswer, sequence, setGameOver, nextLevel)
        }
    }, [userAnswer]) //eslint-disable-line

    function resetGame () {
        setLightFlashing(true);
        setSequence([])
        setUserAnswer([])
        setGameOver(false)
    }

    function nextLevel () {
        setUserAnswer([])
        setLightFlashing(true);
        var randomIndex = Math.floor(Math.random() * 9);
        addToSequence({sequence, setSequence}, randomIndex)
        if(sequence.length > props.highscoreState.highscore) {
            if(window.localStorage.getItem("highscore")) {
                window.localStorage.removeItem("highscore")
            }
            window.localStorage.setItem("highscore", sequence.length)
        }
    }


    function playSequence (arrayToPlay) {
        let step = arrayToPlay[loopIndex-1];
        setTimeout(function () {
            setColors(step.name, step.hue, step.sat, props.brightness.brightness, props.config.lampConfig)
        }, 1000)
        setTimeout(function () {
            setColors("off", step.hue, 0, props.brightness.brightness, props.config.lampConfig)
            if (loopIndex < arrayToPlay.length) {
                loopIndex++
                playSequence(arrayToPlay);
            } else {
                return
            }
        }, 2000)

    }

    function userInterAction (name, hue) {
        var newUserAnswer = [...userAnswer];
        if(name === "white") {
            newUserAnswer.push({"name": name, "hue": hue, sat: 0})
        } else {
            newUserAnswer.push({"name": name, "hue": hue})
        }
        setUserAnswer(newUserAnswer)
        setColors(name, hue, name === "white" ? 0 : 254, props.brightness.brightness, props.config.lampConfig)
        setTimeout(function () {
            setColors("off", hue, 254, props.brightness.brightness, props.config.lampConfig)

        }, 400)
    }



    useEffect (function () {
        if(sequence.length === 0) {
            var randomIndex = Math.floor(Math.random() * 9);
            addToSequence({sequence, setSequence}, randomIndex)
        }
    }, [sequence]) 

    useEffect(function () {
        var username = "NuLu5V2ErI50R8dMvPtoHYgw4lKywYQJ0KQIEsAa"
        var bridgeIP = "192.168.8.100"
        var lightID = 18;
        var url = `http://${bridgeIP}/api/${username}/lights/${lightID}/state`;
        axios.put(url, {
            on: false
        })
    }, [])



    return (
        <>
        {lightFlashing ? <div className="lightFlashingMessage message">
            <h1>Look at the light, it is showing the pattern</h1>
            <div>
                <button onClick={() => {setLightFlashing(false)}}>Enter pattern</button>
                <button onClick={() => {loopIndex = 1; playSequence(sequence)}}>Play pattern</button>
            </div>
        </div> : null}
        {gameOver ? <div className="gameOverMessage message">
            <h1>Game over you didnt enter the correct combination, but on the bright side you got to level {sequence.length}</h1>
            <div>
                <button onClick={() => navigate("/")}>Back to menu</button>
                <button onClick={resetGame}>Restart</button>
            </div>
        </div> : null}
        
            <div className="game">
                <div className="gameNavigation">
                    <Link className="gameNavigation__back" to="/"><i className="fas fa-chevron-left"></i> Back</Link>

                    <p className="gameNavigation__level">LEVEL: {sequence.length}</p>
                </div>
                <div className="gameGrid">
                    {colors?.map((color, i) => {
                        return <button onClick={(e) => {userInterAction(e.target.value, e.target.getAttribute("hue") * 1)}} key={i} className="gameBTN" value={color.name} hue={color.hue}></button>
                    })}
                </div>
                <div className="userSelection">
                    <h1 className="userSelection__heading">Your current selection</h1>
                    <div className="userSelectionSteps">
                        {userAnswer.map((answer, i) => {
                            return <span key={i} className="userSelectionStep" style={{backgroundColor: answer.name}}></span>
                        })}
                    </div>
                </div>
                
            </div>
        </>
    )
}

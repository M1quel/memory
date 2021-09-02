export default function validateUserInputs (userInputs, sequence, setGameOver, nextLevel) {

    userInputs.map (function(input, i) {
        if(input.name === sequence[i].name) {
            if(i + 1 === userInputs.length) {
                nextLevel();
                return "";
            } else {
                return ""
            }
        } else {
            if(window.localStorage.getItem("highscore")) {
                if(window.localStorage.getItem("highscore") * 1 < userInputs.length) {
                    window.localStorage.removeItem("highscore")
                    window.localStorage.setItem("highscore", userInputs.length)
                }
            } else {
                window.localStorage.setItem("highscore", userInputs.length)
            }
            setGameOver(true)
            return ""
        }
    })
}
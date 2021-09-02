export default function addToSequence (state, randomIndex) {
    var colors = [
        {
            "name": "white",
            "hue": 15000,
            "sat": 0
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
    var newSequence = [...state.sequence];
    newSequence.push(colors[randomIndex]);
    state.setSequence(newSequence);
}
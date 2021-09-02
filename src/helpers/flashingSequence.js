import setColors from './setColors';

export default async function flashingSequence (sequence, flashingLoopIndex, setFlashingLoopIndex) {
    var i = flashingLoopIndex - 1
    let currentStep = sequence[i];
    setColors(currentStep.name, currentStep.hue)
    setTimeout(function () {
        setColors("off", currentStep.hue)
        if(flashingLoopIndex < sequence.length) {
            setFlashingLoopIndex(flashingLoopIndex + 1)
            flashingSequence()
        };
    }, 1000)
        
}
#!/usr/bin/env node
/**
 * The goal of this challenge is to produce a perfectly sorted array of 20 numbers.
 * You are given an array of 20 empty spaces.
 * You will be given 20 random numbers between 0 and 1000, one at a time.
 * Before you see the next number, you must place the current number in the array at a location of your choice.
 * Choose spaces that will keep the numbers in order from smallest to largest.
 * Once a number has been placed, it cannot be moved.
 */

class Challenge {
    numSpaces;
    minNumber;
    maxNumber;
    
    get range() {
        return 1 + this.maxNumber - this.minNumber;
    }

    get rangeToIndexRatio() {
        return this.range / this.numSpaces
    }

    /**
     * Resulting array to place numbers in. Starts with all undefined spaces
     * @type {Array<number | undefined>}
     */
    resultArray;

    constructor(minNumber, maxNumber, numSpaces) {
        this.minNumber = minNumber;
        this.maxNumber = maxNumber;
        this.numSpaces = numSpaces;
        if (this.rangeToIndexRatio < 1) {
            throw new Error(`Number of spaces (${numSpaces}) must be less than the range of numbers between ${minNumber} and ${maxNumber} (${this.range})`) ;
        }
    }

    static playAuto(minNumber, maxNumber, numSpaces) {
        return (new Challenge(minNumber, maxNumber, numSpaces)).playAuto()
    }

    playAuto() {
        const result = this.generateSpacesArray();
        try {
            this.generateRandomNumbers().forEach((randomNumber) => this.handleTurnAuto(randomNumber, result))
        } catch (error) {
            console.error(error.message);
        }
        return result;
    }

    generateRandomNumbers() {
        const rangeArray = Array.from(Array(this.range), (_, index) => this.minNumber + index);
        return Array.from(Array(this.numSpaces), () => {
            const randomIndex = Math.floor(Math.random() * rangeArray.length)
            return rangeArray.splice(randomIndex, 1)[0]
        })
    }

    generateSpacesArray() {
        return Array.from(Array(this.numSpaces), () => undefined)
    }

    handleTurnAuto(randomNumber, result) {
        console.log('Handling', randomNumber);
        let indexGuess = Math.floor(this.numSpaces * (randomNumber / this.maxNumber)) - 1;
        let direction = 0;
        while (result[indexGuess] !== undefined) {
            console.log('Conflicting index:', indexGuess,', value:', result[indexGuess])
            const indexOffset = Math.ceil(Math.abs(randomNumber - result[indexGuess]) / this.rangeToIndexRatio)
            if (result[indexGuess] < randomNumber) {
                if (direction === -1) {
                    throw new Error('We lost :/')
                }
                direction = 1;
            } else if (direction === 1) {
                throw new Error('We lost :/')
            } else {
                direction = -1
            }
            indexGuess += indexOffset * direction
        }
        result[indexGuess] = randomNumber;
    }

}

(() => {
    const minNumber = 0;
    const maxNumber = 1000;
    const numSpaces = 20;
    const result = Challenge.playAuto(minNumber, maxNumber, numSpaces);
    console.log(result)

    console.log('Index | Value');
    console.log('------|------');
    result.forEach((value, index) => console.log(index.toString().padStart(6, ' '), '|', value));
})();
function getRandomKey(obj) {
    const keys = Object.keys(obj);
    const randomIndex = Math.floor(Math.random() * keys.length);
    return keys[randomIndex];
}

function getSingleOrRandom(array) {
    if (array.length === 1) {
        return array[0];
    } else if (array.length > 1) {
        const randomIndex = Math.floor(Math.random() * array.length);
        return array[randomIndex];
    } else {
        return null; // Return null if the array is empty
    }
}

function mergeArrays(obj) {
    // Concatenate all arrays into a single array
    const mergedArray = Object.values(obj).reduce((acc, curr) => acc.concat(curr), []);

    // Remove duplicates
    const uniqueArray = Array.from(new Set(mergedArray));

    return uniqueArray;
}

function getRandomMembers(array, numMembers, exclude=null) {
    // Clone the array to avoid mutating the original array

    if (exclude) {
        let index = array.indexOf(exclude);
        if (index !== -1) {
            array.splice(index, 1);
        }
    }

    const shuffledArray = array.slice();

    // Fisher-Yates (Knuth) shuffle algorithm
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }

    // Return the first five elements
    return shuffledArray.slice(0, numMembers);
}

function nameCleanup(countryName) {
    return countryName.includes('(') ? countryName.split('(')[0].trim() : countryName
}


const allCountries = Object.keys(prefixList);
const allPrefixes = mergeArrays(prefixList);

let randomCountry =  getRandomKey(prefixList)
let countryPrefix = getSingleOrRandom(prefixList[randomCountry])

let randomPrefixes = getRandomMembers(allPrefixes, 5, countryPrefix)
let randomCountries = getRandomMembers(allCountries, 5, randomCountry)



console.log('countries: ', allCountries)

console.log('prefixes: ', allPrefixes)

console.log('random country: ', nameCleanup(randomCountry))

console.log('one prefix of that country: ', countryPrefix)

console.log('random prefixes: ', randomPrefixes);

console.log('random countries: ', randomCountries.map(x => nameCleanup(x)));


window.onload = (event) => {

    let gameWrapper = document.getElementsByClassName('gameWrapper')
    let modeChooserButton = document.getElementsByClassName('modeChooserButton')[0];

    let buttonText = 'Guess Prefix'
    modeChooserButton.addEventListener('click', function (){
        let currentText = this.innerText;
        this.innerText = buttonText;
        buttonText = currentText;
            Array.from(gameWrapper).forEach(gw => gw.classList.toggle("hidden"))
        })


};





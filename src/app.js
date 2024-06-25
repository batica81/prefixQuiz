
const allCountries = Object.keys(prefixList);
const allPrefixes = mergeArrays(prefixList);

let randomCountry =  getRandomKey(prefixList)
let countryPrefix = getSingleOrRandom(prefixList[randomCountry])

let showCorrectStatus = false;

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

function initCountries() {
    let countryOptions = document.getElementsByClassName('countryOptions')[0];
    countryOptions.innerHTML = '';

    let randomCountry =  getRandomKey(prefixList)
    let countryPrefix = getSingleOrRandom(prefixList[randomCountry])
    this.innerText =  countryPrefix;



    // adding correct country to the list
    let tmpDiv = createDivWithTxtAndData(nameCleanup(randomCountry))
    tmpDiv.setAttribute("data-param", "correctAnswer");
    if (showCorrectStatus === true) {
        tmpDiv.classList.add('correctAnswer')
    } else {
        // create an array of countries excluding the correct one
        let randomCountries = getRandomMembers(allCountries, 3, randomCountry)

        randomCountries.forEach(rp => {
            let tmpDiv = createDivWithTxtAndData(nameCleanup(rp))
            tmpDiv.addEventListener('click', checkAnswer)
            countryOptions.appendChild(tmpDiv)
        })
    }
    tmpDiv.addEventListener('click', checkAnswer)
    countryOptions.appendChild(tmpDiv)

    shuffle_children(countryOptions)
}

function initPrefixes() {
    let prefixOptions = document.getElementsByClassName('prefixOptions')[0];
    prefixOptions.innerHTML = '';

    let randomCountry =  getRandomKey(prefixList)
    this.innerText =  nameCleanup(randomCountry)


    // adding correct prefix to the list
    let correctPrefix =  getSingleOrRandom(prefixList[randomCountry])
    let tmpDiv = createDivWithTxtAndData(correctPrefix)
    tmpDiv.setAttribute("data-param", "correctAnswer");
    if (showCorrectStatus === true) {
        tmpDiv.classList.add('correctAnswer')
    } else {
        // create an array of prefixes excluding the correct one
        let randomPrefixes = getRandomMembers(allPrefixes, 3, countryPrefix)

        randomPrefixes.forEach(rp => {
            let tmpDiv = createDivWithTxtAndData(rp)
            tmpDiv.addEventListener('click', checkAnswer)
            prefixOptions.appendChild(tmpDiv)
        })
    }
    tmpDiv.addEventListener('click', checkAnswer)
    prefixOptions.appendChild(tmpDiv)

    shuffle_children(prefixOptions)
}

function createDivWithTxtAndData(textContent) {
    // Create a new div element
    let div = document.createElement("div");

    // Set the text content
    div.textContent = textContent;

    // Optional: Add a class for styling
    div.classList.add("clickable-div");
    div.classList.add("answerWrapper");

    return div;
}

function checkAnswer() {
    if (this.getAttribute('data-param') === 'correctAnswer') {
        this.classList.add('correctAnswer')
    } else {
        this.classList.add('wrongAnswer')
    }
}

function shuffle_children(element) {
    for (var i = element.children.length; i >= 0; i--) {
        element.appendChild(element.children[Math.random() * i | 0]);
    }
}

function markCorrect(showCorrectStatusParam) {
    if (showCorrectStatusParam === true) {
        document.querySelectorAll('div[data-param="correctAnswer"]').forEach( function (c) {
            c.classList.add('correctAnswer');

            // classList.add('hidden')
        })
    } else if (showCorrectStatusParam === false){
        document.querySelectorAll('div[data-param="correctAnswer"]').forEach( function (c) {
            c.classList.remove('correctAnswer');

            // c.classList.remove('hidden');
        })
    }
}

function findCountryByPrefix(prefixList, wantedPrefix) {
    for (const country in prefixList) {
        if (prefixList[country].indexOf(wantedPrefix.toUpperCase()) !== -1) {
            return nameCleanup(country);
        }
    }
}

function updateResult() {
    const input = document.getElementById('twoLetterInput').value;
    if (input.length === 2) {
        document.getElementById('result').textContent = findCountryByPrefix(prefixList,input);
        document.getElementById('askedPrefix').textContent = input.toUpperCase();
        document.getElementById('twoLetterInput').value = '';
    } else {
        document.getElementById('twoLetterInput').value = document.getElementById('twoLetterInput').value.toUpperCase();
    }
}

window.onload = (event) => {

    if ("serviceWorker" in navigator) {
        navigator.serviceWorker
            .register("/service-worker.js")
            .then(serviceWorker => {
                console.log("Service Worker registered: ", serviceWorker);
            })
            .catch(error => {
                console.error("Error registering the Service Worker: ", error);
            });
    }

    let gameWrapper = document.getElementsByClassName('gameWrapper')

    let prefixGameWrapper = document.getElementsByClassName('prefixGameWrapper')[0]
    let countryGameWrapper = document.getElementsByClassName('countryGameWrapper')[0]
    let lookupGameWrapper = document.getElementsByClassName('lookupGameWrapper')[0]

    let showCorrectWrapper = document.getElementsByClassName('showCorrectWrapper')[0]

    let guessCountryButton = document.getElementsByClassName('guessCountryButton')[0];
    let guessPrefixButton = document.getElementsByClassName('guessPrefixButton')[0];
    let prefixLookupButton = document.getElementsByClassName('prefixLookupButton')[0];

    let currentPrefix = document.getElementsByClassName('currentPrefix')[0];
    let currentCountry = document.getElementsByClassName('currentCountry')[0];

    let darkModeButton = document.querySelector('#darkMode');
    let showCorrect = document.querySelector('#showCorrect');

    let twoLetterInput = document.querySelector('#twoLetterInput');

    const darkMode = new Darkmode({
        backgroundColor: 'darkgray'
    });

    showCorrect.addEventListener('change', function () {
        showCorrectStatus = !showCorrectStatus;
        markCorrect(showCorrectStatus);
    });

    twoLetterInput.addEventListener('input', function () {
        updateResult();
    });

    darkModeButton.addEventListener('click', function () {
        darkMode.toggle();
    });

    guessCountryButton.addEventListener('click', function (){
        Array.from(gameWrapper).forEach(gw => gw.classList.add("hidden"))
        countryGameWrapper.classList.remove("hidden");
        showCorrectWrapper.classList.remove("hidden");
    })

    guessPrefixButton.addEventListener('click', function (){
        Array.from(gameWrapper).forEach(gw => gw.classList.add("hidden"))
        prefixGameWrapper.classList.remove("hidden");
        showCorrectWrapper.classList.remove("hidden");
    })

    prefixLookupButton.addEventListener('click', function (){
        Array.from(gameWrapper).forEach(gw => gw.classList.add("hidden"))
        lookupGameWrapper.classList.remove("hidden");
        showCorrectWrapper.classList.add("hidden");
    })

    currentPrefix.addEventListener('click', initCountries)
    currentCountry.addEventListener('click', initPrefixes)
};

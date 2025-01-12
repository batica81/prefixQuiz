
const allCountries = Object.keys(prefixList);
const allPrefixes = mergeArrays(prefixList);

let randomCountry =  getRandomKey(prefixList)
let countryPrefix = getSingleOrRandom(prefixList[randomCountry])

let showCorrectStatus = false;
let currentLang = "rs"; // Default language

let correctCount = 0;
let totalCount = 0;
let didWrong = false;

function calculatePoints(correctCount, totalCount) {
    if (totalCount === 0) {return 0}
    else return Math.round((correctCount / totalCount) * 100)
}

function translate(key) {
    return translations[currentLang][key] || key;
}

function switchLanguage(lang) {
    currentLang = lang;
    updateTexts();
}

function updateTexts() {
    document.querySelectorAll("[data-translate]").forEach((el) => {
        const key = el.getAttribute("data-translate");
        el.innerText = translate(key);
    });
}

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
    return Array.from(new Set(mergedArray));
}

function getRandomMembers(array, numMembers, exclude=null) {
    // Clone the array to avoid mutating the original array

    if (exclude) {
        array = array.filter(item => item !== exclude);
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

function initCountries(currentPrefix) {
    let countryOptions = document.getElementsByClassName('countryOptions')[0];
    countryOptions.innerHTML = '';

    let randomCountry =  getRandomKey(prefixList)
    let countryPrefix = getSingleOrRandom(prefixList[randomCountry])
    currentPrefix.innerText =   countryPrefix.replace(/0/g, "Ø"); //

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

function initPrefixes(currentCountry) {
    let prefixOptions = document.getElementsByClassName('prefixOptions')[0];
    prefixOptions.innerHTML = '';

    let randomCountry =  getRandomKey(prefixList)
    currentCountry.innerText =  nameCleanup(randomCountry)

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
    div.textContent = textContent.replace(/0/g, "Ø");

    // Optional: Add a class for styling
    div.classList.add("clickable-div");
    div.classList.add("answerWrapper");
    return div;
}

function checkAnswer() {
    if (this.getAttribute('data-param') === 'correctAnswer') {
        this.classList.add('correctAnswer')
        if (!didWrong) correctCount += 1;
    } else {
        didWrong = true;
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
        })
    } else if (showCorrectStatusParam === false){
        document.querySelectorAll('div[data-param="correctAnswer"]').forEach( function (c) {
            c.classList.remove('correctAnswer');
        })
    }
}

function findCountryByPrefix(prefixList, wantedPrefix) {
    let result = [];
    for (const country in prefixList) {
        if (prefixList[country].some(prefix => prefix.startsWith(wantedPrefix.toUpperCase()))) {
            result.push( prefixList[country] + ' - ' +  nameCleanup(country));
        }
    }
    return result.length === 0 ? ['/'] : result;
}

function updateResult() {
    const input = document.getElementById('twoLetterInput').value;
    const resultContainer = document.getElementById('result');
    resultContainer.innerHTML = ''; // Clear previous results

    if (input.length === 2 || ['B','G','M','F','I','E','K','W','N'].includes(input.toUpperCase())) {
        const countries = findCountryByPrefix(prefixListForLookup, input);
        document.getElementById('askedPrefix').textContent = input.toUpperCase();
        countries.forEach(country => {
            const countryElement = document.createElement('div');
            countryElement.textContent = country;
            resultContainer.appendChild(document.createElement('br'));
            resultContainer.appendChild(countryElement);
            resultContainer.appendChild(document.createElement('br'));
        });
        if (input.length === 2 || countries.length === 1) {
            document.getElementById('askedPrefix').textContent = input.toUpperCase();
            document.getElementById('twoLetterInput').value = '';
        }
    } else {
        document.getElementById('twoLetterInput').value = document.getElementById('twoLetterInput').value.toUpperCase();
    }
}

window.onload = (event) => {

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  });
}

    let gameWrapper = document.getElementsByClassName('gameWrapper')
    let prefixGameWrapper = document.getElementsByClassName('prefixGameWrapper')[0]
    let countryGameWrapper = document.getElementsByClassName('countryGameWrapper')[0]
    let lookupGameWrapper = document.getElementsByClassName('lookupGameWrapper')[0]
    let showCorrectWrapper = document.getElementsByClassName('showCorrectWrapper')[0]
    let pointsWrapper = document.getElementsByClassName('pointsWrapper')[0];

    let guessCountryButton = document.getElementsByClassName('guessCountryButton')[0];
    let guessPrefixButton = document.getElementsByClassName('guessPrefixButton')[0];
    let prefixLookupButton = document.getElementsByClassName('prefixLookupButton')[0];

    let currentPrefix = document.getElementsByClassName('currentPrefix')[0];
    let currentCountry = document.getElementsByClassName('currentCountry')[0];

    let correctCountSpan = document.getElementsByClassName('correctCount')[0];
    let totalCountSpan = document.getElementsByClassName('totalCount')[0];
    let pointsPercentSpan = document.getElementsByClassName('pointsPercent')[0];

    let darkModeButton = document.querySelector('#darkMode');
    let langSelectButton = document.querySelector('#langSelect');
    let showCorrect = document.querySelector('#showCorrect');
    let twoLetterInput = document.querySelector('#twoLetterInput');

    const darkMode = new Darkmode({
        backgroundColor: 'darkgray'
    });

    showCorrect.addEventListener('change', function () {
        showCorrectStatus = !showCorrectStatus;
        markCorrect(showCorrectStatus);
        pointsWrapper.classList.add("hidden");
    });

    twoLetterInput.addEventListener('input', function () {
        updateResult();
    });

    darkModeButton.addEventListener('click', function () {
        darkMode.toggle();
    });

    langSelectButton.addEventListener('click', function () {
        currentLang === 'en'? currentLang = 'rs' : currentLang = 'en'
        switchLanguage(currentLang);
    });

    guessCountryButton.addEventListener('click', function (){
        Array.from(gameWrapper).forEach(gw => gw.classList.add("hidden"))
        countryGameWrapper.classList.remove("hidden");
        showCorrectWrapper.classList.remove("hidden");
        pointsWrapper.classList.remove("hidden");
    })

    guessPrefixButton.addEventListener('click', function (){
        Array.from(gameWrapper).forEach(gw => gw.classList.add("hidden"))
        prefixGameWrapper.classList.remove("hidden");
        showCorrectWrapper.classList.remove("hidden");
        pointsWrapper.classList.remove("hidden");
    })

    prefixLookupButton.addEventListener('click', function (){
        Array.from(gameWrapper).forEach(gw => gw.classList.add("hidden"))
        lookupGameWrapper.classList.remove("hidden");
        showCorrectWrapper.classList.add("hidden");
        pointsWrapper.classList.add("hidden");
        twoLetterInput.focus()
    })

     currentPrefix.addEventListener('click', function() {
        initCountries(currentPrefix);
        pointsWrapper.classList.remove("hidden");
        totalCountSpan.innerText = totalCount;
        correctCountSpan.innerText = correctCount;
        pointsPercentSpan.innerHTML = calculatePoints(correctCount, totalCount).toString();
        totalCount += 1;
        didWrong = false;
     });

    currentCountry.addEventListener('click', function() {
        initPrefixes(currentCountry);
        pointsWrapper.classList.remove("hidden");
        totalCountSpan.innerText = totalCount;
        correctCountSpan.innerText = correctCount;
        pointsPercentSpan.innerHTML = calculatePoints(correctCount, totalCount).toString();
        totalCount += 1;
        didWrong = false;
     });

    function initKeys() {
        keyboardJS.bind('space', function (e) {
            initCountries(currentPrefix);
            initPrefixes(currentCountry);
        });
        keyboardJS.bind('right', function (e) {
            initCountries(currentPrefix);
            initPrefixes(currentCountry);
        });
    }

    for (let i = 0; i < 4; i++) {
        keyboardJS.bind((i + 1).toString(), function(e) {
            if (document.querySelectorAll('.countryOptions .answerWrapper').length > i) {
                document.querySelectorAll('.countryOptions .answerWrapper')[i].click()
            }
        });
        keyboardJS.bind('num' + (i + 1).toString(), function(e) {
            if (document.querySelectorAll('.countryOptions .answerWrapper').length > i) {
                document.querySelectorAll('.countryOptions .answerWrapper')[i].click()
            }
        });
    }

    switchLanguage(currentLang);
    initKeys();
};

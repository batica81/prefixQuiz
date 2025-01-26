
const fs = require('fs');

// Get the file path from command line arguments
const filePath = process.argv[2];

if (!filePath) {
  console.error("Please provide a file path as an argument.");
  process.exit(1);
}

// Read the contents of the file
const fileContents = fs.readFileSync(filePath, 'utf8');

var prefixListForLookup;
var prefixList;

// Evaluate the file content to define variables in the current context
eval(fileContents); // Not recommended for production use

let fullArray1 = []
let fullArray2 = []

if (prefixListForLookup !== undefined) {
  for (const p in prefixListForLookup) {
    fullArray1 = [...fullArray1, ...prefixListForLookup[p]];
  }
}

if (prefixList) {
  for (const p in prefixList) {
    fullArray2 = [...fullArray2, ...prefixList[p]];
  }
}


const findDuplicates = (arr) => {
  let sorted_arr = arr.slice().sort(); // You can define the comparing function here. 
  // JS by default uses a crappy string compare.
  // (we use slice to clone the array so the
  // original array won't be modified)
  let results = [];
  for (let i = 0; i < sorted_arr.length - 1; i++) {
    if (sorted_arr[i + 1] === sorted_arr[i]) {
      results.push(sorted_arr[i]);
    }
  }
  return results;
}


console.log("Duplicates in prefixListForLookup:")
console.log(findDuplicates(fullArray1))

console.log("Duplicates in prefixList:")
console.log(findDuplicates(fullArray2))

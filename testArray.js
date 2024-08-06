function generateArray(range) {
    let parts = range.split('-');
    let start = parts[0];
    let end = parts[1];

    let prefixStart = start.slice(0, -1).toUpperCase();
    let startChar = start.slice(-1).toUpperCase();
    let endChar = end.slice(-1).toUpperCase();

    let result = [];
    for (let i = startChar.charCodeAt(0); i <= endChar.charCodeAt(0); i++) {
        result.push(`"${prefixStart + String.fromCharCode(i)}"`);
    }
    return result.join(', ');
}

// Get the range from command line arguments
const args = process.argv.slice(2);
if (args.length !== 1) {
    console.error('Please provide a range argument in the format "start-end".');
    process.exit(1);
}

const range = args[0];
console.log(generateArray(range));

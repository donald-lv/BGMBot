// doesn't produce special characters
const fs = require('node:fs');
const { join } = require('node:path');

const contents = fs.readFileSync(join(__dirname, "customCharEmojis.json"));
const customCharEmojis = JSON.parse(contents);

var charEmojis = {};

addRange("0", "9", "0️⃣");
addRange("A", "Z", "🇦");

for (i in customCharEmojis) {
  addChars(i, customCharEmojis[i]);
}

charEmojis = Object.keys(charEmojis)
.sort((a, b) => {return (b.length - a.length)})
.reduce((curr, val) => {curr[val] = charEmojis[val];
                        return curr}, {});

console.log(charEmojis);

charEmojisJSON = JSON.stringify(charEmojis, null, 4);
fs.writeFileSync(join(__dirname, "charEmojis.json"), charEmojisJSON, (err) => {if (err) throw err;} );



function addRange(startChar, endChar, startEquivChar) {
  delta = startEquivChar.codePointAt(0) - startChar.codePointAt(0);

  for (i = startChar.codePointAt(0); i <= endChar.codePointAt(0); ++i) {
    addChars(String.fromCodePoint(i), [String.fromCodePoint(i + delta)]);
  }
}

function addChars(char, equivs) {  
  if (char in charEmojis) {
    charEmojis[char] = charEmojis[char].concat(equivs); 
  } else {
    charEmojis[char] = equivs;
  }
}

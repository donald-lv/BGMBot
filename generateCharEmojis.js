// doesn't produce special characters
const fs = require('node:fs');

var charEmojis = {};

addRange("A", "Z", );
addRange("0", "9", "0️⃣");

charEmojisJSON = JSON.stringify(charEmojis, null, 4);
fs.writeFileSync("charEmojis.json", charEmojisJSON, (err) => {if (err) throw err;} );

function addRange(startChar, endChar, startEquivChar) {
  delta = startEquivChar.codePointAt(0) - startChar.codePointAt(0);

  for (i = startChar.codePointAt(0); i <= endChar.codePointAt(0); ++i) {
    charEmojis[String.fromCodePoint(i)] = String.fromCodePoint(i + delta);
  }
  

}
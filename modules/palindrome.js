const { PermissionsBitField, Collection } = require("discord.js");

module.exports = (message) => {
  if (
    !message.guild.members.me
      .permissionsIn(message.channel.id)
      .has(PermissionsBitField.Flags.AddReactions)
  )
    return;

  const { cooldowns } = message.client;

  const thisCmd = "palindrome";
  if (!cooldowns.has(thisCmd)) {
    cooldowns.set(thisCmd, new Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(thisCmd);
  const defaultCooldownDuration = 10;
  const cooldownAmount = defaultCooldownDuration * 1_000;
  if (timestamps.has(message.user.id)) {
    const expirationTime = timestamps.get(message.user.id) + cooldownAmount;
    if (now < expirationTime) {
      //const expiredTimestamp = Math.round(expirationTime / 1_000);
      return;
    }
  }

  try {
    let content = message.content.toLowerCase();
    if (containsShrimp(content)) message.react("🦐");
    if (content.includes("gatito")) message.react("1199693039623491624");
    if (content.includes("ghost")) message.react("👻");
    if (content.includes("bunny")) message.react("🐇");
    if (content.includes("nice")) message.react("1235647492285136907");
    if (content.includes("noice")) message.react("1235649381701521429");
    if (content.includes("mitsu")) message.react("1199783697243717712");

    if (content.includes("shrimps")) {
      message.react("🍤");
      message.react("1217870128427827311");
      message.react("1217870132785844265");
      message.react("1217870138557337690");
      message.react("1217870135852011620");
    }
  } catch (e) {
    console.log(e);
  }
};

function containsShrimp(input) {
  if (input.match(/http/)) return;
  const shrimpLetters = ["s", "h", "r", "i", "m", "p"];
  const inputLetters = input.toLowerCase().match(/[a-z]/g); // Extracting only letters and converting to lowercase
  const uniqueInputLetters = [...new Set(inputLetters)]; // Removing duplicate letters

  for (let letter of shrimpLetters) {
    if (!uniqueInputLetters.includes(letter)) {
      return false;
    }
  }

  return true;
}

// function containsGatito(input) {
//   if (input.match(/http/)) return;
//   const shrimpLetters = ["g", "a", "t", "i", "t", "o"];
//   const inputLetters = input.toLowerCase().match(/[a-z]/g); // Extracting only letters and converting to lowercase
//   const uniqueInputLetters = [...new Set(inputLetters)]; // Removing duplicate letters

//   for (let letter of shrimpLetters) {
//     if (!uniqueInputLetters.includes(letter)) {
//       return false;
//     }
//   }

//   return true;
// }

/*(str) => {
  if (str.length < 2) return false;
  if (isPalindrom(str) || containsShrimp(str)) return true;
  else return false;
};

function isPalindrom(str) {
  var letters = [];
  var rword = "";
  //put letters of word into stack
  for (var i = 0; i < str.length; i++) {
    letters.push(str[i]);
  }
  //pop off the stack in reverse order
  for (var i = 0; i < str.length; i++) {
    rword += letters.pop();
  }
  return rword == str;
}
*/

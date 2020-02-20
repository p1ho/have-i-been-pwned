var prompt = require('prompt')
var prompt_attributes = [{
    name: 'password',
    hidden: true
}]

prompt.start()
prompt.get(prompt_attributes, (err, result) => {
  if (err) {
    console.log(err)
    process.exit(1)
  } else {
    haveIBeenPwned(result.password)
  }
})

function haveIBeenPwned(pw) {
    var hash = require('crypto').createHash('sha1').update(pw).digest('hex').toUpperCase()
    var hash_substr = hash.substring(0, 5)
    var hash_truncate = hash.substring(5)

    const req = require('request')
    req(`https://api.pwnedpasswords.com/range/${hash_substr}`, (err, res, body) => {
      if (err) {
        console.error(err)
        process.exit(1)
      }
      const pwndList = body.split("\n").map(line => line.split(":")[0])
      if (pwndList.includes(hash_truncate)) {
        console.log("Your password got pwned!")
      } else {
        console.log("Your password is safe... for now!")
      }
    })
}

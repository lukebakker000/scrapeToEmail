var request = require('request'),
	cheerio = require('cheerio'),
	keypress = require('keypress'),
  nodemailer = require("nodemailer")

request('https://learn.jquery.com/using-jquery-core/selecting-elements/', function (error, response, body) {
  if (!error && response.statusCode == 200) {
  	$ = cheerio.load(body)
    var $data = []
    function scrapeData(){
      $('.toc-linked').each(function(){
        $data.push($(this).text().slice(5) + "\n")
      })
    }
    
    if(scrapeData){
      scrapeData()
    }
    
    console.log($data)
    console.log("Would you like the data to be sent to your email?\n(Y)es or (N)o?")
    keypress(process.stdin)
    
    process.stdin.on('keypress', function(ch, key){
  	if(key.name == 'y'){
  		console.log('Sending email.')
      var smtpTransport = nodemailer.createTransport("SMTP",{
        service: "Gmail",
        auth: {
          user: "email@ddress.com",
          pass: "password"
        }
      })
      var testObject = {start: "This is a", end: " test object"}
      smtpTransport.sendMail({
        from: "My Name <email@ddress.com>", // sender address
        to: "Your Name <email@ddress.com>", // comma separated list of receivers
        subject: "scrapeEmail", // Subject line
        text: $data // plaintext body // can't use objects
      }, function(error, response){
        if(error){
          console.log(error)
        }else{
          console.log("Message sent: " + response.message)
          process.exit()
        }
      })
  	} else if(key.name == 'n'){
  		console.log('Not sending email.')
  		process.stdin.pause()
  	}
  })
  }
})

process.stdin.setRawMode(true)
process.stdin.resume()

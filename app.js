const express = require('express');
const app = express();
const request = require('request');
const https = require('https');
const bodyParser = require('body-parser');
const { json } = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/signup.html')
})
app.get("/failure", function(req, res) {
    res.sendFile(__dirname + "/signup.html" )
})
app.post("/", function(req, res) {
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;
    
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fname,
                    LNAME: lname
                }
            }
        ]
    }
    const options = {
        method : "POST",
        auth: "srishti:b973c35f5e60070baed75c8914eba068-us20"
    }
    const jsonData= JSON.stringify(data);
    const url = "https://us20.api.mailchimp.com/3.0/lists/dab04d6a87";   
    const request = https.request(url, options, function(response) {
        if (response.statusCode == 200) {
            res.sendFile(__dirname + '/success.html')
            //res.send('Subscriber Details' + 'First Name:' + fname + 'Last Name:' + lname + 'Email:' + email)
        }
        else {
            res.sendFile(__dirname + '/failure.html')
            //res.send('Something went wrong!!')
        }
        response.on("data", function(data) {
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end();
    
})
app.post("/failure", function(req, res) {
    res.redirect("/");
})


app.listen(process.env.PORT || 3000, function() {
    console.log('App is listening to port 3000')
})

//API Key
//b973c35f5e60070baed75c8914eba068-us20
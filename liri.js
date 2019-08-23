var keys = require('./utils/keys')
var axios = require('axios');


var search = {
    command: "",
    searchString: ""
}

require("dotenv").config()

var Spotify = function (keys) {
    this.id = keys.id
    this.secret = keys.secret
}

var searchConcert = function (searchTerm) {
    axios({
        method: "GET",
        url: `https://rest.bandsintown.com/artists/${searchTerm}/events?app_id=codingbootcamp`
    })
        .then(function (response) {
            console.log(response)
        })
        .catch(function (err) {
            console.log(err)
        })

}


var spotify = new Spotify(keys.spotify);

process.argv.splice(2).forEach(function (inputString, index) {

    if (index === 0) {
        search.command = inputString;
    }
    else {
        search.searchString = search.searchString + inputString
    }
})

if (search.command === "concert-this") {
    searchConcert(search.searchString);
}


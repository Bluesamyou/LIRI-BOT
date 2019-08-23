var keys = require('./utils/keys')
var axios = require('axios');
var Logger = require('./utils/logger')
var moment = require('moment')

var search = {
    command: "",
    searchString: ""
}

require("dotenv").config()

var logger = new Logger("LIRI BOT")

var log = logger.log.bind(logger)


var Spotify = function (keys) {
    this.id = keys.id
    this.secret = keys.secret
}

var searchConcert = function (searchTerm) {
    log("SEARCHING FOR CONCERTS", "info")
    axios({
        method: "GET",
        url: `https://rest.bandsintown.com/artists/${searchTerm}/events?app_id=codingbootcamp`
    })
        .then(function (response) {
            if (response.data.length > 0) {

                var showsArray = []
                log(`WE FOUND THE FOLLOWING CONCERTS FOR ${response.data[0].lineup[0].toUpperCase()}`, "success")
                log("===============================================================================\n", "success", false)

                response.data.forEach(function (show) {
                    showsArray.push({
                        "Show Arena": show.venue.name,
                        "City": show.venue.city,
                        "Country": show.venue.country,
                        "Show date": moment(show.datetime).format('LLLL')

                    })
                })
                console.table(showsArray)
            }
            else {
                log("Whoops looks like that didn't work, Please try again", "fail")
            }


        })
        .catch(function (err) {
            console.log(err)
            log("Whoops looks like that didn't work, Please try again", "fail")
        })

}

var searchSpotify


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
else if (search.command === "spotify-this-song") {
    searchSpotify(search.searchString)
}

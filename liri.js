var keys = require('./utils/keys')
var axios = require('axios');
var Logger = require('./utils/logger')
var moment = require('moment')
var Spotify = require('node-spotify-api');

var search = {
    command: "",
    searchString: ""
}

require("dotenv").config()

var logger = new Logger("LIRI BOT")

var log = logger.log.bind(logger)

var searchConcert = function (searchTerm) {
    log("SEARCHING FOR CONCERTS \n", "info")
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

var searchSpotify = function (searchTerm) {
    var displayArray = []
    spotify.search(
        {
            type: 'track',
            query: searchTerm
        }
        , function (err, data) {
            if (err) {
                return log(`Looks like we encountered an error: ${err}`);
            }

            data.tracks.items.forEach(function (trackitem) {
                log(`ARTIST       : ${trackitem.artists[0].name}`, 'success', false)
                log(`SONG NAME    : ${trackitem.name}`, 'success', false)
                log(`ALBUM NAME   : ${trackitem.album.name}`, 'success', false)
                log(`PREVIEW LINK : ${trackitem.preview_url}`, 'success', false)
                log('===========================================================================================================================\n', 'default', false)

            })

        });
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
else if (search.command === "spotify-this-song") {
    searchSpotify(search.searchString)
}

var keys = require('./utils/keys')
var fs = require('fs')
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
            if (response.data.length === 0) {
                return log("Looks like we didn't find any matches for that... Please try again", "fail");
            }
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


        })
        .catch(function (err) {
            console.log(err)
            log("Whoops looks like that didn't work, Please try again", "fail")
        })

}

var searchSpotify = function (searchTerm) {
    var displayArray = []
    log("SEARCHING SPOTIFY FOR SONGS \n", 'info')
    spotify.search(
        {
            type: 'track',
            query: searchTerm
        }
        , function (err, data) {
            if (err) {
                return log(`Looks like we encountered an error: ${err}`, 'fail');
            }

            if (data.tracks.items === 0) {
                return log("Looks like we didn't find any matches for that... Please try again", "fail");
            }

            log("WE FOUND THE FOLLOWING MATCHING TRACKS: \n", 'success')

            data.tracks.items.forEach(function (trackitem) {
                log(`ARTIST       : ${trackitem.artists[0].name}`, 'success', false)
                log(`SONG NAME    : ${trackitem.name}`, 'success', false)
                log(`ALBUM NAME   : ${trackitem.album.name}`, 'success', false)
                log(`PREVIEW LINK : ${trackitem.preview_url}`, 'success', false)
                log('===========================================================================================================================\n', 'default', false)

            })

        });
}

var movieSearch = function (searchTerm) {
    log("FETCHING MOVIE INFO\n", 'info')
    axios({
        method: "GET",
        url: `http://www.omdbapi.com/?t=${searchTerm}&apikey=trilogy&`
    })
        .then(function (response) {
            var rottenTomatoesScore = ""

            response.data['Ratings'].forEach(function (rating) {
                if (rating['Source'] === "Rotten Tomatoes") {
                    rottenTomatoesScore = rating['Value']
                }
            })

            // response.data
            log(`TITLE                  : ${response.data['Title']}`, 'success', false)
            log(`YEAR                   : ${response.data['Year']}`, 'success', false)
            log(`RATING                 : ${response.data['imdbRating']}`, 'success', false)
            log(`ROTTEN TOMATOES RATING : ${rottenTomatoesScore}`, 'success', false)
            log(`COUNTRY                : ${response.data['Country']}`, 'success', false)
            log(`PLOT                   : ${response.data['Plot']}`, 'success', false)
            log(`ACTORS                 : ${response.data['Actors']}`, 'success', false)


        })
        .catch(function (err) {
            log('An error occured fetching the data', 'fail')
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
else if (search.command === "spotify-this-song") {
    searchSpotify(search.searchString)
}
else if (search.command === "movie-this") {
    movieSearch(search.searchString)
}
else if (search.command === "do-what-it-says") {
    fs.readFile('./utils/random.txt', function (err, data) {
        if (err) {
            return log("Unable to run command", 'fail')
        }
        searchSpotify(data.toString().split(',')[1])
    })
}
else {
    log("That command is unrecognised... Please try again", 'fail')
}


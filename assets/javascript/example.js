/* ====================================
 * Some documentation
 * ==================================== 
 * 
 * API documentation
 * ----------------------------------
 *  flight API search: 
 *  https://developers.amadeus.com/self-service/category/air/api-doc/flight-low-fare-search/api-reference
 * 
 * hotel API search:
 * https://developers.amadeus.com/self-service/category/hotel/api-doc/hotel-search/api-reference
 * 
 * resource for flight and hotel search:
 * https://documenter.getpostman.com/view/2672636/RWEcPfuJ?version=latest#8196c48f-30f9-4e3b-8590-e22f96da8326
 * 
 * */

/* ====================================
 * Database setup
 * ==================================== */
//Sorry, I don't have a clue how to hide this key & make it work on github at the same time
var config = {
    apiKey: "AIzaSyDju-ufXCy5nHMPUefNuZu6EjGC5kdLd9I",
    authDomain: "authentication-43ba6.firebaseapp.com",
    databaseURL: "https://authentication-43ba6.firebaseio.com",
    storageBucket: "authentication-43ba6.appspot.com"
};

firebase.initializeApp(config); //starting database (jtsai)

//setting database variables, one for the database itself, and one for the authentication stuff (jtsai)
const database = firebase.database();
const dbAuth = database.ref('/authentication');

// var key = {  };
// dbAuth.push(key);

/* ====================================
 * Non-database Global Variables
 * ==================================== */

// You can also use these values as examples and for testing

// Test Full URLS
var testFlightURL = "https://test.api.amadeus.com/v1/shopping/flight-offers?origin=MAD&destination=PAR&departureDate=2019-12-01&returnDate=2019-12-28 &max10";
var testHotelURL = "https://test.api.amadeus.com/v2/shopping/hotel-offers?cityCode=LON";
var testRestaurantURL = "https://api.yelp.com/v3/businesses/search?term=delis&latitude=37.786882&longitude=-122.399972";

// Test values
var testFlightValue = "origin=MAD&destination=PAR&departureDate=2019-12-01&returnDate=2019-12-28 &max10";
var testHotelValue = "cityCode=LON";
var testRestaurantValue = "term=delis&latitude=37.786882&longitude=-122.399972";

/* ====================================
 * Initialization of document
 * ==================================== */
//Default hiding all the sections
$("section").hide();


/* ====================================
 * Other functions
 * ==================================== */
/* not sure where these should go, guess it depends on what's the most convenient */


/* ====================================
 * Ajax queries
 * ==================================== */
/* You guys will have to create the search queries in your function and pass it here */
function flightAPI(queryValues) {

    //base url for the API, this is the api site we're connecting to
    var queryBaseURL = "https://test.api.amadeus.com/"; 

    //the final URL that has the query terms added to the end
    var queryURL = 
        queryBaseURL + "v1/shopping/flight-offers?" + queryValues;

    //So I'm using an API that requires an authentication token and it really doesn't want you to commit your key and stuff anywhere
    
    //referencing firebase in order to get keys from there (jtsai)
    //This is crap security, but still better than nothing. (jtsai)
    dbAuth.once("value", function(snapshot) {
        var cid, csec;  //creating variables for keys
        cid = snapshot.child('amadeusKey').val();
        csec = snapshot.child('amadeusSecret').val();
        //console.log(`cId: ${cid} cSec: ${csec}`);

        //using the keys from firebase to get a token (this token expires so I figured it'd be safer to make sure it's called whenever you need this flightAPI query) (jtsai)
        var auth = {
            "url": queryBaseURL + "v1/security/oauth2/token",
            "method": "POST",
            "timeout": 0,
            "data": {
                "client_id": cid,
                "client_secret": csec,
                "grant_type": "client_credentials"
            }
        };

        $.ajax(auth).done(function (response) {
            token = response;
            //console.log(token);
            //console.log("Access token:" + token.access_token);
            var tokenBearer = "Bearer " + token.access_token;
            //console.log(tokenBearer);

             /** ----------------------------------------------
             *  Once we've authenticated stuff
             * ---------------------------------------------- */
            var settings = {
                "async": true,
                "crossDomain": true,
                "url": queryURL,
                "method": "GET",
                "headers": {
                    "Accept": "application/vnd.amadeus+json",
                    "Authorization": tokenBearer
                }
            }

            $.ajax(settings).then( function(response) {
                var queryResult = response;
                // console.log("AJAX YOU BETTER WORK!");
                // console.log(queryResult);

                /** ----------------------------------------------
                 *  variables for stuff you want to get from the API query go here
                 *  
                 *  Example for getting data you want
                 *      var hotelName = queryResult.name;
                 *  
                 *  Example for printing out data multiple times
                 *      for(let i=0; i < queryResult.data[i]) {
                 *  
                 *      //Getting the data we wanted
                 *          //(getting the source url of the image from the queryResults Object)
                 *          imgSrc = queryResult.data[i].url; 
                 *  
                 *          //(getting the description data from the queryResults Object)
                 *          restaurantDescription = queryResult.data[i].description 
                 *  
                 *          <more data and variables here>
                 *          
                 *          //Printing the data we wanted here
                 *  
                 *          //(setting the image source url for an image in the html)
                 *          $('img').attr('src') = imgSrc; 
                 *  
                 *          //(making a paragraph with restaurantDescription content as its text)
                 *          $('p').text(restaurantDescription);
                 *      }
                 * ---------------------------------------------- */
            });
        });
    });
}

// You guys will have to create the search queries in your function and pass it here
function hotelAPI(queryValues) {
    //base url for the API
    var queryBaseURL = "https://test.api.amadeus.com/"; 

    //the final URL that has the query terms added to the end
    var queryURL = 
        queryBaseURL + "v2/shopping/hotel-offers?" + queryValues;
    
    //referencing firebase in order to get keys from there (jtsai)
    dbAuth.once("value", function(snapshot) {
        var cid, csec;  //creating variables for keys
        cid = snapshot.child('amadeusKey').val();
        csec = snapshot.child('amadeusSecret').val();
        //console.log(`cId: ${cid} cSec: ${csec}`);

        //using the keys from firebase to get a token (this token expires so I figured it'd be safer to make sure it's called whenever you need this hotelAPI query) (jtsai)
        var auth = {
            "url": queryBaseURL + "v1/security/oauth2/token",
            "method": "POST",
            "timeout": 0,
            "data": {
                "client_id": cid,
                "client_secret": csec,
                "grant_type": "client_credentials"
            }
        };

        $.ajax(auth).done(function (response) {
            token = response;
            //console.log(token);
            //console.log("Access token:" + token.access_token);
            var tokenBearer = "Bearer " + token.access_token;
            //console.log(tokenBearer);

            //once authentication is done:
            // Finally starting the actual ajax query for hotel data(jtsai)
            var settings = {
                "async": true,
                "crossDomain": true,
                "url": queryURL,
                "method": "GET",
                "headers": {
                    "Accept": "application/vnd.amadeus+json",
                    "Authorization": tokenBearer
                }
            }

            $.ajax(settings).then( function(response) {
                var queryResult = response;
                // console.log("AJAX YOU BETTER WORK!");
                // console.log(queryResult);

                /** ----------------------------------------------
                 *  variables for stuff you want to get from the API query go here
                 *  
                 *  Example for getting data you want
                 *      var hotelName = queryResult.name;
                 *  
                 *  Example for printing out data multiple times
                 *      for(let i=0; i < queryResult.data[i]) {
                 *  
                 *      //Getting the data we wanted
                 *          //(getting the source url of the image from the queryResults Object)
                 *          imgSrc = queryResult.data[i].url; 
                 *  
                 *          //(getting the description data from the queryResults Object)
                 *          restaurantDescription = queryResult.data[i].description 
                 *  
                 *          <more data and variables here>
                 *          
                 *          //Printing the data we wanted here
                 *  
                 *          //(setting the image source url for an image in the html)
                 *          $('img').attr('src') = imgSrc; 
                 *  
                 *          //(making a paragraph with restaurantDescription content as its text)
                 *          $('p').text(restaurantDescription);
                 *      }
                 * ---------------------------------------------- */
            });
        });
    });
}

function restaurantAPI(queryValues) {

    /* this is the url for the API servers. All things related to this API go through this URL */
    var queryBaseURL = "https://api.yelp.com/v3/"; 

    //final yelp query
    var queryURL = 
        "https://cors-anywhere.herokuapp.com/" + queryBaseURL + "businesses/search?" + queryValues;

    //referencing firebase in order to get keys from there (jtsai)
    dbAuth.once("value", function(snapshot) {
        var cid; //creating variables for keys
        cid = snapshot.child('yelpKey').val();
        //console.log(`yelp token: ${cid}`);

        /* Setting up the text for the token header */
        var tokenBearer = "Bearer " + cid; 

        /* using the keys from firebase to get a token (jtsai) */
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": queryURL,
            "method": "GET",
            "contentType": "text/json",
            "dataType": "json",
            "cache": true,
            "headers": {
                "Accept": "*/*",
                "Access-Control-Allow-Origin" : "*",
                "Authorization": tokenBearer
            }
        }

        $.ajax(settings).then( function(response) {
            var queryResult = response;
            // console.log(response);

            /** ----------------------------------------------
             *  variables for stuff you want to get from the API query go here
             *  
             *  Example for getting data you want
             *      var hotelName = queryResult.name;
             *  
             *  Example for printing out data multiple times
             *      for(let i=0; i < queryResult.data[i]) {
             *  
             *      //Getting the data we wanted
             *          //(getting the source url of the image from the queryResults Object)
             *          imgSrc = queryResult.data[i].url; 
             *          restaurantDescription = queryResult.data[i].description //(getting the description data from the queryResults Object)
             *          <more data and variables here>
             *          
             *          //Printing the data we wanted here
             *          $('img').attr('src') = imgSrc; //setting the image source url for an image in the html
             *          $('p').text(restaurantDescription); //making a paragraph with restaurantDescription content as its text
             *      }
             * ---------------------------------------------- */
        });
    })
}

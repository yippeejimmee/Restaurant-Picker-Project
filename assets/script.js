var searchForm = $('#search-form');
var searchBtn = $('.searchBtn');
// var searchQuery = ('#search-place');
var searchQueryPlace = $('.form-inputPlace');
var searchQueryFood = $('.form-inputFood')
var apiKey = "gJVmTi7vwWY--jKnwBsPJdLiPDsil3tcQzGmNEpsaoBkFKdkMwmTdiB_RCkLqnrExNMK-VW2twwvYqNssc1H8r25mJE0L-ZTnpq2xSa88h65tb8IzboCX_C1UHFrYnYx"
var dogFactEl = document.getElementById("#dog-fact");
var dogRun = document.querySelector(".walkingDog");
let l = document.querySelector("#dogHeaderImage").offsetWidth;
var margin = 0;
var selectedQuery = "";
var selectedRestaurant = "";
var locationName = "";
var restaurantName = "";


function getLocationResults(e) {
    e.preventDefault();

    //takes query of user takes its value and stores it as searchRequest
    var searchRequest = searchQueryPlace.val()
    var myHeaders = new Headers();

    //creating appropriate header to utilize API
    myHeaders.append("Authorization", "Bearer " + apiKey);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    //inserts user location request to find a beach or park in that area
    fetch("https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?&limit=5&categories=parks,beaches&location=" + searchRequest, requestOptions)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            var i = 0;

            //loops through each of the retrieved data and places them into a object to be stored in localstorage
            data.businesses.forEach(function (item) {
                var searchResult = {
                    name: item.name,
                    address: item.location.address1,
                    city: item.location.city,
                    zipcode: item.location.zip_code,
                    picture: item.image_url,
                }

                //converts data to string and stores it in local storage
                localStorage.setItem("result" + [i], JSON.stringify(searchResult));
                i++;
            })
        })

        .then(function addAddressInformationToPage() {
            var localStorageAddressInformation = [];
            for (i = 0; i < 5; i++) {
                var resultIndex = "result" + [i];

                //loops through and retries information regarding the locations from local storage and places it in array
                localStorageAddressInformation = JSON.parse(window.localStorage.getItem(resultIndex));

                //combines all the address information into one variable for easier consumption
                var completeAddress = localStorageAddressInformation.address + ", " + localStorageAddressInformation.city + " "
                localStorageAddressInformation.zipcode;

                //literal template of information regarding location to be appended to parent element and show on screen
                var searchResultDataDisplayed = `
                    <container id="searchResult${i}" class="resultsContainer">
                        <div class="resultPicture">
                            <img id="searchResultImage${i}" class="searchResultImage" src="${localStorageAddressInformation.picture}"/>
                        </div>
                        <div class="resultInfo">
                            <span class="locationTitle">${localStorageAddressInformation.name}</span>
                            <span>${completeAddress}</span>
                            <button id="foodOption${i}" type="button" class="btn btn-light">Eat Here</button>
                        </div>
                    </container>
                `
                //append the information above to the parent element
                $("#displaySearchResults").append(searchResultDataDisplayed);

                //event handling on created divs to remove all search results when clicked on 
                $("#displaySearchResults").on("click", `#foodOption${i}`, function (e) {
                    e.preventDefault();

                    //storing address of location into variable selectedQuery
                    var selectedQuery = `${localStorageAddressInformation.address}`;
                    searchResultDataDisplayed = "";

                    //storing name of location in variable location name
                    locationName = `${localStorageAddressInformation.name}`;

                    //when user clicks on location of choice, this will remove all locations from screen
                    $("#displaySearchResults").remove(searchResultDataDisplayed)

                    //run the restaurant search with address of location as anchor point so all restaurants are relevant/close to that location
                    populateRestaurant(selectedQuery);
                })
            }

        }).catch(error => console.log('error', error));
}


function populateRestaurant(selectedQuery) {

    //clears local storage of location information
    localStorage.clear();

    //gets value of food that user searched for and stores it into foodRequest
    var foodRequest = searchQueryFood.val();
    var myHeaders = new Headers();

    //makes header appropriate for API use
    myHeaders.append("Authorization", "Bearer " + apiKey);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    //run yelp API with users food preference input and address of location to return restaurants near that location
    fetch(`https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=${foodRequest}&limit=5&categories=restaurants&location=${selectedQuery}`, requestOptions)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log("Hello")
            console.log(data);
            var i = 0;

            //loop through the returned data and add relevant information to the restaurantObject object
            data.businesses.forEach(function (item) {
                const restaurantObject = {
                    name: item.name,
                    address: item.location.address1,
                    city: item.location.city,
                    zipcode: item.location.zip_code,
                    picture: item.image_url,
                    phone: item.display_phone,
                    cost: item.price,
                    rating: item.rating,
                }

                //store the restaurantObject object into local storage to be consumed later on
                localStorage.setItem("restaurantresults" + [i], JSON.stringify(restaurantObject));
                i++
            })
        })
        .then(function addRestaurantInformationToPage() {
            var localStorageRestaurantInformation = [];
            for (i = 0; i < 5; i++) {
                var restaurantIndex = "restaurantresults" + [i];

                //getting data from local storage by index 
                localStorageRestaurantInformation = JSON.parse(window.localStorage.getItem(restaurantIndex));

                //replacing undefined price value with reading string
                if (localStorageRestaurantInformation.cost == undefined) {
                    localStorageRestaurantInformation.cost = "No pricing yet";
                }

                //creating complete address from data for easier consumption
                var completeAddress = localStorageRestaurantInformation.address + ", " + localStorageRestaurantInformation.city + " "
                localStorageRestaurantInformation.zipcode;

                //literal template of information regarding restaurant to be appended to parent element and show on screen
                var searchRestaurantDataDisplayed = `
                <container id="restaurantResult${i}" class="resultsContainer">
                  <div>
                    <img id="restaurantResultImage${i}" class="searchResultImage" src="${localStorageRestaurantInformation.picture}">
                  </div>
                  <div class="resultInfo">
                    <span class="locationTitle">${localStorageRestaurantInformation.name}</span>
                    <hr style = "margin: 0;">
                    <span>${completeAddress}</span>
                    <span>${localStorageRestaurantInformation.phone}</span>
                    <span>Pricing: ${localStorageRestaurantInformation.cost}</span>
                    <span>Rating: ${localStorageRestaurantInformation.rating}</span>
                  </div>
                    <div class="resultInfoBtn">
                     <button id="restaurantOption${i}" type="button" class="btn btn-light">Eat Here</button>
                    </div>
                </container>
                `

                //delegating onclick function to restaurant options to delete all options when clicked on and store selected restaurant information in variable
                $("#displayRestaurantResults").on("click", `#restaurantOption${i}`, function (e) {
                    e.preventDefault();
                    selectedRestaurant = `${localStorageRestaurantInformation.address}`
                    restaurantName = `${localStorageRestaurantInformation.name}`

                    //run addressSearch function while passing restaurant address and location address
                    addressSearch(selectedRestaurant, selectedQuery)
                    searchRestaurantDataDisplayed = "";

                    //remove all restaurant options from page
                    $("#displayRestaurantResults").remove(searchRestaurantDataDisplayed)
                })

                //add all the restaurant options to the screen 
                $("#displayRestaurantResults").append(searchRestaurantDataDisplayed);
            };
        })
}

//call function for moving dog across screen
moveDog();

function moveDog() {

    //runs the trotRight function every 20 ms
    setInterval(trotRight, 20);

    //recalls the movedog function for continued loop
    moveDog;
}

function trotRight() {

    //if the margin variable does not equal width of screen, add 1 to margin the margin-left CSS
    if (margin !== l) {
        dogRun.style.marginLeft = margin + "px";
        margin += 2;

        //if margin variable equals width of screen, set margin-left CSS back to 0
    } else if (margin == l) {
        dogRun.style.marginLeft = 0;
        margin = 0;
    }
}


// random dog fact API
// var dogFactEl = document.querySelector("#dog-fact");
// var url = "http://dog-api.kinduff.com";
function fetchDogFact() {

    var dogFactUrl = 'https://cors-anywhere.herokuapp.com/http://dog-api.kinduff.com/api/facts';
    fetch(dogFactUrl)

        .then(response => {
            console.log(response);
            return response.json();

        }).then(function (data) {
            console.log("data", data);

            var dogFactAPIData = data.facts;
            var dogFactData = `<p>${dogFactAPIData}</p>`;

            $('#dogFactDisplay').append(dogFactData);

        })
        .catch(error => console.log('error', error));
}

//run fetchDogFact function as soon as window loads
$(document).ready(fetchDogFact);

//loop through and create directions from restraunt park 
function addressSearch(restaurant, park) {

    //utilizes mapquest API to develop directions from passed in restaurant address input to passed in location address input
    fetch(`http://www.mapquestapi.com/directions/v2/route?key=kjB9lPrpbc0GrGOIyTCQIBKimoouOGE1&from=${restaurant}&to=${park}`)
        .then(response => response.json())
        .then(function (data) {
            console.log(data);

            //taking global data and making it local, to be used 
            var localName = locationName

            //creating template literal to append to directions element
            var directionsTitle = `<div id="directionsTitle"> 
            <div id="secondPartDirections"> Directions from ${restaurantName} to ${localName} </div> </div>`
            $("#displayDirections").append(directionsTitle);

            //loop through the response from mapquest API and pull directions 
            for (let index = 0; index < data.route.legs[0].maneuvers.length; index++) {

                //creating template literal of each step of direction to append it to the directions element
                var listofDirections = `
                <p class="stepDirections"> ${index + 1}. ${data.route.legs[0].maneuvers[index].narrative} </p>
                `
                $("#directionsTitle").append(listofDirections);
                // directions.push(data.route.legs[0].maneuvers[index])
            }
        })

    //got all directions inside of directions variable, only need to append it to element with id=displaydirections and finish.
    ;

}


// getDirections();

// function getDirections() {
//     navigator.geolocation.getCurrentPosition(addressSearch, console.log)
// }
// var directions = `http://www.mapquestapi.com/directions/v2/route?key=kjB9lPrpbc0GrGOIyTCQIBKimoouOGE1&from


//DANIEL ADDING API SCRIPT TO FETCH Random Dog Picture
//On page load trigger the API
function addRandomImage(message) {
    var imageURL = message;
    console.log(imageURL);
    $("#randomDogHeaderImage").attr("src", imageURL);
}

function fetchDogPicture() {
    var fetchDogPictureEndpoint = "https://dog.ceo/api/breeds/image/random";
    fetch(fetchDogPictureEndpoint, {}).then(response => {
        return response.json();
    }).then(function (data) {
        console.log(data);
        console.log(data.message);
        addRandomImage(data.message);
    }).catch(error =>
        console.log("error", error));
}

$(document).ready(fetchDogPicture);

//ENDING RANDOM DOG PICTURE SCRIPT


function hideStarterElements() {
    $("#foodSearchParameters").addClass("hideContainer");
    $("#randomDogHeaderImage").addClass("hideContainer");
}

//initialize program
searchForm.on('submit', getLocationResults);

$(document).ready(hideStarterElements);
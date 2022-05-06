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


function getLocationResults(e) {
    e.preventDefault();

    var searchRequest = searchQueryPlace.val()
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + apiKey);
    console.log(searchRequest);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch("https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?&limit=10&categories=parks,beaches&location=" + searchRequest, requestOptions)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            var i = 0;

            data.businesses.forEach(function (item) {
                var searchResult = {
                    name: item.name,
                    address: item.location.address1,
                    city: item.location.city,
                    zipcode: item.location.zip_code,
                    picture: item.image_url,
                }
                localStorage.setItem("result" + [i], JSON.stringify(searchResult));
                i++;
            })
        })
        .then(function addAddressInformationToPage() {
            var localStorageAddressInformation = [];
            for (i = 0; i < 3; i++) {
                var resultIndex = "result" + [i];
                localStorageAddressInformation = JSON.parse(window.localStorage.getItem(resultIndex));
                console.log(localStorageAddressInformation);
                console.log(localStorageAddressInformation.address);
                console.log(localStorageAddressInformation.name);
                console.log(localStorageAddressInformation.picture);
                var completeAddress = localStorageAddressInformation.address + ", " + localStorageAddressInformation.city + " "
                localStorageAddressInformation.zipcode;
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

                $("#displaySearchResults").append(searchResultDataDisplayed);

                //event handling on created divs to remove all search results when clicked on 
                $("#displaySearchResults").on("click", `#foodOption${i}`, function (e) {
                    e.preventDefault();
                    console.log("clear out results");
                    var selectedQuery = `${localStorageAddressInformation.address}`;
                    searchResultDataDisplayed = "";
                    $("#displaySearchResults").remove(searchResultDataDisplayed)
                    populateRestaurant(selectedQuery);
                })
            }

        }).catch(error => console.log('error', error));
}


function populateRestaurant(selectedQuery) {
    localStorage.clear();
    var foodRequest = searchQueryFood.val();
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + apiKey);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(`https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=${foodRequest}&limit=10&categories=restaurants&location=${selectedQuery}`, requestOptions)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log("Hello")
            console.log(data);
            var i = 0;

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
                localStorage.setItem("restaurantresults" + [i], JSON.stringify(restaurantObject));
                i++
            })
        })
        .then(function addRestaurantInformationToPage() {
            var localStorageRestaurantInformation = [];
            for (i = 0; i < 3; i++) {
                var restaurantIndex = "restaurantresults" + [i];
                localStorageRestaurantInformation = JSON.parse(window.localStorage.getItem(restaurantIndex));
                console.log(localStorageRestaurantInformation);
                console.log(localStorageRestaurantInformation.address);
                console.log(localStorageRestaurantInformation.name);
                console.log(localStorageRestaurantInformation.picture);
                console.log(localStorageRestaurantInformation.phone);
                console.log(localStorageRestaurantInformation.cost);
                console.log(localStorageRestaurantInformation.rating);
                if (localStorageRestaurantInformation.cost == undefined) {
                    localStorageRestaurantInformation.cost = "No pricing yet";
                }
                var completeAddress = localStorageRestaurantInformation.address + ", " + localStorageRestaurantInformation.city + " "
                localStorageRestaurantInformation.zipcode;
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
                $("#displayRestaurantResults").on("click", `#restaurantOption${i}`, function (e) {
                    e.preventDefault();
                    selectedRestaurant = `${localStorageRestaurantInformation.address}`
                    addressSearch(selectedRestaurant, selectedQuery)
                    searchRestaurantDataDisplayed = "";
                    $("#displayRestaurantResults").remove(searchRestaurantDataDisplayed)
                })

                $("#displayRestaurantResults").append(searchRestaurantDataDisplayed);
            };
        })
}

// moveDog();

function moveDog() {
    console.log("width", l);
    setInterval(trotRight, 20);
    moveDog;
}

function trotRight() {
    console.log();
    if (margin !== l) {
        dogRun.style.marginLeft = margin + "px";
        margin += 2;
        console.log("third reset");
    } else if (margin == l) {
        dogRun.style.marginLeft = 0;
        console.log("reset dog");
        margin = 0;
    }
}

searchForm.on('submit', getLocationResults);


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

// $(document).ready(fetchDogFact);

//loop through and create directions from restraunt park
function addressSearch(restaurant, park) {

    fetch(`http://www.mapquestapi.com/directions/v2/route?key=kjB9lPrpbc0GrGOIyTCQIBKimoouOGE1&from=${restaurant}&to=${park}`)
        .then(response => response.json())
        .then(function (data) {
            console.log(data);
            const directions = []
            for (let index = 0; index < data.route.legs[0].maneuvers.length; index++) {
                directions.push(data.route.legs[0].maneuvers[index])
            }
            console.log(directions);

            //got all directions inside of directions variable, only need to append it to element with id=displaydirections and finish.
        });

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

$(document).ready(hideStarterElements);
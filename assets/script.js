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


function addAddressInformationToPage () {
    var localStorageAddressInformation = [];
    for (i = 0; i <=10; i++) {
        var resultIndex = "result" + [i];
       localStorageAddressInformation =  JSON.parse(window.localStorage.getItem(resultIndex));
        console.log(localStorageAddressInformation);
        console.log(localStorageAddressInformation.address);
        console.log(localStorageAddressInformation.name);
        console.log(localStorageAddressInformation.picture);
        var searchResultDataDisplayed = `
            <container id="searchResult${i}" class="container">
                <span>${localStorageAddressInformation.address}</span>
                <img id="searchResultImage${i}" class="searchResultImage" src="${localStorageAddressInformation.picture}"/>
                <span>${localStorageAddressInformation.name}</span>
            </container>
        `
        $("#displaySearchResults").append(searchResultDataDisplayed);
    }

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
                    const searchResult = {
                        name: item.name,
                        address: item.location.address1,
                        picture: item.image_url,
                    }
                    localStorage.setItem("result" + [i], JSON.stringify(searchResult));
                    i++;
                })
                .catch(error => console.log('error', error));
        })
        addAddressInformationToPage();
}

function getRestaurant(selectionLocation) {
    var foodRequest = searchQueryPlace.val()
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + apiKey);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(`https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?=&${foodRequest}limit=10&location=${selectionLocation}`, requestOptions)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data)
        })

}


moveDog();

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

$(document).ready(fetchDogFact);


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


var searchForm = $('#search-form');
var searchBtn = $('.searchBtn');
// var searchQuery = ('#search-place');
var searchQueryTwo = $('.form-input');
var apiKey = "gJVmTi7vwWY--jKnwBsPJdLiPDsil3tcQzGmNEpsaoBkFKdkMwmTdiB_RCkLqnrExNMK-VW2twwvYqNssc1H8r25mJE0L-ZTnpq2xSa88h65tb8IzboCX_C1UHFrYnYx"
var dogFactEl = document.getElementById("#dog-fact");

// IN PROGRESS - DANIEL
function addAddressInformationToPage () {

}

function getLocationResults(e) {
    e.preventDefault();

    var searchRequest = searchQueryTwo.val()
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
            $i = 0;
            data.businesses.forEach(function (item) {
                    const searchResult = {
                        name: item.name,
                        address: item.location.address1,
                        picture: item.image_url,
                    }
                    localStorage.setItem(item.name, JSON.stringify(searchResult));
                })
                .catch(error => console.log('error', error));
        })
}

// function selectLocationFunction(e) {
//     e.preventDefault();
//     JSON.parse(window.localStorage.getItem("something to specify chosen location"))

//     fetch("https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=" & limit = 10 & categories = parks, beaches & location = " + searchRequest, requestOptions)

//     }


searchForm.on('submit', getLocationResults);


// //random dog fact API
// var dogFactEl = document.querySelector("#dog-fact");
// var url = "http://dog-api.kinduff.com";
function fetchDogFact() {

var dogFactUrl = 'https://cors-anywhere.herokuapp.com/http://dog-api.kinduff.com/api/facts';
fetch(dogFactUrl)
    
    .then(response => {
    console.log(response);
    return response.json(); 
    
    }).then(function(data) {
    console.log("data", data);

    var dogFactAPIData = data.facts;
    var dogFactData = `<p>${dogFactAPIData}</p>`;

    $('#dog-fact').append(dogFactData);


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
     fetch(fetchDogPictureEndpoint, {
     }).then(response => {
         return response.json();
     }).then(function(data){
         console.log(data);
         console.log(data.message);
         addRandomImage(data.message);
     }).catch(error => 
         console.log("error", error));
}

$(document).ready(fetchDogPicture);

//ENDING RANDOM DOG PICTURE SCRIPT


function hideStarterElements () {
    $("#foodSearchParameters").addClass("hideContainer");
    $("#randomDogHeaderImage").addClass("hideContainer");
}
$(document).ready(hideStarterElements);

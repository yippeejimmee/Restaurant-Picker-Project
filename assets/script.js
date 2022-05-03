var searchForm = $('#search-form');
var searchBtn = $('.searchBtn');
// var searchQuery = ('#search-place');
var searchQueryTwo = $('.form-input');
var apiKey = "gJVmTi7vwWY--jKnwBsPJdLiPDsil3tcQzGmNEpsaoBkFKdkMwmTdiB_RCkLqnrExNMK-VW2twwvYqNssc1H8r25mJE0L-ZTnpq2xSa88h65tb8IzboCX_C1UHFrYnYx"

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



fetch('http://dog-api.kinduff.com/api/facts?number=5', {
    mode: 'no-cors'
}).then(response => {
    console.log(response);
    //return response.json(); //nest response and allows us to format it
}).catch(error => console.log('error', error));


//then(e=> {

//e.data.forEach(item => {
// dogFactEl.innerHTML += item.
//})


//DANIEL ADDING API SCRIPT TO FETCH Random Dog Picture
//On page load trigger the API

//CODE BELOW CAN BE USED TO GENERATE RANDOM PICTURE
//CURRENTLY SET TO MODIFY HOMEPAGE BANNER IMAGE, WILL
//NEED TO UPDATE IF WE WANT TO USE ELSEWHERE

// function addRandomImage(message) {
//     var imageURL = message;
//     console.log(imageURL);
//     $("#dogHeaderImage").attr("src", imageURL);
// }

// function fetchDogPicture() {
//     var fetchDogPictureEndpoint = "https://dog.ceo/api/breeds/image/random"; 
//     fetch(fetchDogPictureEndpoint, {
//     }).then(response => {
//         return response.json();
//     }).then(function(data){
//         console.log(data);
//         console.log(data.message);
//         addRandomImage(data.message);
//     }).catch(error => 
//         console.log("error", error));
// }
function fetchDogPicture() {
    var fetchDogPictureEndpoint = "https://dog.ceo/api/breeds/image/random";
    fetch(fetchDogPictureEndpoint, {}).then(response => {
        console.log(response);
    }).catch(error =>
        console.log("error", error));
}

$(document).ready(fetchDogPicture)

//ENDING RANDOM DOG PICTURE SCRIPT
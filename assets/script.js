//Element Selector
var restartApp = $("#clearButton");
//Element Selector
var searchForm = $('#search-form');
//Element Selector
var searchBtn = $('.searchBtn');
// var searchQuery = ('#search-place');
//Element Selector
var searchQueryPlace = $('.form-inputPlace');
//Element Selector
var searchQueryFood = $('.form-inputFood')
var apiKey = "gJVmTi7vwWY--jKnwBsPJdLiPDsil3tcQzGmNEpsaoBkFKdkMwmTdiB_RCkLqnrExNMK-VW2twwvYqNssc1H8r25mJE0L-ZTnpq2xSa88h65tb8IzboCX_C1UHFrYnYx";
//Element Selector
var dogFactEl = document.getElementById("#dog-fact");
//Element Selector
var dogRun = document.querySelector(".walkingDog");
//Element Selector
let l = document.querySelector("#dogHeaderImage").offsetWidth;
var margin = 0;
var selectedQuery = "";
var selectedRestaurant = "";
var locationName = "";
var selectedLocationName = "";
var restaurantName = "";
var searchRestaurantDataDisplayed = "";

//Function "addressSearch" is initialized. This function takes four parameters. 
// - restaurant => restaurant address
// - park => park address
// - selectedRestaurantName => name of restaurant selected by the user
// - selectedLocationName => name of park/beach selected by the user
//These four variables are used to display directions to the end user. 
function addressSearch(restaurant, park, selectedRestaurantName, selectedLocationName) {
    event.preventDefault();
    localStorage.clear();
    //utilizes mapquest API to develop directions from passed in restaurant address input to passed in location address input
    fetch(`http://www.mapquestapi.com/directions/v2/route?key=kjB9lPrpbc0GrGOIyTCQIBKimoouOGE1&from=${restaurant}&to=${park}`)
        .then(response => response.json())
        .then(function (data) {
            console.log(data);

            //taking global data and making it local, to be used 
            var localName = selectedLocationName;

            //creating template literal to append to directions element
            var directionsParentContainer = `
            <container id="parentDirectionsContainer">
            </container>`
            $("#displayDirections").append(directionsParentContainer);

            var directionsTitle = `<div id="directionsTitle"> 
            <div id="secondPartDirections"> Directions from <em>${selectedRestaurantName}</em> to <em>${localName}</em> </div> </div>`
            
            $("#parentDirectionsContainer").append(directionsTitle);
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
    //When this function finishes running, it removes the "hideContainer" class from our restart button. 
    $("#restartAppButton").removeClass("hideContainer");
}

//Beginning of get restaurants function
//Function "populateRestaurant" is used to retrieve restaurant information from the
//Yelp API. 
function populateRestaurant(selectedQuery, userSelectedLocationName) {
    //Variable "selectedQuery" is passed to this function. This variable is used
    //to send the "populateRestaurant" the address of the park or beach that the
    //user has selected. 
    //We also pass a "userSelectedLocationName" variable. This is the name of the
    //place that the user has selected. This will eventually be used when displaying
    //the directions to the user. 
    selectedLocationName = userSelectedLocationName;
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
                i++;
            })
        })
        //Function "addRestaurantInformationToPage" is used to take fetched restaurant data and display
        //it to the end user. 
        .then(function addRestaurantInformationToPage() {
            var localStorageRestaurantInformation = [];
            //For loop is used to display 5 restaurant results to the end user. 
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
                + localStorageRestaurantInformation.zipcode;


                //literal template of information regarding restaurant to be appended to parent element and show on screen
                searchRestaurantDataDisplayed = `
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
                     <button id="restaurantOption${i}" data-value="${completeAddress}" type="button" class="btn btn-light">Eat Here</button>
                    </div>
                </container>
                `
                $("#displayRestaurantResults").append(searchRestaurantDataDisplayed);
        };
        })
        .then( function addRestaurantEventListeners() {
            //variable reinitialized so that we can clear it from the page. 
            searchRestaurantDataDisplayed = "";
            //variables are created, the main purpose of these variables is to get data
            //that will ultimately be used in the function that displays the directions
            //to the end user. 
            var restaurantValue0 = restaurantOption0.dataset.value;
            var restaurantValue1 = restaurantOption1.dataset.value;
            var restaurantValue2 = restaurantOption2.dataset.value;
            var restaurantValue3 = restaurantOption3.dataset.value;
            var restaurantValue4 = restaurantOption4.dataset.value;
            var restaurantResult0 = JSON.parse(localStorage.getItem("restaurantresults0"));
            var restaurantResult1 = JSON.parse(localStorage.getItem("restaurantresults1"));
            var restaurantResult2 = JSON.parse(localStorage.getItem("restaurantresults2"));
            var restaurantResult3 = JSON.parse(localStorage.getItem("restaurantresults3"));
            var restaurantResult4 = JSON.parse(localStorage.getItem("restaurantresults4"));
            var restaurantResultName0 = restaurantResult0.name;
            var restaurantResultName1 = restaurantResult1.name;
            var restaurantResultName2 = restaurantResult2.name;
            var restaurantResultName3 = restaurantResult3.name;
            var restaurantResultName4 = restaurantResult4.name;

            //Event listeners are created for each restaurant option, depending on the restaurant
            //that is picked by the end user we then call the "addressSearch" function to display
            //the directions to the end user. 

            //Restaurant options are also cleared for the page at this point. 
            $("#restaurantOption0").on("click", function () {
                addressSearch(restaurantValue0, selectedQuery, restaurantResultName0, selectedLocationName);
                $("#displayRestaurantResults").remove(searchRestaurantDataDisplayed);
            });
            $("#restaurantOption1").on("click", function () {
                addressSearch(restaurantValue1, selectedQuery, restaurantResultName1, selectedLocationName);
                $("#displayRestaurantResults").remove(searchRestaurantDataDisplayed);
            });
            $("#restaurantOption2").on("click", function () {
                addressSearch(restaurantValue2, selectedQuery, restaurantResultName2, selectedLocationName);
                $("#displayRestaurantResults").remove(searchRestaurantDataDisplayed);
            });
            $("#restaurantOption3").on("click", function () {
                addressSearch(restaurantValue3, selectedQuery, restaurantResultName3, selectedLocationName);
                $("#displayRestaurantResults").remove(searchRestaurantDataDisplayed);
            });
            $("#restaurantOption4").on("click", function () {
                addressSearch(restaurantValue4, selectedQuery, restaurantResultName4, selectedLocationName);
                $("#displayRestaurantResults").remove(searchRestaurantDataDisplayed);
            });
        });
}
//End of get restaurants function



//Beginning of getLocationResults function
function getLocationResults(e) {
    e.preventDefault();
    //Takes our event "e", this has some data that we can use to make our request.
    //Takes query of user takes its value and stores it as searchRequest
    var searchRequest = searchQueryPlace.val();
    var myHeaders = new Headers();

    //creating appropriate header to utilize API
    myHeaders.append("Authorization", "Bearer " + apiKey);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    //inserts user location request to find a beach or park in that area
    fetch("https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?&limit=5&categories=parks%2Cbeaches&location=" + searchRequest, requestOptions)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            //Initializing "i", will be used in our for loop below.
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
                //this should create a key called "'result' + i" which will contain an array of the data
                //returned by the API. 
                localStorage.setItem("result" + [i], JSON.stringify(searchResult));
                i++;
            })
        })
        //We were running into issues when we had this function in our previous ".then" request. The fetch
        //request and our function were being called asynchronously which was causing issues because we were
        //trying to parse through data that hadn't been created yet. 

        //Created new ".then" step to ensure that previous step is finished before we start this function.
        //Function below is used to append our original fetch data to the page, this will let the end user
        //see a list of parks or beaches near the location that they have entered.
        .then(function addAddressInformationToPage() {
            //For loop used to create template literal elements that will display the information to the end
            //user.
            var localStorageAddressInformation = [];
            for (i = 0; i < 5; i++) {
                //Creating a variable that will be used to key data on a key by key basis.
                var resultIndex = "result" + [i];

                //Each iteration of the loop will retrieve data by each key value. This data is stored in the
                //"localStorageAddressInformation" array. We can use this array later. 
                localStorageAddressInformation = JSON.parse(window.localStorage.getItem(resultIndex));

                //combines all the address information into one variable for easier consumption
                //will also be useful for additional requests. 
                //Pulls array elements such as "address", "city", "zipcode".
                var completeAddress = localStorageAddressInformation.address + ", " + localStorageAddressInformation.city + " "
                + localStorageAddressInformation.zipcode;

                //literal template of information regarding location to be appended to parent element and show on screen
                var searchResultDataDisplayed = `
                    <container id="searchResult${i}" class="resultsContainer">
                        <div class="resultPicture">
                            <img id="searchResultImage${i}" class="searchResultImage" src="${localStorageAddressInformation.picture}"/>
                        </div>
                        <div class="resultInfo">
                            <span class="locationTitle">${localStorageAddressInformation.name}</span>
                            <span>${completeAddress}</span>
                            <button id="foodOption${i}" type="button" data-value="${completeAddress}" class="btn btn-light">Eat Here</button>
                        </div>
                    </container>
                `
                //append the information above to the parent element
                $("#displaySearchResults").append(searchResultDataDisplayed);
            };
            //Creating a bunch of variables here. The main objective of these variables is so
            //that when a user clicks on one of our event listeners for one of the options
            //created. The event listener can pass the information that has been tied to the
            //"Eat Here" button and pass that over to another function.
            //The "buttonValue" variables below are storing the "data" attribute attached
            //to the buttons we have created.
            var buttonValue0 = foodOption0.dataset.value;
            var buttonValue1 = foodOption1.dataset.value;
            var buttonValue2 = foodOption2.dataset.value;
            var buttonValue3 = foodOption3.dataset.value;
            var buttonValue4 = foodOption4.dataset.value;
            //The variables below will be used to pass the name of the location that the user
            //has selected. We are fetching this from local storage.
            var locationResult0 = JSON.parse(localStorage.getItem("result0"));
            var locationResult1 = JSON.parse(localStorage.getItem("result1"));
            var locationResult2 = JSON.parse(localStorage.getItem("result2"));
            var locationResult3 = JSON.parse(localStorage.getItem("result3"));
            var locationResult4 = JSON.parse(localStorage.getItem("result4"));
            var locationResultName0 = locationResult0.name;
            var locationResultName1 = locationResult1.name;
            var locationResultName2 = locationResult2.name;
            var locationResultName3 = locationResult3.name;
            var locationResultName4 = locationResult4.name;
            //Setting "searchResultDataDisplayed" to a variable so that we can
            //clear the parks/beaches search results once the user has made a
            //choice of where they would like to go. 
            searchResultDataDisplayed = "";
            
            //Created a bunch of event listeners that will pass different data to
            //our "populateRestaurant" function. We also remove previous location
            //results at this step. 
            $("#foodOption0").on("click", function () {
                //We pass buttonValue => data-type associated to the button clicked
                //by the user, and localResultName => name of location being clicked
                //on.
                populateRestaurant(buttonValue0,locationResultName0);
                $("#displaySearchResults").remove(searchResultDataDisplayed);
            });
            $("#foodOption1").on("click", function () {
                populateRestaurant(buttonValue1, locationResultName1);
                $("#displaySearchResults").remove(searchResultDataDisplayed);
            });
            $("#foodOption2").on("click", function () {
                populateRestaurant(buttonValue2, locationResultName2);
                $("#displaySearchResults").remove(searchResultDataDisplayed);
            });
            $("#foodOption3").on("click", function () {
                populateRestaurant(buttonValue3, locationResultName3);
                $("#displaySearchResults").remove(searchResultDataDisplayed);
            });
            $("#foodOption4").on("click", function () {
                populateRestaurant(buttonValue4, locationResultName4);
                $("#displaySearchResults").remove(searchResultDataDisplayed);
            });
        }).catch(function() {
            //Catch function is used to consume any errors returned by the API.
            //The function will display an error message to the user asking them
            //to try again. The message goes away after 3 seconds. 
            var warningMessageTimer = 0;
            console.log(warningMessageTimer);
            $("#warningMessageContainer").removeClass("hideContainer");
            $("#warningMessage").removeClass("hideContainer");
            setInterval(function() {
                if (warningMessageTimer > 3 ){
                    $("#warningMessageContainer").addClass("hideContainer");
                    $("#warningMessage").addClass("hideContainer");
                    clearInterval();
                } else{
                    console.log(warningMessageTimer);
                    warningMessageTimer++;
                }
            },1000);
        });
}
//End of getLocationResults function

//Beginning fetchDogFact function
// random dog fact API
// Standard fetch request. Fetch data is displayed as a random dog fact
// to the end user. 
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
//End of fetchDogFact function


//Beginning of functions that move the dog gif
//on the homepage.
//moveDog function uses setInterval and calls
//trotRight function.
function moveDog() {
    //runs the trotRight function every 20 ms
    setInterval(trotRight, 20);
    //recalls the movedog function for continued loop
    moveDog;
}

//trotRight function moves the dog gif to the right.
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
//End of trotRight function.
//End of dog gif animation functions.

//Beginning of random dog picture functions
//On page load trigger the API, currently not being used.
//addRandomImage function is used to add the image to the page.
function addRandomImage(message) {
    var imageURL = message;
    console.log(imageURL);
    //The imageUrl retrieved in our fetch request is used
    //and added as the "src" for our element.
    //We also make sure this element is viewable by the end user.
    $("#randomDogHeaderImage").attr("src", imageURL);
    $("#randomDogHeaderImage").removeClass("hideContainer");
}
//Function will fetch the random dog picture.
//This is a standard fetch function.
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
//End of random dog picture function.
//End of random dog picture functions.

/*
Beginning of function that hides elements that we will not be using.
*/
function hideStarterElements() {
    //Adds the "hideContainer" class, which is set to "display => None".
    //This should hide the elements when not in use.
    $("#foodSearchParameters").addClass("hideContainer");
    $("#randomDogHeaderImage").addClass("hideContainer");
}
/*End of function that hides elements that we won't be using.*/
//Event Listener that will trigger the hideStarterElements
$(document).ready(hideStarterElements);
//Event listener that will trigger our fetchDogPicture function.
searchForm.on('submit', fetchDogPicture);
//Event listener that will trigger the dog animation functions.
$(document).ready(moveDog);
//Event listener that will trigger the dogFact function.
$(document).ready(fetchDogFact);
//initialize program
searchForm.on('submit', getLocationResults);
//Once the application has concluded, we give the user the option
//create a new search.
restartApp.on('click', function() {
    //When the user clicks on the "New Search" button, we will
    //reload the page, giving the user the option to start a new
    //search.
    location.reload();
})

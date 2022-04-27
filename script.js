var _locationInput = document.querySelector("#location");
var foodTypeInput = document.querySelector("#food");
var pricingInput = document.querySelector("#pricing");
var waitTimeInput = document.querySelector("#waitTime");
var submitButton = document.querySelector("#submit");

submitButton.addEventListener("click", function(event) {
  event.preventDefault();
  
  // create user object from submission
  var user = {
    location: _locationInput.value.trim(),
    food: foodTypeInput.value.trim(),
    pricing: pricingInput.value.trim(),
    waitTime: waitTimeInput.value.trim()
  };

  // set new submission to local storage 
  localStorage.setItem("user", JSON.stringify(user));
  
});







$("#factButton").on("click", function() {
	var number = Math.floor((Math.random() * dogFacts.length));
	$("#factText").text(dogFacts[number])
})

var dogFacts = ["Dog's are smarter than humans", "Dog's do not need toilet paper", "Dog's exchange business cards by sniffing each other", "Too poo or not to poo, that is the question!"]


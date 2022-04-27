$("#factButton").on("click", function() {
	var number = Math.floor((Math.random() * dogFacts.length));
	$("#factText").text(dogFacts[number])
})

var dogFacts = ["Dog's are smarter than humans", "Dog's do not need toilet paper", "Dog's exchange business cards by sniffing each other", "Too poo or not to poo, that is the question!"]

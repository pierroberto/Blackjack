	var updatedDeck = []; //Array of the cards left in the deck
	var deckPlayer =[]; //Array of the cards in the deck of the player
	var deckDealer = []; //Array of the cards in the deck of the dealer
	var scoreDealer = 0;
	var scorePlayer = 0;
	var counter=1; // Slot where the images of the card will be displayed
	var slot2;
	var image2; // Object image to keep the covered card
	var split=false;
	var leftHand=false;
	var scoreSplit1 = 0;
	var scoreSplit2 = 0;
	var pickedCard;

function main () {
	/* SETUP LAYOUT HTML */
	$('.content').hide();
	$('#scorePlayer').hide();
	$('#scoreDealer').hide();
	reset(); // Reset all the variables
	$('#hit').hide();
	$('#stand').hide();
	$('#split').hide();
	/* END SETUP LAYOUT HTML */

	$('#deal').on('click', function() {
		reset();
		// If the deck is running out of cards, the dealer start a new game
		(updatedDeck.length <= 10) ? newGame() : firstHand(); 
	});

	$('#stand').on('click', function(){
		if (split === true && leftHand === true) {
			$('#scorePlayerSplit1').text("Score:" + scoreSplit1);
			$('#scorePlayerSplit2').text("> Score:");
			leftHand = false;
			$('#scorePlayerSplit2').text('> Score: ' + scoreSplit2);
			deckPlayer = deckPlayer.slice(0,1); // I keep only the first element of the deck
			deckPlayer.push(pickupCard(updatedDeck, "player")); //Pick up the second card
			scoreSplit2 = valueDeckGamers(deckPlayer); // Calculate the score of the player
			$('#scorePlayerSplit2').text("> Score: " + scoreSplit2); //Display the score of the player
		} else {
			dealerTurn();
		}
	});

	$('#new').on('click', function() {
		newGame();
	});

	$('#split').on('click', function() {
		splitHand();
	});

	$('#hit').on('click', function() {
		
		// CASE 1: The player decided to split and he's playing in the left hand
		if (split === true && leftHand === true) {
			deckPlayer.push(pickupCard(updatedDeck, "player"));
			scoreSplit1 = valueDeckGamers(deckPlayer);
			// I check a possible bust			
			if (scoreSplit1 > 21) {
				$('#scorePlayerSplit1').text("BUST");
				$('#scorePlayerSplit2').text("> Score:");
				leftHand = false; // switch to the second hand of the player
				deckPlayer = deckPlayer.slice(0,1); // I keep only the first element of the deck
				deckPlayer.push(pickupCard(updatedDeck, "player")); // I pick up the second card
				scoreSplit2 = valueDeckGamers(deckPlayer); // I calculate the score of the player
				$('#scorePlayerSplit2').text('> Score: ' + scoreSplit2); // I display the score 
			} else { $('#scorePlayerSplit1').text('> Score: ' + scoreSplit1) } //If the player didn't bust, then display the score of the left hand
		
		// CASE 2: The player decided to split and he's playing in the right hand
		} else if (split === true && leftHand === false) {
			deckPlayer.push(pickupCard(updatedDeck, "player")); // pickup a card
			scoreSplit2 = valueDeckGamers(deckPlayer); // calculate the score 
			if (scoreSplit2 > 21) { // check a possible bust
				dealerTurn(); // If the player bustes, the dealer plays... 
				/* SETUP updated layout */
				$('#deal').show();
				$('#hit').hide();
				$('#stand').hide();
				/* END SETUP updated layout */
			} else { $('#scorePlayerSplit2').text('> Score: ' + scoreSplit2) } // ... else display the player's score
		
		// CASE 3: The player didn't split
		} else  { 
			if (split === false) $('#split').hide(); // It hides the button in the case the player decides not to split
			deckPlayer.push(pickupCard(updatedDeck, 'player')); // add a card to the player's deck
			scorePlayer = valueDeckGamers(deckPlayer); // calculate the score of the player
			// If the player bustes then check the winner, otherwise display the score of the player
			(scorePlayer > 21) ? findWinner() : $('#scorePlayer').text('Score: ' + scorePlayer);
			if (scorePlayer === 21) dealerTurn(); // If the player's score is == 20 then the deal plays
		}
	});
	
}

function newGame () {



	function defineDeck() {
		var typeCard = ["H","D","S","C"]; // H = Hearts | D = Diamonds | S = Spades | C = Clubs
		var valueCard = [1,2,3,4,5,6,7,8,9,10,"J","Q","K"];
		var fullSet =[]; // It is the actual deck (52 card)
		for (var i = typeCard.length-1; i >= 0; i--) { // Start counting from the four types of cards...
			for (var j = valueCard.length-1; j >= 0; j--) { // ... and for each type it runs a loop of each value
				fullSet.push(typeCard[i]+valueCard[j]); // fullset is given by the type of the card + the value. Its elements are strings	
			} // end for		
		} //end for
		return fullSet;
	}
	
	function shuffleDeck (cards) {
		// I shuffle the deck through the Fisher-Yates alghoritm 
		var temp = cards; // cards is the parameter which contains 52 cards of the deck
		var x = cards.length;
		while (--x > 0) {
			// I generate a random position. Its max value is the length of the array (52 at the begin of the loop) 
			j = Math.floor(Math.random() * (x+1));  
			/* START THE SWAPPING */
			temp = cards[j]; // assign the value of the card randomly chosen to the variable temp
			cards[j] = cards[x]; //swap the card randomly found with the last card (x) of the deck 
			cards[x] = temp; // put the card randomly found (temp) at the last postion of the deck
			/* END THE SWAPPING */
		}
		return cards;
	}

	/* UPDATE layout */
	reset();
	$('.content').show(800);
	$('#scorePlayer').show();
	$('#scoreDealer').show();
	$('#player1').show();
	/* END UPDATE layout */

	//I Start a new game
	//I assign as argument of shuffleDeck the returned value of defineDeck()
	updatedDeck = shuffleDeck(defineDeck()); 
	firstHand();	
}


function firstHand () {
	deckPlayer.push(pickupCard(updatedDeck,"player")); // I define the value of the card picked and I add it into the deck of the player
	deckDealer.push(pickupCard(updatedDeck,"dealer")); // I define the value of the first card picked by the dealer and I add it into the deck of the dealer.
	deckPlayer.push(pickupCard(updatedDeck,"player")); // Define the value of the 2nd card
	deckDealer.push(pickupCard(updatedDeck,"dealer")); // Define the value of the 2nd card
	scorePlayer = valueDeckGamers(deckPlayer);
	scoreDealer = valueDeckGamers(deckDealer);
	$('#scorePlayer').text("Score: "+scorePlayer); // Display the score of the player	
	checkBlackjack();
	if (deckPlayer[0] === deckPlayer[1]) $('#split').show(); // I check if the player can split

	function checkBlackjack(){
		if (scorePlayer === 21 && scoreDealer < 21) {
			$('#scorePlayer').text('BLACKJACK!');
			$('#scoreDealer').text('LOSE');
			hideButtons();
		} else if (scorePlayer === 21 && scoreDealer === 21) {
			$('#scorePlayer').text("PUSH!");
			$('#scoreDealer').text("PUSH!");
			hideButtons();
		} else if (scoreDealer === 21 && scorePlayer < 21) {
			$('#scoreDealer').text("BLACKJACK!");
			$('#scorePlayer').text('LOSE');
			hideButtons();
		}

		function hideButtons() {
			slot2.appendChild(image2); // show the image covered;
			$('#backCard').remove(); //remove the retro.png image
			$('#hit').hide();
			$('#stand').hide();
			$('#split').hide();
			$('#deal').show();
		}
	}

}


function dealerTurn() {
	// The turn of the dealer starts
	$("#backCard").remove(); //remove the retro.png image
	slot2.appendChild(image2); // show the image covered previously
	// The dealer picks up a card until he reaches 17 points
	while (scoreDealer < 17) { 
		deckDealer.push(pickupCard(updatedDeck, "dealer"));
		scoreDealer = valueDeckGamers(deckDealer);
	}
	findWinner();
}

function valueDeckGamers (cardsGamer) {
	var sum = cardsGamer.reduce((score, val) => score + val, 0); // do the sum of the deck

/*	SOLUTION WITH A FOR LOOP
	for (var i = 0; i < cardsGamer.length; i++) {
		sum += cardsGamer[i];	
	} 
*/
	// check each value of the player's cards.
	// If the sum is <= 11 then the ace's value is 11 then it adds 10 (and not 11 because 1 has already been added)
	cardsGamer.map(val => {
		if (val === 1) sum = (sum <= 11) ? (sum + 10) : sum;
	});
	
/* SOLUTION WITH A FOR LOOP
	 for (var i = 0; i < cardsGamer.length; i++) {
	 	if (cardsGamer[i] === 1) {
	 		sum = (sum <= 11) ? (sum + 11 - 1) : sum;  
	 	} 	
	 } 
*/
	
	if (split === false && sum > 21) {  //Check for a possible bust
		$('#hit').hide();
		$('#stand').hide();
		$('#deal').show();		
	}
	return sum; // return the score 

}




function splitHand() {
	leftHand = true; // We are playing now on the left hand of the player
	split = true; // Set the decition of the player to split
	deckPlayer.shift(); // Remove the first item of the array and keep the second for the left hand
	$("#player1").hide();
	$("#scorePlayer").hide();
	$('#split1').show();
	$('#split2').show();
	$('#scorePlayerSplit1').show();
	$('#scorePlayerSplit2').show();
	$('#hit').show();
	$('#split').hide();	
	deckPlayer.push(pickupCard(updatedDeck, "player")); // pick up the second card
	scoreSplit1 = valueDeckGamers(deckPlayer); // calculate the score
	$('#scorePlayerSplit1').text('> Score: ' + scoreSplit1);
}

function findWinner() {
	if (split === true){
		if (scoreDealer > 21 && scoreSplit1 > 21 && scoreSplit2 > 21) {
			$('#scoreDealer').text("PUSH");
			$('#scorePlayerSplit1').text("PUSH");
			$('#scorePlayerSplit2').text("PUSH");
		} else if (scoreDealer <= 21 && scoreSplit1 > 21 && scoreSplit2 > 21) {
			$('#scoreDealer').text("WIN");	
			$('#scorePlayerSplit1').text("BUST");
			$('#scorePlayerSplit2').text("BUST");		
		} else if (scoreSplit1 > scoreDealer && scoreSplit1 <= 21){
			$('#scorePlayerSplit1').text("WIN");
			$('#scorePlayerSplit2').text("WIN");
			$('#scoreDealer').text("Score: " + scoreDealer);
		} else if (scoreSplit2 > scoreDealer && scoreSplit2 <= 21) {
			$('#scorePlayerSplit1').text("WIN");
			$('#scorePlayerSplit2').text("WIN");
			$('#scoreDealer').text("Score: " + scoreDealer);
		} else if ((scoreSplit1 === scoreDealer && scoreSplit2 === scoreDealer)|| (scoreSplit2 == scoreDealer && scoreSplit1 < scoreDealer) || (scoreSplit1 == scoreDealer && scoreSplit2 < scoreDealer)){
			$('#scoreDealer').text("PUSH");
			$('#scorePlayerSplit1').text("PUSH");
			$('#scorePlayerSplit2').text("PUSH");
		} else if (scoreDealer > 21) {
			$('#scoreDealer').text("BUST");
			$('#scorePlayerSplit1').text("WIN");
			$('#scorePlayerSplit2').text("WIN");
		} else {
			$('#scoreDealer').text("WIN");
		}
	} else if (split === false) {
		 if (scoreDealer > 21) {
			$('#scoreDealer').text("BUST");
			$('#scorePlayer').text("WIN");
		} else if (scorePlayer > 21) {
			$("#backCard").remove(); //remove the retro.jpg image
			slot2.appendChild(image2); // show the image covered previously
			$('#scorePlayer').text("BUST");
			$('#scoreDealer').text("WIN");
		} else if (scorePlayer > scoreDealer) {
			$('#scorePlayer').text("WIN");
			$('#scoreDealer').text("LOSE");

		} else if (scorePlayer < scoreDealer) {
			$('#scoreDealer').text("WIN");
			$('#scorePlayer').text("LOSE");

		} else if (scorePlayer == scoreDealer) {
			$('#scoreDealer').text("PUSH");
			$('#scorePlayer').text("PUSH");
		}
	}

	
	$('#deal').show();
	$('#hit').hide();
	$("#stand").hide();
	$('#split').hide();
}

function pickupCard(cards,gamer) {

	
	function defineValueCard(card) {
		var value = card.substr(1,card.length-1); // I remove the info about the type of the card (H or D or S or C)
		switch (value) {
			case "J":
				return 10;
				break;
			case "Q":
				return 10;
				break;
			case "K":
				return 10;
				break;
			default:
				return parseInt(value);
		} // end switch 
	}

	function updateDeck(oldDeck, position) {
		oldDeck.splice(position,1);
			$('#numberCards').text("Cards left in the deck: " + oldDeck.length);
		return oldDeck;
	}

	function displayImg(gamer) {
		
		var image = document.createElement("IMG"); 
		if (gamer === "player") { // Player's turn 
			image.setAttribute("src", "img/set/"+pickedCard+".png");
			if (split === true && leftHand === true) { 
				var slot = document.getElementById('split1');
				slot.appendChild(image);			
			} else if (split === true && leftHand === false) {
				var slot = document.getElementById('split2');
				slot.appendChild(image);			
			} else if (split === false) {
				var slot = document.getElementById('player1');
				slot.appendChild(image);
				if (counter === 1) {
					var image3 = document.createElement("IMG");  
					image3.setAttribute("src", "img/set/"+pickedCard+".png");
					var slot = document.getElementById('split1');
					slot.appendChild(image3);
				} else if (counter === 3) {
					var image4 = document.createElement("IMG");
					image4.setAttribute("src", "img/set/"+pickedCard+".png");
					var slot = document.getElementById('split2');
					slot.appendChild(image4);					
				}
			}
		} else if (gamer === "dealer") { 		
			if (counter === 4) {
				slot2 = document.getElementById('dealer');
				image2 = document.createElement("IMG");
				image2.setAttribute("src", "img/set/"+pickedCard+".png"); //here is stored the image which is hidden at the beginning of the game
				slot = document.getElementById('dealer');
				image.setAttribute("src","img/retro.png"); // this is the image of the covered card
				image.setAttribute("id","backCard"); // it has been set an id because it will be used at the end of the game to remove it and show the card
				slot.appendChild(image);		  
			} else {
				image.setAttribute("src", "img/set/"+pickedCard+".png");
				var slot = document.getElementById('dealer');
				slot.appendChild(image);
			} // end if

		} // end if
		counter++;
	}
	
	var x =	cards.length -1;
	var j = Math.floor(Math.random() * (x+1));
	pickedCard = cards[j];
	displayImg(gamer);
	updatedDeck = updateDeck(updatedDeck,j); // Call the function in order to update the deck
	return defineValueCard(pickedCard);

}

function reset() {
	counter = 1; 
	scorePlayer = 0;
	scoreDealer = 0;
	deckPlayer = [];
	deckDealer = [];
	$("#scoreDealer").text("Score");
	$("#hit").show();
	$("#stand").show();
	$("#deal").hide();
	$("#player1").empty(); // I remove all the child elements of the div player1
	$("#dealer").empty();
	split = false;
	leftHand = false;
	$("#split1").empty();
	$("#split2").empty();
	$("#scorePlayerSplit1").text("> Score");
	$("#scorePlayerSplit2").text("Score");
	$("#scorePlayerSplit1").hide();
	$("#scorePlayerSplit2").hide();
	$("#split1").hide();
	$("#split2").hide();
	$("#scorePlayer").show();
	$("#player1").show();
	$('#split').hide();
}

$(document).ready(main);
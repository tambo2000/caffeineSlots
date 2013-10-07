var $COFFEE_MAKER = $("<div class='coffee-maker'><img src='images/coffeeMakerSmall.jpg'></div>");
var $TEAPOT = $("<div class='teapot'><img src='images/teapotSmall.jpg'></div>");
var $ESPRESSO_MACHINE = $("<div class='espresso-machine'><img src='images/espressoMachineSmall.jpg'></div>");
var $COFFEE_FILTER = $("<div class='coffee-filter'><img src='images/coffeeFilterSmall.jpg'></div>");
var $TEA_STRAINER = $("<div class='tea-strainer'><img src='images/teaStrainerSmall.jpg'></div>");
var $ESPRESSO_TAMPER = $("<div class='espresso-tamper'><img src='images/espressoTamperSmall.jpg'></div>");
var $COFFEE_GROUNDS = $("<div class='coffee-grounds'><img src='images/coffeeGroundsSmall.jpg'></div>");
var $LOOSE_TEA = $("<div class='loose-tea'><img src='images/looseTeaSmall.jpg'></div>");
var $ESPRESSO_BEANS = $("<div class='espresso-beans'><img src='images/espressoBeansSmall.jpg'></div>");

var MAKERS = [$COFFEE_MAKER, $TEAPOT, $ESPRESSO_MACHINE];
var FILTERS =[$COFFEE_FILTER, $TEA_STRAINER, $ESPRESSO_TAMPER];
var SOURCE = [$COFFEE_GROUNDS, $LOOSE_TEA, $ESPRESSO_BEANS];
var PRIZE = ["coffee", "tea", "espresso"];
var losses = 0;

var REEL_INTERVAL = 450;
var REEL_SPINS = [3, 6, 9];
var REEL_SELECTORS = [".reel1", ".reel2", ".reel3"];
var REELS = [MAKERS, FILTERS, SOURCE];

var HANDLE_PULL_SOUND = new Audio("sounds/handle.mp3"); // buffers automatically when created
var REEL_CLICK_SOUND = new Audio("sounds/reelClick.mp3"); REEL_CLICK_SOUND.volume = 0.2;
var BELLS_SOUND = new Audio("sounds/bells.mp3");
var BEER_POUR_SOUND = new Audio("sounds/beerPour.mp3");



$(document).ready( function() {
	intitializeReels();

	$(".handle").click( function() {
		pullHandle();
	});
});



function intitializeReels() {
	for (var i = 0; i < REELS.length; i++) {
		$(REEL_SELECTORS[i]).prepend(REELS[i][rand()].clone());
		$(REEL_SELECTORS[i]).prepend(REELS[i][rand()].clone()); // need the extra one to push the first into the viewable area
	}
}

function pullHandle() {
	$(".handle").unbind("click"); // don't allow user to activate new spin while current spin in motion
	HANDLE_PULL_SOUND.currentTime = 0;
	HANDLE_PULL_SOUND.play();
	$(".prize").fadeOut();
	var prize = won( spinAll() );

	// after last reel has finished
	setTimeout( function() {
		$(".handle").click( function() { // turn click handler back on 
			pullHandle();
		});
		showPrize(prize);	
	}, ((REEL_SPINS[2] * (REEL_INTERVAL)) + 500) )
}

function rand() {
	return Math.floor(Math.random()*3);
}

function showPrize(prize) {
	$("div.prize>h1").text("You won " + prize + "!");
	$(".prize>div").hide();
	$("." + prize).show();
	$(".prize").fadeIn();
}

function slideReelDownOne($element, reel) {
	REEL_CLICK_SOUND.currentTime = 0;
	REEL_CLICK_SOUND.play();
	$(REEL_SELECTORS[reel]).prepend($element);
	$element.slideDown( function() {
		$(REEL_SELECTORS[reel] + " div:last-child").remove(); // Prevents html from getting super huge
	});
}

function spinReel($element, reel, times) {
	// Create appropriate filler elements	
	var $fillerElement = REELS[reel][rand()].clone().hide();

	if (times === 0) { // If last spin then add the actual element
		var $newElement = $element.clone().hide();
		slideReelDownOne($newElement, reel);
		setTimeout( function() { // We need this last one to push our desired pick into view
				slideReelDownOne($fillerElement, reel);
		}, REEL_INTERVAL);
	} else { // Add the filler element
		slideReelDownOne($fillerElement, reel);
	}

	if (times > 0) {
		setTimeout( function() {
			spinReel($element, reel, times-1);
		}, REEL_INTERVAL);
	}
}

function spinAll() {
	var reelPicks = [rand(), rand(), rand()];

	for (var i = 0; i < REELS.length; i++) {
		spinReel(REELS[i][reelPicks[i]], i, REEL_SPINS[i]);
	}

	return reelPicks;
}

function won(reelPicks) {
	if ((reelPicks[0] === reelPicks[1]) && (reelPicks[0] === reelPicks[2])) {
		setTimeout( function() {
			BELLS_SOUND.currentTime = 0;
			BELLS_SOUND.play();
		}, ((REEL_SPINS[2] * (REEL_INTERVAL)) + 500) )
		losses = 0;
		return PRIZE[reelPicks[0]];
	} else {
		losses += 1;
		if (losses > 10) {
			setTimeout( function() {
				BEER_POUR_SOUND.currentTime = 0;
				BEER_POUR_SOUND.play();
			}, ((REEL_SPINS[2] * (REEL_INTERVAL)) + 500) )
			losses = 0;
			return "beer";
		}
		return "nothing";
	}
}


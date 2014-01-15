// This page displays 6 beers that have been recently consumed by users of The Beer Spot.
// It only shows beers that have received reviews.

$(document).ready(function() {

	var devAPIKey = "ff55a5e66374550427cb24017593972b";
	var devUserKey = "d7ac68693b41c4730841148beff15633";

	var beerIDs = [];
	var beerIndex;
	var indexToDelete;
	
	var displayCount;

	// Get 50 recently consumed beers - only need to display six, but need to account for duplicates and beers that don't have reviews
	// Store the beer id's in the beerIDs array and then look up details with separate AJAX request
	function getRecentBeers () {
		$.post("https://www.thebeerspot.com/api/info",
			{"function" : "drink",
			"dev_key" : devAPIKey, 
			"limit" : "200"},
				function(beers) {
					//Store beer_id's in beerIDs array -- Do not store duplicate id's
					for (var i = 0; i < beers.length && beerIDs.length < 200; i++) {
						if (beerIDs.indexOf(beers[i].beer_id) === -1) {
						beerIDs.push(beers[i].beer_id);	
					};
				};	
			displaySixBeers();					
		});		
	};

	// Get details of 6 recently consumed beers that have reviews and display them in divs on the page.
	// Have to go through the entire beerIDs array because of the asynchronous nature of the AJAX request. There is no way to stop the for loop.
	function displaySixBeers () {
		displayCount = 0;
		beerIndex = 0;
		while (displayCount < 6 && (beerIndex < beerIDs.length)) {	
			getBeerDetails(beerIDs[beerIndex]);
			beerIndex++;
			
		};		
	};

	//Get the details of a single beer
	function getBeerDetails(id) {
		$('#hourglass').addClass('hidden');
		$.post("https://www.thebeerspot.com/api/info",
				{"function" : "beer",
				"dev_key" : devAPIKey,
				"beer_id" : id},
				checkBeer		
			);	
	};

	// Check the beer to see if it has any reviews. If it does, and there are not yet 6 displayed,
	// then display the beer and update the count.
	function checkBeer(info) {
		if (info[0].reviews > 0 && (displayCount < 6)) {
			displayBeer(info[0]);
			displayCount++;
			indexToDelete = beerIDs.indexOf(info[0].beer_id);
			beerIDs.splice(indexToDelete, 1);
		};
	};

	// Display the details of a beer on the page
	function displayBeer(beerDetails) {
		$('#recentBeers').append('<div>'
			+ '<h4>' + beerDetails.beer_name + '</h4>'
			+ '<h5>' + beerDetails.brewery_name + '</h5>'
			+ '<p>Style: ' + beerDetails.style + '</p>'
			+ '<p>ABV: ' + beerDetails.abv + '</p>'
			+ '<p>No. of Reviews: ' + beerDetails.reviews + '</p>'
			+ '<p>Avg. Score: ' + Number(beerDetails.avg_score).toFixed(2) + '</p>'
			+ '</div>');

	
	};

	getRecentBeers();

	// Set focus to more beer button
	$('#more').focus();


	// Clear display and show 6 more beers when more beers button is clicked
	$('#more').click(function() {	
		$('#recentBeers').empty();
		displaySixBeers();
	});

					
});

	




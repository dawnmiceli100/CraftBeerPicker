// This page displays 6 beers that have been recently consumed by users of The Beer Spot.
// It only shows beers that have received reviews.

$(document).ready(function() {

	var devAPIKey = "ff55a5e66374550427cb24017593972b";
	var devUserKey = "d7ac68693b41c4730841148beff15633";

	var beerIDs = [];
	
	var displayCount = 0;

	// Get 50 recently consumed beers - only need to display six, but need to account for duplicates and beers that don't have reviews
	// Store the beer id's in the beerIDs array and then look up details with separate AJAX request
	function getRecentBeers () {
		$.post("https://www.thebeerspot.com/api/info",
			{"function" : "drink",
			"dev_key" : devAPIKey, 
			"limit" : "50"},
				function(beers) {
					//Store beer_id's in beerIDs array -- Do not store duplicate id's
					for (var i = 0; i < beers.length && beerIDs.length < 25; i++) {
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
		for (var i = 0; i < beerIDs.length; i++) {	
			$('#hourglass').addClass('hidden');
			$.post("https://www.thebeerspot.com/api/info",
				{"function" : "beer",
				"dev_key" : devAPIKey,
				"beer_id" : beerIDs[i]},
				function(beerDetails) {
			 		if (beerDetails[0].reviews > 0 && displayCount < 6) {
						displayCount++;
						$('#recentBeers').append('<div>'
						+ '<h4>' + beerDetails[0].beer_name + '</h4>'
						+ '<h5>' + beerDetails[0].brewery_name + '</h5>'
						+ '<p>Style: ' + beerDetails[0].style + '</p>'
						+ '<p>ABV: ' + beerDetails[0].abv + '</p>'
						+ '<p>No. of Reviews: ' + beerDetails[0].reviews + '</p>'
						+ '<p>Avg. Score: ' + Number(beerDetails[0].avg_score).toFixed(2) + '</p>'
						+ '</div>');
					};						
			});	
		};		
	};

	getRecentBeers();

					
});

	




var language_url = 'https://ws.detectlanguage.com/0.2/detect';
var api_key = 'your_api_key';

function smoothScroll(anchor, duration) {
	return new Promise(function(resolve) {
	    // Calculate how far and how fast to scroll
	    var startLocation = window.pageYOffset;
	    var endLocation = anchor.offsetTop;
	    var distance = endLocation - startLocation;
	    var increments = distance/(duration/16);
	    var stopAnimation;

	    // Scroll the page by an increment, and check if it's time to stop
	    var animateScroll = function () {
	        window.scrollBy(0, increments);
	        stopAnimation();
	    };

	    // If scrolling down
	    if ( increments >= 0 ) {
	        // Stop animation when you reach the anchor OR the bottom of the page
	        stopAnimation = function () {
	            var travelled = window.pageYOffset;
	            if ( (travelled >= (endLocation - increments)) ) {
	                clearInterval(runAnimation);
	            } else if (((window.innerHeight + travelled) >= document.body.offsetHeight)) {
	            	clearInterval(runAnimation);
	            	resolve(true);
	            	return;
	            }
	        };
	    }
	    // If scrolling up
	    else {
	        // Stop animation when you reach the anchor OR the top of the page
	        stopAnimation = function () {
	            var travelled = window.pageYOffset;
	            if ( travelled <= (endLocation || 0) ) {
	                clearInterval(runAnimation);
	            }
	        };
	    }

	    // Loop the animation function
	    var runAnimation = setInterval(animateScroll, 16);
	});
};

async function cleanup() {
	return new Promise( async function(resolve) {
		console.log('Cleanup started');
		for (var i in card_array) {
			// Weird collection property
			if (i == "length") {
				resolve(true);
				return;
			}
			
			job_element = card_array[i];
			if (job_element == 2) {
				debugger;
			}
			is_ham = null;
			is_ham = await job_filter(job_element);
			if (is_ham == false) {
				job_element.scrollIntoView();
				job_element.parentNode.removeChild(job_element);
			}
		};
	})
};

function makeRequest(data) {
	return new Promise( function(resolve, reject) {
		var xhr = new XMLHttpRequest();
		xhr.open('POST', language_url);
		xhr.onload = function() {
			if(this.status == 200 && this.status < 300) {
				var response_object = JSON.parse(xhr.responseText)
				resolve( response_object);
		    } else {
		    	console.error(xhr.statusText)
		    	reject(false);
		    }
		}
		xhr.onerror = function(e) {
			console.error(xhr.statusText)
		}
		xhr.send(data);

	})
}
// Called when the user clicks on the browser action.
console.clear()

// Listener stuff
try {
	while(true) {
		chrome.browserAction.onClicked.removeListener(main_listener);
	}
}
catch(err) {
	console.log('')
}

chrome.browserAction.onClicked.addListener(function main_listener(tab) {
	try {
		while(true) {
			chrome.runtime.onMessage.removeListener(cleanup_listener);
		}
	}
	catch(err) {
		console.log('')
	}

	try {
		while(true) {
			chrome.runtime.onMessage.removeListener(destroy_listener);
		}
	}
	catch(err) {
		console.log('')
	}

	try {
		while(true) {
			chrome.tabs.onUpdated.removeListener(on_new_page_load_complete_listener);
		}
	}
	catch(err) {
		console.log('')
	}


	console.log('Initialising...')

	var amount_of_pages_crawled = 1
	var main_tab_id = tab.id
	var main_url = tab.url
	var order_by_date_posted = encodeURI('sortBy=DD');
	var all_elements = {}

	// First order job results by date posted (sortBy=DD)
	if (main_url.indexOf(order_by_date_posted) == -1) {
		var hashStart = (main_url.indexOf('#') === -1) ? main_url.length : main_url.indexOf('#');
	    var querySymbol = (main_url.indexOf('?') === -1) ? '?' : '&';
		var main_url = main_url.substring(0, hashStart) + querySymbol + order_by_date_posted +
			main_url.substring(hashStart);
	}

	// Update current tab so that it has elements sorted by date
	chrome.tabs.update(tab.id, {url: main_url, active: true}, function(tab1) {

	    // Add listener so callback executes only if page loaded. otherwise calls instantly
	    var on_reload_complete_listener = function(tabId, changeInfo, tab) {
	        if (tabId == tab1.id && changeInfo.status === 'complete') {
	            // remove listener, so only run once
	            chrome.tabs.onUpdated.removeListener(on_reload_complete_listener);
	            // Execute first page cleanup
				chrome.tabs.executeScript(null, {file : "main_page_cleanup.js" })
	        }
	    }
	    chrome.tabs.onUpdated.addListener(on_reload_complete_listener);
	});

	// Add listener for after first cleanup
	chrome.runtime.onMessage.addListener(async function cleanup_listener(msg, sender, sendResponse) {
		// After first page cleanup is done, it will send a message
		// This means that we can start opening new tabs and load the images from them
	    if (msg['message'] == 'part 1 done') {
	    	for (i = 0; i < amount_of_pages_crawled; i++) {
	    		// break;
	    		page_start = (i+1)*25
	    		page_param = encodeURI('&start=' + page_start.toString())
	    		next_url = main_url + page_param

	    		// Open new tab and wait for it to fully load
	    		tab_id = await open_new_tab(next_url)

	    		// Once loaded, execute script, which will return a destroy message once done
	    		chrome.tabs.executeScript(tab_id, {file: "additional_pages.js"}, function() {});
	    		await tab_destruction()

	    		function open_new_tab(url) {
	    			return new Promise(function(resolve) {
	    				chrome.tabs.create({url: url}, function(NewTab) {
	    					var on_new_page_load_complete_listener = function(tabId, changeInfo, tab) {
	    						if (tabId == NewTab.id && changeInfo.status === 'complete') {
	    							chrome.tabs.onUpdated.removeListener(on_new_page_load_complete_listener);
	    							// Tab was successfully created and loaded, so we can return the id
	    							resolve(NewTab.id);
	    							return;
	    						}
	    					}
	    					chrome.tabs.onUpdated.addListener(on_new_page_load_complete_listener);
	    				})
	    			})
	    		}

	    		function tab_destruction() {
	    			return new Promise(function(resolve) {
	    				var destroy_listener = function(msg, sender, sendResponse) {
	    					if (msg['message'] == 'destroy') {
	    						chrome.runtime.onMessage.removeListener(destroy_listener);
	    						// Script was successfully executed, close the tab
	    						chrome.tabs.remove(sender.tab.id, function() { });
	    						resolve(true);
	    					}
	    				}
	    				chrome.runtime.onMessage.addListener(destroy_listener);
	    			})
	    		}

	    	}
	    } // Once a new tab has been opened and filtered, it will pass back the job cards, to be updated in the initial tab
	    else if (msg['message'] == 'update ready') {
	    	chrome.tabs.executeScript(main_tab_id, {
	    		// Pass cards as parameter
	    		code: 'var cards = ' + msg['cards']
	    	}, function() {
	    		// Execute update script
	    		chrome.tabs.executeScript(main_tab_id, {file : 'append_jobs.js'})
	    	})
	    }
	});
	
})
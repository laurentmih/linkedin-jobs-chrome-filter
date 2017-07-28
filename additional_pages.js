var card_array = document.getElementsByClassName("job-card")
main()

async function main() {
	console.clear()
	await smoothScroll(card_array[card_array.length-1], 4000);
	await cleanup();
	final_function();
}

async function final_function() {
	final_cards = document.getElementsByClassName("job-card")
	card_array = []
	for (i = 0; i<final_cards.length; i++) {
		card_array[i] = final_cards[i].outerHTML
	}

	object = {}
	object['message'] = 'update ready'
	object['cards'] = JSON.stringify(card_array)
	await send_cards(object);
	console.log('Setting up timeout for close')
	setTimeout(function() {
		chrome.runtime.sendMessage({'message' : 'destroy'})
		console.log('Message for destroy was sent!')
	}, 1000)
}

function send_cards(object) {
	return new Promise(function(resolve) {
		console.log('Sending out cards...')
		chrome.runtime.sendMessage(object);
		resolve(true);
		return;
	})
}
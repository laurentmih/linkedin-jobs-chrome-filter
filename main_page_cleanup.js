var card_array = document.getElementsByClassName("job-card")
main()

async function main() {
	// console.clear()
	await smoothScroll(card_array[card_array.length-1], 4000);
	await cleanup();
	final_function();
}

function final_function() {
	object = {};
	object['message'] = 'part 1 done';
	chrome.runtime.sendMessage(object);
	return true;
}
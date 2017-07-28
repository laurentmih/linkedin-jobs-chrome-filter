var title_badwords = [
	"senior",
	"lead",
	"director",
	"phd",
]

async function job_filter(element) {
	return new Promise( async function(resolve) {
		// Ad detection
		if (element.classList.contains('jobs-search-upsell')) {
			console.log('Detected ad!')
			resolve(false);
			return;
		}

		// Title blacklist detection
		title = element.getElementsByClassName('break-words')[0].innerHTML.toLowerCase();

		for (i=0; i<title_badwords.length; i++) {
			if (title.includes(title_badwords[i])) {
				console.log('Detected ' + title_badwords[i].toString() + '!')
				resolve(false);
				return
			}
		}

		// Company blacklist detection
		company = element.getElementsByClassName('job-card__company-name')[0].innerHTML.toLowerCase();

		// German detection
		var data = new FormData();
		content = element.getElementsByClassName('job-card__description-snippet')[0].innerHTML
		content = content.split(/\s+/).slice(0,8).join(" ");
		data.append('key', api_key);
		data.append('q', content);

		response_object = await makeRequest(data);
		try{
			if (response_object['data']['detections'][0]['language'] == 'de') {
				console.log('detected German!')
				resolve(false);
				return;
			} else {
				console.log('Non-german detected, continuing...')
				resolve(true);
				return;
			}
		} catch(err) {
			debugger;
			console.log('Something went wrong, probably out of API calls?')
			resolve(true);
			return;
		}
	})
}
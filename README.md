# LinkedIn Jobs Chrome Extension
Ambitious name, limited functionality. This plugin does two things:  
- Remove cards that match certain criteria/languages (detailed below in [filters](#filters))  
- Open additional pages, extracting their cards, and appending them to the initial page  

This was tested working on LinkedIn, English locale, on the most recent stable Chrome on macOS, as of 28th of July 2017.

## Installing
The usual stuff: 
* Download/clone this repo
* Open Chrome, navigate to `chrome://extensions/`
* Enable `developer mode`
* Click `Load unpacked extension`
* Select the directory that contains all the JS files

## Operation
* Log in to LinkedIn
* Navigate to jobs tab
* Enter a search, make sure you end up on the search page
* Hit the extension button at the top-right of your browser-window
* Wait for it to complete

## Filters
To see the active filters, inspect `filter.js`. You'll see the following:  
* Filters for badwords in the title  
* Filters for badwords in the company name  
* Language detection. __Note:__ For language detection, you need to create an account at [https://detectlanguage.com/](https://detectlanguage.com/) and fill in your API key at the top of `helpers.js`  
Of course, most of this should be straightforward to extend with other filters, using the existing code as an example.

## 'It doesn't work'
The HTML elements the extension checks for are hardcoded. Check the details in `helpers.js`, `filter.js`, `additional_pages.js` and `main_page_cleanup.js`
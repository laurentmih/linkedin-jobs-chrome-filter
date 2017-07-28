var parent = document.getElementsByClassName("job-card")[1].parentElement
var fragment = document.createDocumentFragment()
console.log('Appending ' + cards.length.toString() + ' elements to this page...')

for (i=0; i < cards.length; i++) {
	new_element_html_string = cards[i]
	var container_element = document.createElement('template')
	container_element.innerHTML = new_element_html_string
	fragment.append(container_element.content.firstElementChild)
}

parent.appendChild(fragment)
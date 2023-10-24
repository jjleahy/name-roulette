
// Given a selected index and config, construct an array of names to
// flash on the screen that concludes with the name at the chosenIndex.
// If sillyNames exists, occationally pick one an insert it as the
// penultimate name. 
// Once a name is chosen, it's removed from the array.
// If only 'sillyNames' remain, the array is reset.

const sillyNames = config.sillyNames;
const studentNames = config.names;
let allNamesList = [...studentNames, ...sillyNames];

function constructNames(chosenIndex, currentNamesList) {
	const LIST_LENGTH = 100;
	let namesCopy = currentNamesList.filter(studentName => studentNames.includes(studentName));
	let sillyNamesCopy = currentNamesList.filter(studentName => sillyNames.includes(studentName));
	let chooseSillyName = Math.random() > 0.8 && sillyNamesCopy.length;
	let sillyName = '';
	if (chooseSillyName) {
		console.log('silly');
		sillyName = sillyNamesCopy[Math.floor(Math.random() * sillyNamesCopy.length)];
	}

	let sillyOffset = (i) => {
		if (!chooseSillyName) return 0; // no offset
		if (i < LIST_LENGTH - 2) return -1; // move the names down one to add the silly name
		if (i === LIST_LENGTH - 2) return -1 * LIST_LENGTH + i - chosenIndex; // for the second to last name, set the index to -1
		if (i === LIST_LENGTH - 1) return 0; // leave the final name alone
	}
	
	let indices = Array.from({length: LIST_LENGTH}, (_, i) => ((LIST_LENGTH - i + chosenIndex - 1 + sillyOffset(i)) % namesCopy.length));
	return indices.map((index) => index < 0 ? sillyName : namesCopy[index]);
}

let title = document.querySelector('h1');

function shuffle(names, callback) {
	title.innerText = names[0];
	let pause = Math.max(17, 1000 / names.length); // get gradually slower as the names run out
	let newNames = names.splice(1,names.length);
	if (newNames.length) {
		window.setTimeout(() => {
            shuffle(newNames, callback);
        }, pause);
	}else {
        callback(title.innerText); // Use the last name that was set to the title
    }

}


let button = document.querySelector('#roulette');

button.addEventListener('click', () => {
	let chosenIndex = Math.floor(Math.random() * config.names.length);
	let nameList = constructNames(chosenIndex, allNamesList);
	let allNamesListCopy = [...allNamesList];
	shuffle(nameList, chosenName => {
		allNamesList = allNamesListCopy.filter(studentName => studentName != chosenName); // after name is picked remove it from shuffle list
		if (allNamesList.length == 5) {
			// if only sillyNames are left, reset the list
			allNamesList = [...studentNames, ...sillyNames];
		}
	});
});
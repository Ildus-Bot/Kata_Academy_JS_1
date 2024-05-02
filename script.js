let sourceForm = document.querySelector(".git-repositores__source");
let itemElements = document.querySelectorAll(".git-repositores__item");
let repositoryList = document.querySelector(".selectedRepositories__list");

let count = 0;

let getDebounceRepositories = debounce(600);

sourceForm.addEventListener("input", (event) => {
	if(sourceForm.value) {
		getDebounceRepositories(sourceForm.value);
	}

	if(sourceForm.value === "") {
		removeContentLists();
		getDebounceRepositories();
	}
})



function debounce(debounceTime) {
	let timeout;

	return function(data) {
		if(data === undefined) {
			clearTimeout(timeout);
		} else {
			clearTimeout(timeout);

			timeout = setTimeout(() => getRepositories(data), debounceTime);
		}
	}
}

function getRepositories(text) {
	fetch(`https://api.github.com/search/repositories?q=${text}`, {
		headers: {
		    'accept': 'application/vnd.github+json'
		}})
		.then(response => {
			return response.json();
		})
		.then(repositories => {
			if(sourceForm.value) changeElements(repositories.items);
		})
		.catch(error => {
			console.log(error);
		})
}

function changeElements(arrayRepositories) {
	itemElements.forEach((element, index) => {

		if(arrayRepositories[index]) { 
			element.style.padding = "10px";
			if(index !== 4) {
				element.style.borderBottom = "1px solid gray";
			}
			addEvent(element, arrayRepositories[index]);
			element.textContent = arrayRepositories[index].name;
		} else {

			element.textContent = "";
		}
	})
}

function addEvent(element, objRepository) {
	removeEventListener('click', createListSelectedRepositories);
	element.addEventListener("click", createListSelectedRepositories);
	element.myParam = objRepository;
}

function createListSelectedRepositories(evt) {
	console.dir(evt.currentTarget.myParam);

	const fragment = document.createDocumentFragment();

	const card = document.createElement("div");
	card.classList.add('selectedRepositories__item');
	card.classList.add(`item${count}`);

	const cardBody = document.createElement("div");
	cardBody.classList.add('selectedRepositories__item-body');
	card.appendChild(cardBody);

	const cardName = document.createElement("p");
	cardName.classList.add('selectedRepositories__item-name');
	cardName.textContent = evt.currentTarget.myParam.name;
	cardBody.appendChild(cardName);

	const cardOwner = document.createElement("p");
	cardOwner.classList.add('selectedRepositories__item-owner');
	cardOwner.textContent = evt.currentTarget.myParam.owner.login;
	cardBody.appendChild(cardOwner);

	const cardStars = document.createElement("p");
	cardStars.classList.add('selectedRepositories__item-stars');
	cardStars.textContent = evt.currentTarget.myParam.stargazers_count;
	cardBody.appendChild(cardStars);

	const cardButtonClose = document.createElement("button");
	cardButtonClose.classList.add('selectedRepositories__item-button-close');
	cardButtonClose.myParam = count;
	card.appendChild(cardButtonClose);

	count++;

	const cardButtonCloseImage = document.createElement("img");
	cardButtonCloseImage.classList.add('selectedRepositories__item-button-image-close');
	cardButtonCloseImage.src = "images/icon-close.svg";
	cardButtonCloseImage.alt = '';
	cardButtonClose.appendChild(cardButtonCloseImage);

	// removeEventListener('click', removeCard);
	cardButtonClose.addEventListener("click", removeCard);

	fragment.appendChild(card);

	repositoryList.appendChild(fragment);

	// removeContentLists();
	removeSearch();
}

function removeCard(evt) {
	let deleteCard = document.querySelector(`.item${evt.currentTarget.myParam}`);
	deleteCard.remove();

}

function removeContentLists() {
	itemElements.forEach( element => { 
		element.textContent = "";
		element.style.padding = "0";
		element.style.borderBottom = "none";
	})
}

function removeSearch() {
	sourceForm.value = '';
}


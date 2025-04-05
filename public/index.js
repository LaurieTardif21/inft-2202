// Import the list component.
import { list } from '../src/list.js';
import { animal } from '../src/animal.js';
import { loadAnimals } from '../src/list.js'; //we need to import the loadAnimals function

function home() {
    const homeElement = document.createElement('p');
    homeElement.textContent = 'This is the home page';
    return homeElement;
}

export function navigateTo(path, state = null) {
    // Clear existing content
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = '';
    // Update the url

    window.history.pushState(state, '', path); //***CHANGE 1: Update the navigation to manage the hash***
    switch (path) { //***CHANGE 2: Update the navigation to manage the hash***
        case '#/':
            const homeElement = home();
            mainContent.appendChild(homeElement);
            break;
        case '#/list':
            const listComponent2 = list(navigateTo);
            mainContent.appendChild(listComponent2);
            loadAnimals(navigateTo); //we call loadAnimals here
            break;
        case '#/animal':
            const urlParams = new URLSearchParams(window.location.search);
            const animalName = urlParams.get('name');
            const animalComponent = animal(animalName);
            mainContent.appendChild(animalComponent);
            break;
        default:
            const notFoundElement = document.createElement('p');
            notFoundElement.textContent = '404 - Page not found';
            mainContent.appendChild(notFoundElement);
            break;
    }
}

function initializeSPA() {
    // initial navigation
    navigateTo(window.location.hash || '#/'); //***CHANGE 3: Update the initial navigation to manage the hash***
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault(); // *** CHANGE 4: Prevent default link behavior ***
            const href = link.getAttribute('href');
            navigateTo(href); //***CHANGE 5: Update the links management to manage the hash***
        });
    });

    // handle back/forward navigation
    window.addEventListener('popstate', () => { //***CHANGE 6: Update the popstate event listener to manage the hash***
        navigateTo(window.location.hash);
    });
}
//add the document to the dom
document.addEventListener('DOMContentLoaded', () => {
    initializeSPA();
});
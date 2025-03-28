// Import the list component.
import { list } from './list.js';
import { animal } from './animal.js';

const mainContent = document.getElementById('main-content');

export function navigateTo(path, state = null) {
    // Clear existing content
    mainContent.innerHTML = '';
    // Update the url
    window.history.pushState(state, '', path);
    switch (path) {
        case '/':
            const listComponent = list();
            mainContent.appendChild(listComponent);
            break;
        case '/list':
            const listComponent2 = list();
            mainContent.appendChild(listComponent2);
            break;
        case '/animal':
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
    navigateTo(window.location.pathname + window.location.search);
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();
            const href = link.getAttribute('href');
            navigateTo(href);
        });
    });

    // handle back/forward navigation
    window.addEventListener('popstate', () => {
        navigateTo(window.location.pathname + window.location.search);
    });
}
//add the document to the dom
document.addEventListener('DOMContentLoaded', () => {
    initializeSPA();
});
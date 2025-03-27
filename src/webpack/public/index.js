// src/index.js
import { addAnimal, findAnimal, updateAnimal } from './animals/animal.service.js';
import list from './list.js';

function navigateTo(path) {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = '';

    // Extract query parameters
    const queryParams = new URLSearchParams(path.split('?')[1]);
    const animalName = queryParams.get('name');

    // Manage the navigation
    switch (path.split('?')[0]) {
        case '/':
            const homeElement = document.createElement('h1');
            homeElement.textContent = 'Welcome to the Home Page';
            mainContent.appendChild(homeElement);
            break;
        case '/animal':
            const animalComponent = animal();
            mainContent.appendChild(animalComponent);
            break;
        case '/list':
            const listComponent = list();
            mainContent.appendChild(listComponent);
            break;
        case '/contact':
            const contactElement = document.createElement('h1');
            contactElement.textContent = 'Contact Page';
            mainContent.appendChild(contactElement);
            break;
        case '/about':
            const aboutElement = document.createElement('h1');
            aboutElement.textContent = 'About Page';
            mainContent.appendChild(aboutElement);
            break;
        default:
            const notFoundElement = document.createElement('h1');
            notFoundElement.textContent = '404 - Not Found';
            mainContent.appendChild(notFoundElement);
            break;
    }
}

function animal() {
    const form = document.createElement('form');
    const description = 'Manage Animals';

    // Container for animals list (if required)
    const animalList = document.createElement('ul');

    animalList.id = 'animalList';

    async function loadAnimalData(animalName) {
        if (animalName) {
            try {
                const animal = await findAnimal(animalName);
                if (animal) {
                    // Populate the form with the retrieved animal data
                    form.animalName.value = animal.name;
                    form.animalBreed.value = animal.breed;
                    form.animalEyes.value = animal.eyes;
                    form.animalLegs.value = animal.legs;
                    form.animalSound.value = animal.sound;
                    // Add the animal ID to the form for updating later
                    form.setAttribute('data-animal-id', animal.id);
                    // Change the button text to update
                    form.querySelector('button[type="submit"]').textContent = 'Update Animal';
                } else {
                    console.log('Animal not found');
                }
            } catch (error) {
                console.error('Error fetching animal:', error);
            }
        }
    }

    function createContent() {
        const container = document.createElement('div');
        container.classList.add('mb-2');

        const nameLabel = document.createElement('label');
        nameLabel.textContent = 'Animal Name:';
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.name = 'name';
        nameInput.id = 'animalName';
        nameInput.classList.add('form-control');
        nameInput.required = true;

        const breedLabel = document.createElement('label');
        breedLabel.textContent = 'Breed:';
        const breedInput = document.createElement('input');
        breedInput.type = 'text';
        breedInput.name = 'breed';
        breedInput.id = 'animalBreed';
        breedInput.classList.add('form-control');
        breedInput.required = true;

        const eyesLabel = document.createElement('label');
        eyesLabel.textContent = 'Number of Eyes:';
        const eyesInput = document.createElement('input');
        eyesInput.type = 'number';
        eyesInput.name = 'eyes';
        eyesInput.id = 'animalEyes';
        eyesInput.classList.add('form-control');
        eyesInput.required = true;
        eyesInput.min = 0;

        const legsLabel = document.createElement('label');
        legsLabel.textContent = 'Legs:';
        const legsInput = document.createElement('input');
        legsInput.type = 'number';
        legsInput.name = 'legs';
        legsInput.id = 'animalLegs';
        legsInput.classList.add('form-control');
        legsInput.required = true;
        legsInput.min = 0;

        const soundLabel = document.createElement('label');
        soundLabel.textContent = 'Sound:';
        const soundInput = document.createElement('input');
        soundInput.type = 'text';
        soundInput.name = 'sound';
        soundInput.id = 'animalSound';
        soundInput.classList.add('form-control');
        soundInput.required = true;

        const submitBtn = document.createElement('button');
        submitBtn.textContent = 'Add Animal';
        submitBtn.type = 'submit';
        submitBtn.classList.add('btn', 'btn-primary');


        container.appendChild(nameLabel);
        container.appendChild(nameInput);
        container.appendChild(breedLabel);
        container.appendChild(breedInput);
        container.appendChild(eyesLabel);
        container.appendChild(eyesInput);
        container.appendChild(legsLabel);
        container.appendChild(legsInput);
        container.appendChild(soundLabel);
        container.appendChild(soundInput);
        container.appendChild(submitBtn);

        form.appendChild(container);
    }

    form.addEventListener('submit', async function (event) {
        event.preventDefault();
        const animalData = {
            name: form.animalName.value,
            breed: form.animalBreed.value,
            eyes: parseInt(form.animalEyes.value, 10),
            legs: parseInt(form.animalLegs.value, 10),
            sound: form.animalSound.value,
        };
        const animalId = form.getAttribute('data-animal-id');
        try {
            if (!animalId) {
                await addAnimal(animalData);
            } else {
                await updateAnimal([animalData], form.animalName.value);
            }
            form.reset();
            form.removeAttribute('data-animal-id');
            form.querySelector('button[type="submit"]').textContent = 'Add Animal';
            window.history.pushState(null, '', `/list`); // Update URL
            navigateTo(`/list`); // Load content
        } catch (error) {
            console.error('Error adding/updating animal:', error);
        }
    });

    createContent();
    //get the parameters
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const animalName = urlParams.get('name');
    loadAnimalData(animalName);
    return form;
}
function initializeSPA() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();
            const href = link.getAttribute('href');
            window.history.pushState(null, '', href); // Update URL
            navigateTo(href); // Load content
        });
    });

    // Handle initial load and browser navigation
    window.addEventListener('popstate', () => {
        navigateTo(window.location.pathname);
    });

    // Initial load
    navigateTo(window.location.pathname);
}

initializeSPA();
export default animal;
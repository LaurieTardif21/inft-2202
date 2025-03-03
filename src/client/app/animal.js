import animalService from './animals/animal.service.js';

// Form elements
const animalForm = document.getElementById('animalForm');
const animalName = document.getElementById('animalName');
const animalBreed = document.getElementById('animalBreed');
const animalEyes = document.getElementById('animalEyes');
const animalLegs = document.getElementById('animalLegs');
const animalSound = document.getElementById('animalSound');
const animalId = document.getElementById('animalId');
const action = document.getElementById('action');
const loadingMessageBox = document.getElementById('loading-message-box');
const errorMessage = document.getElementById('error-message-box');
const noServiceMessageBox = document.getElementById('no-service-message-box');

// Get the animal id from the url
const urlParams = new URLSearchParams(window.location.search);
const animalIdFromUrl = urlParams.get('id');

// If there is an animal id, then we are editing an animal
if (animalIdFromUrl) {
    action.innerHTML = "Edit an animal";
    animalId.value = animalIdFromUrl;
    loadAnimal(animalIdFromUrl);
}

// Initialize the form
initForm();

// Event listener for form submission
animalForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Get the data from the form
    const animal = {
        name: animalName.value,
        breed: animalBreed.value,
        eyes: animalEyes.value,
        legs: animalLegs.value,
        sound: animalSound.value,
    };

    // Check if we are adding or editing an animal
    if (animalId.value) {
        animal.id = animalId.value;
        await updateAnimal(animal);
    } else {
        await addAnimal(animal);
    }
    // Redirect to the list page
    window.location.href = 'list.html';
});

// Function to load an animal
async function loadAnimal(id) {
    manageLoadingMessage(true);
    manageNoServiceMessage(false);
    try {
        const animal = await animalService.findAnimal(id);
        if (animal) {
            animalName.value = animal.name;
            animalBreed.value = animal.breed;
            animalEyes.value = animal.eyes;
            animalLegs.value = animal.legs;
            animalSound.value = animal.sound;
            manageLoadingMessage(false);
        } else {
            manageNoServiceMessage(true);
            manageLoadingMessage(false);
        }
    } catch (error) {
        manageErrorMessage(true);
        manageNoServiceMessage(false);
        manageLoadingMessage(false);
    }
}

// Function to add an animal
async function addAnimal(animal) {
    manageLoadingMessage(true);
    try {
        await animalService.saveAnimal(animal);
    } catch (error) {
        manageErrorMessage(true);
    } finally {
        manageLoadingMessage(false);
    }
}

// Function to update an animal
async function updateAnimal(animal) {
    manageLoadingMessage(true);
    try {
        await animalService.updateAnimal(animal);
    } catch (error) {
        manageErrorMessage(true);
    } finally {
        manageLoadingMessage(false);
    }
}

function manageErrorMessage(show) {
    if (show) {
        errorMessage.classList.remove('d-none');
    } else {
        errorMessage.classList.add('d-none');
    }
}

function manageLoadingMessage(show) {
    if (show) {
        loadingMessageBox.classList.remove('d-none');
    } else {
        loadingMessageBox.classList.add('d-none');
    }
}
function manageNoServiceMessage(show) {
    if (show) {
        noServiceMessageBox.classList.remove('d-none');
    } else {
        noServiceMessageBox.classList.add('d-none');
    }
}

function initForm() {
    manageErrorMessage(false);
    manageLoadingMessage(false);
    manageNoServiceMessage(false);
}

// Handle timeout and no service
let timeoutId; // Define timeoutId in the outer scope

async function initialize() {
    try {
        timeoutId = setTimeout(() => {
            console.log("Timeout triggered");
            noServiceMessageBox.classList.remove('d-none'); // Show "no service" message
            loadingMessageBox.classList.add('d-none'); // Hide "loading" message
            clearTimeout(timeoutId);
        }, 5000);

    } catch (error) {
        console.error('Initialization failed:', error);
        // Handle the error during initialization
    } finally {
        clearTimeout(timeoutId);
        loadingMessageBox.classList.add('d-none');
        noServiceMessageBox.classList.add('d-none');
    }
}

initialize();
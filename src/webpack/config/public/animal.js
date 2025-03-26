import { addAnimal, findAnimal, updateAnimal, deleteAnimal } from './animal.service.js'; //You will also need to import delete animal.

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('animal-form');
    const saveButton = form.querySelector('button[type="submit"]');
    // Inputs
    const nameInput = document.getElementById('animal-name');
    const breedInput = document.getElementById('animal-breed');
    const eyesInput = document.getElementById('animal-eyes');
    const legsInput = document.getElementById('animal-legs');
    const soundInput = document.getElementById('animal-sound');
    // Errors
    const breedError = document.getElementById('breedError');
    const eyesError = document.getElementById('eyesError');
    const legsError = document.getElementById('legsError');
    const soundError = document.getElementById('soundError');
    const nameError = document.getElementById('nameError');

    // Check if we're editing or adding
    const urlParams = new URLSearchParams(window.location.search);
    const animalName = urlParams.get('name'); // Get the animal's name from the URL
    //Declare the variable

    // Helper function to validate if an input is a non-negative number
    function isValidNonNegativeNumber(value) {
        const num = Number(value);
        if (isNaN(num) || num < 0) {
            throw new Error('Input must be a non-negative number.');
        }
        return true; // Indicate validation passed
    }

    // Helper function to clear all errors
    function clearErrors() {
        breedError.textContent = '';
        eyesError.textContent = '';
        legsError.textContent = '';
        soundError.textContent = '';
        nameError.textContent = '';
    }
    // Function to fill the form
    async function fillForm() {
        // Editing an animal
        saveButton.textContent = 'Save Animal'; // Change button text
        nameInput.disabled = true; // Disable name input in edit mode
        try {
            const animal = await findAnimal(animalName); // Search by name
            if (animal) {
                // Pre-fill the form
                nameInput.value = animal.name;
                breedInput.value = animal.breed;
                eyesInput.value = animal.eyes;
                legsInput.value = animal.legs;
                soundInput.value = animal.sound;
            }
        } catch (error) {
            console.error('Error fetching animal:', error);
            alert(error);
        }
    }

    if (animalName) {
        fillForm();
    } else {
        // Adding a new animal
        saveButton.textContent = 'Add Animal'; //Change button text
        nameInput.disabled = false; // Enable name input in add mode (optional)
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the default form submission
        clearErrors();// Reset error messages

        // Get the values from the form, and remove white spaces
        const name = nameInput.value.trim();
        const breed = breedInput.value.trim();
        const eyes = eyesInput.value.trim();
        const legs = legsInput.value.trim();
        const sound = soundInput.value.trim();

        // Validation
        try {
            if (!breed) {
                throw new Error('Breed is required.');
            }
            isValidNonNegativeNumber(eyes);
            isValidNonNegativeNumber(legs);
            if (!sound) {
                throw new Error('Sound is required.');
            }
             if (!name) {
                throw new Error('Name is required.');
            }
        } catch (error) {
            //Error handling
            if (error.message === 'Breed is required.') {
                breedError.textContent = error.message;
            } else if (error.message === 'Input must be a non-negative number.') {
                eyesError.textContent = (eyesError.textContent) ? eyesError.textContent : error.message;
                legsError.textContent = (legsError.textContent) ? legsError.textContent : error.message;
            }else if (error.message === 'Name is required.') {
                nameError.textContent = error.message;
            }
            else if (error.message) {
                console.log(error.message);
            }
            return;
        }
        // Create the animal object
        const animal = {
            name: name,
            breed: breed,
            eyes: parseInt(eyes), // convert to an int, this is a good practice
            legs: parseInt(legs), // convert to an int, this is a good practice
            sound: sound,
        };

        try {
            if (animalName) {
                // Call updateAnimal and put the data inside an array.
                const animalData = [{...animal}];
                await updateAnimal(animalData, animalName);
            } else {
                // If adding, call addAnimal
                await addAnimal([animal]); // THIS LINE IS CORRECT NOW!
            }
            window.location.href = '/inft-2202/src/client/public/list.html'; // Redirect to list page
        } catch (error) {
            console.error('Error adding/updating animal:', error);
            alert(error);//Show the full error to the user
        }
    });
});
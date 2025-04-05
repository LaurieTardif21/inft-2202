import { addAnimal, findAnimal, updateAnimal } from './animals/animal.service.js';

export function animal(animalName) {
    //create the form element
    const form = document.createElement('form');
    form.id = 'animal-form';

    // Create input fields dynamically
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.id = 'animal-name';
    nameInput.name = 'name';
    nameInput.classList.add('form-control');
    nameInput.required = true;

    const breedInput = document.createElement('input');
    breedInput.type = 'text';
    breedInput.id = 'animal-breed';
    breedInput.name = 'breed';
    breedInput.classList.add('form-control');
    breedInput.required = true;

    const eyesInput = document.createElement('input');
    eyesInput.type = 'number';
    eyesInput.id = 'animal-eyes';
    eyesInput.name = 'eyes';
    eyesInput.classList.add('form-control');
    eyesInput.required = true;
    eyesInput.min = 0;

    const legsInput = document.createElement('input');
    legsInput.type = 'number';
    legsInput.id = 'animal-legs';
    legsInput.name = 'legs';
    legsInput.classList.add('form-control');
    legsInput.required = true;
    legsInput.min = 0;

    const soundInput = document.createElement('input');
    soundInput.type = 'text';
    soundInput.id = 'animal-sound';
    soundInput.name = 'sound';
    soundInput.classList.add('form-control');
    soundInput.required = true;

    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.classList.add('btn', 'btn-primary');

    // Create error elements
    const nameError = document.createElement('div');
    nameError.id = 'nameError';
    nameError.classList.add('text-danger');

    const breedError = document.createElement('div');
    breedError.id = 'breedError';
    breedError.classList.add('text-danger');

    const eyesError = document.createElement('div');
    eyesError.id = 'eyesError';
    eyesError.classList.add('text-danger');

    const legsError = document.createElement('div');
    legsError.id = 'legsError';
    legsError.classList.add('text-danger');

    const soundError = document.createElement('div');
    soundError.id = 'soundError';
    soundError.classList.add('text-danger');

    // Function to fill the form
    async function fillForm() {
        // Editing an animal
        submitBtn.textContent = 'Save Animal'; // Change button text
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
                //add the id to the animal
                form.animalId = animal.id;
            }
        } catch (error) {
            console.error('Error fetching animal:', error);
            alert(error);
        }
    }

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
    // Add labels
    const nameLabel = document.createElement('label');
    nameLabel.textContent = 'Animal Name:';
    const breedLabel = document.createElement('label');
    breedLabel.textContent = 'Breed:';
    const eyesLabel = document.createElement('label');
    eyesLabel.textContent = 'Number of Eyes:';
    const legsLabel = document.createElement('label');
    legsLabel.textContent = 'Legs:';
    const soundLabel = document.createElement('label');
    soundLabel.textContent = 'Sound:';

    // Append the form elements
    form.appendChild(nameLabel);
    form.appendChild(nameInput);
    form.appendChild(nameError);
    form.appendChild(breedLabel);
    form.appendChild(breedInput);
    form.appendChild(breedError);
    form.appendChild(eyesLabel);
    form.appendChild(eyesInput);
    form.appendChild(eyesError);
    form.appendChild(legsLabel);
    form.appendChild(legsInput);
    form.appendChild(legsError);
    form.appendChild(soundLabel);
    form.appendChild(soundInput);
    form.appendChild(soundError);
    form.appendChild(submitBtn);

    // Check if we're editing or adding
    if (animalName) {
        fillForm();
    } else {
        // Adding a new animal
        submitBtn.textContent = 'Add Animal'; //Change button text
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
            } else if (error.message === 'Name is required.') {
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
                const animalDb = await findAnimal(animalName);
                const animalData = {...animal, id: animalDb.id};
                await updateAnimal(animalData);
            } else {
                // If adding, call addAnimal
                await addAnimal(animal); // THIS LINE IS CORRECT NOW!
            }
            navigateTo('/list'); // Redirect to list page
        } catch (error) {
            console.error('Error adding/updating animal:', error);
            alert(error);//Show the full error to the user
        }
    });
    return form;
}
/*
    Name: Laurie Tardif
    Filename: add.js
    Course: INFT 2202
    Date: January 10, 2025
    Description: This is the general application script. Functions that are required on the add page live here.
*/

// Validate the animal form
function validateAnimalForm(form) {
    let isValid = true;

    // List of fields to validate
    const fields = [
        { name: 'animalName', message: 'Animal name is required.' },
        { name: 'animalBreed', message: 'Breed is required.' },
        { name: 'animalEyes', message: 'Number of eyes is required and must be a positive number.', isNumber: true },
        { name: 'animalLegs', message: 'Number of legs is required and must be a positive number.', isNumber: true },
        { name: 'animalSound', message: 'Sound is required.' },
    ];

    // Validate each field
    fields.forEach(field => {
        const input = form[field.name];
        const value = input.value.trim();
        const errorField = input.nextElementSibling;

        if (field.isNumber) {
            const numberValue = Number(value);
            if (!value || isNaN(numberValue) || numberValue < 0) {
                errorField.textContent = field.message;
                errorField.classList.remove('d-none');
                input.classList.add('is-invalid');
                isValid = false;
            } else {
                errorField.textContent = '';
                errorField.classList.add('d-none');
                input.classList.remove('is-invalid');
                input.classList.add('is-valid');
            }
        } else {
            if (!value) {
                errorField.textContent = field.message;
                errorField.classList.remove('d-none');
                input.classList.add('is-invalid');
                isValid = false;
            } else {
                errorField.textContent = '';
                errorField.classList.add('d-none');
                input.classList.remove('is-invalid');
                input.classList.add('is-valid');
            }
        }
    });

    return isValid;
}

// Add the animal to local storage
function putAnimalInStorage(animal) {
    let animals = JSON.parse(localStorage.getItem('animals')) || [];

    // Check if the animal already exists
    if (animals.some(existingAnimal => existingAnimal.name.toLowerCase() === animal.name.toLowerCase())) {
        throw new Error('That animal already exists!');
    }

    // Add the new animal and update local storage
    animals.push(animal);
    localStorage.setItem('animals', JSON.stringify(animals));
}

// Handle form submission
function submitAnimalForm(event) {
    event.preventDefault();

    const form = event.target;

    // Validate the form
    if (validateAnimalForm(form)) {
        const animal = {
            name: form.animalName.value.trim(),
            breed: form.animalBreed.value.trim(),
            eyes: Number(form.animalEyes.value.trim()),
            legs: Number(form.animalLegs.value.trim()),
            sound: form.animalSound.value.trim(),
        };

        try {
            // Attempt to add the animal to storage
            putAnimalInStorage(animal);

            // Redirect to list.html on success
            window.location.href = 'list.html';
        } catch (error) {
            // Display the error message in the name's error field
            const errorField = form.animalName.nextElementSibling;
            errorField.textContent = error.message;
            errorField.classList.remove('d-none');
        }
    }
}

// Attach the event listener to the form
document.getElementById('animalForm').addEventListener('submit', submitAnimalForm);
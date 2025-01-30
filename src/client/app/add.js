import { addAnimal, getAnimals, deleteAnimal } from "/inft-2202/src/client/app/animals/animal.service.js";

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

    const maxEyes = 10;
    const maxLegs = 8;

    const fields = [
        { name: 'animalName', message: 'Animal name is required.' },
        { name: 'animalBreed', message: 'Breed is required.' },
        { name: 'animalEyes', message: `Number of eyes is required, must be a positive number and ≤ ${maxEyes}.`, isNumber: true, max: maxEyes },
        { name: 'animalLegs', message: `Number of legs is required, must be a positive number and ≤ ${maxLegs}.`, isNumber: true, max: maxLegs },
        { name: 'animalSound', message: 'Sound is required.' },
    ];

    fields.forEach(field => {
        const input = form[field.name];
        const value = input.value.trim();
        const errorField = input.nextElementSibling;

        if (field.isNumber) {
            const numberValue = Number(value);
            if (!value || isNaN(numberValue) || numberValue < 0 || numberValue > field.max) {
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

// Handle form submission
function submitAnimalForm(event) {
    event.preventDefault();
    const form = event.target;

    if (validateAnimalForm(form)) {
        const animal = {
            id: '', // Will be assigned in service
            name: form.animalName.value.trim(),
            breed: form.animalBreed.value.trim(),
            eyes: Number(form.animalEyes.value.trim()),
            legs: Number(form.animalLegs.value.trim()),
            sound: form.animalSound.value.trim(),
        };

        addAnimal(animal)
            .then(() => {
                window.location.href = './list.html';
            })
            .catch(error => {
                const errorField = form.animalName.nextElementSibling;
                errorField.textContent = error.message;
                errorField.classList.remove('d-none');
            });
    }
}

// Display the list of animals and add delete buttons
function displayAnimals() {
    getAnimals().then(animals => {
        const animalList = document.getElementById('animalList');
        animalList.innerHTML = ''; // Clear the list

        animals.forEach(animal => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
            listItem.innerHTML = `
                <span>${animal.name} (${animal.breed}) - ${animal.eyes} eyes, ${animal.legs} legs</span>
                <button class="btn btn-danger btn-sm delete-btn" data-id="${animal.id}">Delete</button>
            `;
            animalList.appendChild(listItem);
        });

        // Attach event listeners to delete buttons
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', function () {
                const animalId = this.getAttribute('data-id');
                handleDelete(animalId);
            });
        });
    }).catch(error => console.error('Error fetching animals:', error));
}

// Handle animal deletion
function handleDelete(animalId) {
    if (confirm('Are you sure you want to delete this animal?')) {
        deleteAnimal(animalId)
            .then(() => {
                displayAnimals(); // Refresh the list after deletion
            })
            .catch(error => console.error('Error deleting animal:', error));
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', displayAnimals);
document.getElementById('animalForm').addEventListener('submit', submitAnimalForm);
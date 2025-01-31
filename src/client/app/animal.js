import { addAnimal, findAnimal, updateAnimal } from './animals/animal.service.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('animal-form');
    const saveButton = form.querySelector('button[type="submit"]');
    // Check if we're editing or adding
    const urlParams = new URLSearchParams(window.location.search);
    const animalId = urlParams.get('id');

    if (animalId) {
        // Editing an animal
        saveButton.textContent = 'Save Animal'; // Change button text
        findAnimal(animalId)
            .then((animal) => {
                // Pre-fill the form
                document.getElementById('animal-name').value = animal.name;
                document.getElementById('animal-breed').value = animal.breed;
                document.getElementById('animal-eyes').value = animal.eyes;
                document.getElementById('animal-legs').value = animal.legs;
                document.getElementById('animal-sound').value = animal.sound;
            })
            .catch((error) => {
                console.error('Error fetching animal:', error);
                alert('Failed to fetch animal data. Please try again.');
            });
    } else {
        // Adding a new animal
        saveButton.textContent = 'Add Animal'; //Change button text
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent the default form submission

        // Get the values from the form
        const name = document.getElementById('animal-name').value;
        const breed = document.getElementById('animal-breed').value;
        const eyes = document.getElementById('animal-eyes').value;
        const legs = document.getElementById('animal-legs').value;
        const sound = document.getElementById('animal-sound').value;

        // Create the animal object
        const animal = {
            name: name,
            breed: breed,
            eyes: eyes,
            legs: legs,
            sound: sound,
        };

        if (animalId) {
            // If editing, add the id to the animal object
            animal.id = animalId;
            // Call updateAnimal
            updateAnimal(animal)
                .then(() => {
                    window.location.href = 'list.html'; // Redirect to list page
                })
                .catch((error) => {
                    console.error('Error updating animal:', error);
                    alert('Failed to update animal. Please try again.');
                });
        } else {
            // If adding, call addAnimal
            addAnimal(animal)
                .then(() => {
                    window.location.href = 'list.html'; // Redirect to list page
                })
                .catch((error) => {
                    console.error('Error adding animal:', error);
                    alert('Failed to add animal. Please try again.');
                });
        }
    });
});


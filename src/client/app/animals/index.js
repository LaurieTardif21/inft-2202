// index.js
import { addAnimal, getAnimals, deleteAnimal } from './animal.service.js';

export function animal() {
    const form = document.createElement('form');
    const animalList = document.createElement('ul');
    animalList.id = 'animalList'; // List container for animals
    let description = 'Manage Animals';

    // Create the form content
    function createContent() {
        const container = document.createElement('div');
        container.classList.add('mb-2');

        // Animal Name
        const nameLabel = document.createElement('label');
        nameLabel.textContent = "Animal Name:";
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.name = 'name';
        nameInput.id = 'animalName';
        nameInput.classList.add('form-control');
        nameInput.required = true;

        // Animal Breed
        const breedLabel = document.createElement('label');
        breedLabel.textContent = "Breed:";
        const breedInput = document.createElement('input');
        breedInput.type = 'text';
        breedInput.name = 'breed';
        breedInput.id = 'animalBreed';
        breedInput.classList.add('form-control');
        breedInput.required = true;

        // Animal Eyes
        const eyesLabel = document.createElement('label');
        eyesLabel.textContent = "Eye Color:";
        const eyesInput = document.createElement('input');
        eyesInput.type = 'text';
        eyesInput.name = 'eyes';
        eyesInput.id = 'animalEyes';
        eyesInput.classList.add('form-control');
        eyesInput.required = true;

        // Animal Legs
        const legsLabel = document.createElement('label');
        legsLabel.textContent = "Legs:";
        const legsInput = document.createElement('input');
        legsInput.type = 'number';
        legsInput.name = 'legs';
        legsInput.id = 'animalLegs';
        legsInput.classList.add('form-control');
        legsInput.required = true;

        // Animal Sound
        const soundLabel = document.createElement('label');
        soundLabel.textContent = "Sound:";
        const soundInput = document.createElement('input');
        soundInput.type = 'text';
        soundInput.name = 'sound';
        soundInput.id = 'animalSound';
        soundInput.classList.add('form-control');
        soundInput.required = true;

        // Submit Button
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

    // Handle form submission to add new animal
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const animalData = {
            name: form.animalName.value,
            breed: form.animalBreed.value,
            eyes: form.animalEyes.value,
            legs: form.animalLegs.value,
            sound: form.animalSound.value
        };

        addAnimal(animalData).then(() => {
            form.reset();
            loadAnimals(); // Reload the list after adding new animal
        }).catch(error => {
            console.error("Error adding animal:", error);
        });
    });

    createContent();
    return { element: form }; // Return the form as part of an object
}
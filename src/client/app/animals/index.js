import { addAnimal, getAnimals, deleteAnimal } from './animal.service.js';

function animal() {
    const form = document.createElement('form');
    const description = 'Manage Animals';

    // Container for animals list (if required)
    const animalList = document.createElement('ul');

    animalList.id = 'animalList';

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

    form.addEventListener('submit', async function (event) { // Changed here
        event.preventDefault();
        const animalData = {
            name: form.animalName.value,
            breed: form.animalBreed.value,
            eyes: parseInt(form.animalEyes.value, 10),
            legs: parseInt(form.animalLegs.value, 10),
            sound: form.animalSound.value,
        };

        try { // Added try here
            await addAnimal(animalData); // await here
            form.reset();
            window.location.href = './list.html';
            // might mod later for to update here
        } catch (error) { // catch here
            console.error('Error adding animal:', error);
        }
    });

    createContent();

    return {
        element: form,
        description, // Optional: For debugging or future use
    };
}

export default animal;
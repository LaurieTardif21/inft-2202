import { addAnimal, getAnimals, deleteAnimal } from './animal.service.js';

function animal() {
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

        // Number of Eyes
        const eyesLabel = document.createElement('label');
        eyesLabel.textContent = "Number of Eyes:";
        const eyesInput = document.createElement('input');
        eyesInput.type = 'number';
        eyesInput.name = 'eyes';
        eyesInput.id = 'animalEyes';
        eyesInput.classList.add('form-control');
        eyesInput.required = true;

        // Number of Legs
        const legsLabel = document.createElement('label');
        legsLabel.textContent = "Number of Legs:";
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
        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.classList.add('btn', 'btn-primary');
        submitButton.textContent = 'Add Animal';

        // Append all the elements
        container.append(
            nameLabel, nameInput,
            breedLabel, breedInput,
            eyesLabel, eyesInput,
            legsLabel, legsInput,
            soundLabel, soundInput,
            submitButton
        );

        form.append(container);
        return form;
    }

    // Fetch and display the animal list
    function renderAnimalList() {
        // Clear the current list
        animalList.innerHTML = '';

        getAnimals()
            .then((animals) => {
                animals.forEach((animal) => {
                    const listItem = document.createElement('li');
                    listItem.textContent = `${animal.name} (${animal.breed})`;

                    // Delete button
                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.classList.add('btn', 'btn-danger', 'ms-2');
                    deleteButton.addEventListener('click', () => {
                        deleteAnimal(animal.id)
                            .then(() => {
                                alert('Animal deleted successfully!');
                                renderAnimalList(); // Refresh the list
                            })
                            .catch((error) => {
                                console.error('Error deleting animal:', error);
                                alert('An error occurred while deleting the animal.');
                            });
                    });

                    listItem.append(deleteButton);
                    animalList.appendChild(listItem);
                });
            })
            .catch((error) => {
                console.error('Error fetching animals:', error);
                alert('An error occurred while fetching the animal list.');
            });
    }

    // Handle form submission
    function submit() {
        // Validate the form
        if (!validate()) {
            return;
        }

        // Get the form data
        const name = document.getElementById('animalName').value;
        const breed = document.getElementById('animalBreed').value;
        const eyes = document.getElementById('animalEyes').value;
        const legs = document.getElementById('animalLegs').value;
        const sound = document.getElementById('animalSound').value;

        // Create an animal object
        const animalData = {
            name,
            breed,
            eyes: parseInt(eyes, 10),
            legs: parseInt(legs, 10),
            sound
        };

        // Send the data to the animal service to be added
        addAnimal(animalData)
            .then(() => {
                console.log('Animal added successfully!');
                alert('Animal added successfully!');
                form.reset();
                renderAnimalList(); // Refresh the list
            })
            .catch((error) => {
                console.error('Error adding animal:', error);
                alert('An error occurred while adding the animal.');
            });
    }

    // Validate the form before submitting
    function validate() {
        const name = document.getElementById('animalName').value;
        const breed = document.getElementById('animalBreed').value;
        const eyes = document.getElementById('animalEyes').value;
        const legs = document.getElementById('animalLegs').value;
        const sound = document.getElementById('animalSound').value;

        if (!name || !breed || !eyes || !legs || !sound) {
            alert('All fields are required.');
            return false;
        }

        return true;
    }

    // Attach a submit event handler to the form
    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission
        submit(); // Handle the submit
    });

    // Initial render of the animal list
    renderAnimalList();

    // Return the description, form element, and animal list
    return {
        description,
        element: (() => {
            const wrapper = document.createElement('div');
            wrapper.appendChild(createContent());
            wrapper.appendChild(animalList);
            return wrapper;
        })()
    };
}

export default animal;
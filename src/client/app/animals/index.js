import { addAnimal, getAnimals, deleteAnimal } from './animal.service.js';

function animal() {
    const form = document.createElement('form');
    let description = 'Add Animal';

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
        nameInput.id = 'animalName'; // Keep the ID as 'animalName'
        nameInput.classList.add('form-control');
        nameInput.required = true;

        // Animal Breed
        const breedLabel = document.createElement('label');
        breedLabel.textContent = "Breed:";
        const breedInput = document.createElement('input');
        breedInput.type = 'text';
        breedInput.name = 'breed';
        breedInput.id = 'animalBreed'; // Keep the ID as 'animalBreed'
        breedInput.classList.add('form-control');
        breedInput.required = true;

        // Number of Eyes
        const eyesLabel = document.createElement('label');
        eyesLabel.textContent = "Number of Eyes:";
        const eyesInput = document.createElement('input');
        eyesInput.type = 'number';
        eyesInput.name = 'eyes';
        eyesInput.id = 'animalEyes'; // Keep the ID as 'animalEyes'
        eyesInput.classList.add('form-control');
        eyesInput.required = true;

        // Number of Legs
        const legsLabel = document.createElement('label');
        legsLabel.textContent = "Number of Legs:";
        const legsInput = document.createElement('input');
        legsInput.type = 'number';
        legsInput.name = 'legs';
        legsInput.id = 'animalLegs'; // Keep the ID as 'animalLegs'
        legsInput.classList.add('form-control');
        legsInput.required = true;

        // Animal Sound
        const soundLabel = document.createElement('label');
        soundLabel.textContent = "Sound:";
        const soundInput = document.createElement('input');
        soundInput.type = 'text';
        soundInput.name = 'sound';
        soundInput.id = 'animalSound'; // Keep the ID as 'animalSound'
        soundInput.classList.add('form-control');
        soundInput.required = true;

        // Submit Button
        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.classList.add('btn', 'btn-primary');
        submitButton.textContent = 'Submit';

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

    // Validate the form before submitting
    function validate() {
        let valid = true;

        // Check if all the fields are filled out
        const name = document.getElementById('animalName').value;
        const breed = document.getElementById('animalBreed').value;
        const eyes = document.getElementById('animalEyes').value;
        const legs = document.getElementById('animalLegs').value;
        const sound = document.getElementById('animalSound').value;

        if (!name || !breed || !eyes || !legs || !sound) {
            valid = false;
            alert("All fields are required.");
        }

        return valid;
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
            eyes,
            legs,
            sound
        };

        // Send the data to the animal service to be added
        addAnimal(animalData)
            .then(() => {
                console.log("Animal added successfully!");
                alert("Animal added successfully!");

                // Optionally, clear the form
                form.reset();
            })
            .catch((error) => {
                console.error("Error adding animal:", error);
                alert("An error occurred while adding the animal.");
            });
    }

    // Attach a submit event handler to the form
    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission
        submit(); // Handle the submit
    });

    // Return the description and the created form element
    return {
        description,
        element: createContent()
    };
}

export default animal;
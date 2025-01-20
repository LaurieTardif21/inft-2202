import animalService from "./animal.service.js";

function animal() {
    const form = document.createElement('form');
    let description = 'Add Animal';

    function createContent() {
        const container = document.createElement('div');
        container.classList.add('mb-2');

        // Create form fields
        container.innerHTML = `
            <div class="form-group">
                <label for="name">Name:</label>
                <input type="text" id="name" name="name" class="form-control" required>
            </div>
            <div class="form-group">
                <label for="breed">Breed:</label>
                <input type="text" id="breed" name="breed" class="form-control" required>
            </div>
            <div class="form-group">
                <label for="eyes">Eye Color:</label>
                <input type="text" id="eyes" name="eyes" class="form-control" required>
            </div>
            <div class="form-group">
                <label for="legs">Number of Legs:</label>
                <input type="number" id="legs" name="legs" class="form-control" min="0" required>
            </div>
            <div class="form-group">
                <label for="sound">Sound:</label>
                <input type="text" id="sound" name="sound" class="form-control" required>
            </div>
            <button type="submit" class="btn btn-primary mt-2">Add Animal</button>
        `;

        form.append(container);
        return form;
    }

    function validate() {
        let valid = true;
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.classList.add('is-invalid');
                valid = false;
            } else {
                input.classList.remove('is-invalid');
            }
        });
        return valid;
    }

    function submit() {
        if (validate()) {
            const newAnimal = {
                name: form.querySelector('#name').value,
                breed: form.querySelector('#breed').value,
                eyes: form.querySelector('#eyes').value,
                legs: parseInt(form.querySelector('#legs').value, 10),
                sound: form.querySelector('#sound').value,
            };

            animalService.addAnimal(newAnimal)
                .then(() => {
                    alert('Animal added successfully!');
                    form.reset();
                })
                .catch(error => {
                    console.error('Error adding animal:', error);
                    alert('Failed to add animal.');
                });
        }
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        submit();
    });

    return {
        description,
        element: createContent(),
    };
}

export default animal;
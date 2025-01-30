/*
    Name: Laurie Tardif
    Filename: list.js
    Course: INFT 2202
    Date: January 10, 2025
    Description: This is the general application script. Functions that are required on the list page live here.
*/
// Handle animal deletion
function handleDelete(animalId) {
    if (confirm('Are you sure you want to delete this animal?')) {
        // Get the animals from local storage
        let animals = JSON.parse(localStorage.getItem('animals')) || [];

        // Filter out the animal with the given ID
        animals = animals.filter(animal => animal.id !== animalId);

        // Update local storage
        localStorage.setItem('animals', JSON.stringify(animals));

        // Refresh the list
        displayAnimals();
    }
}

// Load animals from localStorage and display them
function displayAnimals() {
    const animals = JSON.parse(localStorage.getItem('animals')) || [];
    const listContainer = document.getElementById('animalList'); // Assuming you have a container for the list

    if (listContainer) {
        // Clear the list before repopulating
        listContainer.innerHTML = '';

        animals.forEach(animal => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
            listItem.innerHTML = `
                <span>${animal.name} (${animal.breed}) - ${animal.eyes} eyes, ${animal.legs} legs</span>
                <button class="btn btn-danger btn-sm delete-btn" data-id="${animal.id}">Delete</button>
            `;
            listContainer.appendChild(listItem);

             // Attach event listeners to delete buttons
             document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', function () {
                    const animalId = this.getAttribute('data-id');
                    handleDelete(Number(animalId));
                });
            });
        });
    }
}

// Call loadAnimals to display the list on page load
displayAnimals();
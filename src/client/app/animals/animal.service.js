// animals.services.js

// Function to get the list of animals from localStorage
export function getAnimals() {
    return new Promise((resolve) => {
        // Retrieve the list from localStorage, or an empty array if not present
        const animals = JSON.parse(localStorage.getItem('animals')) || [];
        resolve(animals);
    });
}

// Function to add a new animal to the list and save it to localStorage
export function addAnimal(animal) {
    return new Promise((resolve) => {
        const animals = JSON.parse(localStorage.getItem('animals')) || [];
        
        // Assign a unique ID by using the current timestamp (or use any other method)
        animal.id = Date.now();
        
        animals.push(animal); // Add the new animal to the array
        localStorage.setItem('animals', JSON.stringify(animals)); // Save the updated list back to localStorage
        resolve();
    });
}

// Function to delete an animal from the list and update localStorage
export function deleteAnimal(animalId) {
    return new Promise((resolve) => {
        const animals = JSON.parse(localStorage.getItem('animals')) || [];
        const updatedAnimals = animals.filter(animal => animal.id !== animalId); // Remove the animal with the given ID
        localStorage.setItem('animals', JSON.stringify(updatedAnimals)); // Update localStorage with the new list
        resolve();
    });
}
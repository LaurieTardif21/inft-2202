// animal.service.js

// Function to get the list of animals from localStorage
export function getAnimals() {
    return new Promise((resolve, reject) => {
        try {
            const animals = JSON.parse(localStorage.getItem('animals')) || [];
            resolve(animals);
        } catch (error) {
            reject('Error getting animals from localStorage: ' + error);
        }
    });
}

// Function to add a new animal to the list and save it to localStorage
export function addAnimal(animal) {
    return new Promise((resolve, reject) => {
        try {
            const animals = JSON.parse(localStorage.getItem('animals')) || [];
            animal.id = Date.now();  // Set a unique ID for each animal
            animals.push(animal); // Add the new animal to the array
            localStorage.setItem('animals', JSON.stringify(animals)); // Save the updated list to localStorage
            resolve();
        } catch (error) {
            reject('Error adding animal to localStorage: ' + error);
        }
    });
}

// Function to delete an animal from the list and update localStorage
export function deleteAnimal(animalId) {
    return new Promise((resolve, reject) => {
        try {
            const animals = JSON.parse(localStorage.getItem('animals')) || [];
            const updatedAnimals = animals.filter(animal => animal.id !== animalId); // Remove the animal with the given ID
            localStorage.setItem('animals', JSON.stringify(updatedAnimals)); // Update localStorage with the new list
            resolve();
        } catch (error) {
            reject('Error deleting animal from localStorage: ' + error);
        }
    });
}
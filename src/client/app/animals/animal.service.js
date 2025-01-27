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
            animal.id = Date.now(); // Set a unique ID for each animal
            animals.push(animal); // Add the new animal to the array
            localStorage.setItem('animals', JSON.stringify(animals)); // Save the updated list to localStorage
            resolve();
        } catch (error) {
            reject('Error adding animal to localStorage: ' + error);
        }
    });
}

// Function to find an animal by its ID in localStorage
export function findAnimal(animalId) {
    return new Promise((resolve, reject) => {
        try {
            const animals = JSON.parse(localStorage.getItem('animals')) || [];
            const animal = animals.find(animal => animal.id === animalId);
            if (!animal) {
                throw new Error(`Animal with ID ${animalId} not found`);
            }
            resolve(animal);
        } catch (error) {
            reject('Error finding animal in localStorage: ' + error.message);
        }
    });
}

// Function to update an existing animal in the list
export function updateAnimal(updatedAnimal) {
    return new Promise((resolve, reject) => {
        try {
            const animals = JSON.parse(localStorage.getItem('animals')) || [];
            const index = animals.findIndex(animal => animal.id === updatedAnimal.id);
            if (index === -1) {
                throw new Error(`Animal with ID ${updatedAnimal.id} not found`);
            }
            animals[index] = updatedAnimal; // Update the animal object
            localStorage.setItem('animals', JSON.stringify(animals)); // Save the updated list to localStorage
            resolve(true);
        } catch (error) {
            reject('Error updating animal in localStorage: ' + error.message);
        }
    });
}

// Function to delete an animal from the list using the animal object
export function deleteAnimal(animal) {
    return new Promise((resolve, reject) => {
        try {
            const animals = JSON.parse(localStorage.getItem('animals')) || [];
            const index = animals.findIndex(item => item.id === animal.id);
            if (index === -1) {
                throw new Error(`Animal with ID ${animal.id} not found`);
            }
            animals.splice(index, 1); // Remove the animal from the array
            localStorage.setItem('animals', JSON.stringify(animals)); // Save the updated list to localStorage
            resolve(true);
        } catch (error) {
            reject('Error deleting animal from localStorage: ' + error.message);
        }
    });
}
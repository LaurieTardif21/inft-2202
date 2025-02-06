// Function to generate a unique ID without uuid
function generateId() {
    return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

// Simulate API delay (adjust to 2 seconds)
const API_DELAY = 2000; // 2 second

// Function to get the list of animals (from localStorage)
export function getAnimals() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                // Fetch from localStorage
                const animals = JSON.parse(localStorage.getItem('animals')) || [];

                // Ensure each animal has a unique 'id'
                animals.forEach((animal) => {
                    if (!animal.id) {
                        // Assign a unique ID if not present
                        animal.id = generateId();
                    }
                });

                resolve(animals);
            } catch (error) {
                reject(new Error(`Error getting animals: ${error.message}`));
            }
        }, API_DELAY);
    });
}

// Function to add a new animal to the list (to localStorage)
export function addAnimal(animal) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                // Add to localStorage
                const animals = JSON.parse(localStorage.getItem('animals')) || [];
                animal.id = generateId(); // Ensure unique ID for each animal
                animals.push(animal); // Add the new animal to the array
                localStorage.setItem('animals', JSON.stringify(animals)); // Save to localStorage
                resolve();
            } catch (error) {
                reject(new Error(`Error adding animal: ${error.message}`));
            }
        }, API_DELAY);
    });
}

// Function to delete an animal by ID (from localStorage)
export function deleteAnimal(animalId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                // Remove from localStorage
                const animals = JSON.parse(localStorage.getItem('animals')) || [];
                const updatedAnimals = animals.filter(animal => animal.id !== animalId); // Filter out the deleted animal by ID
                localStorage.setItem('animals', JSON.stringify(updatedAnimals)); // Save to localStorage
                resolve();
            } catch (error) {
                reject(new Error(`Error deleting animal: ${error.message}`));
            }
        }, API_DELAY);
    });
}

// Function to find an animal by ID (Checks Local Storage)
export function findAnimal(animalId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                // Check Local Storage
                const animals = JSON.parse(localStorage.getItem('animals')) || [];
                const animal = animals.find(a => a.id === animalId);

                if (!animal) {
                    throw new Error(`Error finding animal: animal not found`);
                }
                resolve(animal); // Found in local storage
            } catch (error) {
                reject(error);
            }
        }, API_DELAY);
    });
}

// Function to update an animal (Updates Local Storage)
export function updateAnimal(updatedAnimal) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                // Update Local Storage
                const animals = JSON.parse(localStorage.getItem('animals')) || [];
                const index = animals.findIndex(a => a.id === updatedAnimal.id);

                if (index === -1) {
                    throw new Error('Animal not found in local storage');
                }
                animals[index] = updatedAnimal;
                localStorage.setItem('animals', JSON.stringify(animals));
                resolve();
            } catch (error) {
                reject(error);
            }
        }, API_DELAY);
    });
}
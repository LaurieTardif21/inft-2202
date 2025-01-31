// Function to generate a unique ID without uuid
function generateId() {
    return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

// Function to get the list of animals (from localStorage)
export function getAnimals() {
    return new Promise((resolve, reject) => {
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
            reject('Error getting animals: ' + error);
        }
    });
}

// Helper function to validate animal data
function validateAnimalData(animal) {
    // Ensure 'legs' and 'eyes' are not negative
    if (animal.legs < 0) {
        animal.legs = 0;
    }
    if (animal.eyes < 0) {
        animal.eyes = 0;
    }
}

// Function to add a new animal to the list (to localStorage)
export function addAnimal(animal) {
    return new Promise((resolve, reject) => {
        try {
            validateAnimalData(animal); // Validate the animal data before adding
            // Add to localStorage
            const animals = JSON.parse(localStorage.getItem('animals')) || [];
            animal.id = generateId(); // Ensure unique ID for each animal
            animals.push(animal); // Add the new animal to the array
            localStorage.setItem('animals', JSON.stringify(animals)); // Save to localStorage
            resolve();
        } catch (error) {
            reject('Error adding animal: ' + error);
        }
    });
}

// Function to delete an animal by ID (from localStorage)
export function deleteAnimal(animalId) {
    return new Promise((resolve, reject) => {
        try {
            // Remove from localStorage
            const animals = JSON.parse(localStorage.getItem('animals')) || [];
            const updatedAnimals = animals.filter(animal => animal.id !== animalId); // Filter out the deleted animal by ID
            localStorage.setItem('animals', JSON.stringify(updatedAnimals)); // Save to localStorage
            resolve();
        } catch (error) {
            reject('Error deleting animal: ' + error);
        }
    });
}

// Function to find an animal by ID (Checks Local Storage)
export function findAnimal(animalId) {
    return new Promise((resolve, reject) => {
        try {
            // Check Local Storage
            const animals = JSON.parse(localStorage.getItem('animals')) || [];
            const animal = animals.find(a => a.id === animalId);

            if (animal) {
                resolve(animal); // Found in local storage
            } else {
                reject(`Error finding animal: animal not found`);
            }
        } catch (error) {
            reject(`Error finding animal: ${error.message}`);
        }
    });
}

// Function to update an animal (Updates Local Storage)
export function updateAnimal(updatedAnimal) {
    return new Promise((resolve, reject) => {
        try {
            validateAnimalData(updatedAnimal);// Validate the updated animal data
            // Update Local Storage
            const animals = JSON.parse(localStorage.getItem('animals')) || [];
            const index = animals.findIndex(a => a.id === updatedAnimal.id);

            if (index !== -1) {
                animals[index] = { ...animals[index], ...updatedAnimal }; //correct line
                localStorage.setItem('animals', JSON.stringify(animals));
                resolve();
            } else {
                reject('Animal not found in local storage'); //correct line
            }
        } catch (error) {
            reject(`Error updating animal: ${error.message}`);
        }
    });
}
// Function to get the list of animals (from localStorage or API)
export function getAnimals() {
    return new Promise((resolve, reject) => {
        try {
            const source = 'localStorage'; // Can be switched to API or other source
            if (source === 'localStorage') {
                // Fetch from localStorage
                const animals = JSON.parse(localStorage.getItem('animals')) || [];
                resolve(animals);
            } else if (source === 'api') {
                // Fetch from API (example: replace with actual API request)
                fetch('/api/animals') // Example API URL
                    .then(response => response.json())
                    .then(animals => resolve(animals))
                    .catch(error => reject('Error fetching animals from API: ' + error));
            } else {
                reject('Unknown data source');
            }
        } catch (error) {
            reject('Error getting animals: ' + error);
        }
    });
}

// Function to add a new animal to the list (to localStorage or API)
export function addAnimal(animal) {
    return new Promise((resolve, reject) => {
        try {
            const source = 'localStorage'; // Switch to API if needed

            if (source === 'localStorage') {
                // Add to localStorage
                const animals = JSON.parse(localStorage.getItem('animals')) || [];
                animal.id = Date.now(); // Set a unique ID for each animal
                animals.push(animal); // Add the new animal to the array
                localStorage.setItem('animals', JSON.stringify(animals)); // Save to localStorage
                resolve();
            } else if (source === 'api') {
                // Add to API (example: replace with actual API request)
                fetch('/api/animals', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(animal)
                })
                    .then(response => response.json())
                    .then(() => resolve())
                    .catch(error => reject('Error adding animal to API: ' + error));
            } else {
                reject('Unknown data source');
            }
        } catch (error) {
            reject('Error adding animal: ' + error);
        }
    });
}

// Function to delete an animal from the list (from localStorage or API)
export function deleteAnimal(animalId) {
    return new Promise((resolve, reject) => {
        try {
            const source = 'localStorage'; // Switch to API if needed

            if (source === 'localStorage') {
                // Delete from localStorage
                const animals = JSON.parse(localStorage.getItem('animals')) || [];
                const index = animals.findIndex(item => item.id === animalId);
                if (index === -1) {
                    throw new Error(`Animal with ID ${animalId} not found`);
                }
                animals.splice(index, 1); // Remove the animal from the array
                localStorage.setItem('animals', JSON.stringify(animals)); // Save to localStorage
                resolve();
            } else if (source === 'api') {
                // Delete from API (example: replace with actual API request)
                fetch(`/api/animals/${animalId}`, {
                    method: 'DELETE'
                })
                    .then(response => response.json())
                    .then(() => resolve())
                    .catch(error => reject('Error deleting animal from API: ' + error));
            } else {
                reject('Unknown data source');
            }
        } catch (error) {
            reject('Error deleting animal: ' + error);
        }
    });
}

// Function to update an existing animal in the list (to localStorage or API)
export function updateAnimal(updatedAnimal) {
    return new Promise((resolve, reject) => {
        try {
            const source = 'localStorage'; // Switch to API if needed

            if (source === 'localStorage') {
                // Update in localStorage
                const animals = JSON.parse(localStorage.getItem('animals')) || [];
                const index = animals.findIndex(animal => animal.id === updatedAnimal.id);
                if (index === -1) {
                    throw new Error(`Animal with ID ${updatedAnimal.id} not found`);
                }
                animals[index] = updatedAnimal; // Update the animal object
                localStorage.setItem('animals', JSON.stringify(animals)); // Save to localStorage
                resolve();
            } else if (source === 'api') {
                // Update in API (example: replace with actual API request)
                fetch(`/api/animals/${updatedAnimal.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedAnimal)
                })
                    .then(response => response.json())
                    .then(() => resolve())
                    .catch(error => reject('Error updating animal in API: ' + error));
            } else {
                reject('Unknown data source');
            }
        } catch (error) {
            reject('Error updating animal: ' + error);
        }
    });
}
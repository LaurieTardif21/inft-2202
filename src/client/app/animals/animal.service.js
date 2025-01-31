// Function to generate a unique ID without uuid
function generateId() {
    return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

// Function to get the list of animals (from localStorage or API)
export function getAnimals() {
    return new Promise((resolve, reject) => {
        try {
            const source = 'localStorage'; // Can be switched to API or other source
            if (source === 'localStorage') {
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
            } else if (source === 'api') {
                // Fetch from API (example: replace with actual API request)
                fetch('/api/animals') // Example API URL
                    .then(response => response.json())
                    .then(animals => {
                        // Ensure each animal has a unique 'id'
                        animals.forEach((animal) => {
                            if (!animal.id) {
                                animal.id = generateId();
                            }
                        });

                        resolve(animals);
                    })
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
                animal.id = generateId(); // Ensure unique ID for each animal
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

// Function to delete an animal by ID (from localStorage or API)
export function deleteAnimal(animalId) {
    return new Promise((resolve, reject) => {
        try {
            const source = 'localStorage'; // Switch to API if needed

            if (source === 'localStorage') {
                // Remove from localStorage
                const animals = JSON.parse(localStorage.getItem('animals')) || [];
                const updatedAnimals = animals.filter(animal => animal.id !== animalId); // Filter out the deleted animal by ID
                localStorage.setItem('animals', JSON.stringify(updatedAnimals)); // Save to localStorage
                resolve();
            } else if (source === 'api') {
                // Remove from API (example: replace with actual API request)
                fetch(`/api/animals/${animalId}`, {
                    method: 'DELETE',
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

const API_URL = '/api/animals'; // Update with actual API URL

// Function to find an animal by ID (Checks Local Storage first, then API)
export function findAnimal(animalId) {
    return new Promise((resolve, reject) => {
        try {
            // Check Local Storage
            const animals = JSON.parse(localStorage.getItem('animals')) || [];
            const animal = animals.find(a => a.id === animalId);

            if (animal) {
                resolve(animal); // Found in local storage
            } else {
                // Fetch from API if not found in localStorage
                fetch(`${API_URL}/${animalId}`)
                    .then(response => {
                        if (!response.ok) throw new Error('Animal not found in API');
                        return response.json();
                    })
                    .then(apiAnimal => resolve(apiAnimal))
                    .catch(error => reject(`Error finding animal: ${error.message}`));
            }
        } catch (error) {
            reject(`Error finding animal: ${error.message}`);
        }
    });
}

// Function to update an animal (Updates Local Storage first, then API)
export function updateAnimal(updatedAnimal) {
    return new Promise((resolve, reject) => {
        try {
            // Update Local Storage
            const animals = JSON.parse(localStorage.getItem('animals')) || [];
            const index = animals.findIndex(a => a.id === updatedAnimal.id);

            if (index !== -1) {
                animals[index] = updatedAnimal;
                localStorage.setItem('animals', JSON.stringify(animals));
            }

            // Update API as well
            fetch(`${API_URL}/${updatedAnimal.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedAnimal)
            })
                .then(response => {
                    if (!response.ok) throw new Error('Failed to update animal in API');
                    return response.json();
                })
                .then(() => resolve('Animal updated in both local storage and API'))
                .catch(error => reject(`Error updating animal in API: ${error.message}`));
        } catch (error) {
            reject(`Error updating animal: ${error.message}`);
        }
    });
}


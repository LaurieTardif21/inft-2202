// animal.service.js

// Function to get the list of animals (from localStorage or API)
export function getAnimals() {
    return new Promise((resolve, reject) => {
        try {
            const source = 'localStorage'; // Can be switched to API or other source
            if (source === 'localStorage') {
                // Fetch from localStorage
                const animals = JSON.parse(localStorage.getItem('animals')) || [];

                // Ensure each animal has an 'id'
                animals.forEach((animal, index) => {
                    if (!animal.id) {
                        // Assign a unique ID if not present (based on the index or Date.now())
                        animal.id = Date.now() + index; // Or use something like uuid()
                    }
                });

                resolve(animals);
            } else if (source === 'api') {
                // Fetch from API (example: replace with actual API request)
                fetch('/api/animals') // Example API URL
                    .then(response => response.json())
                    .then(animals => {
                        // Ensure each animal has an 'id'
                        animals.forEach((animal, index) => {
                            if (!animal.id) {
                                animal.id = Date.now() + index; // Or use something like uuid()
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
                animal.id = Date.now(); // Ensure unique ID for each animal
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
                const updatedAnimals = animals.filter(animal => animal.id !== animalId); // Filter out the deleted animal
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
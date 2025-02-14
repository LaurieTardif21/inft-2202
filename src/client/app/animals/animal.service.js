// animal.service.js

const API_DELAY = 2000; // 2 seconds
const BASE_URL = 'https://inft2202-server.onrender.com'; // Your API base URL
const API_KEY = 'laurie'; // Your API key

// Function to get the list of animals (from the API)
export function getAnimals(currentPage = 1, perPage = 5) {
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/animals?page=${currentPage}&perPage=${perPage}`, {
                    method: 'GET',
                    headers: {
                        'User': API_KEY,
                    },
                });

                if (!response.ok) {
                    const text = await response.text();
                    throw new Error(`HTTP error! status: ${response.status} message: ${text}`);
                }

                const data = await response.json();
                resolve(data);
            } catch (error) {
                reject(new Error(`Error getting animals: ${error.message}`));
            }
        }, API_DELAY);
    });
}

// Function to add a new animal (to the API)
export function addAnimal(animal) {
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/animals`, {
                    method: 'POST',
                    headers: {
                        'User': API_KEY,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(animal),
                });

                if (!response.ok) {
                    const text = await response.text();
                    throw new Error(`HTTP error! status: ${response.status} message: ${text}`);
                }

                resolve();
            } catch (error) {
                reject(new Error(`Error adding animal: ${error.message}`));
            }
        }, API_DELAY);
    });
}

// Function to delete an animal by ID (from the API)
export function deleteAnimal(animalId) {
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/animals/${animalId}`, {
                    method: 'DELETE',
                    headers: {
                        'User': API_KEY,
                    },
                });

                if (!response.ok) {
                    const text = await response.text();
                    throw new Error(`HTTP error! status: ${response.status} message: ${text}`);
                }

                resolve();
            } catch (error) {
                reject(new Error(`Error deleting animal: ${error.message}`));
            }
        }, API_DELAY);
    });
}

// Function to find an animal by ID (from the API)
export function findAnimal(animalId) {
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/animals/${animalId}`, {
                    method: 'GET',
                    headers: {
                        'User': API_KEY,
                    },
                });

                if (!response.ok) {
                    const text = await response.text();
                    throw new Error(`HTTP error! status: ${response.status} message: ${text}`);
                }

                const animal = await response.json();
                resolve(animal);
            } catch (error) {
                reject(new Error(`Error finding animal: ${error.message}`));
            }
        }, API_DELAY);
    });
}

// Function to update an animal (to the API)
export function updateAnimal(updatedAnimal) {
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/animals/${updatedAnimal.id}`, {
                    method: 'PUT',
                    headers: {
                        'User': API_KEY,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedAnimal),
                });

                if (!response.ok) {
                    const text = await response.text();
                    throw new Error(`HTTP error! status: ${response.status} message: ${text}`);
                }

                resolve();
            } catch (error) {
                reject(new Error(`Error updating animal: ${error.message}`));
            }
        }, API_DELAY);
    });
}
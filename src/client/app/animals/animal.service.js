// API Base URL
const API_URL = "https://inft2202-server.onrender.com/api/products"; //URL DATA IS FETCHED FROM
const API_KEY = '7bfa2060-9d12-42fe-8549-cf9205d269a0'; // APIKEY

// Simulate API delay (adjusted to 0.5 seconds)
const API_DELAY = 500;

// Common headers for API requests
const headers = {
    'Content-Type': 'application/json',
    'apiKey': API_KEY
};

// Function to get the list of animals from API
export async function getAnimals() {
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            try {
                const response = await fetch(API_URL, { headers });
                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('Resource not found.');
                    } else if (response.status === 500) {
                        throw new Error('Internal Server Error.');
                    } else {
                        throw new Error('Failed to fetch animals.');
                    }
                }
                const data = await response.json();
                resolve(data);
            } catch (error) {
                reject(error);
            }
        }, API_DELAY);
    });
}

// Function to add a new animal via API
export async function addAnimal(animal) {
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(animal),
                });

                if (!response.ok) {
                    if (response.status === 400) {
                        throw new Error('Bad request. Check the data sent.');
                    } else if (response.status === 500) {
                        throw new Error('Internal Server Error.');
                    } else {
                        throw new Error('Failed to add animal.');
                    }
                }
                resolve();
            } catch (error) {
                reject(error);
            }
        }, API_DELAY);
    });
}

// Function to delete an animal via API
export async function deleteAnimal(animalId) {
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            try {
                const response = await fetch(`${API_URL}/${animalId}`, {
                    method: 'DELETE',
                    headers
                });
                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('Animal not found.');
                    } else if (response.status === 500) {
                        throw new Error('Internal Server Error.');
                    } else {
                        throw new Error('Failed to delete animal.');
                    }
                }
                resolve();
            } catch (error) {
                reject(error);
            }
        }, API_DELAY);
    });
}

// Function to find an animal by ID via API
export async function findAnimal(animalId) {
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            try {
                const response = await fetch(`${API_URL}/${animalId}`, { headers });

                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('Animal not found.');
                    } else if (response.status === 500) {
                        throw new Error('Internal Server Error.');
                    } else {
                        throw new Error('Failed to find the animal.');
                    }
                }
                const data = await response.json();
                resolve(data);
            } catch (error) {
                reject(error);
            }
        }, API_DELAY);
    });
}

// Function to update an animal via API
export async function updateAnimal(updatedAnimal) {
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            try {
                const response = await fetch(`${API_URL}/${updatedAnimal.id}`, {
                    method: 'PUT',
                    headers,
                    body: JSON.stringify(updatedAnimal),
                });

                if (!response.ok) {
                    if (response.status === 400) {
                        throw new Error('Bad request. Check the data sent.');
                    } else if (response.status === 404) {
                        throw new Error('Animal not found.');
                    } else if (response.status === 500) {
                        throw new Error('Internal Server Error.');
                    } else {
                        throw new Error('Failed to update the animal.');
                    }
                }
                resolve();
            } catch (error) {
                reject(error);
            }
        }, API_DELAY);
    });
}
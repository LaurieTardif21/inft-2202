// API Base URL
const API_URL = "https://inft2202-server.onrender.com/api/animals"; //URL DATA IS FETCHED FROM
const API_KEY = '7bfa2060-9d12-42fe-8549-cf9205d269a0'; // APIKEY

// Simulate API delay (adjusted to 2 seconds)
const API_DELAY = 2000;

// Common headers for API requests
const headers = {
    'Content-Type': 'application/json',
    'apiKey': API_KEY //changed x-apikey to apiKey
};

// Function to get one page of animals
export function getAnimalPage(page, perPage) {
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            try {
                const response = await fetch(`${API_URL}?page=${page}&perPage=${perPage}`, { headers });
                if (!response.ok) throw new Error('Failed to fetch animals');

                // Get total number of records from response headers
                const totalRecords = response.headers.get('X-Total-Count');
                const totalPages = Math.ceil(totalRecords / perPage);
                console.log("getAnimals totalRecords", totalRecords);
                console.log("getAnimals totalPages", totalPages);
                // Parse the JSON data from the response
                const data = await response.json();
                console.log("getAnimals data", data);

                resolve({
                    records: data,
                    pagination: {
                        pages: totalPages,
                        page: page,
                        perPage: perPage
                    }
                });
            } catch (error) {
                reject(new Error(`Error getting animals: ${error.message}`));
            }
        }, API_DELAY);
    });
}

// Function to get the list of animals from API
export async function getAnimals() {
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            try {
                const response = await fetch(API_URL, { headers });
                if (!response.ok) throw new Error('Failed to fetch animals');
                resolve(await response.json());
            } catch (error) {
                reject(new Error(`Error getting animals: ${error.message}`));
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

                if (!response.ok) throw new Error('Failed to add animal');
                resolve();
            } catch (error) {
                reject(new Error(`Error adding animal: ${error.message}`));
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

                if (!response.ok) throw new Error('Failed to delete animal');
                resolve();
            } catch (error) {
                reject(new Error(`Error deleting animal: ${error.message}`));
            }
        }, API_DELAY);
    });
}

// Function to find an animal by name via API
export async function findAnimal(animalName) {
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            if (!animalName) {
                reject(new Error('Animal Name is required.'));
                return; // Exit the function early
            }
            try {
                // Construct the URL with the animal name as a query parameter
                const response = await fetch(`${API_URL}?name=${animalName}`, { headers });

                if (!response.ok) {
                    if (response.status === 404) {
                      reject(new Error('Animal not found'));
                    } else {
                      reject(new Error('Failed to get animal'));
                    }
                    return;
                  }
                  //check if there is data in the response
                  const data = await response.json();

                  if (data.length === 0) {
                    reject(new Error('Animal not found'));
                    return;
                  }
                resolve(data[0]); // Resolve with the first animal found (assuming uniqueness)
            } catch (error) {
                reject(new Error(`Error finding animal: ${error.message}`));
            }
        }, API_DELAY);
    });
}

// Function to update an animal via API
export async function updateAnimal(updatedAnimal) {
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            try {
                const response = await fetch(`${API_URL}`, { //change the end of the url to be the base
                    method: 'PUT',
                    headers,
                    body: JSON.stringify(updatedAnimal), //now the id is part of the body
                });

                if (!response.ok) throw new Error('Failed to update animal');
                resolve();
            } catch (error) {
                reject(new Error(`Error updating animal: ${error.message}`));
            }
        }, API_DELAY);
    });
}
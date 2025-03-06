// API Base URL
const API_URL = "https://inft2202-server.onrender.com/api/animals"; //URL DATA IS FETCHED FROM
const API_KEY = '7bfa2060-9d12-42fe-8549-cf9205d269a0'; // APIKEY

// Common headers for API requests
const headers = {
    'Content-Type': 'application/json',
    'apiKey': API_KEY //changed x-apikey to apiKey
};

// Function to get one page of animals
export async function getAnimals(page, perPage) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(`${API_URL}?page=${page}&perPage=${perPage}`, { headers });
            if (!response.ok) throw new Error('Failed to fetch animals');

            // Get total number of records from response headers
            const totalRecords = response.headers.get('X-Total-Count');
            const totalPages = Math.ceil(totalRecords / perPage);
            // Parse the JSON data from the response
            const data = await response.json();

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
    });
}

// Function to add a new animal via API
export async function addAnimal(animal) {
    return new Promise(async (resolve, reject) => {
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
    });
}

// Function to delete an animal via API
export async function deleteAnimal(animalName) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(`${API_URL}/${animalName}`, {
                method: 'DELETE',
                headers
            });

            if (!response.ok) throw new Error('Failed to delete animal');
            resolve(true);
        } catch (error) {
            reject(new Error(`Error deleting animal: ${error.message}`));
        }
    });
}

// Function to find an animal by name via API
export async function findAnimal(animalName) {
    return new Promise(async (resolve, reject) => {
        if (!animalName) {
            reject(new Error('Animal name is required.'));
            return; // Exit the function early
        }
        try {
            const response = await fetch(`${API_URL}/${animalName}`, { headers });// fetch the animal
            if (!response.ok) throw new Error('Failed to fetch animals');
            const animal = await response.json(); // get the data

            resolve(animal); // Return the found animal
        } catch (error) {
            reject(new Error(`Error finding animal: ${error.message}`));
        }
    });
}

// Function to update an animal via API
export async function updateAnimal(updatedAnimal, animalName) {
    return new Promise(async (resolve, reject) => {
        try {
            // Check if updatedAnimal is an array and take only the first record
            if (!Array.isArray(updatedAnimal) || updatedAnimal.length === 0) {
                throw new Error(`updatedAnimal should be an array with a minimum of one object`);
            }

            const animalToUpdate = {
                ...updatedAnimal[0]
            }; // Get the first animal from the array, we put all the data in the body.

            // Modify the API URL to include the animal's name as a query parameter
            const url = `${API_URL}?name=${encodeURIComponent(animalName)}`;

            const response = await fetch(url, {
                method: 'PUT', // Changed to PUT
                headers,
                body: JSON.stringify(animalToUpdate), // Use the correct object
            });

            if (!response.ok) {
                const errorText = await response.text(); // Get error message from the API
                throw new Error(`Failed to update animal: ${errorText}`);
            }
            resolve();
        } catch (error) {
            reject(new Error(`Error updating animal: ${error.message}`));
        }
    });
}
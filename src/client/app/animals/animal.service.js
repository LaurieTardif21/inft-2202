// API Base URL
const API_URL = "https://inft2202-server.onrender.com/api/animals"; //URL DATA IS FETCHED FROM
const API_KEY = '7bfa2060-9d12-42fe-8549-cf9205d269a0'; // APIEY

// Common headers for API requests
const headers = {
    'Content-Type': 'application/json',
    'apiKey': API_KEY
};

// Function to get the list of animals from API
export async function getAnimals(page, perPage) {
    try {
        const response = await fetch(`${API_URL}?page=${page}&perPage=${perPage}`, { headers });
        if (!response.ok) throw new Error('Failed to fetch animals');
        return await response.json();
    } catch (error) {
        throw new Error(`Error getting animals: ${error.message}`);
    }
}

// Function to add a new animal via API
export async function addAnimal(animal) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers,
            body: JSON.stringify(animal),
        });

        if (!response.ok) throw new Error('Failed to add animal');
        return await response.json();
    } catch (error) {
        throw new Error(`Error adding animal: ${error.message}`);
    }
}

// Function to delete an animal via API
export async function deleteAnimal(animalId) {
    try {
        const response = await fetch(`${API_URL}/${animalId}`, {
            method: 'DELETE',
            headers
        });

        if (!response.ok) throw new Error('Failed to delete animal');
        return await response.json();
    } catch (error) {
        throw new Error(`Error deleting animal: ${error.message}`);
    }
}

// Function to find an animal by ID via API
export async function findAnimal(animalId) {
    try {
        const response = await fetch(`${API_URL}/${animalId}`, { headers });

        if (!response.ok) throw new Error('Animal not found');
        return await response.json();
    } catch (error) {
        throw new Error(`Error finding animal: ${error.message}`);
    }
}

// Function to update an animal via API
export async function updateAnimal(updatedAnimal) {
    try {
        const response = await fetch(`${API_URL}/${updatedAnimal.id}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(updatedAnimal),
        });

        if (!response.ok) throw new Error('Failed to update animal');
        return await response.json();
    } catch (error) {
        throw new Error(`Error updating animal: ${error.message}`);
    }
}
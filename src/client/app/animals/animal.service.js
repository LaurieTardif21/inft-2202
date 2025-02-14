// animal.service.js

const serverUrl = 'https://inft2202-server.onrender.com';
const dcUrl = 'https://inft2202.opentech.durhamcollege.org';
const localUrl = 'http://localhost:3091';

const _url = dcUrl;
const API_KEY = '06ecdba4-4ac1-40bd-83a8-b74a04430a49';

export async function getAnimals() {
    const url = new URL('/api/animals', _url);
    const options = {
        method: 'GET',
        headers: {
            'apiKey': API_KEY
        }
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching animals:', error);
        throw error; // Re-throw to handle in calling function
    }
}

export async function deleteAnimal(animalId) {
    const url = new URL(`/api/animals/${animalId}`, _url);
    const options = {
        method: 'DELETE',
        headers: {
            'apiKey': API_KEY
        }
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // No need to parse JSON on DELETE success (usually)
        // Can return response or some status info if needed
    } catch (error) {
        console.error(`Error deleting animal ${animalId}:`, error);
        throw error; // Re-throw to handle in calling function
    }
}
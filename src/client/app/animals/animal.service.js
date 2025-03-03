const API_URL = "https://inft2202-server.onrender.com/api/animals"; //URL DATA IS FETCHED FROM
const API_KEY = '7bfa2060-9d12-42fe-8549-cf9205d269a0'; // APIKEY

// Common headers for API requests
const headers = {
    'Content-Type': 'application/json',
    'x-apikey': API_KEY
};

// Function to get the list of animals from API
export async function getAnimals(page, perPage) {
    console.log("getAnimals called with", page, perPage);
    try {
        const response = await fetch(`${API_URL}?page=${page}&perPage=${perPage}`, { headers });
        if (!response.ok) {
            throw new Error('Failed to fetch animals');
        }

        // Get total number of records from response headers
        const totalRecords = response.headers.get('X-Total-Count');
        const totalPages = Math.ceil(totalRecords / perPage);
        console.log("getAnimals totalRecords", totalRecords);
        console.log("getAnimals totalPages", totalPages);
        // Parse the JSON data from the response
        const data = await response.json();
        console.log("getAnimals data", data);
        return {
            records: data,
            pagination: {
                pages: totalPages,
                page: page,
                perPage: perPage
            }
        };
    } catch (error) {
        console.error('Error fetching animals:', error);
        return {
            records: [],
            pagination: {
                pages: 0,
                page: 0,
                perPage: 0
            }
        };
    }
}
// Function to get one page of animals
export async function getAnimalPage(page, perPage) {
    console.log("getAnimalPage called with", page, perPage);
    try {
        const response = await fetch(`${API_URL}?page=${page}&perPage=${perPage}`, { headers });
        if (!response.ok) {
            throw new Error('Failed to fetch animals');
        }

        // Get total number of records from response headers
        const totalRecords = response.headers.get('X-Total-Count');
        const totalPages = Math.ceil(totalRecords / perPage);
        console.log("getAnimalPage totalRecords", totalRecords);
        console.log("getAnimalPage totalPages", totalPages);
        // Parse the JSON data from the response
        const data = await response.json();
        console.log("getAnimalPage data", data);
        return {
            records: data,
            pagination: {
                pages: totalPages,
                page: page,
                perPage: perPage
            }
        };
    } catch (error) {
        console.error('Error fetching animals:', error);
        return {
            records: [],
            pagination: {
                pages: 0,
                page: 0,
                perPage: 0
            }
        };
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
        return;
    } catch (error) {
        console.error(`Error adding animal: ${error.message}`);
        throw error;
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
        return;
    } catch (error) {
        console.error(`Error deleting animal: ${error.message}`);
        throw error;
    }
}

// Function to find an animal by ID via API
export async function findAnimal(animalId) {
    try {
        const response = await fetch(`${API_URL}/${animalId}`, { headers });

        if (!response.ok) throw new Error('Animal not found');
        return await response.json();
    } catch (error) {
        console.error(`Error finding animal: ${error.message}`);
        throw error;
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
        return;
    } catch (error) {
        console.error(`Error updating animal: ${error.message}`);
        throw error;
    }
}
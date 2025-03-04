// API Base URL
const API_URL = "https://inft2202-server.onrender.com/api/animals"; //URL DATA IS FETCHED FROM
const API_KEY = '7bfa2060-9d12-42fe-8549-cf9205d269a0'; // APIKEY
const CURRENT_USER = "00000"; // You'll replace this with a dynamic user ID later

// Common headers for API requests
const headers = {
    'Content-Type': 'application/json',
    'apiKey': API_KEY //changed x-apikey to apiKey
};

// Function to get one page of animals
export function getAnimalPage(page, perPage) {
    return new Promise(async (resolve, reject) => {
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
    });
}

// Function to get the list of animals from API
export async function getAnimals() {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(API_URL, { headers });
            if (!response.ok) throw new Error('Failed to fetch animals');
            resolve(await response.json());
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
                body: JSON.stringify({...animal, user:CURRENT_USER}),//Add the user
            });

              if (!response.ok) {
                const errorText = await response.text(); // Get error message from the API
                throw new Error(`Failed to add animal: ${errorText}`);
            }
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
            //Modify the URL to use the name
            const response = await fetch(`${API_URL}/${encodeURIComponent(animalName)}`, {
                method: 'DELETE',
                headers
            });

            if (!response.ok) {
                const errorText = await response.text(); // Get error message from the API
                throw new Error(`Failed to delete animal: ${errorText}`);
            }
            resolve();
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
          //Modify url to search by name
            const response = await fetch(`${API_URL}?name=${encodeURIComponent(animalName)}`, { headers });
            if (!response.ok) {
              const errorText = await response.text(); // Get error message from the API
              throw new Error(`Failed to fetch animal: ${errorText}`);
             }
            const data = await response.json(); // Parse JSON response
           //The response is now a single animal
            if (!data) {
                throw new Error('Animal not found');
            }
            resolve(data); // Return the found animal
        } catch (error) {
            reject(new Error(`Error finding animal: ${error.message}`));
        }
    });
}

// Function to update an animal via API
export async function updateAnimal(updatedAnimal) {
    return new Promise(async (resolve, reject) => {
        try {
          //Set the url with the name
            const url = `${API_URL}/${encodeURIComponent(updatedAnimal.name)}`;
            //remove the name from the body of the request
             const animalToUpdate = {
                breed: updatedAnimal.breed,
                eyes: updatedAnimal.eyes,
                legs: updatedAnimal.legs,
                sound: updatedAnimal.sound,
                 user:CURRENT_USER,//add the user
            };

            const response = await fetch(url, {
                method: 'PATCH', // Using PATCH to update
                headers,
                body: JSON.stringify(animalToUpdate),
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
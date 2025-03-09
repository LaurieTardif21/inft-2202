// name: laurie tardif
// date: 02/09/2025
// filename: product.service.js
// course: inft 2202
// description: product service functions

const API_KEY = '1|inft2202-2024|tardif';
const API_URL = 'https://inft2202-server.onrender.com/api/products';

// Common headers for API requests
const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${API_KEY}`
};

// Function to add a product
export async function addProduct(product) {
    try {
        const payload = {
            pagination: {
                page: 1, // Adjust these values based on your application's requirements
                perPage: 5,
                count: 1, // Assuming you're adding one product
                pages: 1
            },
            records: [
                {
                    ...product, // Spread the product object (e.g., name, description, stock, price)
                    user: "00000", // Replace with appropriate user ID if applicable
                    createTime: Math.floor(Date.now() / 1000), // Generate a Unix timestamp
                    updateTime: null
                }
            ]
        };

        console.log('Payload:', payload); // Debugging log

        const response = await fetch(API_URL, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Failed to add product: ${errorMessage}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(`Error adding product: ${error.message}`);
    }
}

// Function to find a product by createTime
export async function findProduct(createTime) {
    if (!createTime) throw new Error(`Error finding product: Create time must be set.`);
    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers
        });

        if (!response.ok) {
            throw new Error(`Failed to find product: ${response.status}`);
        }

        const data = await response.json();
        if (data && data.records) {
            const product = data.records.find(record => record.createTime === Number(createTime));
            if (product) {
                return product;
            } else {
                throw new Error(`Product with create time ${createTime} not found`);
            }
        } else {
            throw new Error(`Error finding product: No records found.`);
        }
    } catch (error) {
        throw new Error(`Error finding product: ${error}`);
    }
}

// Function to update a product
export async function updateProduct(product) {
    if (!product || !product.createTime) throw new Error(`Error updating product: Product or createTime not set.`);
    try {
        const payload = {
            ...product,
            updateTime: Math.floor(Date.now() / 1000) // Update the timestamp
        };

        console.log('Updating Product:', payload); // Debugging log

        const responseUpdate = await fetch(API_URL, {
            method: 'PUT',
            headers,
            body: JSON.stringify(payload)
        });
        if (!responseUpdate.ok) {
            const errorMessage = await responseUpdate.text();
            throw new Error(`Failed to update product: ${errorMessage}`);
        }

        const dataUpdate = await responseUpdate.json();
        return dataUpdate;
    } catch (error) {
        throw new Error(`Error updating product: ${error}`);
    }
}

// Function to get paginated products
export async function getProductPage(page, perPage) {
    try {
        const response = await fetch(`${API_URL}?page=${page}&perPage=${perPage}`, { headers });
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Failed to fetch products: ${errorMessage}`);
        }

        const totalRecords = response.headers.get("X-Total-Count");
        const totalPages = Math.ceil(totalRecords / perPage);
        const data = await response.json();

        return {
            records: data.records,
            pagination: {
                pages: totalPages,
                page: page,
                perPage: perPage
            }
        };
    } catch (error) {
        throw new Error(`Error getting products: ${error.message}`);
    }
}

// Function to get all products
export async function getProducts() {
    try {
        const response = await fetch(API_URL, { headers });
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Failed to fetch products: ${errorMessage}`);
        }
        const data = await response.json();
        return data.records;
    } catch (error) {
        throw new Error(`Error getting products: ${error.message}`);
    }
}

// Function to delete a product by createTime
export async function deleteProduct(createTime) {
    try {
        const response = await fetch(`${API_URL}/${createTime}`, {
            method: "DELETE",
            headers
        });

        if (!response.ok) throw new Error("Failed to delete product");

        return;
    } catch (error) {
        console.error("Error deleting product:", error);
        throw error;
    }
}
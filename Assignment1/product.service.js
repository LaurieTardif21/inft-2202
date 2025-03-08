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
        const response = await fetch(API_URL, {
            method: 'POST',
            headers,
            body: JSON.stringify(product)
        });

        if (!response.ok) {
            throw new Error(`Failed to add product: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(`Error adding product: ${error}`);
    }
}

// Function to find a product by createTime and name
export async function findProduct(productId) {
    if (!productId) throw new Error(`Error finding product: Product id must be set.`);
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
            const product = data.records.find(record => record.createTime === Number(productId.split('-')[1]) && record.name === productId.split('-')[0] ); // find the product with the create time and the name
            if (product) {
                return product;
            } else {
                throw new Error(`Product with id ${productId} not found`);
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
    if (!product || !product.id) throw new Error(`Error updating product: Product or ID not set.`);
    try {
        // find the id
        const responseFind = await fetch(API_URL, {
            method: 'GET',
            headers
        });
        if (!responseFind.ok) {
            throw new Error(`Failed to find product: ${responseFind.status}`);
        }

        const dataFind = await responseFind.json();
        const productToUpdate = dataFind.records.find(record => record.createTime === Number(product.id.split('-')[1]) && record.name === product.id.split('-')[0] );// find the product with the create time and the name
        if (!productToUpdate) {
            throw new Error(`Product with id ${product.id} not found`);
        }
        // update the product
         const responseUpdate = await fetch(`${API_URL}/${productToUpdate.createTime}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(product)
        });
        if (!responseUpdate.ok) {
            throw new Error(`Failed to update product: ${responseUpdate.status}`);
        }
        // add the new product
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
            records: data.records, //changed to data.records
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
        return data.records; // Changed to return data.records
    } catch (error) {
        throw new Error(`Error getting products: ${error.message}`);
    }
}

// Function to delete a product by ID
export async function deleteProduct(productId) {
    try {
        const response = await fetch(`${API_URL}/${productId}`, {
            method: "DELETE",
            headers
        });

        if (!response.ok) throw new Error("Failed to delete product");

        //Changed to return nothing as most APIs do not return anything on a delete.
        return;
    } catch (error) {
        console.error("Error deleting product:", error);
        throw error;
    }
}
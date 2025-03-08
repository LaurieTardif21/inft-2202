// API Base URL
const API_URL = "https://inft2202-server.onrender.com/api/products";
const API_KEY = "7bfa2060-9d12-42fe-8549-cf9205d269a0";

// Common headers for API requests
const headers = {
    "Content-Type": "application/json",
    "apiKey": API_KEY
};

// Function to generate a unique ID without UUID
function generateId() {
    return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

// Function to get paginated products
export async function getProductPage(page, perPage) {
    try {
        const response = await fetch(`${API_URL}?page=${page}&perPage=${perPage}`, { headers });
        if (!response.ok) throw new Error("Failed to fetch products");

        const totalRecords = response.headers.get("X-Total-Count") || 0;
        const totalPages = Math.ceil(totalRecords / perPage);
        const data = await response.json();

        return {
            records: data,
            pagination: {
                pages: totalPages || 1,
                page,
                perPage
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
        if (!response.ok) throw new Error("Failed to fetch products");
        return await response.json();
    } catch (error) {
        throw new Error(`Error getting products: ${error.message}`);
    }
}

// Function to add a new product
export async function addProduct(product) {
    try {
        const newProduct = { id: generateId(), ...product };
        const response = await fetch(API_URL, {
            method: "POST",
            headers,
            body: JSON.stringify(newProduct),
        });

        if (!response.ok) throw new Error("Failed to add product");
        return await response.json();
    } catch (error) {
        throw new Error(`Error adding product: ${error.message}`);
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
        return await response.json();
    } catch (error) {
        throw new Error(`Error deleting product: ${error.message}`);
    }
}

// Function to find a product by ID
export async function findProduct(productId) {
    try {
        const response = await fetch(`${API_URL}/${productId}`, { headers });
        if (!response.ok) throw new Error("Product not found");
        return await response.json();
    } catch (error) {
        throw new Error(`Error finding product: ${error.message}`);
    }
}

// Function to update a product
export async function updateProduct(updatedProduct) {
    try {
        const response = await fetch(`${API_URL}/${updatedProduct.id}`, {
            method: "PUT",
            headers,
            body: JSON.stringify(updatedProduct),
        });

        if (!response.ok) throw new Error("Failed to update product");
        return await response.json();
    } catch (error) {
        throw new Error(`Error updating product: ${error.message}`);
    }
}
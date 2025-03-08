// API Base URL
const API_URL = "https://inft2202-server.onrender.com/api/products";
const API_KEY = "7bfa2060-9d12-42fe-8549-cf9205d269a0";

// Common headers for API requests
const headers = {
    "Content-Type": "application/json",
    "apiKey": API_KEY
};

// Function to get paginated products
export async function getProductPage(page, perPage) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(`${API_URL}?page=${page}&perPage=${perPage}`, { headers });
             if (!response.ok) {
                const errorMessage = await response.text();
                 throw new Error(`Failed to fetch products: ${errorMessage}`);
            }

            const totalRecords = response.headers.get("X-Total-Count");
            const totalPages = Math.ceil(totalRecords / perPage);
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
            reject(new Error(`Error getting products: ${error.message}`));
        }
    });
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
        return data;
    } catch (error) {
        throw new Error(`Error getting products: ${error.message}`);
    }
}

// Function to add a new product
export async function addProduct(product) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers,
                body: JSON.stringify(product),
            });

            if (!response.ok) throw new Error("Failed to add product");
            resolve();
        } catch (error) {
            reject(new Error(`Error adding product: ${error.message}`));
        }
    });
}

// Function to delete a product by ID
export async function deleteProduct(productId) {
    try {
        const response = await fetch(`${API_URL}/${productId}`, {
            method: "DELETE",
            headers: {
                 'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error("Failed to delete product");

        return response.json();
    } catch (error) {
        console.error("Error deleting product:", error);
        throw error;
    }
}

// Function to find a product by ID
export async function findProduct(productId) {
    return new Promise(async (resolve, reject) => {
        try {
             const url = `${API_URL}/${productId}`; 
            const response = await fetch(url, { headers });
            if (!response.ok) {
                 const errorMessage = await response.text();
                throw new Error(`Failed to fetch products: ${errorMessage}`);
            }
             const product = await response.json();
            resolve(product);
        } catch (error) {
            reject(new Error(`Error finding product: ${error.message}`));
        }
    });
}

// Function to update a product
export async function updateProduct(updatedProduct, productId) {
    return new Promise(async (resolve, reject) => {
        try {
            if (typeof updatedProduct !== "object" || Array.isArray(updatedProduct) ) {
                throw new Error(`updatedProduct should be an object`);
            }
            const url = `${API_URL}/${productId}`;
            const response = await fetch(url, {
                method: "PUT",
                headers,
                body: JSON.stringify(updatedProduct),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to update product: ${errorText}`);
            }
            resolve();
        } catch (error) {
            reject(new Error(`Error updating product: ${error.message}`));
        }
    });
}
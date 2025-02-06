class ProductService {
    // Function to generate a unique ID without uuid
    static generateId() {
        return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    }

    // Function to get the list of products (from localStorage)
    static getProducts() {
        return new Promise((resolve, reject) => {
            try {
                // Fetch from localStorage
                const products = JSON.parse(localStorage.getItem('products')) || [];

                // Ensure each product has a unique 'id'
                products.forEach((product) => {
                    if (!product.id) {
                        // Assign a unique ID if not present
                        product.id = ProductService.generateId();
                    }
                });

                resolve(products);
            } catch (error) {
                reject(new Error(`Error getting products: ${error.message}`));
            }
        });
    }

    // Function to add a new product to the list (to localStorage)
    static addProduct(product) {
        return new Promise((resolve, reject) => {
            try {
                // Add to localStorage
                const products = JSON.parse(localStorage.getItem('products')) || [];
                product.id = ProductService.generateId(); // Ensure unique ID for each product
                products.push(product); // Add the new product to the array
                localStorage.setItem('products', JSON.stringify(products)); // Save to localStorage
                resolve();
            } catch (error) {
                reject(new Error(`Error adding product: ${error.message}`));
            }
        });
    }

    // Function to delete a product by ID (from localStorage)
    static deleteProduct(productId) {
        return new Promise((resolve, reject) => {
            try {
                // Remove from localStorage
                const products = JSON.parse(localStorage.getItem('products')) || [];
                const updatedProducts = products.filter(product => product.id !== productId); // Filter out the deleted product by ID
                localStorage.setItem('products', JSON.stringify(updatedProducts)); // Save to localStorage
                resolve();
            } catch (error) {
                reject(new Error(`Error deleting product: ${error.message}`));
            }
        });
    }

    // Function to find a product by ID (Checks Local Storage)
    static findProduct(productId) {
        return new Promise((resolve, reject) => {
            try {
                // Check Local Storage
                const products = JSON.parse(localStorage.getItem('products')) || [];
                const product = products.find(p => p.id === productId);

                if (!product) {
                    throw new Error(`Error finding product: product not found`);
                }
                resolve(product); // Found in local storage
            } catch (error) {
                reject(error);
            }
        });
    }

    // Function to update a product (Updates Local Storage)
    static updateProduct(updatedProduct) {
        return new Promise((resolve, reject) => {
            try {
                // Update Local Storage
                const products = JSON.parse(localStorage.getItem('products')) || [];
                const index = products.findIndex(p => p.id === updatedProduct.id);

                if (index === -1) {
                    throw new Error('Product not found in local storage');
                }
                products[index] = updatedProduct;
                localStorage.setItem('products', JSON.stringify(products));
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }
}

export default ProductService;
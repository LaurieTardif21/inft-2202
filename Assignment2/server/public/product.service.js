// name: laurie tardif
// date: 02/09/2025
// filename: product.service.js
// course: inft 2202
// description: product service functions

const API_KEY = '1|inft2202-2024|tardif';
const API_URL = 'https://inft2202-server.onrender.com/api/products';
const baseUrl = 'https://inft2202-server.onrender.com/api';

// Common headers for API requests
const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${API_KEY}`,
    user: 'your student ID',
    host: window.location.origin
};

// Function to add a product
export async function addProduct(product) {
    try {
        const payload = [
            {
                name: product.name,
                description: product.description,
                stock: product.stock,
                price: product.price,
            },
        ];

        console.log('Payload:', JSON.stringify(payload, null, 2)); // Debugging log

        const response = await fetch(API_URL, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Failed to add product: ${errorMessage}`);
        }

        const data = await response.json();
        console.log("response data", data);
        return data;
    } catch (error) {
        console.error('Error adding product:', error); // Debugging log
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
            name: product.name,
            description: product.description,
            stock: product.stock,
            price: product.price
        };

        console.log('Updating Product:', payload); // Debugging log

        const responseUpdate = await fetch(API_URL, { //we keep the method PUT and we dont modify the url
            method: 'PUT',
            headers,
            body: JSON.stringify(payload)
        });
        if (!responseUpdate.ok) {
            const errorMessage = await responseUpdate.text();
            throw new Error(`Failed to update product: ${errorMessage}`);
        }

        const dataUpdate = await responseUpdate.json();
        console.log("update response data", dataUpdate);
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



// Function to delete a product by id
export async function deleteProduct(id) { // Change 'name' to 'id'
    const response = await fetch(`${baseUrl}/products/${id}`, { // Change the URL
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${API_KEY}` // Add your token here
        }
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to delete product: ${response.statusText}`);
    }
    // if you do not have any response, change to:
    //return;
    return await response.json();
}
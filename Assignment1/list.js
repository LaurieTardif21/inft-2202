// Name: Laurie Tardif
// Date: 02/08/2025
// Course Code: INFT 2202
// Section Number: 05
// Description of file: list js
document.addEventListener("DOMContentLoaded", async function() {
    const productContainer = document.getElementById("product-container");

    try {
        const response = await fetch("products.json"); // Replace with actual API or JSON file
        const products = await response.json();

        if (products.length === 0) {
            productContainer.innerHTML = `<div class="alert alert-warning">The shop is currently closed.</div>`;
            return;
        }

        products.forEach(product => {
            const productCard = document.createElement("div");
            productCard.className = "col-md-4 mb-4";
            productCard.innerHTML = `
                <div class="card">
                    <img src="https://via.placeholder.com/150" class="card-img-top" alt="Product Image">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.description}</p>
                        <p><strong>Stock:</strong> ${product.stock}</p>
                        <p><strong>Price:</strong> $${product.price.toFixed(2)}</p>
                        <button class="btn btn-primary">Add to Cart</button>
                        <button class="btn btn-danger delete-btn" data-name="${product.name}">🗑</button>
                        <button class="btn btn-secondary edit-btn" data-name="${product.name}">✏</button>
                    </div>
                </div>
            `;
            productContainer.appendChild(productCard);
        });

        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", function() {
                const productName = this.getAttribute("data-name");
                if (confirm(`Are you sure you want to delete ${productName}?`)) {
                    alert(`${productName} has been deleted.`);
                }
            });
        });

        document.querySelectorAll(".edit-btn").forEach(button => {
            button.addEventListener("click", function() {
                const productName = this.getAttribute("data-name");
                window.location.href = `product.html?name=${encodeURIComponent(productName)}`;
            });
        });

    } catch (error) {
        productContainer.innerHTML = `<div class="alert alert-danger">Failed to load products.</div>`;
        console.error("Error fetching products:", error);
    }
});
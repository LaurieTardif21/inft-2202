// Name: Laurie Tardif
// Date: 02/08/2025
// Course Code: INFT 2202
// Section Number: 05
// Description: Handles fetching and displaying products with pagination

document.addEventListener("DOMContentLoaded", async () => {
    const productList = document.getElementById("product-list");
    const paginationContainer = document.getElementById("pagination");
    const noProductsMessage = document.getElementById("no-products");

    let currentPage = 1;
    const perPage = 6; // Number of products per page
    let allProducts = []; // Store all products to handle pagination

    async function fetchProducts(page = 1) {
        try {
            // Load product from local storage
            const products = JSON.parse(localStorage.getItem('products')) || [];
            allProducts = products;

            if (!products.length) {
                noProductsMessage.style.display = "block"; // Show "Shop Closed" message
                productList.innerHTML = "";
                paginationContainer.innerHTML = "";
                return;
            } else {
                noProductsMessage.style.display = "none";
            }

            // Get the products for the current page
            const start = (page - 1) * perPage;
            const end = start + perPage;
            const paginatedProducts = allProducts.slice(start, end);
            
            renderProducts(paginatedProducts);
            setupPagination(Math.ceil(allProducts.length / perPage), page); // Calculate the total pages
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    }

    function renderProducts(products) {
        productList.innerHTML = ""; // Clear existing products

        products.forEach(product => {
            const productCard = document.createElement("div");
            productCard.className = "col-md-4 mb-4";
            productCard.innerHTML = `
                <div class="card h-100 shadow-sm">
                    <img src="https://via.placeholder.com/150" class="card-img-top" alt="Product Image">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.description}</p>
                        <p class="card-text"><strong>Stock:</strong> ${product.stock}</p>
                        <p class="card-text"><strong>Price:</strong> $${product.price.toFixed(2)}</p>
                        <button class="btn btn-primary btn-block">Add to Cart</button>
                        <button class="btn btn-warning btn-sm edit-btn" title="Edit"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-danger btn-sm delete-btn" title="Delete"><i class="fas fa-trash-alt"></i></button>
                    </div>
                </div>
            `;
            productList.appendChild(productCard);
        });

        setupDeleteButtons();
    }

    function setupDeleteButtons() {
        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", function () {
                const modal = document.createElement("div");
                modal.className = "modal fade";
                modal.innerHTML = `
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Confirm Deletion</h5>
                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div class="modal-body">
                                <p>Are you sure you want to delete this product?</p>
                            </div>
                            <div class="modal-footer">
                                <button class="btn btn-danger">Delete</button>
                                <button class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                            </div>
                        </div>
                    </div>
                `;
                document.body.appendChild(modal);
                $(modal).modal("show");

                modal.querySelector(".btn-danger").addEventListener("click", () => {
                    $(modal).modal("hide");
                    modal.remove();
                    alert("Product deleted! (Implement backend logic here)");
                });
            });
        });
    }

    function setupPagination(totalPages, currentPage) {
        paginationContainer.innerHTML = "";
        for (let i = 1; i <= totalPages; i++) {
            const li = document.createElement("li");
            li.className = `page-item ${i === currentPage ? "active" : ""}`;
            li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
            li.addEventListener("click", () => {
                currentPage = i;
                fetchProducts(i);
            });
            paginationContainer.appendChild(li);
        }
    }

    fetchProducts(currentPage);
});
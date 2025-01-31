import { movies } from "/movies.js";

// Get references to elements
const pinnedMoviesTable = document.querySelector("#pinned-movies-container table");
const pinnedMoviesAlert = document.querySelector("#pinned-movies-container .alert");
const allMoviesTable = document.querySelector("#all-movies-container table");
const allMoviesAlert = document.querySelector("#all-movies-container .alert");

// Load pinned movies from local storage
function getPinnedMoviesFromStorage() {
    return JSON.parse(localStorage.getItem("pinnedMovies")) || [];
}

// Save pinned movies to local storage
function savePinnedMoviesToStorage(pinnedMovies) {
    localStorage.setItem("pinnedMovies", JSON.stringify(pinnedMovies));
}

// Function to populate a movie table
function insertMoviesIntoTable(eleTable, moviesList, isPinned = false) {
    if (moviesList.length === 0) {
        eleTable.previousElementSibling.classList.remove("d-none"); // Show alert
        return;
    } else {
        eleTable.previousElementSibling.classList.add("d-none"); // Hide alert
    }

    eleTable.classList.remove("d-none");
    const tbody = eleTable.querySelector("tbody");
    tbody.innerHTML = ""; // Clear existing rows

    moviesList
        .filter(movie => movie.genre !== "Drama") // Exclude dramas
        .sort((a, b) => b.rating - a.rating) // Sort by rating
        .forEach(movie => {
            const row = document.createElement("tr");

            // Set row color based on rating
            if (movie.rating <= 2) row.classList.add("table-danger");
            else if (movie.rating <= 5) row.classList.add("table-warning");
            else if (movie.rating <= 8) row.classList.add("table-info");
            else row.classList.add("table-success");

            row.innerHTML = `
                <td>${movie.title}</td>
                <td>${movie.genre}</td>
                <td>${new Date(movie.release_date * 1000).toLocaleDateString()}</td>
                <td>${movie.director}</td>
                <td>${movie.rating}</td>
                <td>
                    <button class="btn ${isPinned ? "btn-danger" : "btn-primary"} pin-btn">
                        <i class="fa ${isPinned ? "fa-xmark" : "fa-thumbtack"}"></i>
                    </button>
                </td>
            `;

            // Add event listener for pin/unpin button
            row.querySelector(".pin-btn").addEventListener("click", () => {
                let pinnedMovies = getPinnedMoviesFromStorage();
                if (isPinned) {
                    pinnedMovies = pinnedMovies.filter(m => m.title !== movie.title);
                } else {
                    pinnedMovies.push(movie);
                }
                savePinnedMoviesToStorage(pinnedMovies);
                location.reload(); // Refresh page
            });

            tbody.appendChild(row);
        });
}

// Load all movies
insertMoviesIntoTable(allMoviesTable, movies);

// Load pinned movies
const pinnedMovies = getPinnedMoviesFromStorage();
insertMoviesIntoTable(pinnedMoviesTable, pinnedMovies, true);

import { movies } from "./movies.js";

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
function insertMoviesIntoTable(tableElement, moviesList, isPinned = false, pinnedMovies = []) {
    if (moviesList.length === 0) {
        tableElement.previousElementSibling.classList.remove("d-none"); // Show alert
        return;
    } else {
        tableElement.previousElementSibling.classList.add("d-none"); // Hide alert
    }

    tableElement.classList.remove("d-none");
    const tbody = tableElement.querySelector("tbody");
    tbody.innerHTML = ""; // Clear existing rows

    moviesList
        .filter((movie) => movie.genre !== "Drama") // Exclude dramas
        .sort((a, b) => b.rating - a.rating) // Sort by rating
        .forEach((movie) => {
            const row = document.createElement("tr");

            // Set row color based on rating
            if (movie.rating <= 2) row.classList.add("table-danger");
            else if (movie.rating <= 5) row.classList.add("table-warning");
            else if (movie.rating <= 8) row.classList.add("table-info");
            else row.classList.add("table-success");

            const isMovieCurrentlyPinned = pinnedMovies.some((m) => m.title === movie.title);

            row.innerHTML = `
                <td>${movie.title}</td>
                <td>${movie.genre}</td>
                <td>${new Date(movie.release_date * 1000).toLocaleDateString()}</td>
                <td>${movie.director}</td>
                <td>${movie.rating}</td>
                <td>
                <a class="${isMovieCurrentlyPinned ? "text-danger" : "text-primary"} pin-link" href="#">
                    <i class="fa ${isMovieCurrentlyPinned ? "fa-xmark" : "fa-thumbtack"}"></i>
                </a>
                </td>
            `;
            // Add event listener for pin/unpin button
            row.querySelector(".pin-link").addEventListener("click", (event) => {
                event.preventDefault();
                let updatedPinnedMovies = pinnedMovies;

                if (isMovieCurrentlyPinned) {
                    // Remove movie
                    updatedPinnedMovies = updatedPinnedMovies.filter((m) => m.title !== movie.title);
                } else {
                    // Add movie
                    updatedPinnedMovies.push(movie);
                }
                savePinnedMoviesToStorage(updatedPinnedMovies);
                updateTables(updatedPinnedMovies); // Update tables directly
            });

            tbody.appendChild(row);
        });
}

function updateTables(pinnedMovies) {
    // Update all movies table
    insertMoviesIntoTable(allMoviesTable, movies, false, pinnedMovies);

    // Update pinned movies table
    insertMoviesIntoTable(pinnedMoviesTable, pinnedMovies, true, pinnedMovies);

    //Show pinned movie alert
    if(pinnedMovies.length == 0){
        pinnedMoviesAlert.classList.remove("d-none");
    }
}

// Load pinned movies
const pinnedMovies = getPinnedMoviesFromStorage();

// Load all movies
insertMoviesIntoTable(allMoviesTable, movies, false, pinnedMovies);

// Load pinned movies
updateTables(pinnedMovies);

/*
Name: Laurie Tardif
Date: 01/31/2025
Course: Web Dev
Description: Show two lists of movies.  One of all movies, and one of just your favourites.
*/


import { movies } from "./movies.js";

console.log(movies);

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
function insertMoviesIntoTable(tableElement, moviesList) {
    //check if the table is empty
    if (moviesList.length === 0) {
        //Hide the table
        tableElement.classList.add("d-none");
        //Show the alert
        tableElement.previousElementSibling.classList.remove("d-none"); // Show alert
        return;
    } else {
        //Hide the alert
        tableElement.previousElementSibling.classList.add("d-none"); // Hide alert
    }

    //show the table
    tableElement.classList.remove("d-none");
    const tbody = tableElement.querySelector("tbody");
    tbody.innerHTML = ""; // Clear existing rows
    // Load pinned movies from local storage
    const pinnedMovies = getPinnedMoviesFromStorage();
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
    //Check if there are no pinned movies
    if (pinnedMovies.length == 0) {
        //Show the alert
        pinnedMoviesAlert.classList.remove("d-none");
        //Hide the table
        pinnedMoviesTable.classList.add("d-none");
        //Remove the rows from the table
        pinnedMoviesTable.querySelector("tbody").innerHTML = "";
    }
    // Update all movies table
    insertMoviesIntoTable(allMoviesTable, movies);

    // Update pinned movies table
    insertMoviesIntoTable(pinnedMoviesTable, pinnedMovies);
}

// Load pinned movies
const pinnedMovies = getPinnedMoviesFromStorage();
console.log(pinnedMovies)

// Load all movies
insertMoviesIntoTable(allMoviesTable, movies);

// Load pinned movies
updateTables(pinnedMovies);
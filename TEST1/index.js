// Import the movies array from the supplied data file
import { movies } from "./movies.js";

// Write the array to the console to verify it is loading properly
console.log("Movies Loaded:", movies);

// Select the table element
const movieTable = document.getElementById("movieTable");

// Get pinned movies from local storage and log them
const pinnedMovies = getPinnedMoviesFromStorage();
console.log("Pinned Movies:", pinnedMovies);

// If there are no pinned movies, display a message; otherwise, hide it
const pinnedMessage = document.getElementById("pinnedMessage");
if (pinnedMovies.length === 0) {
    pinnedMessage.textContent = "No pinned movies.";
    pinnedMessage.style.display = "block";
} else {
    pinnedMessage.style.display = "none";
}

// Insert all movies into the table
insertMoviesIntoTable(movieTable, movies);

/**
 * Retrieves the list of pinned movies from local storage.
 * @returns {Array} An array of pinned movies.
 */
function getPinnedMoviesFromStorage() {
    const pinned = localStorage.getItem("pinnedMovies");
    return pinned ? JSON.parse(pinned) : [];
}

/**
 * Inserts movies into the given table element.
 * @param {HTMLTableElement} eleTable - The table to populate.
 * @param {Array} movies - The list of movies to display.
 */
function insertMoviesIntoTable(eleTable, movies) {
    // Sort movies by rating (highest to lowest)
    movies.sort((a, b) => b.rating - a.rating);

    // Get pinned movies from local storage
    const pinnedMovies = getPinnedMoviesFromStorage();

    movies.forEach(movie => {
        // Skip drama movies
        if (movie.genre.toLowerCase() === "drama") return;

        const row = eleTable.insertRow();
        
        // Insert movie data into cells
        row.insertCell().textContent = movie.title;
        row.insertCell().textContent = movie.genre;
        row.insertCell().textContent = movie.rating;
        row.insertCell().textContent = new Date(movie.releaseDate * 1000).toLocaleDateString();

        // Create a button for pinning/unpinning
        const pinButton = document.createElement("button");

        // Check if the movie is pinned
        const isPinned = pinnedMovies.some(pinned => pinned.movieID === movie.movieID);
        
        if (isPinned) {
            pinButton.style.backgroundColor = "red";
            pinButton.innerHTML = "❌"; // X icon
        } else {
            pinButton.style.backgroundColor = "blue";
            pinButton.innerHTML = "✏️"; // Pencil icon
        }

        // Button event listener
        pinButton.addEventListener("click", () => {
            let updatedPinnedMovies = getPinnedMoviesFromStorage();

            if (isPinned) {
                // Remove from pinned list
                updatedPinnedMovies = updatedPinnedMovies.filter(pinned => pinned.movieID !== movie.movieID);
            } else {
                // Add to pinned list
                updatedPinnedMovies.push(movie);
            }

            // Save updated list to local storage
            localStorage.setItem("pinnedMovies", JSON.stringify(updatedPinnedMovies));

            // Reload to update the UI
            location.reload();
        });

        // Add button to the row
        const buttonCell = row.insertCell();
        buttonCell.appendChild(pinButton);

        // Apply row color based on rating
        if (movie.rating <= 2) row.style.backgroundColor = "red";
        else if (movie.rating <= 5) row.style.backgroundColor = "orange";
        else if (movie.rating <= 8) row.style.backgroundColor = "blue";
        else row.style.backgroundColor = "green";
    });
}

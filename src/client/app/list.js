//in the initialize page function
async function initializePage() {
    try {
        //show that the list is loading
        checkIfListIsEmpty(true);
        const animals = await getAnimalsWithDelay();
        animalsArray = animals;
        managePagination();
        populateAnimalTable(getCurrentPageAnimals());
    } catch (error) {
        console.error('Error fetching animals:', error);
         // Show error message
         const errorMessagebox = document.getElementById('error-message-box');
        errorMessagebox.textContent = "Error fetching animals, please try again later";
        errorMessagebox.classList.remove('d-none');
    } finally {
        // Hide loading message
        const loadingMessageBox = document.getElementById('loading-message-box');
        if (loadingMessageBox) {
            loadingMessageBox.classList.add('d-none');
        }
    }
}
//in the confirmDeleteButton.addEventListener function
confirmDeleteButton.addEventListener('click', async () => {
        // Check if the animalIdToDelete is defined
        if (animalIdToDelete !== null) {
            try {
                await deleteAnimal(animalIdToDelete);
                // Remove the animal in the global array
                const index = animalsArray.findIndex(animal => animal.id === animalIdToDelete);
                if (index !== -1) {
                    animalsArray.splice(index, 1);
                }
                // Remove the row from the table
                const row = document.getElementById(`animal-${animalIdToDelete}`);
                row.remove();
                // Update the empty list message if needed
                checkIfListIsEmpty(false);
                // Update the pagination
                managePagination();
                // Update the table
                populateAnimalTable(getCurrentPageAnimals());
                // Close the modal
                const deleteConfirmationModal = bootstrap.Modal.getInstance(document.getElementById('deleteConfirmationModal'));
                deleteConfirmationModal.hide();
            } catch (error) {
                console.error('Error deleting animal:', error);
                 // Show error message
                const errorMessagebox = document.getElementById('error-message-box');
                errorMessagebox.textContent = "Error deleting the animal, please try again later";
                errorMessagebox.classList.remove('d-none');
            }
        }
    });
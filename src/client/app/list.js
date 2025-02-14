import { getAnimals, deleteAnimal } from './animals/animal.service.js';

function list(recordPage) {
    // Global variable to store the animalId to delete
    let animalIdToDelete = null;

    const container = document.createElement('div');
    container.classList.add('container');
    const divWaiting = document.createElement('div');
    divWaiting.classList.add('text-center');
    divWaiting.innerHTML = '<i class="fa fa-5x fa-spinner fa-spin"></i>';
    container.append(divWaiting);

    const divMessage = document.createElement('div');
    divMessage.classList.add('alert', 'text-center', 'd-none');
    container.append(divMessage);

    function createEditButton(animalId) {
        // create an edit button
        const eleBtnEdit = document.createElement('a');
        eleBtnEdit.classList.add('btn', 'btn-primary', 'mx-1', 'btn-sm', 'me-2');
        eleBtnEdit.innerHTML = `<i class="fas fa-pen-to-square"></i>`;
        eleBtnEdit.href = `./animal.html?id=${animalId}`
        // add the edit button to the button cell
        return eleBtnEdit;
    }
    function createDeleteButton(animal) {
        // create a delete button
        const eleBtnDelete = document.createElement('button');
        eleBtnDelete.classList.add('btn', 'btn-danger', 'mx-1', 'btn-sm');
        eleBtnDelete.innerHTML = `<i class="fa fa-trash"></i>`;
        eleBtnDelete.addEventListener('click', onDeleteButtonClick(animal));
        return eleBtnDelete;
    }
    function onDeleteButtonClick(animal) {
        return async event => {
            animalIdToDelete = animal.id;
            try {
                // Show the confirmation modal
                const deleteConfirmationModal = new bootstrap.Modal(document.getElementById('deleteConfirmationModal'));
                deleteConfirmationModal.show();
                const deleteButtonModal = document.getElementById('confirmDeleteButton');
                deleteButtonModal.addEventListener('click', async () => {
                    try {
                        manageLoadingPagination(true);
                        await deleteAnimal(animalIdToDelete);
                        //find and remove the element
                        const animalToRemove = document.getElementById(`animal-${animalIdToDelete}`);
                        if (animalToRemove) {
                            animalToRemove.remove();
                        }
                        const deleteConfirmationModal = bootstrap.Modal.getInstance(document.getElementById('deleteConfirmationModal'));
                        deleteConfirmationModal.hide();
                        //refresh the table
                        createContent();
                    } catch (error) {
                        console.error("Error deleting the animal", error);
                        const deleteConfirmationModal = bootstrap.Modal.getInstance(document.getElementById('deleteConfirmationModal'));
                        deleteConfirmationModal.hide();
                        const errorMessagebox = document.getElementById('error-message-box');
                        errorMessagebox.classList.remove('d-none');
                    } finally {
                        manageLoadingPagination(false);
                    }
                });

            } catch (error) {
                console.error("Error deleting the animal", error);
                const errorMessagebox = document.getElementById('error-message-box');
                errorMessagebox.classList.remove('d-none');
            }
        }
    }

    function manageLoadingPagination(show) {
        const loadingPaginationMessage = document.getElementById('loading-pagination-message-box');
        if (show) {
            loadingPaginationMessage.classList.remove('d-none');
        } else {
            loadingPaginationMessage.classList.add('d-none');
        }
    }
    function manageNoServiceMessage(show) {
        const noServiceMessageBox = document.getElementById('no-service-message-box');
        const animalListTable = document.getElementById('animals-list');
        const loadingMessageBox = document.getElementById('loading-message-box');
        const messageBox = document.getElementById('message-box');
        const errorMessagebox = document.getElementById('error-message-box');
        if (show) {
            //show the no service message and hide everything else
            noServiceMessageBox.classList.remove('d-none');
            animalListTable.classList.add('d-none');
            loadingMessageBox.classList.add('d-none');
            messageBox.classList.add('d-none');
            errorMessagebox.classList.add('d-none');
            paginationContainer.classList.add('d-none');

        } else {
            noServiceMessageBox.classList.add('d-none');
        }
    }
    function drawPagination({ page = 1, perPage = 5, pages = 10 }) {
        function addPage(number, text, style) {
            return `<li class="page-item ${style}">
              <a class="page-link" href="./list.html?page=${number}&perPage=${perPage}">${text}</a>
            </li>`
        }
        const pagination = document.createElement('nav');
        pagination.setAttribute('aria-label', 'Animal navigation')
        if (pages > 1) {
            pagination.classList.remove('d-none');
        }
        const ul = document.createElement("ul");
        ul.classList.add('pagination', 'justify-content-center')
        ul.insertAdjacentHTML('beforeend', addPage(page - 1, 'Previous', (page == 1) ? 'disabled' : ''))
        for (let i = 1; i <= pages; i++) {
            ul.insertAdjacentHTML('beforeend', addPage(i, i, (i == page) ? 'active' : ''));
        }
        ul.insertAdjacentHTML('beforeend', addPage(page + 1, 'Next', (page == pages) ? 'disabled' : ''))

        pagination.append(ul);
        return pagination;
    }
    function drawAnimalTable(animals) {
        const eleTable = document.createElement('table');
        eleTable.id = "animals-list";
        eleTable.classList.add('table', 'table-striped', 'd-none');
        // Create a <thead> element
        const thead = eleTable.createTHead();
        // Create a row in the <thead>
        const row = thead.insertRow();
        // Create and append header cells
        const headers = ['Name', 'Breed', 'Legs', 'Eyes', 'Sound', 'Actions'];
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            row.appendChild(th);
        });
        for (let animal of animals) {
            const row = eleTable.insertRow();
            row.id = `animal-${animal.id}`;
            // create some rows for each animal field    
            row.insertCell().textContent = animal.name;
            row.insertCell().textContent = animal.breed;
            row.insertCell().textContent = animal.legs;
            row.insertCell().textContent = animal.eyes;
            row.insertCell().textContent = animal.sound;
            // create a cell to hold the buttons
            const eleBtnCell = row.insertCell();
            eleBtnCell.classList.add();
            //create the button
            eleBtnCell.append(createDeleteButton(animal));
            //create the button
            eleBtnCell.append(createEditButton(animal.id));
        }
        return eleTable;
    }

    function createContent() {
        const params = new URLSearchParams(recordPage);
        const url = new URL(`/api/animals?${params.toString()}`, 'https://inft2202-server.onrender.com');
        const req = new Request(url, {
            headers: {
                'User': 'laurie'
            },
            method: 'GET',
        });
        //do fetch here
        fetch(req)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((ret) => {
                let { records, pagination } = ret;
                divWaiting.classList.add('d-none');
                let header = document.createElement('div');
                header.classList.add('d-flex', 'justify-content-between');
                let h1 = document.createElement('h1');
                h1.innerHTML = 'Animal List';
                header.append(h1);
                header.append(drawPagination(pagination));
                container.append(header);
                container.append(drawAnimalTable(records));
            })
            .catch(err => {
                divWaiting.classList.add('d-none');
                divMessage.innerHTML = err;
                divMessage.classList.remove('d-none');
                divMessage.classList.add('alert-danger');
            });
        return container;
    }
    return {
        element: createContent()
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    let currentPage = urlParams.get('page') ? urlParams.get('page') : 1;
    let currentPerPage = urlParams.get('perPage') ? urlParams.get('perPage') : 5;

    const mylist = list({ page: currentPage, perPage: currentPerPage });
    const main = document.querySelector('main .container');
    main.replaceChildren(mylist.element);
});
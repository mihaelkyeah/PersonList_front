// Strict mode enabled
"use strict";

// Define memory structure to keep stuff in until page refreshes
let persons = [];

// Wait for the document to load to define and trigger all this stuff
document.addEventListener("DOMContentLoaded", () => {
    // Get form
    let personForm = document.forms["personForm"];

    // Add event listeners
    document.querySelector("#btn-add").addEventListener("click", addPerson);
    document.querySelector("#btn-wipe").addEventListener("click", wipeList);

    // Add person to person array if both name and surname are provided
    function addPerson() {
        if(!personForm["name"].value == "" && !personForm["surname"].value == "") {
            // Add person to person array and refresh list
            persons.push(new Person(personForm["name"].value, personForm["surname"].value));
            refreshPersonList();
        } else {
            // Prompt the user to fill both required fields and not refresh list
            document.querySelector("#form-prompt-modal-button").click();
            document.querySelector("#form-prompt-ul").innerHTML = "";
            if(personForm["name"].value == "")
                document.querySelector("#form-prompt-ul").innerHTML += `<li>${nameWord}</li>`;
            if(personForm["surname"].value == "")
                document.querySelector("#form-prompt-ul").innerHTML += `<li>${surnameWord}</li>`;
        }
    }

    // Place form to edit person in lieu of person row, and save or cancel changes
    function editPerson(event) {
        // Search for person
        let editPersonId = parseInt(event.target.getAttribute("data-person-id"));
        let i = 0;
        let found = undefined;
        let items = document.querySelector("#person-list").getElementsByTagName("li");
        let person = undefined;
        // Search for item in list with the same id as the one in the edit button
        while(found === undefined & i < persons.length) {
            if(parseInt(items[i].getAttribute("data-person-id")) === editPersonId) {
                found = items[i];
                // Retrieve existing person's details from person array in memory
                let j = 0;
                while(person === undefined && j < persons.length) {
                    if(parseInt(persons[j].idPerson) === editPersonId)
                        person = persons[j];
                    else
                        j++;
                }
            }
            else
                i++;
        }
        // I suppose checking again for person !== undefined is a bit overkill,
        // but it's best to be 100% sure. :P It still works!
        if(found !== undefined && person !== undefined) {
            // Clear the found list item's inner HTML
            found.innerHTML = "";

            // These were set so that the viewing/editing view didn't change too much,
            // but it changes anyway, so I'm leaving them out now.
            // found.classList.add("my-0");
            // found.classList.add("py-0");
            
            let nameSpan = document.createElement("span");

            let editNameLabel = document.createElement("label");
                editNameLabel.for = "editName";
                editNameLabel.classList.add("label-person-form-small");
                editNameLabel.innerHTML = `<small>${nameWord}</small>`;

            let editNameField = document.createElement("input");
                editNameField.type = "text";
                editNameField.name = "editName";
                editNameField.id = "editName";
                editNameField.classList.add("input-person-form");
                editNameField.classList.add("w-100");
                editNameField.value = person.name;

            nameSpan.appendChild(editNameLabel);
            nameSpan.appendChild(editNameField);
            nameSpan.classList.add("col-6");
            nameSpan.classList.add("p-1");
            nameSpan.classList.add("m-0");

            let surnameSpan = document.createElement("span");

            let editSurnameLabel = document.createElement("label");
                editSurnameLabel.for = "editSurname";
                editSurnameLabel.classList.add("label-person-form-small");
                editSurnameLabel.innerHTML = `<small>${surnameWord}</small>`;

            let editSurnameField = document.createElement("input");
                editSurnameField.type = "text";
                editSurnameField.name = "editSurname";
                editSurnameField.id = "editSurname";
                editSurnameField.classList.add("input-person-form");
                editSurnameField.classList.add("w-100");
                editSurnameField.value = person.surname;

            surnameSpan.appendChild(editSurnameLabel);
            surnameSpan.appendChild(editSurnameField);
            surnameSpan.classList.add("col-6");
            surnameSpan.classList.add("p-1");
            surnameSpan.classList.add("m-0");

            let applyButton = document.createElement("button");
                applyButton.type = "button";
                applyButton.classList.add("btn");
                applyButton.classList.add("btn-success");
                applyButton.style.padding = "1ch";
                applyButton.style.marginRight = "0.5ch";
                applyButton.setAttribute("data-person-id", editPersonId);
                applyButton.innerHTML = `<span class="emoji">✅</span>`;

            let cancelButton = document.createElement("button");
                cancelButton.type = "button";
                cancelButton.classList.add("btn");
                cancelButton.classList.add("btn-secondary");
                cancelButton.style.padding = "1ch";
                cancelButton.innerHTML = `<span class="emoji">✖</span>`;

            // Apply button edits the retrieved person's attributes and refreshes list
            applyButton.addEventListener("click", (event) => {
                person.name = document.querySelector("#editName").value;
                person.surname = document.querySelector("#editSurname").value;
                refreshPersonList();
            });
            // Cancel button returns the list back to normal (and dismisses the edit form)
            cancelButton.addEventListener("click", () => {
                refreshPersonList();
            });

            let rowSpan = document.createElement("span");
                rowSpan.classList.add("person-list-item");
                rowSpan.classList.add("fs-6");

            let formSpan = document.createElement("span");
                formSpan.classList.add("flex-grow-1");
                formSpan.classList.add("row");
                formSpan.classList.add("m-0");
                formSpan.classList.add("p-0");

            formSpan.appendChild(nameSpan);
            formSpan.appendChild(surnameSpan);

            rowSpan.appendChild(formSpan);
            rowSpan.appendChild(applyButton);
            rowSpan.appendChild(cancelButton);

            found.appendChild(rowSpan);
        }
        document.querySelector("#person-list").classList.remove("list-unstyled");
    }

    // Delete individual person
    function deletePerson(event) {
        let personDeleteId = parseInt(event.target.getAttribute("data-person-id"));
        let i = 0;
        let found = false;
        // Search for person to delete by id
        while(!found && i < persons.length) {
            if(persons[i].idPerson === personDeleteId)
                found = true;
            else
                i++;
        }
        if(found)
            // Splice person array at index i, only skipping 1 item (2nd parameter)
            persons.splice(i, 1);

        // Refresh list with person array updated
        refreshPersonList();
    }

    // Delete all persons
    function wipeList() {
        // Empty persons array
        persons = [];
        // Refresh list with no people in the array
        refreshPersonList();
    }

    // Refresh person list in the HTML according to the person array
    function refreshPersonList() {
        // Reset form
        personForm["name"].value = "";
        personForm["surname"].value = "";
        // Reset list (so as to avoid accumulating values)
        document.querySelector("#person-list").innerHTML = "";
        // If there are no people
        if(persons.length < 1) {
            // Show empty list message
            document.querySelector("#no-persons").removeAttribute("hidden");
            // Hide wipe list button
            document.querySelector("#div-btn-wipe").setAttribute("hidden", true);
        }
        // Else, if there is at least one person
        else {
            // Hide empty list message
            document.querySelector("#no-persons").setAttribute("hidden", true);
            // Show wipe list button
            document.querySelector("#div-btn-wipe").removeAttribute("hidden");

            persons.forEach((person) => {
                let listItem = document.createElement("li");
                    listItem.setAttribute("data-person-id", person.idPerson);

                let rowSpan = document.createElement("span");
                    rowSpan.classList.add("person-list-item");

                let nameSpan = document.createElement("span");
                    nameSpan.innerHTML = `${person.name} ${person.surname}`;
                    nameSpan.classList.add("flex-grow-1");

                let editButton = document.createElement("button");
                    editButton.classList.add("btn");
                    editButton.classList.add("btn-warning");
                    editButton.style.marginRight = "0.5ch";
                    editButton.style.padding = "1ch";
                    editButton.innerHTML = `<span class="emoji">✍</span>`;
                    editButton.setAttribute("data-person-id", person.idPerson);

                let deleteButton = document.createElement("button");
                    deleteButton.classList.add("btn");
                    deleteButton.classList.add("btn-danger");
                    deleteButton.style.padding = "1ch";
                    deleteButton.innerHTML = `<span class="emoji">🗑</span>`;
                    deleteButton.setAttribute("data-person-id", person.idPerson);

                editButton.addEventListener("click", editPerson);
                deleteButton.addEventListener("click", deletePerson);

                rowSpan.appendChild(nameSpan);
                rowSpan.appendChild(editButton);
                rowSpan.appendChild(deleteButton);

                listItem.appendChild(rowSpan);
                listItem.classList.add("list-group-item");
                document.querySelector("#person-list").appendChild(listItem);
            });
        }
    }
});

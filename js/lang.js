"use strict";

let palabraNombre = "";
let palabraApellido = "";
let alMenosNombreApellido = "";

document.addEventListener("DOMContentLoaded", updateContentLanguage);

async function updateContentLanguage() {
    
    let langJSON = await fetch("./lang/lang.json")
        .then((response) => response.json())
        .then((json) => json.items);

    console.log(langJSON);
    let lang = document.documentElement.lang.toLowerCase()
    switch(lang) {
        case "es":
            palabraNombre = "Nombre";
            palabraApellido = "Apellido";
            alMenosNombreApellido = "Ingrese al menos un nombre o un apellido.";
            break;
        default:
            palabraNombre = "First name";
            palabraApellido = "Last name";
            alMenosNombreApellido = "Enter at least one first or last name."
            break;
    }
    placeText(langJSON, lang);
}

function toggleLanguage(event) {
    document.documentElement.lang = event.target.getAttribute("data-lang-toggle");
    updateContentLanguage();
}

function placeText(langJSON, languageKey) {
    document.title = langJSON[0][languageKey];
    document.querySelector("#titulo").innerHTML = langJSON[0][languageKey];
    for(let i = 1; i < langJSON.length; i++) {

        if(langJSON[i][languageKey] !== undefined)
            document.querySelector(`#${langJSON[i].id}`).innerHTML = langJSON[i][languageKey];

        if(langJSON[i]["data-bs-target"] !== undefined)
            document.querySelector(`#${langJSON[i].id}`).setAttribute("data-bs-target", langJSON[i]["data-bs-target"][languageKey])

        if(langJSON[i].id === "language-dropdown-menu") {
            let ulDropdownMenu = document.querySelector(`#${langJSON[i].id}`);
            ulDropdownMenu.innerHTML = "";

            let dropdownMenuItems = langJSON[i].items;
            dropdownMenuItems.forEach((item) => {
                console.log(dropdownMenuItems);

                let anchor = document.createElement("a");

                anchor.classList.add("dropdown-item");
                anchor.classList.add("language-menu-item");
                anchor.setAttribute("data-lang-toggle", item.locale);
                anchor.href = "#";
                anchor.innerHTML = item[languageKey];

                if(item.locale !== document.documentElement.lang)
                    anchor.addEventListener("click", toggleLanguage);
                else
                    anchor.classList.add("disabled");

                let listItem = document.createElement("li");
                listItem.appendChild(anchor);

                ulDropdownMenu.appendChild(listItem);
            });
        }

    }
}
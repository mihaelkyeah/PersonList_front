"use strict";

// These will be used for forms and other things
let nameWord = "";
let surnameWord = "";
let langJSON = undefined;

document.addEventListener("DOMContentLoaded", updateContentLanguage);

async function initContentLanguage() {
    // Fetch lang data from file
    return fetch("./lang/lang.json")
    .then((response) => response.json())
    .then((json) => json.items);
}

async function updateContentLanguage() {
    // Updates the file load if the langJSON variable in memory is undefined.
    // If not undefined, it skips the file load
    if(langJSON === undefined)
        langJSON = await initContentLanguage();
    // Retrieve lang from html lang tag (default: en)
    let lang = document.documentElement.lang.toLowerCase()
    switch(lang) {
        case "es":
            nameWord = "Nombre";
            surnameWord = "Apellido";
            break;
        default:
            nameWord = "Name";
            surnameWord = "Surname";
            break;
    }
    // Places text from JSON into document
    placeText(lang);
}

// Related to the event of pressing the language link from the language dropdown picker
function toggleLanguage(event) {
    // Updates the lang attribute of the html tag in the document
    document.documentElement.lang = event.target.getAttribute("data-lang-toggle");
    // Updates page contents using document lang as language key
    updateContentLanguage();
}

// Places text on the document
// using the html language tag
// as the key to choose from each item in the langJSON structure
function placeText(languageKey) {
    // The first element in the langJSON's items is the app name/title
    document.title = langJSON[0][languageKey];
    document.querySelector("#appTitle").innerHTML = langJSON[0][languageKey];
    // For the rest of the elements it looks through the document
    // for elements with matching id's to those of the items
    for(let i = 1; i < langJSON.length; i++) {

        if(langJSON[i][languageKey] !== undefined) {
            try { document.querySelector(`#${langJSON[i].id}`).innerHTML = langJSON[i][languageKey]
            } catch(e) { console.log(`${langJSON[i].id}`); };
        }

        // This is for the "about..." modal trigger, but other personalized attributes might be accessed this way...
        // Maybe this is a tiny bit messy, what do you think?
        if(langJSON[i]["data-bs-target"] !== undefined)
            document.querySelector(`#${langJSON[i].id}`).setAttribute("data-bs-target", langJSON[i]["data-bs-target"][languageKey])

        // The language dropdown gets created and recreated as soon as the user changes languages
        if(langJSON[i].id === "language-dropdown-menu") {
            let ulDropdownMenu = document.querySelector(`#${langJSON[i].id}`);
            ulDropdownMenu.innerHTML = "";

            let dropdownMenuItems = langJSON[i].items;
            dropdownMenuItems.forEach((item) => {
                // console.log(dropdownMenuItems);
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
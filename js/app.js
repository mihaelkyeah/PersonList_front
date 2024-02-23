"use strict";

let personas = [];

class Persona {
    static contadorPersonas = 0;
    constructor(nombre, apellido) {
        this._idPersona = ++Persona.contadorPersonas;
        this._nombre = nombre;
        this._apellido = apellido;
    }
    get idPersona() {
        return this._idPersona;
    }
    get nombre() {
        return this._nombre;
    }
    set nombre(nombre) {
        this._nombre = nombre;
    }
    get apellido() {
        return this._apellido;
    }
    set apellido(apellido) {
        this._apellido = apellido;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    let formulario = document.forms["formulario"];
    actualizarListaPersonas();

    document.querySelector("#btn-agregar").addEventListener("click", agregarPersona);
    document.querySelector("#btn-limpiar").addEventListener("click", limpiarLista);

    function agregarPersona() {
        if(!formulario["nombre"].value == "" || !formulario["apellido"].value == "") {
            let persona = new Persona(formulario["nombre"].value, formulario["apellido"].value);
            personas.push(persona);
            actualizarListaPersonas();
        } else {
            alert("Ingrese al menos un nombre o un apellido.");
        }
    }

    function editarPersona(event) {
        let idPersonaEditar = parseInt(event.target.getAttribute("data-id-persona"));
        let persona = undefined;
        let i = 0;
        let encontrada = undefined;
        let items = document.querySelector("#lista-personas").getElementsByTagName("li");
        while(encontrada === undefined & i < personas.length) {
            if(parseInt(items[i].getAttribute("data-id-persona")) === idPersonaEditar) {
                encontrada = items[i];
                let j = 0;
                while(persona === undefined && j < personas.length) {
                    if(parseInt(personas[j].idPersona) === idPersonaEditar)
                        persona = personas[j];
                    else
                        j++;
                }
            }
            else
                i++;
        }
        if(encontrada !== undefined) {
            encontrada.innerHTML = "";

            encontrada.classList.add("my-0");
            encontrada.classList.add("py-0");
            let spanNombre = document.createElement("span");

            let rotuloEditarNombre = document.createElement("label");
            rotuloEditarNombre.for = "editarNombre";
            rotuloEditarNombre.classList.add("label-form-persona-chiquito");
            rotuloEditarNombre.innerHTML = `<small>${palabraNombre}</small>`;

            let campoEditarNombre = document.createElement("input");
            campoEditarNombre.type = "text";
            campoEditarNombre.name = "editarNombre";
            campoEditarNombre.id = "editarNombre";
            campoEditarNombre.classList.add("input-form-persona");
            campoEditarNombre.classList.add("w-100");
            campoEditarNombre.value = persona.nombre;

            spanNombre.appendChild(rotuloEditarNombre);
            spanNombre.appendChild(campoEditarNombre);
            spanNombre.classList.add("col-4");
            spanNombre.classList.add("p-1");
            spanNombre.classList.add("m-0");

            let spanApellido = document.createElement("span");

            let rotuloEditarApellido = document.createElement("label");
            rotuloEditarApellido.for = "editarApellido";
            rotuloEditarApellido.classList.add("label-form-persona-chiquito");
            rotuloEditarApellido.innerHTML = `<small>${palabraApellido}</small>`;

            let campoEditarApellido = document.createElement("input");
            campoEditarApellido.type = "text";
            campoEditarApellido.name = "editarApellido";
            campoEditarApellido.id = "editarApellido";
            campoEditarApellido.classList.add("input-form-persona");
            campoEditarApellido.classList.add("w-100");
            campoEditarApellido.value = persona.apellido;

            spanApellido.appendChild(rotuloEditarApellido);
            spanApellido.appendChild(campoEditarApellido);
            spanApellido.classList.add("col-4");
            spanApellido.classList.add("p-1");
            spanApellido.classList.add("m-0");

            let botonAplicar = document.createElement("button");
            botonAplicar.type = "button";
            botonAplicar.classList.add("btn");
            botonAplicar.classList.add("btn-success");
            botonAplicar.style.padding = "1ch";
            botonAplicar.style.marginRight = "0.5ch";
            botonAplicar.setAttribute("data-id-persona", idPersonaEditar);
            botonAplicar.innerHTML = `<span class="emoji">✅</span>`;

            let botonCancelar = document.createElement("button");
            botonCancelar.type = "button";
            botonCancelar.classList.add("btn");
            botonCancelar.classList.add("btn-secondary");
            botonCancelar.style.padding = "1ch";
            botonCancelar.innerHTML = `<span class="emoji">✖</span>`;

            botonAplicar.addEventListener("click", (event) => {
                persona.nombre = document.querySelector("#editarNombre").value;
                persona.apellido = document.querySelector("#editarApellido").value;
                actualizarListaPersonas();
            });
            botonCancelar.addEventListener("click", () => {
                actualizarListaPersonas();
            });

            let rowSpan = document.createElement("span");
            rowSpan.classList.add("item-lista-personas");
            rowSpan.classList.add("fs-6");

            let spanFormulario = document.createElement("span");
            spanFormulario.classList.add("flex-grow-1");
            spanFormulario.classList.add("row");
            spanFormulario.classList.add("m-0");
            spanFormulario.classList.add("p-0");
            spanNombre.classList.add("col-6");
            spanApellido.classList.add("col-6");
            spanFormulario.appendChild(spanNombre);
            spanFormulario.appendChild(spanApellido);


            rowSpan.appendChild(spanFormulario);
            rowSpan.appendChild(botonAplicar);
            rowSpan.appendChild(botonCancelar);

            encontrada.appendChild(rowSpan);
        }
        document.querySelector("#lista-personas").classList.remove("list-unstyled");
    }

    function borrarPersona(event) {
        let idPersonaBorrar = parseInt(event.target.getAttribute("data-id-persona"));
        let i = 0;
        let encontrado = false;
        while(!encontrado && i < personas.length) {
            if(personas[i].idPersona === idPersonaBorrar)
                encontrado = true;
            else
                i++;
        }
        if(encontrado)
            personas.splice(i, 1);

        actualizarListaPersonas();
    }

    function limpiarLista() {
        personas = [];
        actualizarListaPersonas();
    }

    function actualizarListaPersonas() {
        formulario["nombre"].value = "";
        formulario["apellido"].value = "";
        document.querySelector("#lista-personas").innerHTML = "";
        if(personas.length < 1) {
            // Mostrar mensaje de lista vacía
            document.querySelector("#no-hay-personas").removeAttribute("hidden");
            // Esconder botón de limpiar lista
            document.querySelector("#div-btn-limpiar").setAttribute("hidden", true);
        }
        else {
            // Ocultar mensaje de lista vacía
            document.querySelector("#no-hay-personas").setAttribute("hidden", true);
            // Mostrar botón de limpiar lista
            document.querySelector("#div-btn-limpiar").removeAttribute("hidden");

            personas.forEach((persona) => {
                let listItem = document.createElement("li");
                listItem.setAttribute("data-id-persona", persona.idPersona);

                let rowSpan = document.createElement("span");
                rowSpan.classList.add("item-lista-personas");

                let nameSpan = document.createElement("span");
                nameSpan.innerHTML = `${persona.nombre} ${persona.apellido}`;
                nameSpan.classList.add("flex-grow-1");

                let editButton = document.createElement("button");
                editButton.classList.add("btn");
                editButton.classList.add("btn-warning");
                editButton.style.marginRight = "0.5ch";
                editButton.style.padding = "1ch";
                editButton.innerHTML = `<span class="emoji">✍</span>`;
                editButton.setAttribute("data-id-persona", persona.idPersona);

                let deleteButton = document.createElement("button");
                deleteButton.classList.add("btn");
                deleteButton.classList.add("btn-danger");
                deleteButton.style.padding = "1ch";
                deleteButton.innerHTML = `<span class="emoji">🗑</span>`;
                deleteButton.setAttribute("data-id-persona", persona.idPersona);

                editButton.addEventListener("click", editarPersona);
                deleteButton.addEventListener("click", borrarPersona);

                rowSpan.appendChild(nameSpan);
                rowSpan.appendChild(editButton);
                rowSpan.appendChild(deleteButton);

                listItem.appendChild(rowSpan);
                listItem.classList.add("list-group-item");
                document.querySelector("#lista-personas").appendChild(listItem);
            });
        }
    }
});

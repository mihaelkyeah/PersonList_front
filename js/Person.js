class Person {
    static personCounter = 0;
    constructor(name, surname) {
        this._idPerson = ++Person.personCounter;
        this._name = name;
        this._surname = surname;
    }
    get idPerson() {
        return this._idPerson;
    }
    get name() {
        return this._name;
    }
    set name(name) {
        this._name = name;
    }
    get surname() {
        return this._surname;
    }
    set surname(surname) {
        this._surname = surname;
    }
}
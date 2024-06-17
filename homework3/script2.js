document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('person-form');
    const nameInput = document.getElementById('name');
    const ageInput = document.getElementById('age');
    const cityInput = document.getElementById('city');
    const emailInput = document.getElementById('email');
    const peopleContainer = document.getElementById('people-container');
    const resetButton = document.getElementById('reset-button');

    // Load existing people from localStorage
    loadPeople();

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const id = uuid.v4();
        const name = nameInput.value.trim();
        const age = ageInput.value.trim();
        const city = cityInput.value.trim();
        const email = emailInput.value.toString();

        if (name === '' || age === '' || city === '' || email === '') {
            alert('Please fill in all fields');
            return;
        }

        const person = { id, name, age, city,email};

        addPersonToDOM(person);
        savePersonToLocalStorage(person);

        nameInput.value = '';
        ageInput.value = '';
        cityInput.value = '';
        emailInput.value = '';
    });

    resetButton.addEventListener('click', () => {
        clearPeople();
    });

    function addPersonToDOM(person) {
        const card = document.createElement('div');
        card.className = 'person-card';

        const name = document.createElement('h2');
        name.textContent = person.name;

        const age = document.createElement('p');
        age.textContent = `Age: ${person.age}`;

        const city = document.createElement('p');
        city.textContent = person.city;

        const email = document.createElement('p');
        email.textContent = `Email: ${person.email}`;

        card.appendChild(name);
        card.appendChild(age);
        card.appendChild(city);
        card.appendChild(email);
        peopleContainer.appendChild(card);
    }

    function savePersonToLocalStorage(person) {
        let people = getPeopleFromLocalStorage();
        people.push(person);
        localStorage.setItem('people', JSON.stringify(people));
    }

    function getPeopleFromLocalStorage() {
        const people = localStorage.getItem('people');
        return people ? JSON.parse(people) : [];
    }

    function loadPeople() {
        const people = getPeopleFromLocalStorage();
        people.forEach(person => addPersonToDOM(person));
    }

    function clearPeople() {
        // Clear people from localStorage
        localStorage.removeItem('people');

        // Remove all person cards from the DOM
        while (peopleContainer.firstChild) {
            peopleContainer.removeChild(peopleContainer.firstChild);
        }
    }
});
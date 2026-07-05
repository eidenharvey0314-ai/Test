const STORAGE_KEY = "faceTrackerPeople";

let people = {};

// Load saved data
function loadPeople() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);

        if (data) {
            people = JSON.parse(data);
        }
    } catch (err) {
        console.error("Couldn't load people:", err);
        people = {};
    }
}

// Save to localStorage
function savePeople() {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(people)
    );
}

// Save or update one person
function savePerson(id, name, age, info) {

    people[id] = {
        id,
        name,
        age,
        info
    };

    savePeople();
}

// Retrieve one person
function getPerson(id) {
    return people[id] || null;
}

// Delete one person
function removePerson(id) {

    delete people[id];

    savePeople();
}

// Get all people
function getAllPeople() {
    return people;
}

// Clear everything
function clearDatabase() {
    people = {};
    savePeople();
}

// Load immediately
loadPeople();

// Export functions
export {
    savePerson,
    getPerson,
    getAllPeople,
    removePerson,
    clearDatabase
};

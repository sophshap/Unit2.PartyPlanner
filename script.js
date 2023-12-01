const COHORT = "2310-GHP-ET-WEB-FT-SF";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

const state = {
    events: [],
};

const eventList = document.querySelector("#events");

const addEventForm = document.querySelector("#addEvent");
addEventForm.addEventListener("submit", addEvent);

/**
 * Sync state with the API and rerender
 */
async function render() {
    await getEvents();
    renderEvents();
}
render();

/**
* Update state with events from API
*/
async function getEvents() {
    try {
        const response = await fetch(API_URL);
        const json = await response.json();
        console.log(response)
        state.events = json.data;
    } catch (error) {
        console.error(error);
    }
}

/**
 * Render events from state
 */
function renderEvents() {
    console.log(state.events)
    if (!state.events.length) {
        eventList.innerHTML = "<li>No events.</li>";
        return;
    }

    const eventCards = state.events.map((event) => {
        const eventElement = document.createElement("div");
        eventElement.classList.add('event-card');

        const isoStr = event.date;
        const date = new Date(isoStr);
        const time = date.toTimeString();

        eventElement.innerHTML = `
        <div>${event.name}</div>
        <div>${event.description}</div>
        <div>${event.date}</div>
        <div>${time}</div>
        <div>${event.location}</div>
        
      `;

        //delete button
        const deleteButton = document.createElement('button')
        deleteButton.textContent = "Delete Event"
        eventElement.append(deleteButton)

        deleteButton.addEventListener("click", () => deleteEvent(event.id))

        //edit button
        const editButton = document.createElement('button')
        editButton.textContent = "Edit Event"
        eventElement.append(editButton)

        editButton.addEventListener("click", () => updateEvent(event.id))

        return eventElement;
    });

    eventList.replaceChildren(...eventCards);
}

/**
 * Ask the API to create a new event based on form data
 * @param {Event} event
 */
async function addEvent(event) {
    event.preventDefault();
    const time = addEventForm.time.value;
    const date = addEventForm.date.value;
    const dateCombine = `${time} ${date}`;
    const newDate = new Date(dateCombine);
    const fDate = newDate.toISOString();

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: addEventForm.name.value,
                description: addEventForm.description.value,
                date: fDate,
                location: addEventForm.location.value,
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to create event");
        }

        render();
    } catch (error) {
        console.error(error);
    }
}

// DELETE
async function deleteEvent(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        })
        render()
    } catch (error) {
        console.error(error);
    }
}

// UPDATE 
async function updateEvent(id) {
    const time = addEventForm.time.value;
    const date = addEventForm.date.value;
    const dateCombine = `${time} ${date}`;
    const newDate = new Date(dateCombine);
    const fDate = newDate.toISOString();
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
                name: addEventForm.name.value,
                description: addEventForm.description.value,
                date: fDate,
                location: addEventForm.location.value,
            }),
        });
        if (!response.ok) {
            throw new Error("Failed to create event");
        }
        render();
    } catch (error) {
        console.error(error);
    }
}
document.addEventListener('DOMContentLoaded', async () => {
    const eventContainer = document.getElementById('event-container');
    const searchBar = document.getElementById('search-input');
    const eventCount = document.getElementById('event-count');
    const urlParams = new URLSearchParams(window.location.search);
    const regno = urlParams.get("registrationNo");

    // Fetch events data from the server
    fetchEvents();
    fetchEventCount(); // Fetch event count

    async function fetchEvents() {
        try {
            const response = await fetch('http://localhost:3000/events');
            const eventsData = await response.json();
            displayEvents(eventsData);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    }

    async function fetchEventCount() {
        try {
            const response = await fetch('http://localhost:3000/event-count');
            const { count } = await response.json();
            eventCount.textContent = `Search from ${count} events`; // Display count
        } catch (error) {
            console.error('Error fetching event count:', error);
        }
    }

    function displayEvents(eventsData) {
        eventContainer.innerHTML = ''; // Clear previous event blocks

        eventsData.forEach(event => {
            const eventBlock = createEventBlock(event);
            eventContainer.appendChild(eventBlock);
        });
    }

    function createEventBlock(event) {
        const eventBlock = document.createElement('div');
        eventBlock.classList.add('event');
        
        const eventName = document.createElement('h2');
        eventName.textContent = event.event_name;

        // Display registration count alongside event name
        const registrationCount = document.createElement('span');
        registrationCount.textContent = ` (${event.registration_count} registrations)`;
        eventName.appendChild(registrationCount);
    
        // Check if the event has a fee, and if so, display it
        if (event.fee !== 0) {
            const feeTag = document.createElement('strong');
            feeTag.textContent = ` (₹${event.fee}/-)`;
            eventName.appendChild(feeTag);
        }
        
        const eventDescription = document.createElement('p');
        eventDescription.textContent = event.description;
    
        const registerBtn = document.createElement('button');
        registerBtn.textContent = 'Register';
        registerBtn.classList.add('register-btn');
        registerBtn.dataset.eventId = event.event_id; // Store event ID in a data attribute
        registerBtn.addEventListener('click', function() {
            registerEvent(event.event_id);
        });
    
        eventBlock.appendChild(eventName);
        eventBlock.appendChild(eventDescription);
        eventBlock.appendChild(registerBtn);
    
        return eventBlock;
    }        

    async function registerEvent(eventId) {
        try {
            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    event_id: eventId,
                    registration_no: regno // Use registration number from URL
                })
            });
            const responseData = await response.json();
            alert(responseData.message);
        } catch (error) {
            console.error('Error registering event:', error);
        }
    }

    // Search functionality
    searchBar.addEventListener('input', function() {
        const searchTerm = searchBar.value.toLowerCase().trim();
        const events = eventContainer.querySelectorAll('.event');

        events.forEach(event => {
            const eventName = event.querySelector('h2').textContent.toLowerCase();

            if (eventName.includes(searchTerm)) {
                event.style.display = 'block';
            } else {
                event.style.display = 'none';
            }
        });
    });
});

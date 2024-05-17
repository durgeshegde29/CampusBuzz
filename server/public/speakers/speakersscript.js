document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/speakers');
        const speakersData = await response.json();

        const speakersContent = document.getElementById('speakers-content');
        speakersData.forEach(speaker => {
            const box = document.createElement('div');
            box.classList.add('box');

            const speakerName = document.createElement('h3');
            speakerName.textContent = speaker.speaker_name;

            const eventName = document.createElement('h5');
            eventName.textContent = speaker.event_name;

            const image = document.createElement('img');
            image.src = 'img1.png'; 
            image.alt = 'Speaker Image'; 

            box.appendChild(speakerName);
            box.appendChild(eventName);
            box.appendChild(image);

            speakersContent.appendChild(box);
        });
    } catch (error) {
        console.error('Error fetching speaker details:', error);
    }
});

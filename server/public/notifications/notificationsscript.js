document.addEventListener('DOMContentLoaded', function() {
    const queryParams = new URLSearchParams(window.location.search);
    const registrationNo = queryParams.get('registrationNo');

    fetch(`/notifications?registrationNo=${registrationNo}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const notificationList = document.getElementById('notification-list');
            notificationList.innerHTML = ''; // Clear previous notifications

            data.forEach(notification => {
                const notificationBox = document.createElement('li');
                notificationBox.classList.add('notification'); // Add notification class
                notificationBox.textContent = notification.message;
                notificationList.appendChild(notificationBox);
            });
        })
        .catch(error => console.error('Error fetching notifications:', error));
});

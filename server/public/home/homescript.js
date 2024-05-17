document.addEventListener('DOMContentLoaded', function() {
    console.log('Home page loaded.');
    // Add event listener for the "CampusBuzz" text
    const campusBuzzLink = document.getElementById('user_home');
    campusBuzzLink.addEventListener('click', function() {
        // Redirect to the same page
        window.location.href = `home.html?registrationNo=${getRegistrationNumber()}`;
    });
});

// Function to get the registration number from the URL query parameter
function getRegistrationNumber() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('registrationNo');
}

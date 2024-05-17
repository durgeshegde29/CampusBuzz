document.addEventListener('DOMContentLoaded', function() {
    const signInForm = document.getElementById('sign-in-form');
    const regNumberInput = document.getElementById('registration_no');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');

    signInForm.addEventListener('submit', function(event) {
        event.preventDefault(); 

        const registrationNo = regNumberInput.value.trim();
        const password = passwordInput.value.trim();

        fetch('http://localhost:3000/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                registrationNo: registrationNo,
                password: password 
            })
        })
        .then(response => {
            if (response.ok) {
                return response.json(); // Parse the JSON response
            } else {
                errorMessage.textContent = 'Invalid username or password!!!';
                throw new Error('Invalid username or password');
            }
        })
        .then(data => {
            // Redirect to the home page with registration number in the URL
            window.location.href = `/home.html?registrationNo=${data.registrationNo}`;
        })
        .catch(error => {
            console.error('Error:', error);
            errorMessage.textContent = 'Error signing in. Please try again later.';
        });
    });
});

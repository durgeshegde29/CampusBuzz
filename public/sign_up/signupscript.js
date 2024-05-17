document.addEventListener('DOMContentLoaded', function() {
    const signUpForm = document.getElementById('sign-up-form');
    const regNoInput = document.getElementById('registrationNumber');
    const nameInput = document.getElementById('name');
    const dobInput = document.getElementById('dob');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');

    if (!signUpForm || !regNoInput || !nameInput || !dobInput || !passwordInput || !errorMessage) {
        console.error('Required elements not found.');
        return;
    }

    signUpForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const registrationNo = regNoInput.value.trim();
        const name = nameInput.value.trim();
        const dob = dobInput.value.trim();
        const password = passwordInput.value.trim();

        fetch('http://localhost:3000/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                registration_no: registrationNo, 
                name: name, 
                dob: dob, 
                password: password
            })
        })
        .then(response => {
            if (response.ok) {
                window.location.href = '../sign_in/signin.html'; // Redirect to the sign-in page
            } else {
                throw new Error('Error signing up. Please try again later.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            errorMessage.textContent = error.message;
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const adminForm = document.getElementById('admin-sign-in-form');
    const idInput = document.getElementById('admin_id');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');

    adminForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const id = idInput.value.trim();
        const password = passwordInput.value.trim();

        fetch('http://localhost:3000/admin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                admin_id: id,
                password: password
            })
        })
        .then(response => {
            if (response.ok) {
                window.location.href = '/home.html';
            } else {
                errorMessage.textContent = 'Invalid credentials!';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            errorMessage.textContent = 'Error signing in. Please try again later.';
        });
    });
});

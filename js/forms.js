/*
  File: js/forms.js
  Description: Submits the contact and feedback forms to Formspree without leaving the page.
  Feedback forms carry a data-app attribute so each message says which app it is about.
*/

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('form.contact-form').forEach(function(form) {

        // Status line under the submit button, announced to screen readers.
        const status = document.createElement('p');
        status.className = 'form-status';
        status.setAttribute('role', 'status');
        form.appendChild(status);

        const button = form.querySelector('button[type="submit"]');

        form.addEventListener('submit', function(event) {
            event.preventDefault();

            const formData = new FormData(form);
            const appName = form.dataset.app;
            const messageType = (formData.get('type') || '').toUpperCase();
            const emailAddress = formData.get('email');

            // Formspree uses the `_subject` field for the email subject line.
            if (appName) {
                formData.append('_subject', `[${appName}] [${messageType}] from ${emailAddress}`);
                formData.append('app', appName);
            } else if (formData.get('subject')) {
                formData.append('_subject', `[Groove Logic] ${formData.get('subject')}`);
            }

            button.disabled = true;
            status.className = 'form-status';
            status.textContent = 'Sending…';

            fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            }).then(function(response) {
                if (response.ok) {
                    status.classList.add('success');
                    status.textContent = 'Thanks! Your message has been sent.';
                    form.reset();
                } else {
                    status.classList.add('error');
                    status.textContent = 'Oops! There was a problem sending your message. Please try again later.';
                }
            }).catch(function(error) {
                console.error('Form submission error:', error);
                status.classList.add('error');
                status.textContent = 'Oops! There was a network error. Please try again later.';
            }).finally(function() {
                button.disabled = false;
            });
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const feedbackForm = document.getElementById('feedback-form');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(feedbackForm);
            const messageType = formData.get('type').toUpperCase();
            const emailAddress = formData.get('email');
            const subject = `[${messageType}] from ${emailAddress}`;
            formData.append('_subject', subject);
            fetch(feedbackForm.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            }).then(response => {
                if (response.ok) {
                    alert('Thank you for your feedback! Your message has been submitted.');
                    feedbackForm.reset();
                } else {
                    alert('Oops! There was a problem submitting your form. Please try again later.');
                }
            }).catch(error => {
                console.error('Form submission error:', error);
                alert('Oops! There was a network error. Please try again later.');
            });
        });
    }
});

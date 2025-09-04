/*
  File: js/dungeon-soundboard.js
  Generated: 2025-09-04
  Description: Handles the feedback form submission for the Dungeon Soundboard page.
*/

// MARK: - Form Submission Logic
document.addEventListener('DOMContentLoaded', function() {
    
    // Find the feedback form by its ID.
    const feedbackForm = document.getElementById('feedback-form');
    
    // Check if the form exists on the page.
    if (feedbackForm) {

        // Add a listener for the 'submit' event.
        feedbackForm.addEventListener('submit', function(event) {
            
            // Prevent the form from submitting the default way.
            event.preventDefault(); 
            
            // Get the data from the form.
            const formData = new FormData(feedbackForm);
            
            // Get the selected message type and email for the custom subject.
            const messageType = formData.get('type').toUpperCase();
            const emailAddress = formData.get('email');
            
            // Create the custom subject line.
            const subject = `[${messageType}] from ${emailAddress}`;
            
            // Add the custom subject to the form data. Formspree uses the `_subject` field.
            formData.append('_subject', subject);
            
            // Use the Fetch API to send the form data to Formspree.
            fetch(feedbackForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                // Check if the submission was successful.
                if (response.ok) {
                    // Show the success pop-up message.
                    alert('Thank you for your feedback! Your message has been submitted.');
                    // Reset the form fields.
                    feedbackForm.reset();
                } else {
                    // Show an error pop-up message if something went wrong.
                    alert('Oops! There was a problem submitting your form. Please try again later.');
                }
            }).catch(error => {
                // Show an error for network issues.
                console.error('Form submission error:', error);
                alert('Oops! There was a network error. Please try again later.');
            });
        });
    }
});
/* Total lines: 63 */
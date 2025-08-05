/*
  File: js/script.js
  Generated: 2025-08-05
  Description: Main JavaScript file for the Groove Logic website. Includes logic to clear the form on page load.
*/

// Listen for the pageshow event, which fires on initial load and when a page is restored from the back/forward cache.
window.addEventListener('pageshow', function(event) {
    
    // Find the contact form element by its ID.
    const contactForm = document.getElementById('contact-form');

    // If the form exists on the page, reset it to its default empty state.
    // This will now run correctly even when navigating back to the page.
    if (contactForm) {
        contactForm.reset();
    }

});
/* Total lines: 17 */
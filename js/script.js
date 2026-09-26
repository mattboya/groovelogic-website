/*
  File: js/script.js
  Description: Main JavaScript file for the Groove Logic website.
*/

// Listen for the pageshow event, which fires on initial load and when a page is restored from the back/forward cache.
window.addEventListener('pageshow', function(event) {

    // Reset any contact/feedback form to its default empty state.
    document.querySelectorAll('form.contact-form').forEach(function(form) {
        form.reset();
    });

});

// Keep the footer copyright year current.
document.querySelectorAll('.current-year').forEach(function(el) {
    el.textContent = new Date().getFullYear();
});

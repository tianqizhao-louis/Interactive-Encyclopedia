$(document).ready(function () {
    let dropdown = document.querySelector('.dropdown');

    //addEventListener - attaches an event handler to the specified element.
    dropdown.addEventListener('click', function (event) {

        //event.stopPropagation() - it stops the bubbling of an event to parent elements, by preventing parent event handlers from being executed
        event.stopPropagation();

        //classList.toggle - it toggles between adding and removing a class name from an element
        dropdown.classList.toggle('is-active');
    });
});
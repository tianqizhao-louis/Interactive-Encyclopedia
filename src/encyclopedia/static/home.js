document.addEventListener("DOMContentLoaded", function (event) {
    let dropdown = document.getElementById("topic-dropdown");

    //addEventListener - attaches an event handler to the specified element.
    dropdown.addEventListener('click', function (event) {

        //event.stopPropagation() - it stops the bubbling of an event to parent elements, by preventing parent event handlers from being executed
        event.stopPropagation();

        //classList.toggle - it toggles between adding and removing a class name from an element
        dropdown.classList.toggle('is-active');
    });


    document.getElementById("ask-btn").addEventListener("click", function (event) {
        event.preventDefault();
        document.getElementById("ask-btn").classList.add("is-loading")
        let topic = document.getElementById("topic-input").value.toLowerCase();
        window.location.href = '/topic/' + topic;
    });
});
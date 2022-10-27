document.addEventListener("DOMContentLoaded", function (event) {
    const btnSubtopicSelector = document.getElementById("btnSubtopic");
    btnSubtopicSelector.addEventListener("click", function (event) {

        btnSubtopicSelector.classList.add("is-loading");

        let url = "/list_subtopics/" + user_topic;
        fetch(url, {
            method: "GET"
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);


                const btnSubtopicsColumnSelector = document.getElementById("subtopicBtnHolder");
                btnSubtopicsColumnSelector.replaceChildren();

                createDropDown("subtopicDropDownId", document.getElementById("subtopicHolder"), data);

            })
            .catch(error => {
                console.log(error);
            });
    });
});


function createDropDown(dropDownId, columnSelector, data) {
    let contentId = dropDownId + "Content";

    let dropDown = "<div id='" + dropDownId + "' class=\"dropdown\">\n" +
        "                <div class=\"dropdown-trigger\">\n" +
        "                    <button class=\"button\" aria-haspopup=\"true\" aria-controls=\"dropdown-menu\">\n" +
        "                        <span>Select a Subtopic</span>\n" +
        "                        <span class=\"icon is-small\">\n" +
        "                            <i class=\"fas fa-angle-down\" aria-hidden=\"true\"></i>\n" +
        "                        </span>\n" +
        "                    </button>\n" +
        "                </div>\n" +
        "                <div class=\"dropdown-menu\" id=\"dropdown-menu\" role=\"menu\">\n" +
        "                    <div id='" + contentId + "' class=\"dropdown-content\">\n" +
        "                    </div>\n" +
        "                </div>\n" +
        "            </div>";


    columnSelector.innerHTML = dropDown;

    let contentIdSelector = document.getElementById(contentId);
    data["subtopic_list"].forEach(function (item, index){
       let link = document.createElement("a");
       link.classList.add("dropdown-item");
       link.setAttribute("href", "/subtopic/select");
       link.textContent = item;
       link.id = "subtopicSelect" + data["pure_subtopics"][index];
       contentIdSelector.append(link);

       let linkSelector = document.getElementById("subtopicSelect" + data["pure_subtopics"][index]);
       eventClickDropDown(linkSelector, data["pure_subtopics"][index], item);

    });
    let dropDownSelector = document.getElementById("subtopicDropDownId");
    addDropDown(dropDownSelector);
}


function eventClickDropDown(dropdownItemSelector, subtopic, complete_subtopic) {
    dropdownItemSelector.addEventListener("click", function (event) {
       event.preventDefault();

       const subtopicHolderColumn = document.getElementById("subtopicHolder");
       subtopicHolderColumn.replaceChildren();
       subtopicHolderColumn.innerHTML = "Loading..."

       let url = dropdownItemSelector.href;
        fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "subtopic": subtopic,
                "topic": user_topic
            })
        })
            .then(response => response.json())
            .then(data => {
                subtopicHolderColumn.replaceChildren();
                createSubtopicExplanation(complete_subtopic);
                console.log(data);

                addSubtopicMetaphor(data);
            })
            .catch(error => {
                console.log(error);
            });
    });
}

function addSubtopicMetaphor(data) {
    const subSubTopicHolderSelector = document.getElementById("subSubTopicHolder");

    let box = document.createElement("div");
    box.classList.add("box");
    box.id = "subsubTopicHolderBox";

    let prompt = document.createElement("p");
    prompt.innerHTML = "<strong>" + data["prompt"] + "</strong>";

    box.append(prompt);
    subSubTopicHolderSelector.append(box);
}


function createSubtopicExplanation(complete_subtopic) {
    const subtopicHolderSelector = document.getElementById("subtopicHolder");

    let box = document.createElement("div");
    box.classList.add("box");
    box.id = "subtopicHolderBox";

    let p = document.createElement("p");
    p.innerHTML = "Subtopic chosen: <strong>" + complete_subtopic + "</strong>";

    box.append(p);

    subtopicHolderSelector.append(box);
}


function addDropDown(dropDownSelector) {
    dropDownSelector.addEventListener('click', function (event) {

        //event.stopPropagation() - it stops the bubbling of an event to parent elements, by preventing parent event handlers from being executed
        event.stopPropagation();

        //classList.toggle - it toggles between adding and removing a class name from an element
        dropDownSelector.classList.toggle('is-active');
    });
}

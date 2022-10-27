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


    document.getElementById("delete-message-banner").addEventListener("click", function (event) {
       event.preventDefault();
       document.getElementById("banner").replaceChildren();
    });
});


/**
 * Create Dropdown for subtopics
 * @param dropDownId
 * @param columnSelector
 * @param data
 */
function createDropDown(dropDownId, columnSelector, data) {
    let contentId = dropDownId + "Content";

    columnSelector.innerHTML = "<div id='" + dropDownId + "' class=\"dropdown\">\n" +
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

    let contentIdSelector = document.getElementById(contentId);
    data["subtopic_list"].forEach(function (item, index) {
        let link = document.createElement("a");
        link.classList.add("dropdown-item");
        link.setAttribute("href", "/subtopic/select");
        link.textContent = item;
        link.id = "subtopicSelect" + data["pure_subtopics"][index];
        contentIdSelector.append(link);

        let linkSelector = document.getElementById("subtopicSelect" + data["pure_subtopics"][index]);
        eventClickDropDown(linkSelector, data["pure_subtopics"][index], item);

    });
    let dropDownSelector = document.getElementById(dropDownId);
    addDropDown(dropDownSelector);
}


/**
 * create subsubtopic dropdown
 * @param dropDownId
 * @param columnSelector
 * @param data
 * @param subtopic
 */
function createSubSubDropdown(dropDownId, columnSelector, data, subtopic) {
    let contentId = dropDownId + "Content";

    columnSelector.innerHTML = "<div id='" + dropDownId + "' class=\"dropdown\">\n" +
        "                <div class=\"dropdown-trigger\">\n" +
        "                    <button class=\"button\" aria-haspopup=\"true\" aria-controls=\"dropdown-menu\">\n" +
        "                        <span>Select a Sub-subtopic</span>\n" +
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

    let contentIdSelector = document.getElementById(contentId);

    data["subsub_topic"].forEach(function (item, index) {
        let link = document.createElement("a");
        link.classList.add("dropdown-item");
        link.setAttribute("href", "/subsubtopic/select");
        link.textContent = item;
        link.id = "subSubtopicSelect" + data["subsub_pure"][index];
        contentIdSelector.append(link);

        let linkSelector = document.getElementById("subSubtopicSelect" + data["subsub_pure"][index]);
        eventClickDropDownSubSubTopic(linkSelector, subtopic, data["subsub_pure"][index], item);
    });

    let dropDownSelector = document.getElementById(dropDownId);
    addDropDown(dropDownSelector);
}


/**
 * Add dropdown click handler for subsubtopic selection
 * @param dropdownItemSelector
 * @param subtopic
 * @param subsubtopic
 * @param complete_subsubtopic
 */
function eventClickDropDownSubSubTopic(dropdownItemSelector, subtopic, subsubtopic, complete_subsubtopic) {
    dropdownItemSelector.addEventListener("click", function (e) {
        e.preventDefault();

        const subsubTopicHolderColumn = document.getElementById("subSubTopicBtnHolder");
        subsubTopicHolderColumn.replaceChildren();
        subsubTopicHolderColumn.innerHTML = "Loading...";

        let url = dropdownItemSelector.href;

        fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "subsubtopic": subsubtopic,
                "subtopic": subtopic,
                "user_topic": user_topic
            })
        })
            .then(response => response.json())
            .then(data => {
                subsubTopicHolderColumn.replaceChildren();
                createSubSubTopicExplanation(complete_subsubtopic);
                addSubSubTopicMetaphor(data);

                // Follow up questions
                createFollowUp(subtopic, data["subsubtopic"]);
            })
            .catch(error => {
                console.log(error);
            });
    });
}


/**
 * Add event handler to subtopic dropdown
 * @param dropdownItemSelector
 * @param subtopic
 * @param complete_subtopic
 */
function eventClickDropDown(dropdownItemSelector, subtopic, complete_subtopic) {
    dropdownItemSelector.addEventListener("click", function (event) {
        event.preventDefault();

        const subtopicHolderColumn = document.getElementById("subtopicHolder");
        subtopicHolderColumn.replaceChildren();
        subtopicHolderColumn.innerHTML = "Loading...";

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
                addSubtopicMetaphor(data);
                createSubSubDropdown("subSubtopicDropDownId", document.getElementById("subSubTopicBtnHolder"), data, subtopic)
            })
            .catch(error => {
                console.log(error);
            });
    });
}


/**
 *
 * @param subtopic
 * @param subsubtopic
 */
function createFollowUp(subtopic, subsubtopic) {
    const followUpQuestionHolderSelector = document.getElementById("followUpQuestionHolder");

    followUpQuestionHolderSelector.innerHTML = "<form id=\"followUpForm\">\n" +
        "                <div class=\"field\">\n" +
        "                    <label class=\"label\">Follow Up Question:</label>\n" +
        "                    <div class=\"control\">\n" +
        "                        <label>\n" +
        "                            <input id='follow-ask' class=\"input\" type=\"text\" placeholder=\"Ask a follow up question\">\n" +
        "                        </label>\n" +
        "                    </div>\n" +
        "                </div>\n" +
        "                <div class=\"field is-grouped\">\n" +
        "                    <div class=\"control\">\n" +
        "                        <button id='submit-question-btn' class=\"button is-link is-light\">Submit</button>\n" +
        "                    </div>\n" +
        "                    <div class=\"control\">\n" +
        "                        <button onclick=\"window.location.href='/'\" class=\"button\">Go Back to Home Page</button>\n" +
        "                    </div>\n" +
        "                </div>\n" +
        "            </form>"

    const submitSelector = document.getElementById("followUpForm");

    submitSelector.addEventListener("submit", function (e) {
        e.preventDefault();

        document.getElementById("submit-question-btn").classList.add("is-loading");

        let url = "/followupquestion";
        fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "question": document.getElementById("follow-ask").value,
                "subsubtopic": subsubtopic,
                "subtopic": subtopic,
                "user_topic": user_topic
            })
        })
            .then(response => response.json())
            .then(data => {
                let question = document.createElement("p");
                question.innerHTML = "<strong>Question: </strong>" + document.getElementById("follow-ask").value;
                let answer = document.createElement("p");
                answer.innerHTML = "<strong>Answer: </strong>" + data["answer"];

                document.getElementById("followUpAnswerHolder").append(question);
                document.getElementById("followUpAnswerHolder").append(answer);

                document.getElementById("follow-ask").value = "";
                document.getElementById("follow-ask").focus();
                document.getElementById("submit-question-btn").classList.remove("is-loading");
            })
            .catch(error => {
                console.log(error);
            });
    });

}


/**
 * Generate a box with subtopic's metaphor
 * @param data
 */
function addSubtopicMetaphor(data) {
    const subSubTopicHolderSelector = document.getElementById("subSubTopicHolder");

    let box = document.createElement("div");
    box.classList.add("box");
    box.id = "subsubTopicHolderBox";

    let prompt = document.createElement("p");
    prompt.innerHTML = "<strong>" + data["prompt"] + "</strong>";

    box.append(prompt);

    box.append(document.createElement("br"));

    let metaphor = document.createElement("p");
    metaphor.innerHTML = data["subtopic_metaphor"];

    box.append(metaphor);
    subSubTopicHolderSelector.append(box);
}


/**
 * Add sub-sub topic metaphor box
 * @param data
 */
function addSubSubTopicMetaphor(data) {
    const subSubTopicExpHolderSelector = document.getElementById("subSubTopicExpHolder");

    let box = document.createElement("div");
    box.classList.add("box");
    box.id = "subsubTopicExpHolderBox";

    let prompt = document.createElement("p");
    prompt.innerHTML = "<strong>" + data["prompt"] + "</strong>";

    box.append(prompt);

    box.append(document.createElement("br"));

    let metaphor = document.createElement("p");
    metaphor.innerHTML = data["subsubtopicExplanation"];

    box.append(metaphor);
    subSubTopicExpHolderSelector.append(box);
}


/**
 * Generate the subtopic box with user chosen subtopic
 * @param complete_subtopic
 */
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


/**
 *
 * @param complete_subsubtopic
 */
function createSubSubTopicExplanation(complete_subsubtopic) {
    const subsubHolderSelector = document.getElementById("subSubTopicExpHolder");

    let box = document.createElement("div");
    box.classList.add("box");
    box.id = "subSubTopicHolderBox";

    let p = document.createElement("p");
    p.innerHTML = "Sub-subtopic chosen: <strong>" + complete_subsubtopic + "</strong>";

    box.append(p);

    subsubHolderSelector.append(box);
}


/**
 * Add dropdown event handler
 * @param dropDownSelector
 */
function addDropDown(dropDownSelector) {
    dropDownSelector.addEventListener('click', function (event) {

        //event.stopPropagation() - it stops the bubbling of an event to parent elements, by preventing parent event handlers from being executed
        event.stopPropagation();

        //classList.toggle - it toggles between adding and removing a class name from an element
        dropDownSelector.classList.toggle('is-active');
    });
}

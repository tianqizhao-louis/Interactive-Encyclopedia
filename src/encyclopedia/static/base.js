$(document).ready(function () {

    $("#select-topic-button").click(function () {
		selectTopic()
	})
    $("#list-subtopic-button").click(function () {
		listSubtopics()
	})
    $("#select-subtopic-button").click(function () {
		selectSubtopic()
	})
    $("#list-subsubtopic-button").click(function () {
		listSubsubtopics()
	})
    $("#select-subsubtopic-button").click(function () {
		selectSubsubtopic()
	})
    $("#followup-button").click(function () {
		followup()
	})

})


//select topic
function selectTopic() {
    $("#select-topic-button").addClass('is-loading')

	let topic = $("#topic-input").val()
    
	$.ajax({
		url: "/explain_topic",
		type: "POST",
		contentType: "application/json; charset=utf-8",
		data: JSON.stringify({"topic": topic}),
		dataType: "json",
		success: function (data, textStatus, jqXHR) {
            $("#select-topic-button").removeClass('is-loading')
			let prompt = data['prompt']
			let topicExplanation = data['topicExplanation']
			console.log("prompt:", prompt," topicExplanation:",topicExplanation)

            $("#topic-explanation").text(topicExplanation)

			// $("#topic-input").val("")
		},
		error: function (jqXHR, textStatus, errorThrown) {
			alert("error: " + errorThrown);
		}
	});
}

// list subtopics
function listSubtopics() {
    $("#list-subtopic-button").addClass('is-loading')

	$.ajax({
		url: "/list_subtopics",
		type: "POST",
		contentType: "application/json; charset=utf-8",
		data: JSON.stringify({}),
		dataType: "json",
		success: function (data, textStatus, jqXHR) {
            $("#list-subtopic-button").removeClass('is-loading')
			$("#subtopics-list").html("")

			let prompt = data['prompt']
			let subtopicList = data['subtopicList']
			let pureSubtopics = data['pureSubtopics']
			console.log("prompt:", prompt," subtopicList:",subtopicList, " pureSubtopics:",pureSubtopics)

			jsonStringSubtopicList = JSON.stringify(subtopicList)
			var objSubtopicList = JSON.parse(jsonStringSubtopicList)

			for (i=0; i < objSubtopicList.length; i++) {
				let subtopicRow = $("<pre>", { "id": "subtopic"+ i})
				subtopicRow.text(objSubtopicList[i])
				$("#subtopics-list").append(subtopicRow)
			 }			 

			// subtopicList.array.forEach(element => {
			// 	let subtopicRow = $("<pre>", { "class": "", "id": "" });
			// 	$("#subtopics-list").append(subtopicRow)
			// });

            // $("#subtopics-list").text(subtopicListStr)
			
		},
		error: function (jqXHR, textStatus, errorThrown) {
			alert("error: " + errorThrown);
		}
	});
}


//select subtopic
function selectSubtopic() {
    $("#select-subtopic-button").addClass('is-loading')

	let subtopic = $("#subtopic-input").val()

	$.ajax({
		url: "/explain_subtopic",
		type: "POST",
		contentType: "application/json; charset=utf-8",
		data: JSON.stringify({"subtopic": subtopic}),
		dataType: "json",
		success: function (data, textStatus, jqXHR) {
            $("#select-subtopic-button").removeClass('is-loading')
			let prompt = data['prompt']
			let subtopicExplanation = data['subtopicExplanation']
			console.log("prompt:", prompt," subtopicExplanation:",subtopicExplanation)

            $("#subtopic-explanation").text(subtopicExplanation)

			// $("#subtopic-input").val("")
		},
		error: function (jqXHR, textStatus, errorThrown) {
			alert("error: " + errorThrown);
		}
	});
}

// list subsubtopics
function listSubsubtopics() {
    $("#list-subsubtopic-button").addClass('is-loading')

	$.ajax({
		url: "/list_subsubtopics",
		type: "POST",
		contentType: "application/json; charset=utf-8",
		data: JSON.stringify({}),
		dataType: "json",
		success: function (data, textStatus, jqXHR) {
            $("#list-subsubtopic-button").removeClass('is-loading')
			$("#subsubtopics-list").html("")
			let prompt = data['prompt']
			let subsubtopicList = data['subsubtopicList']
			let pureSubsubtopics = data['pureSubsubtopics']
			console.log("prompt:", prompt," subsubtopicList:",subsubtopicList, " pureSubsubtopics:", pureSubsubtopics)

            jsonStringSubsubtopicList = JSON.stringify(subsubtopicList)
			var objSubsubtopicList = JSON.parse(jsonStringSubsubtopicList)

			for (i=0; i < objSubsubtopicList.length; i++) {
				let subsubtopicRow = $("<pre>", { "id": "subsubtopic"+ i})
				subsubtopicRow.text(objSubsubtopicList[i])
				$("#subsubtopics-list").append(subsubtopicRow)
			 }		
		},
		error: function (jqXHR, textStatus, errorThrown) {
			alert("error: " + errorThrown);
		}
	});
}

//select subsubtopic
function selectSubsubtopic() {
    $("#select-subsubtopic-button").addClass('is-loading')

	let subsubtopic = $("#subsubtopic-input").val()

	$.ajax({
		url: "/explain_subsubtopic",
		type: "POST",
		contentType: "application/json; charset=utf-8",
		data: JSON.stringify({"subsubtopic": subsubtopic}),
		dataType: "json",
		success: function (data, textStatus, jqXHR) {
            $("#select-subsubtopic-button").removeClass('is-loading')
			let prompt = data['prompt']
			let subsubtopicExplanation = data['subsubtopicExplanation']
			console.log("prompt:", prompt," subsubtopicExplanation:",subsubtopicExplanation)

            $("#subsubtopic-explanation").text(subsubtopicExplanation)

			// $("#subsubtopic-input").val("")
		},
		error: function (jqXHR, textStatus, errorThrown) {
			alert("error: " + errorThrown);
		}
	});
}

//followup
function followup() {
    $("#followup-button").addClass('is-loading')
    
	let question = $("#followup-input").val()

	$.ajax({
		url: "/followup",
		type: "POST",
		contentType: "application/json; charset=utf-8",
		data: JSON.stringify({"question": question}),
		dataType: "json",
		success: function (data, textStatus, jqXHR) {
            $("#followup-button").removeClass('is-loading')
			let question = data['question']
			let answer = data['answer']
			console.log("question:", prompt," answer:",answer)

            $("#followup-answer").text(answer)

			// $("#followup-input").val("")
		},
		error: function (jqXHR, textStatus, errorThrown) {
			alert("error: " + errorThrown);
		}
	});
}
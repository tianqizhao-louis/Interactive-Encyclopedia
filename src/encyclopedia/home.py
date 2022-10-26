from flask import Flask
from flask import (
    Blueprint, flash, g, redirect, render_template, request, url_for
)
from flask import Response, request, jsonify

import openai
# import textwrap as tw
import re
# from pprint import pprint

openai.api_key = "Your key"

bp = Blueprint('home', __name__)


@bp.route('/')
def index():
    return render_template('home.html')

# explain topic route
@bp.route('/explain_topic', methods = ['GET', 'POST'])
def explainTopic():
    # json_data = request.get_json()
    global topic
    topic = request.get_json()['topic']
    prompt = f'For a 5 years old kid, explain what {topic} is'
    completion = openai.Completion.create(engine="text-davinci-002",max_tokens=256,prompt=prompt)

    topicExplanation = completion.choices[0].text.strip()
    to_return = {'prompt': prompt, 'topicExplanation':topicExplanation}
    return jsonify(to_return)


# list subtopics
@bp.route('/list_subtopics', methods = ['GET', 'POST'])
def listSubTopicWithTopic():
    prompt = f'''List 8 subtopics related to {topic} with brief explanation. Each in the form:
    subtopic: explanation
    1.
    '''
    completion = openai.Completion.create(engine="text-davinci-002",max_tokens=256,temperature=0.7,prompt=prompt)
    result = completion.choices[0].text.strip()
    global subtopicList
    subtopicList = re.split(r'\d\. ', result)
    while len(subtopicList) < 8:
        completion = openai.Completion.create(engine="text-davinci-002",max_tokens=256,temperature=0.7,prompt=prompt)
        result = completion.choices[0].text.strip()
        subtopicList = re.split(r'\d\. ', result)
    if(subtopicList[0]==''):
        subtopicList = subtopicList[1:]
    
    subtopicListStr = ''
    for index, subtopic in enumerate(subtopicList):
        subtopicListStr += f'{index+1}.{subtopic.strip()}\n'
    
    to_return = {'prompt': prompt, 'subtopicListStr':subtopicListStr}
    return jsonify(to_return)

# explain subtopic route
@bp.route('/explain_subtopic', methods = ['GET', 'POST'])
def explainSubtopic():
    # json_data = request.get_json()
    global subtopic
    subtopicIndex = int(request.get_json()['subtopic'])
    subtopic = re.split(r':',subtopicList[subtopicIndex-1])[0]
    
    prompt = f'For a 5 years old kid, explain what {subtopic} in {topic} is with an metaphor.'
    completion = openai.Completion.create(engine="text-davinci-002",max_tokens=256,temperature=0.7,prompt=prompt)

    subtopicExplanation = completion.choices[0].text.strip()

    to_return = {'prompt': prompt, 'subtopicExplanation':subtopicExplanation}
    return jsonify(to_return)

# list subsubtopics
@bp.route('/list_subsubtopics', methods = ['GET', 'POST'])
def listSubsubTopicWithTopic():
    global subtopic
    prompt = f'''List 8 subtopics related to {subtopic} in {topic} with brief explanation. Each in the form:
    subsubtopic: explanation
    1.
    '''
    completion = openai.Completion.create(engine="text-davinci-002",max_tokens=256,temperature=0.7,prompt=prompt)
    result = completion.choices[0].text.strip()
    global subsubtopicList
    subsubtopicList = re.split(r'\d\. ', result)
    while len(subsubtopicList) < 8 or ("?" in subsubtopicList[1]):
        completion = openai.Completion.create(engine="text-davinci-002",max_tokens=256,temperature=0.7,prompt=prompt)
        result = completion.choices[0].text.strip()
        subsubtopicList = re.split(r'\d\. ', result)
    if(subsubtopicList[0]==''):
        subsubtopicList = subsubtopicList[1:]
    
    subsubtopicListStr = ''
    for index, subtopic in enumerate(subsubtopicList):
        subsubtopicListStr += f'{index+1}.{subtopic.strip()}\n'
    
    to_return = {'prompt': prompt, 'subsubtopicListStr':subsubtopicListStr}
    return jsonify(to_return)

# explain subsubtopic route
@bp.route('/explain_subsubtopic', methods = ['GET', 'POST'])
def explainSubsubtopic():
    # json_data = request.get_json()
    global subsubtopic
    subsubtopicIndex = int(request.get_json()['subsubtopic'])
    subsubtopic = re.split(r':',subsubtopicList[subsubtopicIndex-1])[0]
    
    prompt = f"For {subtopic} in {topic}, explain what {subsubtopic} is with an metaphor for a five years old kid."
    completion = openai.Completion.create(engine="text-davinci-002",max_tokens=256,temperature=0.7,prompt=prompt)

    subsubtopicExplanation = completion.choices[0].text.strip()

    to_return = {'prompt': prompt, 'subsubtopicExplanation':subsubtopicExplanation}
    return jsonify(to_return)

#followup question
@bp.route('/followup', methods = ['GET', 'POST'])
def followupQuestion():
    question = request.get_json()['question']
    prompt = f"For {subsubtopic} in {subtopic} in {topic}, explain with metaphor for a five years old kid:  \"{question}\""
    completion = openai.Completion.create(engine="text-davinci-002",max_tokens=256,temperature=0.7,prompt=prompt)

    result = completion.choices[0].text.strip()
    to_return = {'question': prompt, 'answer':result}
    return jsonify(to_return)
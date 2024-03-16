from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
from transformers import AutoModelForSeq2SeqLM
from IndicTransTokenizer import IndicProcessor, IndicTransTokenizer
import easyocr
import cv2
import base64
import numpy as np
import os
from embedchain import App
import json
import joblib

os.environ["HUGGINGFACE_ACCESS_TOKEN"] = "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"
embedchain_app = App.from_config("mistral.yaml")


app = Flask(__name__)
CORS(app)

reader = easyocr.Reader(['en'], model_storage_directory='easyocr-models')

tokenizer = IndicTransTokenizer(direction="en-indic")
ip = IndicProcessor(inference=True)
model = AutoModelForSeq2SeqLM.from_pretrained("ai4bharat/indictrans2-en-indic-dist-200M", trust_remote_code=True)

languages = {
    "asm_Beng": "Assamese",
    "kas_Arab": "Kashmiri (Arabic)",
    "pan_Guru": "Punjabi",
    "ben_Beng": "Bengali",
    "kas_Deva": "Kashmiri (Devanagari)",
    "san_Deva": "Sanskrit",
    "brx_Deva": "Bodo",
    "mai_Deva": "Maithili",
    "sat_Olck": "Santali",
    "doi_Deva": "Dogri",
    "mal_Mlym": "Malayalam",
    "snd_Arab": "Sindhi (Arabic)",
    "eng_Latn": "English",
    "mar_Deva": "Marathi",
    "snd_Deva": "Sindhi (Devanagari)",
    "gom_Deva": "Konkani",
    "mni_Beng": "Manipuri (Bengali)",
    "tam_Taml": "Tamil",
    "guj_Gujr": "Gujarati",
    "mni_Mtei": "Manipuri (Meitei)",
    "tel_Telu": "Telugu",
    "hin_Deva": "Hindi",
    "npi_Deva": "Nepali",
    "urd_Arab": "Urdu",
    "kan_Knda": "Kannada",
    "ory_Orya": "Odia",
}


#For languages list
@app.route('/languages', methods=['GET'])
def get_languages():
    return jsonify(languages)

# For Prescription reading: Image to text
@app.route('/upload', methods=['POST'])
def upload():
    try:
        image_data = request.json['imageData']
        img_array = np.frombuffer(base64.b64decode(image_data.split(',')[1]), dtype=np.uint8)
        img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
        result = reader.readtext(img)
        ocr_text = ' '.join([detection[1] for detection in result])
        return jsonify({'success': True, 'text': ocr_text})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

# Queries from prescription
@app.route('/query', methods=['POST'])
def query():
    try:
        data = request.get_json()
        ocr = "Prescription to be analysed, give analysis on this report: " + data.get('ocr', '')
        prompt = data.get('prompt', '')
        embedchain_app.add(ocr, data_type='text')
        result = embedchain_app.query(prompt)
        answer_index = result.find("Answer")
        if answer_index != -1:
            embedchain_result = result[answer_index + len("Answer: "):]
        else:
            embedchain_result = result
        return jsonify({"answer": embedchain_result})
    except Exception as e:
        return jsonify({"error": str(e)})


@app.route('/translated_query', methods=['POST'])
def translated_query():
    try:
        data = request.get_json()
        ocr = "Prescription to be analysed, give analysis on this report: " + data.get('ocr', '')
        embedchain_app.add(ocr, data_type='text')
        input_text =  data.get('prompt', '')
        src_lang = data.get('src_lang', 'hin_Deva') 
        tgt_lang = 'eng_Latn'

        # Translate input text to English
        batch = ip.preprocess_batch([input_text], src_lang=src_lang, tgt_lang=tgt_lang)
        batch = tokenizer(batch, src=True, return_tensors="pt")

        with torch.inference_mode():
            translated_input = model.generate(**batch, num_beams=5, num_return_sequences=1, max_length=256)

        translated_input = tokenizer.batch_decode(translated_input, src=False)[0]

        # Query Mistral with translated input
        text = "Just give me a brief answer, just the answer part for: "
        prompt = text + translated_input
        result = embedchain_app.query(prompt)
        answer_index = result.find("Answer")
        if answer_index != -1:
            embedchain_result = result[answer_index + len("Answer: "):]
        else:
            embedchain_result = result

        # Translate Mistral result to the original source language
        batch = ip.preprocess_batch([embedchain_result], src_lang=tgt_lang, tgt_lang=src_lang)
        batch = tokenizer(batch, src=True, return_tensors="pt")

        with torch.inference_mode():
            translated_result = model.generate(**batch, num_beams=5, num_return_sequences=1, max_length=256)

        translated_result = tokenizer.batch_decode(translated_result, src=False)[0]

        # Postprocess the translated result
        translated_result = ip.postprocess_batch([translated_result], lang=src_lang)
        print(translated_result)
        return jsonify({'answer': translated_result})
    except Exception as e:
        return jsonify({"error": str(e)})
    

# List of Lab Tests based on the prompt    
@app.route('/test', methods=['POST'])
def test():
    embedchain_app.add("https://medlineplus.gov/lab-tests/")
    data = request.get_json()
    prompt = " Give me a list of 10 tests i should take based on the website. Just a numbered list, no text without any explanation. Just a list"
    prompt_2 = data.get('prompt_2', '') + prompt
    result = embedchain_app.query(prompt_2)

    tests_suggested = [line.split(".")[1].strip() for line in result.split("\n") if len(line.split(".")) > 1 and line.strip()]
    tests_dict = {"tests": [{"test_name": test} for test in tests_suggested]}
    tests_json_str = json.dumps(tests_dict, indent=2)
    file_path = os.path.join(os.path.dirname(__file__), 'lab_test.json')
    with open(file_path, 'r') as file:
        lab_tests_data = json.load(file)

    def get_test_details(test_name):
        for test in lab_tests_data['tests']:
            if test['test_name'] == test_name:
                return test
        return None
    
    tests_json = json.loads(tests_json_str)
    tests_details = [get_test_details(test['test_name']) for test in tests_json['tests'] if get_test_details(test['test_name']) is not None]
    test_details = json.dumps(tests_details, indent=2)
    response_data = {
        "result": result,
        "test_details": tests_details,
    }

    return jsonify(response_data)

# To get user information
@app.route('/info', methods=['POST'])
def info():
    data = request.get_json()
    name = data.get('name', '')
    location = data.get('location', '')
    response_data = {
        'name': name,
        'location': location
    }
    
    return jsonify(response_data)


if __name__ == '__main__':
    app.run(debug=True)
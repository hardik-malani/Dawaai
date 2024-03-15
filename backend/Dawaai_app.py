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
        return jsonify({"answer": result})
    except Exception as e:
        return jsonify({"error": str(e)})



if __name__ == '__main__':
    app.run(debug=True)
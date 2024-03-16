from keras.preprocessing.image import img_to_array
import imutils
import cv2
from keras.models import load_model
import numpy as np
import keras.backend as K
import time
import tensorflow as tf
from flask import Flask, Response, render_template
from matplotlib.figure import Figure
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
import matplotlib.pyplot as plt
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

camera = cv2.VideoCapture(0)
face_detection = cv2.CascadeClassifier('haarcascade_files/haarcascade_frontalface_default.xml')
emotion_classifier = load_model('models/best_model/MUL_KSIZE_MobileNet_v2_best.hdf5', compile=False, custom_objects={'tf': tf})
EMOTIONS = ["angry", "disgust", "scared", "happy", "sad", "surprised", "neutral"]


def gen_frames():
    while True:
        start = time.time()
        ret, frame = camera.read()
        frame = imutils.resize(frame, width=300)
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_detection.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30), flags=cv2.CASCADE_SCALE_IMAGE)
        
        canvas = np.zeros((250, 300, 3), dtype="uint8")
        frameClone = frame.copy()
        if len(faces) > 0:
            faces = sorted(faces, reverse=True, key=lambda x: (x[2] - x[0]) * (x[3] - x[1]))[0]
            (fX, fY, fW, fH) = faces
            
            roi = gray[fY:fY + fH, fX:fX + fW]
            roi = cv2.resize(roi, (48, 48))
            roi = roi.astype("float") / 255.0
            roi = img_to_array(roi)
            roi = np.expand_dims(roi, axis=0)
            
            preds = emotion_classifier.predict(roi)[0]
            emotion_probability = np.max(preds)
            label = EMOTIONS[preds.argmax()]

            for (i, (emotion, prob)) in enumerate(zip(EMOTIONS, preds)):
                text = "{}: {:.2f}%".format(emotion, prob * 100)
                w = int(prob * 300)
                cv2.rectangle(canvas, (7, (i * 35) + 5), (w, (i * 35) + 35), (0, 0, 255), -1)
                cv2.putText(canvas, text, (10, (i * 35) + 23), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (255, 255, 255), 2)
                cv2.putText(frameClone, label, (fX, fY - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 0, 255), 2)
                cv2.rectangle(frameClone, (fX, fY), (fX + fW, fY + fH), (0, 0, 255), 2)

        end = time.time()
        seconds = end - start
        if seconds == 0:
            fps = 0
        else:
            fps = 1 / seconds

        cv2.putText(frameClone, "FPS: " + str('%.0f' % fps), (5, 15), cv2.FONT_HERSHEY_TRIPLEX, 0.5, (0, 0, 255), lineType=cv2.LINE_AA)    


        ret, buffer = cv2.imencode('.jpg', frameClone)
        frame = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
        


@app.route('/video_feed')
def video_feed():
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')


# # Define the emotion labels
# emotion_labels = {0: "Angry", 1: "Disgust", 2: "Fear", 3: "Happy", 4: "Sad", 5: "Surprise", 6: "Neutral"}

# @app.route('/predict2', methods=['POST'])
# def predict_emotion2():
#     # Get the ECG signal data from the request
#     ecg_signal = request.json['ecg_signal']
#     # Convert the ECG signal to a numpy array
#     ecg_array = np.array(ecg_signal)
#     # Reshape the ECG array to match the expected input shape of the model
#     ecg_array = ecg_array.reshape(1, -1)
#     # Make a prediction
#     prediction = model.predict(ecg_array)[0]
#     # Get the corresponding emotion label
#     emotion_label = emotion_labels[prediction]
#     # Return the predicted emotion
#     return jsonify({'emotion': emotion_label})


# @app.route('/predict', methods=['POST'])
# def predict_emotion():
#     json_data = request.get_json()
#     ecg_signal = json_data.get('ecg_signal')

#     if ecg_signal == "your_ecg_data_here":
#         emotion = "Happy"
#     else:
#         emotion = "Unknown"

#     return jsonify({'emotion': emotion})

if __name__ == '__main__':
    app.run(host= '0.0.0.0', debug=True)

from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from inference_sdk import InferenceHTTPClient
import io
from collections import defaultdict

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with specific origins for better security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

waste_classification = {
    "cardboard boxes": "Biodegradable",
    "glass bottles": "NonBiodegradable but Recyclable",
    "glass shards": "NonBiodegradable but Recyclable",
    "jug": "NonBiodegradable but Recyclable",
    "metal can": "NonBiodegradable but Recyclable",
    "other plastic": "NonBiodegradable and Non-Recyclable",
    "paper": "Biodegradable",
    "paper bag": "Biodegradable",
    "paper carton": "Biodegradable",
    "paper cup": "Biodegradable",
    "plastic bottle": "NonBiodegradable but Recyclable",
    "plastic cap": "NonBiodegradable but Recyclable",
    "plastic cup": "NonBiodegradable and Non-Recyclable",
    "plastic utensils": "NonBiodegradable and Non-Recyclable",
    "plastic bag": "NonBiodegradable and Non-Recyclable",
    "styrofoam": "NonBiodegradable and Non-Recyclable",
    "unlabeled": "NonBiodegradable and Non-Recyclable",
    "food waste": "Biodegradable"
}

@app.post("/waste_classification")
async def detect_doors(image: UploadFile = File(...)):
    image_bytes = await image.read()
    CLIENT = InferenceHTTPClient(
        api_url="https://classify.roboflow.com",
        api_key="umOiGbjhCrKijvMJwo1H"
    )
    img = Image.open(io.BytesIO(image_bytes))
    pred_class = defaultdict()
    result = CLIENT.infer(img, model_id="waste-classification-rjo28/2")
    for prediction in result['predicted_classes']:
        pred_class[prediction] = waste_classification[str(prediction).lower()]
    return JSONResponse(content={"prediction": pred_class})

from transformers import BlipProcessor, BlipForConditionalGeneration
from transformers import AutoModelForCausalLM, AutoTokenizer
from PIL import Image
import torch
import google.generativeai as genai
import pandas as pd
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse
import io

processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")

# 이미지 불러오기
#image = Image.open("test.jpg").convert("RGB")  # 로컬 이미지 경로

# 프롬프트 설정: "이미지를 묘사해줘"
#inputs = processor(images=image, return_tensors="pt")
#with torch.no_grad():
#    out = model.generate(**inputs)

# 결과 출력
#caption = processor.tokenizer.decode(out[0], skip_special_tokens=True)
#print("이미지 설명:", caption)
#sentence = caption

# CSV 파일 읽기
df = pd.read_csv('Top100.csv', encoding='utf-8-sig')
song_pairs = list(zip(df['artist'], df['title']))
song_pairs_str = str(song_pairs)
cleaned_song_pairs_str = song_pairs_str.replace("\\'", "'")

genai.configure(api_key="AIzaSyA4eswTzvl7mBYEhaQK4FCOUsT8QwnBiYU")
model_inference = genai.GenerativeModel('gemini-1.5-flash')

app = FastAPI()
@app.post("/analyze/")
async def analyze_image(image: UploadFile = File(...),feeling: str = Form(...), mood: str = Form(...)):
    # 이미지 로딩
    image_bytes = await image.read()
    pil_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    # 이미지 캡셔닝
    inputs = processor(images=pil_image, return_tensors="pt")
    with torch.no_grad():
        out = model.generate(**inputs)
    caption = processor.tokenizer.decode(out[0], skip_special_tokens=True)
    
    # Gemini 프롬프트 생성
    prompt = f'From this Sentence, Mood, and Feeling, Select 5 component which is most proper from List. Do not give any sentence, only give elements. \n \n Sentence : {caption} \n \n Mood : {mood} \n \n Feeling : {feeling} \n \n List : ' + cleaned_song_pairs_str

    # Gemini 응답 생성
    response = model_inference.generate_content(prompt)

    return JSONResponse(content={"response": response.text})

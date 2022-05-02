from turtle import back
from back.tf_code_generator import tf_Code_generator
from fastapi import FastAPI, Body
from fastapi.staticfiles import StaticFiles
from starlette.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import ast
import random
import back.tf_code_generator as tf
import back.pytorch_code_generator as pt

app = FastAPI()

app.mount("/front", StaticFiles(directory="front/public", html=True), name="front")
app.mount("/build", StaticFiles(directory="front/public/build"), name="build")

@app.get('/')
async def front():
   return RedirectResponse(url='front')

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/generate_tensor/")
async def generate_tensor(network: List[List[int]] = Body(...)) -> str:
    # return network
    f = open("tf.py", "a")
    # f.write(tf.tf_Code_generator(network))
    # f.close()
    return tf.tf_Code_generator(network)

@app.post("/generate_pytorch/")
async def generate_pytorch(network: List[List[int]] = Body(...)) -> str:
    # return network
    f = open("tf.py", "a")
    # f.write(tf_Code_generator(network))
    # f.close()
    return pt.torch_Code_generator(network)
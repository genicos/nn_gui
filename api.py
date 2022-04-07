from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from starlette.responses import RedirectResponse
import random

app = FastAPI()

app.mount("/front", StaticFiles(directory="front/public", html=True), name="front")
app.mount("/build", StaticFiles(directory="front/public/build"), name="build")

@app.get("/rand")
async def hello():
   return random.randint(0, 100)

@app.get('/')
async def front():
   return RedirectResponse(url='front')
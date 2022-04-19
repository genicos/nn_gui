from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from starlette.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
import ast
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

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# @app.post("/net/{data}")
# async def get_network(data : str):
#    print("I got")
#    print(data)
#    return data

# print("WHATA")

def tf_Code_generator(l):
    final_String = ""
    operate_type = {0:'Dense', 1:'Conv2D', 2:'relu', 3:'softmax', 4:'MaxPool'}
    l = ast.literal_eval(l)                                                      # turns the inputted string into a list
    headerString = "import tensorflow as tf \nfrom tensorflow import keras\n\n"
    final_String += headerString

    # f = open("tf.py", "w")
    # f.write(headerString)
    # f.close()


    # f = open("tf.py", "a")
    # f.write("model = tf.keras.Sequential([\n")
    final_String += "model = tf.keras.Sequential([\n"
    FlattenFlag = 0
    for i in range(len(l)):
        if (l[i][0] == 0): # if Dense
            if (FlattenFlag == 1):
                FlattenFlag = 0
                # f.write("   tf.keras.layers.Flatten(),\n")
                final_String+= "   tf.keras.layers.Flatten(),\n"
                
                
            if (i == 0): # for first hidden layer
                # f.write("   tf.keras.layers.Flatten(),\n")
                final_String += "   tf.keras.layers.Flatten(),\n"
                # f.write("   tf.keras.layers.Dense("+str(l[i][2])+", input_shape=("+str(l[i][1])+",), activation='"+str(operate_type[l[i][3]])+"'),\n")
                final_String += "   tf.keras.layers.Dense("+str(l[i][2])+", input_shape=("+str(l[i][1])+",), activation='"+str(operate_type[l[i][3]])+"'),\n"
                FlattenFlag = 0
            else:
                # f.write("   tf.keras.layers.Dense("+str(l[i][2])+", activation='"+str(operate_type[l[i][3]])+"'),\n")
                final_String += "   tf.keras.layers.Dense("+str(l[i][2])+", activation='"+str(operate_type[l[i][3]])+"'),\n"
        
        if(l[i][0] == 1): # if Conv2D
            convString = "   tf.keras.layers.Conv2D("+str(l[i][1])+ ", kernel_size="+str(l[i][-1])+", activation='"+str(operate_type[l[i][3]])+"'),\n"
            # f.write(convString)
            final_String+=convString
            FlattenFlag = 1
        if (l[i][0]==4): # if MaxPool
            maxPoolString = "   tf.keras.layers.MaxPool2D(pool_size="+l[i][-1]+"),\n"
            # f.write(maxPoolString)
            final_String+=maxPoolString
                
    # f.write("])")
    final_String += "])"
    # f.close()
    return final_String

@app.get("/generate_tensor")
async def generate_tensor(network: str):
    return tf_Code_generator(network)
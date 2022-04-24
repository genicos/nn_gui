def tf_Code_generator(l):
    final_String = ""
    headerString = "import tensorflow as tf \nfrom tensorflow import keras\n\n"
    final_String += headerString

    f = open("tf.py", "w")
    f.write(headerString)
    f.close()


    f = open("tf.py", "a")
    f.write("model = tf.keras.Sequential([\n")
    final_String += "model = tf.keras.Sequential([\n"
    FlattenFlag = 0
    for i in range(len(l)):
        if (l[i][0] == 0): # if Dense
            if (FlattenFlag == 1):
                FlattenFlag = 0
                f.write("   tf.keras.layers.Flatten(),\n")
                final_String+= "   tf.keras.layers.Flatten(),\n"
                
                
            if (i == 0): # for first hidden layer
                f.write("   tf.keras.layers.Flatten(),\n")
                final_String += "   tf.keras.layers.Flatten(),\n"
                f.write("   tf.keras.layers.Dense("+str(l[i][2])+", input_shape=("+str(l[i][1])+",), activation='"+str(operate_type[l[i][3]])+"'),\n")
                final_String += "   tf.keras.layers.Dense("+str(l[i][2])+", input_shape=("+str(l[i][1])+",), activation='"+str(operate_type[l[i][3]])+"'),\n"
                FlattenFlag = 0
            else:
                f.write("   tf.keras.layers.Dense("+str(l[i][2])+", activation='"+str(operate_type[l[i][3]])+"'),\n")
                final_String += "   tf.keras.layers.Dense("+str(l[i][2])+", activation='"+str(operate_type[l[i][3]])+"'),\n"
        
        if(l[i][0] == 1): # if Conv2D
            convString = "   tf.keras.layers.Conv2D("+str(l[i][1])+ ", kernel_size="+str(l[i][-1])+", activation='"+str(operate_type[l[i][3]])+"'),\n"
            f.write(convString)
            final_String+=convString
            FlattenFlag = 1
        if (l[i][0]==4): # if MaxPool
            maxPoolString = "   tf.keras.layers.MaxPool2D(pool_size="+l[i][-1]+"),\n"
            f.write(maxPoolString)
            final_String+=maxPoolString
                
    f.write("])")
    final_String += "])"
    f.close()
    return final_String

def train_model(optimizer, loss):
    f = open("tf.py", "a")
    final_string = ""
    a = "\n\nmodel.compile(optimizer="
    final_string += a
    f.write(a)
    if (optimizer == "SGD"):
        final_string += "tf.keras.optimizers.SGD(learning_rate=1e-1),\n"
        f.write("tf.keras.optimizers.SGD(learning_rate=1e-1),\n")
    if (optimizer == "Adam"):
        final_string += "tf.keras.optimizers.Adam(learning_rate=1e-3),\n"
        f.write("tf.keras.optimizers.Adam(learning_rate=1e-3),\n")
    if (loss == "sparse_categorical_crossentropy"):
        a = "               loss='"+loss+"',\n"
        final_string += a
        f.write(a)
    f.write("               metrics=['accuracy'])")
    final_string+= "metrics=['accuracy'])"
    return final_string

    
    
        
        
    
    
    
    
    
if __name__ == "__main__":
    operate_type = {0:'Dense', 1:'Conv2D', 2:'relu', 3:'softmax', 4:'MaxPool'}
    layersDense = [[0,784,50,2], [0,50,30,2], [0,30,10,3]]
    #layersDense[0] = [operator_type, Input shape(prev layer input) ,Tensorshape(no.of neurons in layer), operation_type(activation)]


    layersConv = [[1, 24,00, 2, "(3,3)"], [4,00,00,00, "(2,2)"], [1, 36,00, 2, "(3,3)"], [4,00,00,00, "(2,2)"], [0,784,128,2], [0,128,10,2]]
    #layersDense[0] = [operator_type, num_filters, shape(prev layer input DC) , operation_type(activation), string(kernel size)/(pool_size)]

    a = tf_Code_generator(layersConv)
    print(a)
    
    optimizer = {0:'SGD', 1:'Adam'}
    loss = {0: 'sparse_categorical_crossentropy'}
    a = train_model(optimizer[1], loss[0])
    print(a)
    
            
        


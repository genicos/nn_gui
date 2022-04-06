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
    for i in range(len(l)):
        if (l[i][0] == 0): # if Dense
            if (i == 0): # for first hidden layer
                f.write("   tf.keras.layers.Flatten(),\n")
                final_String += "   tf.keras.layers.Flatten(),\n"
                f.write("   tf.keras.layers.Dense("+str(l[i][2])+", input_shape=("+str(l[i][1])+",), activation='"+str(operate_type[l[i][3]])+"'),\n")
                final_String += "   tf.keras.layers.Dense("+str(l[i][2])+", input_shape=("+str(l[i][1])+",), activation='"+str(operate_type[l[i][3]])+"'),\n"
            else:
                f.write("   tf.keras.layers.Dense("+str(l[i][2])+", activation='"+str(operate_type[l[i][3]])+"'),\n")
                final_String += "   tf.keras.layers.Dense("+str(l[i][2])+", activation='"+str(operate_type[l[i][3]])+"'),\n"
        
                
    f.write("])")
    final_String += "])"
    f.close()
    return final_String
    
    
    
    
if __name__ == "__main__":
    operate_type = {0:'Dense', 1:'Conv2D', 2:'relu', 3:'softmax'}
    layersDense = [[0,784,50,2], [0,50,30,2], [0,30,10,3]]
    #layersDense[0] = [operator_type, Input shape(prev layer input) ,Tensorshape(no.of neurons in layer), operation_type(activation)]


    layersConv = [[1,24,2, 3, "kernel size"], [1,50,30,2, ""], [0,30,10,3]]
    #print(layersConv[0])
    #layersDense[0] = [operator_type, Input shape(prev layer input) ,Tensorshape(number of filters), operation_type(activation), string(kernel size)]

    a = tf_Code_generator(layersDense)
    print(a)
            
        


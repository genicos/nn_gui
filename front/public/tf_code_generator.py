def tf_code_generator(l):
    operate_type = {1:'None', 2:'Dense', 3:'Conv2D', 4:"'relu'", 5:"'softmax'", 6:'MaxPool', 7:'ZeroPaddingLayer', 8:'BatchNormalization', 9:'AveragePooling2D', 10:'GlobalAveragePooling2D', 11:"Prelu", 12:"'sigmoid'", 13:"'softplus'", 14:"'swish'", 15:"'softsign'", 16:"'tanh'"}
    final_String = "def model():\n\n"

    final_String += "\tmodel = tf.keras.Sequential([\n"
    FlattenFlag = 0
    for i in range(len(l)):
        if (l[i][0] == 2): # if Dense
            if (FlattenFlag == 1):
                FlattenFlag = 0
                
                final_String+= "   \t\ttf.keras.layers.Flatten(),\n"
                
                
            if (i == 0): # for first hidden layer
                
                final_String += "   \t\ttf.keras.layers.Flatten(),\n"
                
                final_String += "   \t\ttf.keras.layers.Dense("+str(l[i][4])+", input_shape=("+str(l[i][2])+",), activation="+str(operate_type[l[i][6]])+"),\n"
                FlattenFlag = 0
            else:
                
                final_String += "   \t\ttf.keras.layers.Dense("+str(l[i][4])+", activation="+str(operate_type[l[i][6]])+"),\n"
        
        if(l[i][0] == 3): # if Conv2D
            convString = "   \t\ttf.keras.layers.Conv2D("+str(l[i][5].split(":")[1])+ ", kernel_size="+str(l[i][5].split(":")[0])+", activation="+str(operate_type[l[i][6]])+"),\n"
            final_String+=convString
            FlattenFlag = 1
        if (l[i][0]==6): # if MaxPool
            maxPoolString = "   \t\ttf.keras.layers.MaxPool2D(pool_size="+l[i][5].split(":")[0]+", strides="+l[i][5].split(":")[1]+"),\n"
            final_String+=maxPoolString
        if (l[i][0]==9): # if AveragePooling2D
            maxPoolString = "   \t\ttf.keras.layers.AveragePooling2D(pool_size="+l[i][5].split(":")[0]+", strides="+l[i][5].split(":")[1]+"),\n"
            final_String+=maxPoolString
        if (l[i][0]==10): # if GlobalAveragePooling2D
            maxPoolString = "   \t\ttf.keras.layers.GlobalAveragePooling2D(),\n"
            final_String+=maxPoolString
        if (l[i][0]==11): # if Prelu
            maxPoolString = "   \t\ttf.keras.layers.PReLU(),\n"
            final_String+=maxPoolString
        if (l[i][0]==1): # identity
            identString = "   \t\ttf.identity("+l[i][5]+"),\n"
            final_String+=identString
        if (l[i][0]==7): # ZeroPadding2D
            identString = "   \t\ttf.keras.layers.ZeroPadding2D(padding="+l[i][5].split(":")[0]+"),\n"
            final_String+=identString
        if (l[i][0]==8): # BatchNormalization
            identString = "   \t\ttf.keras.layers.BatchNormalization("+"),\n"
            final_String+=identString
    
    final_String += "\t])\n"
    final_String += "\treturn model"
    
    return final_String

def tf_train_model(optimizer, loss):
    
    optimizer_selection = {6:'SGD', 0:'Adam', 2:"Adadelta", 3:"Adagrad", 4:"Adamax", 5:"RMSprop", 1:"Nadam"}
    loss_selection = {0:"CategoricalCrossentropy", 1:"MeanAbsoluteError", 2:"Hinge", 3:"huber", 4:"MeanSquaredError"}

    optimizer = optimizer_selection[optimizer]
    loss = loss_selection[loss]

    final_string = "\ndef compile_model(model):"
    a = "\n\n\tmodel.compile(optimizer="
    final_string += a
    
    if (optimizer == "SGD"):
        final_string += "tf.keras.optimizers.SGD(learning_rate=1e-1),\n"
        
    if (optimizer == "Adam"):
        final_string += "tf.keras.optimizers.Adam(learning_rate=1e-3),\n"
        
    if (optimizer == "Adadelta"):
        final_string += "tf.keras.optimizers.Adadelta(learning_rate=1e-3),\n"
        
    if (optimizer == "Adagrad"):
        final_string += "tf.keras.optimizers.Adagrad(learning_rate=1e-3),\n"
        
    if (optimizer == "Adamax"):
        final_string += "tf.keras.optimizers.Adamax(learning_rate=1e-3),\n"
        
    if (optimizer == "RMSprop"):
        final_string += "tf.keras.optimizers.RMSprop(learning_rate=1e-3),\n"
        
    if (optimizer == "Nadam"):
        final_string += "tf.keras.optimizers.Nadam(learning_rate=1e-3),\n"
    

    # Loss

    if (loss == "CategoricalCrossentropy"):
        a = "               loss='"+loss+"',\n"
        final_string += a
        
    if (loss == "MeanAbsoluteError"):
        a = "               loss='"+loss+"',\n"
        final_string += a
        
    if (loss == "Hinge"):
        a = "               loss='"+loss+"',\n"
        final_string += a
        
    if (loss == "huber"):
        a = "               loss='"+loss+"',\n"
        final_string += a
        
    if (loss == "MeanSquaredError"):
        a = "               loss='"+loss+"',\n"
        final_string += a
    
    final_string+= "               metrics=['accuracy'])"
    return final_string

    
    
        
        
    
    
    
def previous_tf_code_generator(l):
    final_String = ""
    headerString = "import tensorflow as tf \nfrom tensorflow import keras\n\n"
    final_String += headerString

    operate_type = {0:'Dense', 1:'Conv2D', 2:'relu', 3:'softmax', 4:'MaxPool'}

    final_String += "model = tf.keras.Sequential([\n"
    FlattenFlag = 0
    for i in range(len(l)):
        if (l[i][0] == 0): # if Dense
            if (FlattenFlag == 1):
                FlattenFlag = 0
                final_String+= "   tf.keras.layers.Flatten(),\n"
                
                
            if (i == 0): # for first hidden layer
                final_String += "   tf.keras.layers.Flatten(),\n"
                final_String += "   tf.keras.layers.Dense("+str(l[i][2])+", input_shape=("+str(l[i][1])+",), activation='"+str(operate_type[l[i][3]])+"'),\n"
                FlattenFlag = 0
            else:
                final_String += "   tf.keras.layers.Dense("+str(l[i][2])+", activation='"+str(operate_type[l[i][3]])+"'),\n"
        
        if(l[i][0] == 1): # if Conv2D
            convString = "   tf.keras.layers.Conv2D("+str(l[i][1])+ ", kernel_size="+str(l[i][-1])+", activation='"+str(operate_type[l[i][3]])+"'),\n"
            
            final_String+=convString
            FlattenFlag = 1
        if (l[i][0]==4): # if MaxPool
            maxPoolString = "   tf.keras.layers.MaxPool2D(pool_size="+l[i][-1]+"),\n"
            
            final_String+=maxPoolString
                
    
    final_String += "])"
    
    return final_String



    
if __name__ == "__main__":
    operate_type = {0:'Dense', 1:'Conv2D', 2:'relu', 3:'softmax', 4:'MaxPool', 5:'sigmoid', 6:'softplus', 7:'swish', 8:'softsign', 9:'tanh', 10:'AveragePooling2D', 11:'GlobalAveragePooling2D'}
    #layersDense = [[0,784,50,2], [0,50,30,2], [0,30,10,3]]# layersDense = [[0,784,50,0,0,2]
    #layersDense[0] = [operator_type, Input shape(prev layer input) ,Tensorshape(no.of neurons in layer), operation_type(activation)]
    layersDense = [[2,[28,28],784,[50],50,"Misc",4], [2,[50],50,[30],30,"Misc",4], [2,[30],30,[10],10,"Misc",5]]
    
    # [1, 0,0,0, MISC(24 (3,3))]
    layersConv = [[1, 24,00, 2, "(3,3)"], [4,00,00,00, "(2,2)"], [1, 36,00, 2, "(3,3)"], [11,00,00,00, "(2,2)"], [0,784,128,2], [0,128,10,2]]
    layersConv = [[3,[28,28,1],784,[26,26,32],1875,"(3,3):24",4], [6,0,0,0,0,"(2,2):None"], [10,0,0,0,0,"None:False"], [2,[28,28],784,[128],128,"Misc",4], [7,[28,28],784,[128],128,"(1,1):",4], [8, "No one cares"]] 
    #None represents the strides for MaxPool2D
    #layersDense[0] = [operator_type, num_filters, shape(prev layer input DC) , operation_type(activation), string(kernel size)/(pool_size)]

    a = tf_code_generator(layersConv)
    print(a)
    optimizer = {6:'SGD', 0:'Adam', 2:"Adadelta", 3:"Adagrad", 4:"Adamax", 5:"RMSprop", 1:"Nadam"}
    loss = {0:"CategoricalCrossentropy", 1:"MeanAbsoluteError", 2:"Hinge", 3:"huber", 4:"MeanSquaredError"}

    # nico changed tf_train_model so that it just needs integers
    a = tf_train_model(6, 4)
    print(a)
    
            
        


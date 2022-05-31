def pytorch_code_generator(l, optimizer, loss):
    operate_type = {1:'Identity', 2:'Dense', 3:'Conv2D', 4:'ReLU', 5:'Softmax', 6:'MaxPool', 7:'ZeroPaddingLayer', 8:'BatchNormalization', 9:'AveragePooling2D', 10:'GlobalAveragePooling2D',12:'Sigmoid', 13:'Softplus', 14:'SiLU', 15:'Softsign', 16:'Tanh'}
    # Imports
    final_String = ""
    
    # Note: torch = pytorch 
    
    # Basic format for model in Pytorch
    final_String += "class Net(nn.Module):\n"
    final_String += "    def __init__(self):\n"
    
    final_String += "        super().__init__()\n"
    
    # Variables to keep track of certain things in model
    # Helps some of the logic
    kernel = 0 # saves kernel size as its adjusted throughout the layers
    
    prev_out = 1 # saves previous out channels, set to 1 for the start/first input
    
    prev_out_size = 1 # saves previous out size, set to input size for the start/first input
    if (len(l) > 0):
        prev_out_size = l[0][2]
    
    FlattenFlag = 0 # To determine if a flatten is needed
    Conv_prev = False # Keep track layer goes from Conv2D to Linear
    
    # For each input/layer
    for i in range(len(l)):
        if (l[i][0] == 2): # if Dense/Linear
            # Converts Conv2D output to Linear input
            if Conv_prev:
                # If input size is off review this!  Inputs reallly vary between Conv2D and Linear
                linearString = "        self.fc" + str(i) + " = nn.Linear(" +str(prev_out_size) + " * " + str(kernel) + " * " + str(kernel) + ", " +str(l[i][2])+ ")\n"
                Conv_prev = False
            else:
                linearString = "        self.fc" + str(i) + " = nn.Linear(" +str(prev_out_size) + ", " +str(l[i][4])+ ")\n"
            final_String += linearString
            
            # Saves previous output
            prev_out = l[i][2]
            
            activation = "        self.act" + str(i) + " = nn."+str(operate_type[l[i][6]])+"()\n"
            final_String += activation
            
        if(l[i][0] == 3): # if Conv2D
            # Done but may need adjustments in the future
            ConvString = "        self.conv" + str(i) + " = nn.Conv2d(" + str(prev_out) + ", " + str(l[i][5].split(":")[1]) +", kernel_size="+str(l[i][5].split(":")[0])+ ")\n"
            final_String+=ConvString
            
            K = str(l[i][5].split(":")[0])
            K = int(K[1])
            input = int(l[i][5].split(":")[1])
            kernel = input - K + 1
            prev_out = input
            
            Conv_prev = True
            
            activation = "        self.act" + str(i) + " = nn."+str(operate_type[l[i][6]])+"()\n"
            final_String += activation
            
            FlattenFlag = 1

        if (l[i][0]==6): # if MaxPool
            maxPoolString = "        self.pool" + str(i) + " = nn.MaxPool2d("+l[i][5].split(":")[0]+", stride="+l[i][5].split(":")[1]+"),\n"
            final_String+=maxPoolString
            kernel = int(kernel / 2)

        if (l[i][0]==9): # if AveragePooling2D
            final_String += "        self.pool" + str(i) + " = nn.AvgPool2d("+l[i][5].split(":")[0]+", stride="+l[i][5].split(":")[1]+"),\n"
            kernel = int(kernel / 2)

        if (l[i][0]==10): # if GlobalAveragePooling2D
            final_String  += "        self.pool" + str(i) + " = nn.AdaptiveAvgPool2d(1)\n"
        
        if (l[i][0]==11): # if PReLU
            final_String  += "        self.prelu" + str(i) + " = nn.PReLU()\n"
        
        if (l[i][0]==1): # identity
            final_String += "        self.id" + str(i) + " = nn.Identity(),\n"

        if (l[i][0]==7): # ZeroPadding2D
            final_String += "        self.pad" + str(i) +  " = nn.ZeroPad2d(" +l[i][5].split(":")[0] +")\n"
        
        if (l[i][0]==8): # BatchNormalization
            final_String += "        self.batch" + str(i) +  " = nn.BatchNorm2d(" + str(prev_out)+")\n"

    # Activation of layers and other stuff (pytorch requires these to be set in forward, hence why its formatted like this)
    final_String += "\n    def forward(self, x):\n"
    
    for i in range(len(l)):
        if (l[i][0] == 2): # if Dense/Linear
            
            if (i == 0): # for first hidden layer
                final_String += "        x = torch.flatten(x)\n"
                FlattenFlag = 0

            if (FlattenFlag == 1): # 
                final_String += "        x = torch.flatten(x)\n"
                FlattenFlag = 0

            final_String += "        x = self.act" + str(i) + "(self.fc"+ str(i) +"(x))\n"  

        if(l[i][0] == 3): # if Conv2D
            final_String += "        x = self.act" + str(i) + "(self.conv"+ str(i) +"(x))\n"  

        if (l[i][0]==6): # if MaxPool
            final_String += "        x = self.pool" + str(i) + "(x)\n"
            
        if (l[i][0]==9): # if AveragePooling2D
            final_String += "        x = self.pool" + str(i) + "(x)\n"

        if (l[i][0]==10): # if GlobalAveragePooling2D
            final_String += "        x = self.pool" + str(i) + "(x)\n"

        if (l[i][0]==11): # if PReLU
            final_String += "        x = self.prelu" + str(i) + "(x)\n"
            
        if (l[i][0]==1): # if identity
            final_String += "        x = self.id" + str(i) + "(x)\n"

        if (l[i][0]==7): # ZeroPadding2D
            final_String += "        x = self.pad" + str(i) + "(x)\n"
        
        if (l[i][0]==8): # BatchNormalization
            final_String += "        x = self.batch" + str(i) + "(x)\n"

    final_String += "        return x"

    # Saving this all to "net" as our model
    final_String += "\nnet = Net()\n"




    final_String +="\n"
    
    # Now adding optimizer and loss function

    optimizer_selection = {6:'SGD', 0:'Adam', 2:"Adadelta", 3:"Adagrad", 4:"Adamax", 5:"RMSprop", 1:"Nadam"}
    loss_selection = {0:"CategoricalCrossentropy", 1:"MeanAbsoluteError", 2:"Hinge", 3:"huber", 4:"MeanSquaredError"}
    
    optimizer = optimizer_selection[optimizer]
    loss = loss_selection[loss]
    
    # Optimizers
    a = "\noptimizer = "
    final_String += a
    
    if (optimizer == "SGD"):
        final_String += "optim.SGD(net.parameters(), lr=1e-3)\n"
    
    if (optimizer == "Adam"):
        final_String += "optim.Adam(net.parameters(), lr=1e-3)\n"

    if (optimizer == "Adadelta"):
        final_String += "optim.Adadelta(net.parameters(), lr=1e-3)\n"

    if (optimizer == "Adagrad"):
        final_String += "optim.Adagrad(net.parameters(), lr=1e-3)\n"
    
    if (optimizer == "Adamax"):
        final_String += "optim.Adamax(net.parameters(), lr=1e-3)\n"
    
    if (optimizer == "RMSprop"):
        final_String += "optim.RMSprop(net.parameters(), lr=1e-3)\n"
    
    if (optimizer == "Nadam"):
        final_String += "optim.NAdam(net.parameters(), lr=1e-3)\n"
    
    # Loss

    final_String += "criterion = "

    if (loss == "CategoricalCrossentropy"):
        if (len(l) > 0 and l[-1][6] == 5):
            final_String += "nn.BCELoss()\n"
        else:
            final_String += "nn.BCEWithLogitsLoss()\n"
    
    if (loss == "MeanAbsoluteError"):
        final_String += "nn.L1Loss()\n"

    if (loss == "Hinge"):
        final_String += "nn.HingeEmbeddingLoss()\n"

    if (loss == "huber"):
        final_String += "nn.HuberLoss()\n"
    
    if (loss == "MeanSquaredError"):
        final_String += "nn.MSELoss()\n"

    # Determine metrics (look if there is an equivlanet in Pytorch)
    # Didn't find anything equivalent for Pytorch :/
    
    return final_String



def pytorch_train_model(optimizer, loss):
    
    optimizer_selection = {6:'SGD', 0:'Adam', 2:"Adadelta", 3:"Adagrad", 4:"Adamax", 5:"RMSprop", 1:"Nadam"}
    loss_selection = {0:"CategoricalCrossentropy", 1:"MeanAbsoluteError", 2:"Hinge", 3:"huber", 4:"MeanSquaredError"}
    
    optimizer = optimizer_selection[optimizer]
    loss = loss_selection[loss]

    final_string = ""
    
    # Optimizers
    a = "\noptimizer = "
    final_string += a
    
    if (optimizer == "SGD"):
        final_string += "optim.SGD(net.parameters(), lr=1e-1)\n"
    
    if (optimizer == "Adam"):
        final_string += "optim.SGD(net.parameters(), lr=1e-3)\n"

    if (optimizer == "Adadelta"):
        final_string += "optim.Adadelta(net.parameters(), lr=1e-3)\n"

    if (optimizer == "Adagrad"):
        final_string += "optim.Adagrad(net.parameters(), lr=1e-3)\n"
    
    if (optimizer == "Adamax"):
        final_string += "optim.Adamax(net.parameters(), lr=1e-3)\n"
    
    if (optimizer == "RMSprop"):
        final_string += "optim.RMSprop(net.parameters(), lr=1e-3)\n"
    
    if (optimizer == "Nadam"):
        final_string += "optim.NAdam(net.parameters(), lr=1e-3)\n"
    
    # Loss

    final_string += "criterion = "

    if (loss == "CategoricalCrossentropy"):
        final_string += "nn.BCEWithLogitsLoss()\n"
    
    if (loss == "MeanAbsoluteError"):
        final_string += "nn.L1Loss()\n"

    if (loss == "Hinge"):
        final_string += "nn.HingeEmbeddingLoss()\n"

    if (loss == "huber"):
        final_string += "nn.HuberLoss()\n"
    
    if (loss == "MeanSquaredError"):
        final_string += "nn.MSELoss()\n"

    # Determine metrics (look if there is an equivlanet in Pytorch)
    # Didn't find anything equivalent for Pytorch :/
    
    return final_string



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

    a = pytorch_code_generator(layersConv)
    print(a)
    optimizer = {6:'SGD', 0:'Adam', 2:"Adadelta", 3:"Adagrad", 4:"Adamax", 5:"RMSprop", 1:"Nadam"}
    loss = {0:"CategoricalCrossentropy", 1:"MeanAbsoluteError", 2:"Hinge", 3:"huber", 4:"MeanSquaredError"}
    
    a = pytorch_train_model(6, 4)
    print(a)
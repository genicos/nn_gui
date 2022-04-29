def tf_Code_generator(l):
    # Imports
    final_String = ""
    headerString = "import torch\nimport torchvision\nimport torch.nn as nn\nimport torch.optim as optim\n\n" 
    final_String += headerString
    
    # Note: torch = pytorch 
    f = open("torch.py", "w")
    f.write(headerString)
    f.close()

    # Basic format for model in Pytorch
    f = open("torch.py", "a")
    f.write("class Net(nn.Module):\n")
    final_String += "class Net(nn.Module):\n"
    f.write("    def __init__(self):\n")
    final_String += "    def __init__(self):\n"
    f.write("        super().__init__()\n")
    final_String += "        super().__init__()\n"
    
    # Variables to keep track of certain things in model
    # Helps some of the logic
    kernel = 0 # saves kernel size as its adjusted throughout the layers
    prev_out = 1 # saves previous out, set to 1 for the start/first input
    FlattenFlag = 0 # To determine if a flatten is needed
    Conv_prev = False # Keep track layer goes from Conv2D to Linear
    
    # For each input/layer
    for i in range(len(l)):
        if (l[i][0] == 0): # if Dense/Linear
            # Converts Conv2D output to Linear input
            if Conv_prev:
                # If input size is off review this!  Inputs reallly vary between Conv2D and Linear
                linearString = "        self.fc" + str(i) + " = nn.Linear(" +str(prev_out) + " * " + str(kernel) + " * " + str(kernel) + ", " +str(l[i][2])+ ")\n"
                Conv_prev = False
            else:
                linearString = "        self.fc" + str(i) + " = nn.Linear(" +str(prev_out) + ", " +str(l[i][2])+ ")\n"
            f.write(linearString)
            final_String += linearString
            
            # Saves previous output
            prev_out = l[i][2]
            
            if(l[i][3] == 2): # RELU
                actRELU = "        self.act" + str(i) + " = nn.ReLU()\n"
                f.write(actRELU)
                final_String += actRELU
            if(l[i][3] == 3): # Softmax
                actSoft = "        self.act" + str(i) + " = nn.Softmax()\n"
                f.write(actSoft)
                final_String += actSoft
            
        if(l[i][0] == 1): # if Conv2D
            # Done but may need adjustments in the future
            ConvString = "        self.conv" + str(i) + " = nn.Conv2d(" + str(prev_out) + ", " + str(l[i][1]) +", kernel_size="+str(l[i][-1])+ ")\n"
            f.write(ConvString)
            final_String+=ConvString
            
            K = str(l[i][-1])
            K = int(K[1])
            kernel = l[i][1] - K + 1
            prev_out = l[i][1]
            
            Conv_prev = True
            
            if(l[i][3] == 2): # RELU
                actRELU = "        self.act" + str(i) + " = nn.ReLU()\n"
                f.write(actRELU)
                final_String += actRELU
            if(l[i][3] == 3): # Softmax
                actSoft = "        self.act" + str(i) + " = nn.Softmax()\n"
                f.write(actSoft)
                final_String += actSoft

            FlattenFlag = 1
        
        if (l[i][0]==4): # if MaxPool
            K = str(l[i][-1])
            K = int(K[1])
            maxPoolString = "        self.pool" + str(i) + " = nn.MaxPool2d("+str(K) + ")\n"
            f.write(maxPoolString)
            final_String+=maxPoolString

            kernel = int(kernel / 2)

    # Activation of layers and other stuff (pytorch requires these to be set in forward, hence why its formatted like this)
    f.write("\n    def forward(self, x):\n")
    final_String += "\n    def forward(self, x):\n"
    
    for i in range(len(l)):
        if (l[i][0] == 0): # if Dense/Linear
            
            if (i == 0): # for first hidden layer
                f.write("        x = torch.flatten(x)\n")
                final_String += "        x = torch.flatten(x)\n"
                FlattenFlag = 0

            if (FlattenFlag == 1): # 
                f.write("        x = torch.flatten(x)\n")
                final_String += "        x = torch.flatten(x)\n"
                FlattenFlag = 0

            f.write("        x = self.act" + str(i) + "(self.fc"+ str(i) +"(x))\n")
            final_String += "        x = self.act" + str(i) + "(self.fc"+ str(i) +"(x))\n"  

        if(l[i][0] == 1): # if Conv2D
            f.write("        x = self.act" + str(i) + "(self.conv"+ str(i) +"(x))\n")
            final_String += "        x = self.act" + str(i) + "(self.conv"+ str(i) +"(x))\n"  

        if (l[i][0]==4): # if MaxPool
            f.write("        x = self.pool" + str(i) + " (x)\n")
            final_String += "        x = self.pool" + str(i) + "(x)\n"
            
    # Saving this all to "net" as our model
    f.write("\nnet = Net()\n")
    final_String += "\nnet = Net()\n"
    f.close()
    return final_String



def train_model(optimizer, loss):
    # No real equivalent to model.compile in pytorch :/

    f = open("torch.py", "a")
    final_string = ""
    
    # Optimizers
    a = "\noptimizer = "
    final_string += a
    f.write(a)
    
    if (optimizer == "SGD"):
        sgdString = "optim.SGD(net.parameters(), lr=1e-1)\n"
        final_string += sgdString
        f.write(sgdString)
    
    if (optimizer == "Adam"):
        AdamString = "optim.SGD(net.parameters(), lr=1e-3)\n"
        final_string += AdamString
        f.write(AdamString)
    
    # Loss 
    a = "criterion = "
    final_string += a
    f.write(a)
    if (loss == "sparse_categorical_crossentropy"):
        CrossString = "nn.CrossEntropyLoss()\n"
        final_string += CrossString
        f.write(CrossString)
    
    # Determine metrics (look if there is an equivlanet in Pytorch)
    # Didn't find anything equivalent for Pytorch :/

    f.close()
    return final_string




if __name__ == "__main__":
    operate_type = {0:'Dense', 1:'Conv2D', 2:'relu', 3:'softmax', 4:'MaxPool'}

    layersDense = [[0,784,50,2], [0,50,30,2], [0,30,10,3]]
    layersConv = [[1, 24,00, 2, "(3,3)"], [4,00,00,00, "(2,2)"], [1, 36,00, 2, "(3,3)"], [4,00,00,00, "(2,2)"], [0,784,128,2], [0,128,10,2]]
    
    a = tf_Code_generator(layersConv)
    print(a)

    optimizer = {0:'SGD', 1:'Adam'}
    loss = {0: 'sparse_categorical_crossentropy'}

    a = train_model(optimizer[1], loss[0])
    print(a)
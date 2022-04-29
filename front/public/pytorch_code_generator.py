
# Important to look over!!!
# https://discuss.pytorch.org/t/pytorch-equivalent-of-keras/29412

def pytorch_code_generator(l):
    final_String = ""
    headerString = "import torch\nimport torchvision\nimport torch.nn as nn\n\n" 
    final_String += headerString
    
    # Note: torch = pytorch 
    f = open("torch.py", "w")
    f.write(headerString)
    f.close()


    f = open("torch.py", "a")
    f.write("class Net(nn.Module):\n")
    final_String += "class Net(nn.Module):\n"
    f.write("    def __init__(self):\n")
    final_String += "    def __init__(self):\n"
    f.write("        super().__init__()\n")
    final_String += "        super().__init__()\n"
    
    kernel = 0
    prev_out = 1
    FlattenFlag = 0
    Conv_prev = False
    
    for i in range(len(l)):
        if (l[i][0] == 0): # if Dense/Linear
            # Converts Conv2D output to Linear input
            if Conv_prev:
                # prev_out = prev_out * kernel * kernel
                linearString = "        self.fc" + str(i) + " = nn.Linear(" +str(prev_out) + " * " + str(kernel) + " * " + str(kernel) + ", " +str(l[i][2])+ ")\n"
                Conv_prev = False
            else:
            # Has to do with in and out shapes
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
            # the 1 at the start will need to be changed if the stride is to be adjusted at any point
            convString = "        self.conv" + str(i) + " = nn.Conv2d(" + str(prev_out) + ", " + str(l[i][1]) +", kernel_size="+str(l[i][-1])+ ")\n"
            f.write(convString)
            final_String+=convString
            
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

    # Addition needed
    # Add something to keep track of the previous out feature 
    # this can just be a var and it will be used on the next input
    # this is needed for linear but the previous out can be from conv2D or from linear
    # Review this!!
    

    # Activation and other stuff
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
            
        
        
    

            


    f.write("\nnet = Net()\n")
    final_String += "\nnet = Net()\n"
    f.close()
    return final_String


if __name__ == "__main__":
    operate_type = {0:'Dense', 1:'Conv2D', 2:'relu', 3:'softmax', 4:'MaxPool'}
    layersDense = [[0,784,50,2], [0,50,30,2], [0,30,10,3]]

    layersConv = [[1, 24,00, 2, "(3,3)"], [4,00,00,00, "(2,2)"], [1, 36,00, 2, "(3,3)"], [4,00,00,00, "(2,2)"], [0,784,128,2], [0,128,10,2]]
    # test - [[]]
    a = tf_Code_generator(layersConv)
    print(a)
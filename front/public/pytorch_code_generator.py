
# Important to look over!!!
# https://discuss.pytorch.org/t/pytorch-equivalent-of-keras/29412

def pytorch_code_generator(l):
    final_String = ""
    headerString = "import torch\nimport torchvision\nimport torch.nn as nn\nimport torch.nn.functional as F\n\n" 
    final_String += headerString
    
    final_String += "class Net(nn.Module):\n"
    
    final_String += "    def __init__(self):\n"
    
    final_String += "        super().__init__()\n"

    FlattenFlag = 0
    for i in range(len(l)):
        if (l[i][0] == 0): # if Dense/Linear
            # Needs work so we can add before and after shape to layer
            # Has to do with in and out shapes
            # Input is a work in progress
            
            final_String += "        self.fc" + str(i) + " = nn.Linear(" +str(l[i][2])+ ")\n"
            
            if(l[i][3] == 2): # RELU
                actRELU = "        self.act" + str(i) + " = nn.ReLU()\n"
                
                final_String += actRELU
            if(l[i][3] == 3): # Softmax
                actSoft = "        self.act" + str(i) + " = nn.Softmax()\n"
                
                final_String += actSoft
            
        if(l[i][0] == 1): # if Conv2D
            # Need to determine what will be in and out channel values    
            # Input is a work in progress
            convString = "        self.conv" + str(i) + " = nn.Conv2d(" + ")\n"
            
            final_String+=convString
            if(l[i][3] == 2): # RELU
                actRELU = "        self.act" + str(i) + " = nn.ReLU()\n"
                
                final_String += actRELU
            if(l[i][3] == 3): # Softmax
                actSoft = "        self.act" + str(i) + " = nn.Softmax()\n"
                
                final_String += actSoft

            FlattenFlag = 1
        
        if (l[i][0]==4): # if MaxPool
            maxPoolString = "        self.pool" + str(i) + " = nn.MaxPool2d"+str(l[i][-1]) + "\n"
            
            final_String+=maxPoolString


    # Activation and other stuff
    final_String += "\n    def forward(self, x):\n"
    
    for i in range(len(l)):
        if (l[i][0] == 0): # if Dense/Linear
            
            if (i == 0): # for first hidden layer
                final_String += "        x = torch.flatten(x)\n"
                FlattenFlag = 0

            if (FlattenFlag == 1):
                final_String += "        x = torch.flatten(x)\n"
                FlattenFlag = 0

            final_String += "        x = self.act" + str(i) + "(self.fc"+ str(i) +"(x)))\n"  

        if(l[i][0] == 1): # if Conv2D

            final_String += "        x = self.act" + str(i) + "(self.conv"+ str(i) +"(x)))\n"  

        if (l[i][0]==4): # if MaxPool

            final_String += "        x = self.pool" + str(i) + " (x)\n"
            
    
    final_String += "\nnet = Net()\n"

    return final_String


if __name__ == "__main__":
    operate_type = {0:'Dense', 1:'Conv2D', 2:'relu', 3:'softmax', 4:'MaxPool'}
    layersDense = [[0,784,50,2], [0,50,30,2], [0,30,10,3]]

    layersConv = [[1, 24,00, 2, "(3,3)"], [4,00,00,00, "(2,2)"], [1, 36,00, 2, "(3,3)"], [4,00,00,00, "(2,2)"], [0,784,128,2], [0,128,10,2]]
    # test - [[]]
    a = pytorch_code_generator(layersConv)
    print(a)
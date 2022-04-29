import torch
import torchvision
import torch.nn as nn

class Net(nn.Module):
    def __init__(self):
        super().__init__()
        self.conv0 = nn.Conv2d(1, 24, kernel_size=(3,3))
        self.act0 = nn.ReLU()
        self.pool1 = nn.MaxPool2d(2)
        self.conv2 = nn.Conv2d(24, 36, kernel_size=(3,3))
        self.act2 = nn.ReLU()
        self.pool3 = nn.MaxPool2d(2)
        self.fc4 = nn.Linear(36 * 17 * 17, 128)
        self.act4 = nn.ReLU()
        self.fc5 = nn.Linear(128, 10)
        self.act5 = nn.ReLU()

    def forward(self, x):
        x = self.act0(self.conv0(x))
        x = self.pool1 (x)
        x = self.act2(self.conv2(x))
        x = self.pool3 (x)
        x = torch.flatten(x)
        x = self.act4(self.fc4(x))
        x = self.act5(self.fc5(x))

net = Net()

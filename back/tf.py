import tensorflow as tf 
from tensorflow import keras

model = tf.keras.Sequential([
   tf.keras.layers.Conv2D(24, kernel_size=(3,3), activation='relu'),
   tf.keras.layers.MaxPool2D(pool_size=(2,2)),
   tf.keras.layers.Conv2D(36, kernel_size=(3,3), activation='relu'),
   tf.keras.layers.MaxPool2D(pool_size=(2,2)),
   tf.keras.layers.Flatten(),
   tf.keras.layers.Dense(128, activation='relu'),
   tf.keras.layers.Dense(10, activation='relu'),
])
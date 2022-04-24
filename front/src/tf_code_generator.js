var operate_type = {0:'Dense', 1:'Conv2D', 2:'relu', 3:'softmax', 4:'MaxPool'}


//This code is here just in case we need to translate back end code into js

export function tf_code_generator(l){

    var final_string = ""

    // Add necessary imports
    var header_string = "import tensorflow as tf \nfrom tensorflow import keras\n\n"
    final_string += header_string
    
    final_string += "model = tf.keras.Sequential([\n"
    flatten_flag = 0

    for(let i = 0; i < l.length; i++){

        if (l[i][0] == 0) { // If Fully Connected

            if (flatten_flag == 1){
                flatten_flag = 0
                final_string+= "   tf.keras.layers.Flatten(),\n"
            }

            if (i == 0){ // For first hidden layer

                // If first layer, we have to flatten
                final_string += "   tf.keras.layers.Flatten(),\n"

                // Add Dense layer
                final_string += "   tf.keras.layers.Dense("+String(l[i][2])+", input_shape=("+String(l[i][1])+",), activation='"+String(operate_type[l[i][3]])+"'),\n"
                
                // Output of Dense is a vector, no need to flatten
                flatten_flag = 0
            }else{
                
                // Add Dense layer
                final_string += "   tf.keras.layers.Dense("+String(l[i][2])+", activation='"+String(operate_type[l[i][3]])+"'),\n"
            }
        }

        if(l[i][0] == 1){ // If Conv2D

            var conv_string = "   tf.keras.layers.Conv2D("+String(l[i][1])+ ", kernel_size="+String(l[i][-1])+", activation='"+String(operate_type[l[i][3]])+"'),\n"
            final_string += conv_string

            // Output may not be vector, we may need to flatten
            flatten_flag = 1
        }

        if (l[i][0]==4){ // If MaxPool
            var max_pool_string = "   tf.keras.layers.MaxPool2D(pool_size="+l[i][-1]+"),\n"
            
            final_string += max_pool_string
        }

    }

    final_string += "])"
    return final_string
}
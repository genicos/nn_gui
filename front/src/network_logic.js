import {Network} from "./define_network_objects"
import {Tensor} from "./define_network_objects"
import {function_table} from "./define_network_objects"
import {Operator} from "./define_network_objects"



const unmergeDist = 20

// Returns a boolean answer to the question of wether the given network is sequential
//  A network is sequential if it can be modeled by the tf.keras.sequential API
export function is_sequential(network){
    
    //Ensuring the network only has one input and one output
    if(network.input_tensors.length != 1 || network.output_tensors.length != 1){
        
        return false
    }
    
    
    //Ensuring each tensor is only input to a single operator at most
    for(let i = 0; i < network.tensors.length; i++){
        
        if(network.tensors[i].input_to.length > 1) {
            return false
        }
    }

    //Ensure parameter tensors have no inputs
    for(let i = 0; i < network.operators.length; i++){
        
        if(network.operators[i].inputs.length > 1){
            
            if(network.tensors[network.operators[i].inputs[1]].inputs_of > 0){
                
                return false
            }

            if(network.operators[i].inputs[1] in network.input_tensors){

                return false
            }
        }
    }

    
    var visited = Array(network.operators.length).fill(false)
    var current = network.tensors[network.input_tensors[0]].input_to[0]
    if(isNaN(current)){
        
        return false
    }

    
    //Ensuring each operator flows from the input tensor, with no cycles
    for(let i = 0; i < network.operators.length - 1; i++){
        
        if(visited[current]){
            
            return false
        }
        
        visited[current] = true

        console.log(network.operators[current].outputs[0])
        console.log(network.tensors[network.operators[current].outputs[0]].input_to[0])

        current = network.tensors[network.operators[current].outputs[0]].input_to[0]

        if(isNaN(current)){
            
            return false
        }
    }
    
    if(network.output_tensors[0] != network.operators[current].outputs[0]){
        
        return false
    }
    
    return true
}


// This function returns a list of operator indecies
// such that computing in this order creates
// no dependency hazards
export function operator_ordering(network){
    
    var ordered_operators = []
    var computed_tensors = network.input_tensors.concat(network.param_tensors)


    while(computed_tensors.length != 0){
        var no_computation = true

        //find operators which can now be computed
        for(let i = 0; i < network.operators.length; i++){

            //only check operators we have not already computed
            if(!ordered_operators.includes(i)){
                var all_inputs_are_computed = true

                //check if all inputs have been computed
                for(let k = 0; k < network.operators[i].inputs.length; k++){
                    if(!computed_tensors.includes(network.operators[i].inputs[k])){
                        all_inputs_are_computed = false
                    }
                }
                
                //if all inputs have been computed, then the operator may be computed
                // and all of the operators outputs can be computed
                if(all_inputs_are_computed){
                    no_computation = false

                    ordered_operators.push(i)

                    for(let k = 0; k < network.operators[i].outputs.length; k++){
                        computed_tensors.push(network.operators[i].outputs[k])
                    }
                }
            }
        }

        if(computed_tensors.length == network.tensors.length){
            break
        }else if(no_computation){
            //If we can perform no more computations, and we have not computed every tensor
            // then the network is ill-formed
            return [];
        }
    }


    return ordered_operators
}




export function unmergeTensor(network, tensor_index) {
    var t0 = network.tensors[tensor_index]

    // Save function we are inputting to, and delete that shit
    var functions = t0.input_to
    t0.input_to = []

    for (let i = 0; i < functions.length; i++) {
        var fi = functions[i]
        var op1 = network.operators[fi]

        // create new tensor
        var tnewind = network.tensors.length
        network.add_tensor(new Tensor(true))
        
        var todeleteind = op1.inputs.findIndex((elem) => elem == tensor_index)
        op1.inputs[todeleteind] = tnewind

        // update position
        network.tensors[tnewind].x = t0.x + unmergeDist
        network.tensors[tnewind].y = t0.y

        network.tensors[tnewind].input_to = [fi]
        network.tensors[tnewind].output_of = null
        network.tensors[tnewind].live = false
    }

    t0.x -= unmergeDist
    t0.live = false

}


// Take two tensors and replace them with a single tensor
export function mergeTensors(network, tensor_index0, tensor_index1) {

    if (network.tensors[tensor_index0].live && network.tensors[tensor_index1].live) {
        console.log("Both merged tensors are live, so don't do anything.")
        return
    }

    
    var one_is_an_output = false
    var output_index = 0
    var one_is_an_input = false
    var input_index = 0
    for(let i = 0; i < network.output_tensors.length; i++){
        if(network.output_tensors[i] == tensor_index0 || network.output_tensors[i] == tensor_index1){
            if(one_is_an_output){
                console.log("Cant merge two outputs")
                return
            }
            one_is_an_output = true;
        }
    }
    for(let i = 0; i < network.input_tensors.length; i++){
        if(network.input_tensors[i] == tensor_index0 || network.input_tensors[i] == tensor_index1){
            if(one_is_an_input){
                console.log("Cant merge two inputs")
                return
            }
            one_is_an_input = true;
        }
    }


    if(one_is_an_output && one_is_an_input){
        console.log("Cant merge, one is an input and one is an output")
        return
    }

    if(one_is_an_output){
        network.output_tensors.splice(output_index, 1)
    }
    if(one_is_an_input){
        network.input_tensors.splice(input_index, 1)
    }
    
        
    let t0 = network.tensors[tensor_index0]
    let t1 = network.tensors[tensor_index1]

    let toDeleteIndex = tensor_index1
    let noDeleteIndex = tensor_index0



    // t0 is already an output to a function and stays, t1 is an input to a function and is deleted
    if (t0.output_of != null && t1.output_of == null) {}
    else if (t1.output_of != null && t0.output_of == null) {
        var tmp = t1
        t1 = t0
        t0 = tmp
        toDeleteIndex = tensor_index0
        noDeleteIndex = tensor_index1
    } else if (t0.output_of == null && t1.output_of == null) {}
    else {
        console.log("Error merging, only one input must have an output")
        return
    }

    // check that they aren't input and output to the same function
    if (t1.input_to.length > 0 && t0.output_of == t1.input_to[0]) {
        console.log("Error merging, these are input and output of the same function")
        return
    }
    
    if(t1.input_to.length > 0){
        let ind = network.operators[t1.input_to[0]].inputs.indexOf(toDeleteIndex)
        network.operators[t1.input_to[0]].inputs[ind] = noDeleteIndex
    }

    t0.input_to = t1.input_to
    
    t0.live = (t0.live || t1.live)


    network.tensors[noDeleteIndex].selected = true

    if(one_is_an_output){
        network.output_tensors.push(noDeleteIndex)
    }else if(one_is_an_input){
        network.input_tensors.push(noDeleteIndex)
    }
    
    deleteTensor(network, toDeleteIndex)
}



function deleteTensor(network, index) {

    // in operators, decrement input and output indices if greater than deleted indices
    for (let i = 0; i < network.operators.length; i++) {
        for (let j = 0; j < network.operators[i].inputs.length; j++) {
            if (network.operators[i].inputs[j] > index) {
                network.operators[i].inputs[j] -= 1
            }
        }
        for (let j = 0; j < network.operators[i].outputs.length; j++) {
            if (network.operators[i].outputs[j] > index) {
                network.operators[i].outputs[j] -= 1
            }
        }
    }

    // update indexes in input_tensors and output_tensors lists
    for(let i = 0; i < network.input_tensors.length; i++){
        if (network.input_tensors[i] > index) {
            network.input_tensors[i] -= 1
        }
    }
    for(let i = 0; i < network.param_tensors.length; i++){
        if (network.param_tensors[i] > index) {
            network.param_tensors[i] -= 1
        }
    }
    for(let i = 0; i < network.output_tensors.length; i++){
        if (network.output_tensors[i] > index) {
            network.output_tensors[i] -= 1
        }
    }

   
    // delete relevant tensor
    return network.tensors.splice(index, 1)
}

export function deleteOperator(network, index){

    var op = network.operators[index]

    //First we deal with the tensors associated with this operator
    //
    // We delete any tensor which is associated only with this operator
    for(let i = 0; i < op.inputs.length; i++){
        let tensor = network.tensors[op.inputs[i]]
        let ops_associated_with_this_tensor = tensor.input_to
        
        if(tensor.output_of != null){
            ops_associated_with_this_tensor.push(tensor.output_of)
        }

        //delete if this tensor is only associated with this op
        if(ops_associated_with_this_tensor.length == 1){
            deleteTensor(network, op.inputs[i])
        }
    }
    for(let i = 0; i < op.outputs.length; i++){
        let tensor = network.tensors[op.outputs[i]]
        let ops_associated_with_this_tensor = tensor.input_to
        
        if(tensor.output_of != null){
            ops_associated_with_this_tensor.push(tensor.output_of)
        }

        //delete if this tensor is only associated with this op
        if(ops_associated_with_this_tensor.length == 1){
            deleteTensor(network, op.outputs[i])
        }
    }

    //Remove operator
    network.operators.splice(index, 1)
    
    //Update references to operators in tensors
    network.update_tensors()
}


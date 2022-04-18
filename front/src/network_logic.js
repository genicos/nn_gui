import {Network} from "./define_network_objects"
import {Tensor} from "./define_network_objects"
import {Operator} from "./define_network_objects"



const unmergeDist = 20


export function is_sequential(network){

    //Ensuring the network only has one input and one output
    if(network.input_tensors.length != 1 || network.output_tensors.length != 1){
        return false
    }
    
    //Ensuring each tensor is only input to a single operator at most
    for(let i = 0; i < network.tensors.length; i++){
        if(network.tensors[i].input_to.length > 1){
            return false
        }
    }

    //Ensure parameter tensors have no inputs
    for(let i = 0; i < network.operators.length; i++){
        if(network.operators[i].inputs.length > 1){
            if(network.tensors[network.operators[i].inputs[1]].inputs_of > 0){
                return false
            }
        }
    }

    var visited = Array(network.operators.length).fill(false)
    var current = network.input_tensors[0].input_to

    //Ensuring each operator flows from the input tensor, with no cycles
    for(let i = 0; i < network.operators.length; i++){
        if(visited[current]){
            return false
        }
        visited[current] = true
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



export function mergeTensors(network, tensor_index0, tensor_index1) {

    if (network.tensors[tensor_index0].live && network.tensors[tensor_index1].live) {
        console.log("Both merged tensors are live, so don't do anything.")
        return
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
    }
    else {
        console.log("Error merging, only one input must have an output")
        return
    }

    // check that they aren't input and output to the same function
    console.log(t0.output_of, t1.input_to)
    if (t0.output_of == t1.input_to) {
        console.log("Error merging, these are input and output of the same function")
        return
    }
    
    let ind = network.operators[t1.input_to].inputs.indexOf(toDeleteIndex)
    network.operators[t1.input_to].inputs[ind] = noDeleteIndex

    t0.input_to = t1.input_to
    
    t0.live = (t0.live || t1.live)

    network.tensors[noDeleteIndex].selected = true

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

    // delete relevant tensor
    return network.tensors.splice(index, 1)
}
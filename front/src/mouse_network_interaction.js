import {Network} from "./define_network_objects"
import {Tensor} from "./define_network_objects"
import {Operator} from "./define_network_objects"


const tensorRadius = 10




//move tensors, accounting for obstructions
export function nudgeTensor(network, tensor_index, delta_x, delta_y){

    network.tensors[tensor_index].x += delta_x
    network.tensors[tensor_index].y += delta_y

}


// returns list of indices of tensors with mouse hovered over
//TODO: TENSORRESHAPE
export function getHoveredTensorIndices(network, x, y) {
    
    var hovered_tensors_list = []

    
    for (let j = 0; j < network.tensors.length; j++) {
        if (network.tensors[j].x - tensorRadius < x &&
            network.tensors[j].x + tensorRadius > x &&
            network.tensors[j].y - tensorRadius < y &&
            network.tensors[j].y + tensorRadius > y) 
        {
            hovered_tensors_list.push(j)
        }
    }

    return hovered_tensors_list
}



// returns list of indices of Operators with mouse hovered over
// We define 'hovering over' an operator as having the mouse
// over the region that is to the right of the leftmost tensor in the operator, 
// and to the left of the rightmost tensor in the operator, 
// and under the topmost...

//TODO: TENSORRESHAPE
//TODO: notice the plus and minus patterns, these patterns will differ 
// for different operator types
export function getHoveredOperatorIndices(network, x, y) {

    var grabbedList = []
    
    for (let j = 0; j < network.operators.length; j++) {
        var this_op = network.operators[j]
        var x_min =  1000000
        var x_max = -1000000
        var y_min =  1000000
        var y_max = -1000000
        for(let t = 0; t < this_op.inputs.length; t++){
            var this_tens = network.tensors[this_op.inputs[t]]
            x_min = Math.min(this_tens.x + tensorRadius, x_min)
            x_max = Math.max(this_tens.x - tensorRadius, x_max)
            y_min = Math.min(this_tens.y + tensorRadius, y_min)
            y_max = Math.max(this_tens.y + tensorRadius, y_max) 
        }
        for(let t = 0; t < this_op.outputs.length; t++){
            var this_tens = network.tensors[this_op.outputs[t]]
            x_min = Math.min(this_tens.x + tensorRadius, x_min)
            x_max = Math.max(this_tens.x - tensorRadius, x_max)
            y_min = Math.min(this_tens.y + tensorRadius, y_min)
            y_max = Math.max(this_tens.y + tensorRadius, y_max)
        }
        
        
        if (x_min < x &&
            x_max > x &&
            y_min < y &&
            y_max > y) {
            grabbedList.push(j)
        }
    }
    
    return grabbedList
}
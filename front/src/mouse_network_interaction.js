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

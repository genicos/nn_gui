import {Network} from "./define_network_objects"
import {Tensor} from "./define_network_objects"
import {Operator} from "./define_network_objects"

//move tensors, accounting for obstructions
export function nudgeTensor(network, tensor_index, delta_x, delta_y){
    network.tensors[tensor_index].x += delta_x
    network.tensors[tensor_index].y += delta_y
}

import {Network} from "./define_network_objects"
import {Tensor} from "./define_network_objects"
import {Operator} from "./define_network_objects"
import { function_table } from "./define_network_objects"


const tensorRadius = 10

//Gets boundary of where tensor is allowed to move around
// given the operators its associated with
function get_tensor_bounds(network, operator_index, tensor_index){
    var ans = {
        x_min: -9999,
        x_max: 10000,
        y_min: -9999,
        y_max: 10000
    };

    var o = network.operators[operator_index]

    //Find out how this tensor is associated with this operator, 
    // whether it is an output or input
    var output = false;
    var output_index = 0;
    for(let i = 0; i < o.outputs.length; i++){
        if(o.outputs[i] == tensor_index){
            output = true;
            output_index = i;
        }
    }
    //checking if this tensor is an input
    var input_index = 0;
    if(!output){
        for(let i = 0; i < o.inputs.length; i++){
            if(o.inputs[i] == tensor_index){
                input_index = i;
            }
        }
    }


    var inp0 = network.tensors[o.inputs[0]]
    var inp1 = network.tensors[o.inputs[1]]
    var out  = network.tensors[o.outputs[0]]

    //unary
    if(function_table[o.func].type == 0){
        if(output){
            ans.x_min = inp0.x + 4 * tensorRadius
        }else{
            ans.x_max = out.x - 4 * tensorRadius
        }
    }

    //side binary
    if(function_table[o.func].type == 1){
        if(output){
            var rightest = Math.max(inp0.x, inp1.x)
            ans.x_min = rightest + 4 * tensorRadius
        }else{
            if(input_index == 1){ //top tensor
                ans.x_max = out.x - 4 * tensorRadius
                
                ans.y_max = inp0.y - 2 * tensorRadius
            }else{
                ans.x_max = out.x - 4 * tensorRadius

                ans.y_min = inp1.y + 2 * tensorRadius
            }
        }
    }

    //top binary
    if(function_table[o.func].type == 2){
        if(output){
            ans.x_min = inp1.x + 2 * tensorRadius
            ans.y_min = inp1.y + 2 * tensorRadius
        }else{
            if(input_index == 1){ //top tensor
                ans.x_min = inp0.x + 2 * tensorRadius
                ans.x_max = out.x - 2 * tensorRadius

                var highest = Math.min(out.y, inp0.y)
                ans.y_max = highest - 2 * tensorRadius
            }else{
                ans.x_max = inp1.x - 2 * tensorRadius

                ans.y_min = inp1.y + 2 * tensorRadius
            }
        }
    }
    

    return ans;
}







//Tries to move the tensor to the give point,
// accounts for all of the boundaries imposed on the tensor
export function placeTensor(network, tensor_index, x, y, bounds, grid = false){

    network.tensors[tensor_index].x = x
    network.tensors[tensor_index].y = y

    //If grid, place tensor to nearest grid point
    if(grid){
        network.tensors[tensor_index].x -= (network.tensors[tensor_index].x + tensorRadius) % (tensorRadius * 2) - tensorRadius
        network.tensors[tensor_index].y -= (network.tensors[tensor_index].y + tensorRadius) % (tensorRadius * 2) - tensorRadius
    }


    
    
    // get bounds of operators this tensor is an input to
    for(let i = 0; i < network.tensors[tensor_index].input_to.length; i++){
        let ans = get_tensor_bounds(network,network.tensors[tensor_index].input_to[i],tensor_index)
        bounds.x_min = Math.max(bounds.x_min, ans.x_min)
        bounds.x_max = Math.min(bounds.x_max, ans.x_max)
        bounds.y_min = Math.max(bounds.y_min, ans.y_min)
        bounds.y_max = Math.min(bounds.y_max, ans.y_max)
    }
    
    // get bounds of operator this tensor is an output of
    if(network.tensors[tensor_index].output_of != null){
        let ans = get_tensor_bounds(network,network.tensors[tensor_index].output_of,tensor_index)
        bounds.x_min = Math.max(bounds.x_min, ans.x_min)
        bounds.x_max = Math.min(bounds.x_max, ans.x_max)
        bounds.y_min = Math.max(bounds.y_min, ans.y_min)
        bounds.y_max = Math.min(bounds.y_max, ans.y_max)
    }

    //Enforce the boundaries on the tensor
    if( network.tensors[tensor_index].x < bounds.x_min){
        network.tensors[tensor_index].x = bounds.x_min
    }
    if( network.tensors[tensor_index].x > bounds.x_max){
        network.tensors[tensor_index].x = bounds.x_max
    }
    if( network.tensors[tensor_index].y < bounds.y_min){
        network.tensors[tensor_index].y = bounds.y_min
    }
    if( network.tensors[tensor_index].y > bounds.y_max){
        network.tensors[tensor_index].y = bounds.y_max
    }
    
}







//move tensors, accounting for obstructions, UNUSED
export function nudgeTensor(network, tensor_index, delta_x, delta_y){

    placeTensor(network, tensor_index,
         network.tensors[tensor_index].x + delta_x,
         network.tensors[tensor_index].y + delta_y
    )
    
}


// returns list of indices of tensors
//  that are intersecting with the given point
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
export function getHoveredOperatorIndices(network, x, y) {

    var grabbedList = []
    
    for (let j = 0; j < network.operators.length; j++) {
        
        var o = network.operators[j]

        var inp0 = network.tensors[o.inputs[0]]
        var inp1 = network.tensors[o.inputs[1]]
        var out  = network.tensors[o.outputs[0]]

        var x_min =  1000000
        var x_max = -1000000
        var y_min =  1000000
        var y_max = -1000000

        if(o.func < 0){
            continue
        }

        if(function_table[o.func].type == 0){
            x_min = inp0.x + tensorRadius
            x_max = out.x  - tensorRadius
            y_min = Math.min(inp0.y - tensorRadius, out.y - tensorRadius)
            y_max = Math.max(inp0.y + tensorRadius, out.y + tensorRadius)
        }

        if(function_table[o.func].type == 2){
            x_min = inp0.x + tensorRadius
            x_max = out.x  - tensorRadius
            y_min = inp1.y + tensorRadius
            y_max = Math.max(inp0.y + tensorRadius, out.y + tensorRadius)
        }

        if(function_table[o.func].type == 1){
            x_min = Math.min(inp0.x + tensorRadius, inp1.x + tensorRadius)
            x_max = out.x  - tensorRadius
            y_min = inp1.y - tensorRadius
            y_max = inp0.y + tensorRadius
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

import {Network} from "./define_network_objects"
import {Tensor} from "./define_network_objects"
import {Operator} from "./define_network_objects"
import { function_table } from "./define_network_objects"

import { placeTensor } from "./mouse_network_interaction"
import {nudgeTensor} from "./mouse_network_interaction"
import {getHoveredTensorIndices} from "./mouse_network_interaction"
import {getHoveredOperatorIndices} from "./mouse_network_interaction"

import {unmergeTensor} from "./network_logic"
import {mergeTensors} from "./network_logic"




var canvas    //html canvas object
var ctx       //context rendering object


var width = 0;   //width of canvas
var height = 0;  //height of canvas


const tensorRadius = 10


var down = false                  //iff mouse down
var draggedIndex = -1             //index of tensor being dragged
var dragged_operator_index = -1   //index of operator being dragged


var last_mouseX = 0;              //mouseX on last frame
var last_mouseY = 0;              //mouseY on last frame
var mouseX = 0;                   //mouseX
var mouseY = 0;                   //mouseY
var tmX = 0;                      //starting X of selection
var tmY = 0;                      //starting Y of selection

var last_frame = Date.now()       //Time last frame was drawn
var this_frame = Date.now()       //Time in this frame

var networks = []                 //list of networks we are working with
var networkIndex = 0              //network we are working with
networks.push(new Network())      //Inital network


var selecting = false             //iff selecting
var grid = true                   //iff grid is on


var inputs_margin = tensorRadius*2 * 5     // width of inputs area
var outputs_margin = tensorRadius*2 * 5    // width of outputs area

var input_box_width = tensorRadius*2 * 4   
var input_box_height = tensorRadius*2 * 3

// input_box object
// what appears in the inputs or outputs area
class input_box{
    constructor(y){
        this.tensor_index = -1
        this.y = y
    }
}


var input_boxes = []   // boxes on the left

var output_boxes = []  // boxes on the right


var output_box_width  = tensorRadius*2 * 4 
var output_box_height = tensorRadius*2 * 3

var box_seperation    = tensorRadius*0.75





//Draws a rounded rectangle
// x: x corner
// y: y corner
// w: width
// h: height
// r: radius of circle of rounded edge
CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    if (w < 0){
        w = -w
        x -= w
    }
    if (h < 0){
        h = -h
        y -= h
    }


    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    this.beginPath();
    this.moveTo(x+r, y);
    this.arcTo(x+w, y,   x+w, y+h, r);
    this.arcTo(x+w, y+h, x,   y+h, r);
    this.arcTo(x,   y+h, x,   y,   r);
    this.arcTo(x,   y,   x+w, y,   r);
    this.closePath();
    return this;
}




// Adds a new input box the inputs area
function add_input_box(y, tensor_index = null){
    
    // If tensor doesnt exist, create it
    if (tensor_index == null){

        tensor_index = networks[networkIndex].add_tensor(new Tensor(false))
        
        // Set position of tensor
        networks[networkIndex].tensors[tensor_index].y = y
        networks[networkIndex].tensors[tensor_index].x = inputs_margin + tensorRadius * 2

        //Add tensor to network inputs
        networks[networkIndex].input_tensors.push(tensor_index)
    }

    
    var box = new input_box(y)
    box.tensor_index = tensor_index
    
    input_boxes.push(box)

}


function add_output_box(y, tensor_index = null){
    
    // If tensor doesnt exist, create it
    if (tensor_index == null){

        tensor_index = networks[networkIndex].add_tensor(new Tensor(false))
        
        // Set position of tensor
        networks[networkIndex].tensors[tensor_index].y = y
        networks[networkIndex].tensors[tensor_index].x = outputs_margin - tensorRadius * 2
        
        //Add tensor to network outputs
        networks[networkIndex].output_tensors.push(tensor_index)
    }

    var box = new input_box(y)
    box.tensor_index = tensor_index
    
    output_boxes.push(box)
}


// Returns the network object of the network we are working on
export function get_network(){
    return networks[networkIndex]
}

// Removes everything from network
export function clear_network(){
    networks[networkIndex] = new Network()
}


//Introduce a new operator to the canvas and network
export function new_operator(func, x = inputs_margin + tensorRadius*2 * 2, y = tensorRadius*2 * 3){
    clear_selected()

    let new_op = new Operator()
    new_op.func = func

    var t_index = networks[networkIndex].tensors.length
    
    //unary operator
    if(function_table[func].type == 0){

        networks[networkIndex].add_tensor(new Tensor(false))
        networks[networkIndex].tensors[t_index + 0].x = x + tensorRadius*2 * 0
        networks[networkIndex].tensors[t_index + 0].y = y + tensorRadius*2 * 0

        networks[networkIndex].add_tensor(new Tensor(false))
        networks[networkIndex].tensors[t_index + 1].x = x + tensorRadius*2 * 3
        networks[networkIndex].tensors[t_index + 1].y = y + tensorRadius*2 * 0

        new_op.inputs  = [t_index + 0]
        new_op.outputs = [t_index + 1]
    }

    //side binary operator
    if(function_table[func].type == 2){
        
        networks[networkIndex].add_tensor(new Tensor(false))
        networks[networkIndex].tensors[t_index + 0].x = x + tensorRadius*2 * 0
        networks[networkIndex].tensors[t_index + 0].y = y + tensorRadius*2 * 2

        networks[networkIndex].add_tensor(new Tensor(false))
        networks[networkIndex].tensors[t_index + 1].x = x + tensorRadius*2 * 2
        networks[networkIndex].tensors[t_index + 1].y = y + tensorRadius*2 * 0

        networks[networkIndex].add_tensor(new Tensor(false))
        networks[networkIndex].tensors[t_index + 2].x = x + tensorRadius*2 * 4
        networks[networkIndex].tensors[t_index + 2].y = y + tensorRadius*2 * 2

        new_op.inputs  = [t_index + 0, t_index + 1]
        new_op.outputs = [t_index + 2]
    }

    //top binary operator
    if(function_table[func].type == 1){

        networks[networkIndex].add_tensor(new Tensor(false))
        networks[networkIndex].tensors[t_index + 0].x = x + tensorRadius*2 * 0
        networks[networkIndex].tensors[t_index + 0].y = y + tensorRadius*2 * 2

        networks[networkIndex].add_tensor(new Tensor(false))
        networks[networkIndex].tensors[t_index + 1].x = x + tensorRadius*2 * 0
        networks[networkIndex].tensors[t_index + 1].y = y + tensorRadius*2 * 0

        networks[networkIndex].add_tensor(new Tensor(false))
        networks[networkIndex].tensors[t_index + 2].x = x + tensorRadius*2 * 3
        networks[networkIndex].tensors[t_index + 2].y = y + tensorRadius*2 * 1

        new_op.inputs  = [t_index + 0, t_index + 1]
        new_op.outputs = [t_index + 2]
    }

    networks[networkIndex].add_operator(new_op)
}


//Button object, for toggle buttons on canvas
class Button{
    constructor(x, y, w, h, bool=false){
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.bool = bool;
    }

    //Detects if a click here is on the button, if so, flip the bool
    press(x, y){
        if(this.x <= x && this.x + this.w >= x
        && this.y <= y && this.y + this.h >= y){
            this.bool = !this.bool
        }
    }
}




var Buttons = []

//Add grid button
var b = new Button(inputs_margin + tensorRadius*1, tensorRadius*1, tensorRadius*2, tensorRadius*2, true);
Buttons.push(b)
var grid_icon = new Image()
grid_icon.src = "grid_icon.png"


//edit an tensor from the operator edit screen
//  input is bool, whether the tensor is an input to the operator or not
export function edit_tensor_by_operator(operator_index, tensor_index, input, new_shape){
    
    if(input){
        tensor_index = networks[networkIndex].operators[operator_index].inputs[tensor_index]
    }else{
        tensor_index = networks[networkIndex].operators[operator_index].outputs[tensor_index]
    }
    edit_tensor(tensor_index, new_shape)
}


// Update shape or form of the tensor, propogates the effects to other tensors
export function edit_tensor(tensor_index, new_shape){
    var t = networks[networkIndex].tensors[tensor_index]
    t.form = new_shape
    t.calc_size()
    
    t.live = true
    for(let i = 0; i < t.input_to.length; i++){
        propogate_shape(t.input_to[i], tensor_index, true)
    }
    if(t.output_of != null){
        propogate_shape(t.output_of, tensor_index, false)
    }
}


//Propogates the effects of a tensor shape change
//  forward is bool, meaning we are propogating from inputs to outputs, or vice versa if false
//TODO: for DAG i gotta worry about infinite loops
//This code assumes that convolution is only 2D
function propogate_shape(operator_index,tensor_index, forward){

    if(operator_index == null){
        return;
    }

    var intra_operator_index = 0;
    var op = networks[networkIndex].operators[operator_index]
    var t = networks[networkIndex].tensors[tensor_index]

    if(forward){
        for(let i = 0; i < op.inputs.length; i++){
            if(op.inputs[i] == tensor_index){
                intra_operator_index = i
            }
        }
    }else{
        for(let i = 0; i < op.outputs.length; i++){
            if(op.outputs[i] == tensor_index){
                intra_operator_index = i
            }
        }
    }

    var input0 = networks[networkIndex].tensors[op.inputs[0]]
    var output = networks[networkIndex].tensors[op.outputs[0]]
    var input1
    if(op.inputs.length > 1)
        input1 = networks[networkIndex].tensors[op.inputs[1]]
    

    switch(op.func){
        case 5://Fully Connected
            if(forward){
                if(intra_operator_index == 0){
                    if(output.live){
                        input1.form = [input0.size, output.size]
                        input1.live = true
                        input1.calc_size()
                        propogate_shape(input1.output_of, op.inputs[1], false)
                    }else if(input1.live){
                        output.form = [input1.form[1]]
                        output.live = true
                        output.calc_size()
                        for(let i = 0; i < output.input_to; i++){
                            propogate_shape(output.input_to[i], op.outputs[0], true)
                        }
                    }
                }else{
                    input0.form = [input1.form[0]]
                    input0.live = true
                    input0.calc_size()
                    propogate_shape(input0.output_of, op.inputs[0], false)

                    output.form = [input1.form[1]]
                    output.live = true
                    output.calc_size()
                    for(let i = 0; i < output.input_to; i++){
                        propogate_shape(output.input_to[i], op.outputs[0], true)
                    }
                }
            }else{
                if(input0.live){
                    input1.form = [input0.size, output.size]
                    input1.live = true
                    input1.calc_size()
                    propogate_shape(input1.output_of, op.inputs[1], false)
                }
            }
            break;
        case 7://Softmax
            if(forward){
                output.form = input0.form
                output.live = true
                output.calc_size()
                for(let i = 0; i < output.input_to; i++){
                    propogate_shape(output.input_to[i], op.outputs[0], true)
                }
            }else{
                input0.form = output.form
                input0.live = true
                input0.calc_size()
                propogate_shape(input0.output_of, op.inputs[0], false)
            }
            break;
        case 10://Convolution
            if(forward){
                if(intra_operator_index == 0){
                    if(output.live){
                        input1.form = [input0.form[0] - output.form[0] + 1, input0.form[1] - output.form[1] + 1, output.form[2]]
                        input1.live = true
                        input1.calc_size()
                        propogate_shape(input1.output_of, op.inputs[1], false)
                    }else if(input1.live){
                        output.form = [input0.form[0] - input1.form[0] + 1, input0.form[1] - input1.form[1] + 1, input1.form[2]]
                        output.live = true
                        output.calc_size()
                        for(let i = 0; i < output.input_to; i++){
                            propogate_shape(output.input_to[i], op.outputs[0], true)
                        }
                    }
                }else{
                    if(output.live){
                        input0.form = [input1.form[0] + output.form[0] - 1, input1.form[1] + output.form[1] - 1]
                        input0.live = true
                        input0.calc_size()
                        propogate_shape(input1.output_of, op.inputs[1], false)
                    }else if(input0.live){
                        output.form = [input0.form[0] - input1.form[0] + 1, input0.form[1] - input1.form[1] + 1, input1.form[2]]
                        output.live = true
                        output.calc_size()
                        for(let i = 0; i < output.input_to; i++){
                            propogate_shape(output.input_to[i], op.outputs[0], true)
                        }
                    }
                }
            }else{
                if(input0.live){
                    input1.form = [input0.form[0] - output.form[0] + 1, input0.form[1] - output.form[1] + 1, output.form[2]]
                    input1.live = true
                    input1.calc_size()
                    propogate_shape(input1.output_of, op.inputs[1], false)
                }else if(input1.live){
                    input0.form = [input1.form[0] + output.form[0] - 1, input1.form[1] + output.form[1] - 1]
                    input0.live = true
                    input0.calc_size()
                    propogate_shape(input1.output_of, op.inputs[1], false)
                }
            }
            break;
        case 12://ReLU
            if(forward){
                output.form = input0.form
                output.live = true
                output.calc_size()
                for(let i = 0; i < output.input_to; i++){
                    propogate_shape(output.input_to[i], op.outputs[0], true)
                }
            }else{
                input0.form = output.form
                input0.live = true
                input0.calc_size()
                propogate_shape(input0.output_of, op.inputs[0], false)
            }
            break;
        default:
            break;
    }

    
}


//Sets this operator as an input
export function set_op_as_input(operator_index){
    
    var n = networks[networkIndex]
    n.input_tensors.push(n.operators[operator_index].inputs[0])
    
}

//Sets this operator as an output
export function set_op_as_output(operator_index){
    
    var n = networks[networkIndex]
    n.output_tensors.push(n.operators[operator_index].outputs[0])
    
}



// Initialize the canvas and some objects
//   is called after html canvas objects loads
export function init() {

    canvas = document.getElementById("gui_canvas")
    canvas.addEventListener("mousedown", doMouseDown, false)
    canvas.addEventListener("mousemove", doMouseMove, false)
    canvas.addEventListener("mouseup", doMouseUp, false)
    canvas.addEventListener("dblclick", doDoubleClick, false)
    ctx = canvas.getContext("2d");

    canvas.width = canvas.getBoundingClientRect().width
    canvas.height = canvas.getBoundingClientRect().height

    width = canvas.width;
    height = canvas.height;

    last_frame = Date.now()
    this_frame = Date.now()

    //Add initial input box, cus every network must have at least one input
    add_input_box(height/2 - (height/2 % (tensorRadius*2)))
    
    window.requestAnimationFrame(draw);
}





function drawTensor(network, tensorIndex) {
    let t = network.tensors[tensorIndex]

    // find out if tensor is an input or output of the network
    // we will draw it a different color if so ////////////////
    var input = false                                        //
    var output = false

    for(let i = 0; i < network.input_tensors.length; i++){
        if(network.input_tensors[i] == tensorIndex){
            input = true
        }
    }
    for(let i = 0; i < network.output_tensors.length; i++){
        if(network.output_tensors[i] == tensorIndex){
            output = true
        }
    }                                                        //
    ///////////////////////////////////////////////////////////

    // If the tensor is live, draw it solid, otherwise draw it see through
    if (t.live) {

        if(input){
            ctx.fillStyle = "#F2C8A6"
        }else if(output){
            ctx.fillStyle = "#A6D0F2"
        }else{
            ctx.fillStyle = "#FFFFFF"
        }
        ctx.lineWidth = 1
        ctx.setLineDash([])
        ctx.strokeStyle = 'black'
    }
    else {
        ctx.fillStyle = "rgba(255,255,255,0)"
        ctx.lineWidth = 1
        ctx.setLineDash([3,4])
        ctx.strokeStyle = 'Grey'
        if(input){
            ctx.strokeStyle = "#F2C8A6"
        }else if(output){
            ctx.strokeStyle = "#A6D0F2"
        }else
            ctx.strokeStyle = "#888888"
    }

    //Draw outline
    ctx.beginPath()
    if (t.scalar) {
        ctx.rect(t.x - scalarTensorRadius, t.y - scalarTensorRadius, 2 * scalarTensorRadius, 2 * scalarTensorRadius)
    }
    else {
        ctx.rect(t.x - tensorRadius, t.y - tensorRadius, 2 * tensorRadius, 2 * tensorRadius)
    }
    ctx.fill()
    ctx.stroke()
    
    //Draw inside
    if(t.selected){
        ctx.fillStyle = "rgba(255,255,255,0)"
        ctx.lineWidth = 1
        ctx.strokeStyle = '#5dd2f0'
        ctx.setLineDash([])
        ctx.beginPath()
        ctx.roundRect(t.x - tensorRadius*1.5, t.y - tensorRadius*1.5, 3 * tensorRadius, 3 * tensorRadius, tensorRadius * 0.2)
        ctx.stroke()
    }
}


function draw_grill(x1, y1, x2, y2, x3, y3, x4, y4, bars, solid){
    if(bars < 1){
        return
    }

    var bar_gap = 1/(bars*solid + (bars-1)*(1-solid))

    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x3, y3)
    ctx.lineTo(x3 + (x4 - x3) * (0*bar_gap + solid*bar_gap),
               y3 + (y4 - y3) * (0*bar_gap + solid*bar_gap))
    ctx.lineTo(x1 + (x2 - x1) * (0*bar_gap + solid*bar_gap),
               y1 + (y2 - y1) * (0*bar_gap + solid*bar_gap))
    
    for(let i = 1; i < bars; i++){
        ctx.lineTo(x1 + (x2 - x1) * (i*bar_gap),
                   y1 + (y2 - y1) * (i*bar_gap))
        ctx.lineTo(x3 + (x4 - x3) * (i*bar_gap),
                   y3 + (y4 - y3) * (i*bar_gap))
        ctx.lineTo(x3 + (x4 - x3) * (i*bar_gap + solid*bar_gap ),
                   y3 + (y4 - y3) * (i*bar_gap + solid*bar_gap ))
        ctx.lineTo(x1 + (x2 - x1) * (i*bar_gap + solid*bar_gap ),
                   y1 + (y2 - y1) * (i*bar_gap + solid*bar_gap ))
    }

    ctx.closePath()
    ctx.fill()
}


// here we draw the function naively without checking for tensor positions. That must be handled 
// by movement logic
function drawOperator(network, operatorIndex) {
    let o = network.operators[operatorIndex]
    let input
    let input1
    let input2
    let output

    let functionGradient = ctx.createLinearGradient(0, 0, width, 0)
    if(o.highlighted){
        functionGradient.addColorStop(0, "#E5914D")
        functionGradient.addColorStop(1, "#4DA1E5")
    }else{
        functionGradient.addColorStop(0, "#DE7521")
        functionGradient.addColorStop(1, "#218ADE")
    }

    ctx.fillStyle = functionGradient

    var tapes = 3

    switch (o.func) {
        case 0: // abstraction
            break
        case 1: // identity
            break
        case 2: // add
            input1 = network.tensors[o.inputs[0]]
            input2 = network.tensors[o.inputs[1]]
            output = network.tensors[o.outputs[0]]

            ctx.beginPath()
            ctx.moveTo(output.x - tensorRadius, output.y - tensorRadius)
            ctx.lineTo(output.x - tensorRadius, output.y + tensorRadius)

            ctx.lineTo(input1.x + tensorRadius, input1.y + tensorRadius)
            ctx.lineTo(input1.x + tensorRadius, input1.y - tensorRadius)
            ctx.closePath()
            ctx.fill()

            ctx.beginPath()
            ctx.moveTo(output.x - tensorRadius, output.y - tensorRadius)
            ctx.lineTo(output.x - tensorRadius, output.y + tensorRadius)

            ctx.lineTo(input2.x + tensorRadius, input2.y + tensorRadius)
            ctx.lineTo(input2.x + tensorRadius, input2.y - tensorRadius)
            ctx.closePath()
            ctx.fill()


            break
        case 3: // subtract
            input1 = network.tensors[o.inputs[0]]
            input2 = network.tensors[o.inputs[1]]
            output = network.tensors[o.outputs[0]]

            break
        case 4: // scale
            break
        case 5: // full
            input1 = network.tensors[o.inputs[0]]
            input2 = network.tensors[o.inputs[1]]
            output = network.tensors[o.outputs[0]]

            ctx.beginPath()
            ctx.moveTo(output.x - tensorRadius, output.y - tensorRadius)
            ctx.lineTo(output.x - tensorRadius, output.y + tensorRadius)

            ctx.lineTo(input1.x + tensorRadius, input1.y + tensorRadius)
            ctx.lineTo(input1.x + tensorRadius, input1.y - tensorRadius)

            ctx.lineTo(input2.x - tensorRadius, input2.y + tensorRadius)
            ctx.lineTo(input2.x + tensorRadius, input2.y + tensorRadius)
           
            ctx.closePath()
            ctx.fill()
            break
        case 6: // amass
            break
        case 7: // softmax
            input = network.tensors[o.inputs[0]]
            output = network.tensors[o.outputs[0]]

            ctx.beginPath()
            ctx.moveTo(output.x - tensorRadius, output.y - tensorRadius*0.5)
            ctx.lineTo(output.x - tensorRadius, output.y + tensorRadius*0.5)

            ctx.lineTo(input.x + tensorRadius, input.y + tensorRadius)
            ctx.lineTo(input.x + tensorRadius, input.y - tensorRadius)
        
            ctx.closePath()
            ctx.fill()

            break
        case 8: // hardmax
            break
        case 9: // max
            break
        case 10: // convolution
            input1 = network.tensors[o.inputs[0]]
            input2 = network.tensors[o.inputs[1]]
            output = network.tensors[o.outputs[0]]

            ctx.beginPath()
            ctx.moveTo(input1.x + tensorRadius, input1.y - tensorRadius)
            
            ctx.lineTo(input2.x - tensorRadius, input2.y + tensorRadius)
            ctx.lineTo(input2.x + tensorRadius, input2.y + tensorRadius)

            ctx.lineTo(output.x - tensorRadius, output.y - tensorRadius)
            ctx.closePath()
            ctx.fill()
            
            draw_grill(input1.x + tensorRadius, input1.y - tensorRadius - 1, 
                       input1.x + tensorRadius, input1.y + tensorRadius,
                       output.x - tensorRadius, output.y - tensorRadius - 1,
                       output.x - tensorRadius, output.y + tensorRadius,
                        3, 0.6)
            
            break
        case 11: // squared dist
            break
        case 12: // PReLU
            input = network.tensors[o.inputs[0]]
            output = network.tensors[o.outputs[0]]

            
            ctx.beginPath()
            ctx.moveTo(input.x + tensorRadius, input.y - tensorRadius)
            ctx.lineTo((output.x + input.x)/2, (output.y + input.y)/2 - tensorRadius)


            ctx.lineTo((output.x + input.x)/2, (output.y + input.y)/2 + tensorRadius)
            ctx.lineTo(input.x + tensorRadius, input.y + tensorRadius)
            
            ctx.closePath()
            ctx.fill()
            
            
            draw_grill((output.x + input.x)/2, (output.y + input.y)/2 - tensorRadius, 
                       (output.x + input.x)/2, (output.y + input.y)/2 + tensorRadius,
                       output.x - tensorRadius, output.y - tensorRadius,
                       output.x - tensorRadius, output.y + tensorRadius,
                        3, 0.5)
            
            break
        case 15: // MaxPool
            input = network.tensors[o.inputs[0]]
            output = network.tensors[o.outputs[0]]

            ctx.beginPath()
            ctx.moveTo(input.x + tensorRadius, input.y - tensorRadius)
            ctx.lineTo(output.x - tensorRadius, output.y - tensorRadius)

            ctx.lineTo(output.x - tensorRadius, output.y)
            ctx.lineTo(input.x + tensorRadius + 0.6*(output.x - tensorRadius - input.x - tensorRadius), (input.y + output.y)/2 )

            ctx.lineTo(input.x + tensorRadius + 0.4*(output.x - tensorRadius - input.x - tensorRadius), (input.y + output.y)/2 +tensorRadius)
            ctx.lineTo(input.x + tensorRadius, input.y + tensorRadius)

            ctx.closePath()
            ctx.fill()
            break
        default:
            break
    }
}























var seconds = 0;

function draw() {
    canvas.width = canvas.getBoundingClientRect().width
    canvas.height = canvas.getBoundingClientRect().height
    width = canvas.width
    height = canvas.height

    last_frame = this_frame
    this_frame = Date.now()
    var sec = (this_frame - last_frame) / 1000.0
    seconds += sec;

    /*
    ctx.fillStyle = "#2e3037"
    ctx.fillRect(0, 0, width, height)
    */


    var delta_x = mouseX - last_mouseX;
    var delta_y = mouseY - last_mouseY;
    last_mouseX = mouseX;
    last_mouseY = mouseY;

    if(grid){
        ctx.beginPath()

        for(let i = -tensorRadius; i < width; i+= tensorRadius*2){
            ctx.moveTo(i, 0)
            ctx.lineTo(i, height)
        }
        for(let i = -tensorRadius; i < height; i+= tensorRadius*2){
            ctx.moveTo(0, i)
            ctx.lineTo(width, i)
        }
        ctx.lineWidth = 0.5
        ctx.setLineDash([1,4])
        ctx.strokeStyle = 'Grey'

        ctx.closePath()
        ctx.stroke();
    }
    

    for (let i = 0; i < networks[0].operators.length; i++) {
        drawOperator(networks[0], i)
    }

    for (let i = 0; i < networks[0].tensors.length; i++) {
        drawTensor(networks[0], i)
        if(networks[networkIndex].tensors[i].selected && !selecting && down){
            var bounds = {
                x_min: tensorRadius*2 + inputs_margin,
                x_max: (canvas.width - tensorRadius*2 - outputs_margin) - (canvas.width % (tensorRadius*2)),
                y_min: tensorRadius*2,
                y_max: (canvas.height - tensorRadius*2) - ((canvas.height - tensorRadius*2) % tensorRadius*2)
            }
            
            placeTensor(networks[networkIndex],i,
                networks[networkIndex].tensors[i].tx + mouseX - tmX,
                networks[networkIndex].tensors[i].ty + mouseY - tmY, bounds, grid)
        }
    }


    


    if(selecting){
        ctx.fillStyle = "rgba(255,255,255,0)"
        ctx.lineWidth = 1
        ctx.strokeStyle = '#5dd2f0'
        ctx.setLineDash([3,2])
        ctx.beginPath()
        
        ctx.roundRect(tmX, tmY, mouseX-tmX, mouseY-tmY, tensorRadius * 0.2)
            
        ctx.stroke()
    }



    
    grid = Buttons[0].bool
    try{
        ctx.drawImage(grid_icon, Buttons[0].x, Buttons[0].y, Buttons[0].w, Buttons[0].h)
    }catch(e){
        ctx.fillStyle = "black"
        ctx.fillRect(Buttons[0].x, Buttons[0].y, Buttons[0].w, Buttons[0].h)
    }


    
    // Draw input box zone
    ctx.fillStyle = "#E0E0E0"
    ctx.fillRect(0, 0, inputs_margin, height + tensorRadius * 2)


    // Draw input boxes
    for(let i = 0; i < input_boxes.length; i++){

        ctx.fillStyle = "#84DBD7"
        ctx.roundRect((inputs_margin - input_box_width)/2, input_boxes[i].y - input_box_height/2, input_box_width, input_box_height, tensorRadius)
        ctx.fill()

        
        var t = networks[networkIndex].tensors[input_boxes[i].tensor_index]

        ctx.lineWidth = 1
        ctx.strokeStyle = "black"
        ctx.setLineDash([])
        ctx.beginPath()
        ctx.moveTo(inputs_margin - (inputs_margin - input_box_width)/2, input_boxes[i].y)
        
        
        if(Math.abs(input_boxes[i].y - t.y) < tensorRadius*2) {

            ctx.lineTo(inputs_margin - Math.abs(input_boxes[i].y - t.y)/2, input_boxes[i].y)
            if(input_boxes[i].y - t.y > 0){
                ctx.arc(  inputs_margin - Math.abs(input_boxes[i].y - t.y)/2, (input_boxes[i].y + t.y)/2, Math.abs(t.y - input_boxes[i].y)/2, Math.PI/2, 0, true)
                ctx.arc(  inputs_margin + Math.abs(input_boxes[i].y - t.y)/2, input_boxes[i].y - (input_boxes[i].y - t.y)/2, Math.abs(t.y - input_boxes[i].y)/2, Math.PI, 3*Math.PI/2)
            }else{
                ctx.arc(  inputs_margin - Math.abs(input_boxes[i].y - t.y)/2, (input_boxes[i].y + t.y)/2, Math.abs(t.y - input_boxes[i].y)/2, 3*Math.PI/2, 0)
                ctx.arc(  inputs_margin + Math.abs(input_boxes[i].y - t.y)/2, input_boxes[i].y - (input_boxes[i].y - t.y)/2, Math.abs(t.y - input_boxes[i].y)/2, Math.PI, Math.PI/2, true)
            }
            ctx.lineTo(t.x - tensorRadius, t.y)

        }else{
            
            if(input_boxes[i].y - t.y > 0){
                ctx.arc(  inputs_margin - tensorRadius, input_boxes[i].y - tensorRadius, tensorRadius, Math.PI/2, 0, true)
                ctx.arc(  inputs_margin + Math.min(Math.abs(input_boxes[i].y - t.y)/2, t.x-tensorRadius-inputs_margin) , t.y + Math.min( Math.abs(t.y - input_boxes[i].y)/2, t.x-tensorRadius-inputs_margin), Math.min( Math.abs(t.y - input_boxes[i].y)/2, t.x-tensorRadius-inputs_margin), Math.PI, 3*Math.PI/2)
            }else{
                ctx.arc(  inputs_margin - tensorRadius, input_boxes[i].y + tensorRadius, tensorRadius, 3*Math.PI/2, 0)
                ctx.arc(  inputs_margin + Math.min(Math.abs(input_boxes[i].y - t.y)/2, t.x-tensorRadius-inputs_margin) , t.y - Math.min( Math.abs(t.y - input_boxes[i].y)/2, t.x-tensorRadius-inputs_margin), Math.min( Math.abs(t.y - input_boxes[i].y)/2, t.x-tensorRadius-inputs_margin),  Math.PI, Math.PI/2, true)
            }
            ctx.lineTo(t.x - tensorRadius, t.y)
        }

        ctx.stroke()

    }



    ctx.fillStyle = "#E0E0E0"
    ctx.fillRect(width - outputs_margin , 0, width, height + tensorRadius * 2)


    window.requestAnimationFrame(draw);
}







function clear_selected(){
    for(let i = 0; i < networks[networkIndex].tensors.length; i++){
        networks[networkIndex].tensors[i].selected = false;
    }
}

//ineligant solution
export function highlighted_operators(){
    return getHoveredOperatorIndices(networks[networkIndex], mouseX, mouseY)
}

export function highlight_operators(op_list){
    for(let i = 0; i < networks[networkIndex].operators.length; i++){
        networks[networkIndex].operators[i].highlighted = false
    }
    for(let i = 0; i < op_list.length; i++){
        networks[networkIndex].operators[op_list[i]].highlighted = true
    }
}



function doDoubleClick(e) {

    let clickedList = getHoveredTensorIndices(networks[networkIndex], mouseX, mouseY)

    for (let i = 0; i < clickedList.length; i++) {
        var clickedIndex = clickedList[i]
        var t0 = networks[networkIndex].tensors[clickedIndex]
        if (t0.output_of == null || t0.input_to.length == 0) {

        }
        else {
            console.log("Unmerge")
            unmergeTensor(networks[networkIndex], clickedIndex)
        }
    }
}


function doMouseUp(e) {
    
    selecting = false;

    
    for(let i = 0; i < networks[networkIndex].tensors.length; i++){
        for(let j = 0; j < networks[networkIndex].tensors.length; j++){
                

            if(j == i){
                continue
            }
            var t1 = networks[networkIndex].tensors[i];
            var t2 = networks[networkIndex].tensors[j];

            if(Math.abs(t1.x - t2.x) < tensorRadius * 2 && Math.abs(t1.y - t2.y) < tensorRadius * 2){
                mergeTensors(networks[networkIndex], i, j);
            }
        }
    }
    
    
    down = false
    draggedIndex = -1
    dragged_operator_index = -1

    let clickedList = getHoveredTensorIndices(networks[networkIndex], mouseX, mouseY)

    if (clickedList.length >= 2) {
        mergeTensors(networks[networkIndex], clickedList[0], clickedList[1])
        // if either tensor are ghosts
    }
}

function doMouseDown(e) {
    down = true
    for(let i = 0; i < networks[networkIndex].tensors.length; i++){
        networks[networkIndex].tensors[i].tx = networks[networkIndex].tensors[i].x
        networks[networkIndex].tensors[i].ty = networks[networkIndex].tensors[i].y
    }
    tmX = mouseX;
    tmY = mouseY;


    // console.log("Mouse position: ",mouseX," ", mouseY)
    let draggedList = getHoveredTensorIndices(networks[networkIndex], mouseX, mouseY)

    if (draggedList.length != 0) {
        draggedIndex = draggedList[0]

        networks[networkIndex].tensors[draggedIndex].selected = true
        console.log(networks[networkIndex].tensors[draggedIndex].form)
    }

    let dragged_operators = getHoveredOperatorIndices(networks[networkIndex], mouseX, mouseY)

    if (dragged_operators.length != 0 && draggedList.length == 0){
        dragged_operator_index = dragged_operators[0]
        var op = networks[networkIndex].operators[dragged_operator_index]
        for(let i = 0; i < op.inputs.length; i++){
            networks[networkIndex].tensors[op.inputs[i]].selected = true
        }
        for(let i = 0; i < op.outputs.length; i++){
            networks[networkIndex].tensors[op.outputs[i]].selected = true
        }

        
    }

    if(draggedList.length == 0 && dragged_operators.length == 0){
        selecting = true
        clear_selected()
    }



    for(let i = 0; i < Buttons.length; i++){
        Buttons[i].press(mouseX, mouseY)
    }
}


function doMouseMove(e) {
    if (e.offsetX) {
        mouseX = e.offsetX;
        mouseY = e.offsetY;
    }
    else if (e.layerX) {
        mouseX = e.layerX;
        mouseY = e.layerY;
    }

    if(selecting){
        for(let i = 0; i < networks[networkIndex].tensors.length; i++){
            var t = networks[networkIndex].tensors[i]

            if(Math.abs(t.x - (tmX + mouseX)/2) < Math.abs(tmX - (tmX + mouseX)/2)
            && Math.abs(t.y - (tmY + mouseY)/2) < Math.abs(tmY - (tmY + mouseY)/2)){
                t.selected = true
            }else{
                t.selected = false
            }
        }
    }

}
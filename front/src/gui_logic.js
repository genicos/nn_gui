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

// What appears in the inputs or outputs area
class input_output_box{
    constructor(y){
        this.list_index = -1 //index in the network input_tensors or output_tensors list
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
    if (w < 0) {
        w = -w
        x -= w
    }
    if (h < 0) {
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

    
    var box = new input_output_box(y)

    for (let i = 0; i < networks[networkIndex].input_tensors.length; i++){
        if(networks[networkIndex].input_tensors[i] == tensor_index) {
            box.list_index = i;
        }
    }
    
    input_boxes.push(box)

}


function add_output_box(y, tensor_index = null){
    
    // If tensor doesnt exist, create it
    if (tensor_index == null){

        tensor_index = networks[networkIndex].add_tensor(new Tensor(false))
        
        // Set position of tensor
        networks[networkIndex].tensors[tensor_index].y = y
        networks[networkIndex].tensors[tensor_index].x = (width - outputs_margin - tensorRadius * 2) - ( (width - outputs_margin - tensorRadius * 2) % (tensorRadius*2) )
        
        //Add tensor to network outputs
        networks[networkIndex].output_tensors.push(tensor_index)
    }

    var box = new input_output_box(y)
    for(let i = 0; i < networks[networkIndex].output_tensors.length; i++){
        if(networks[networkIndex].output_tensors[i] == tensor_index){
            box.list_index = i;
        }
    }
    
    output_boxes.push(box)
}


// Returns the network object of the network we are working on
export function get_network(){
    return networks[networkIndex]
}

// Removes everything from network
export function clear_network(){
    networks[networkIndex] = new Network()
    network_init()
}




//Introduce a new operator to the canvas and network
// func is and int, which is the type of operator
// x and y are the positions of the top left corner of the operator
export function new_operator(func, x = inputs_margin + tensorRadius*2 * 2, y = tensorRadius*2 * 3){
    clear_selected()

    let new_op = new Operator()
    new_op.func = func

    var t_index = networks[networkIndex].tensors.length
    
    //unary operator
    if(function_table[func].type == 0){

        //Add input tensor
        networks[networkIndex].add_tensor(new Tensor(false))
        networks[networkIndex].tensors[t_index + 0].x = x + tensorRadius*2 * 0
        networks[networkIndex].tensors[t_index + 0].y = y + tensorRadius*2 * 0
        new_op.inputs  = [t_index + 0]

        //Add output tensor
        networks[networkIndex].add_tensor(new Tensor(false))
        networks[networkIndex].tensors[t_index + 1].x = x + tensorRadius*2 * 3
        networks[networkIndex].tensors[t_index + 1].y = y + tensorRadius*2 * 0
        new_op.outputs = [t_index + 1]

    }

    //side binary operator
    if(function_table[func].type == 2){
        
        //Add first tensor 
        networks[networkIndex].add_tensor(new Tensor(false))
        networks[networkIndex].tensors[t_index + 0].x = x + tensorRadius*2 * 0
        networks[networkIndex].tensors[t_index + 0].y = y + tensorRadius*2 * 2

        //Add second tensor
        networks[networkIndex].add_tensor(new Tensor(false))
        networks[networkIndex].tensors[t_index + 1].x = x + tensorRadius*2 * 2
        networks[networkIndex].tensors[t_index + 1].y = y + tensorRadius*2 * 0

        //Add output tensor
        networks[networkIndex].add_tensor(new Tensor(false))
        networks[networkIndex].tensors[t_index + 2].x = x + tensorRadius*2 * 4
        networks[networkIndex].tensors[t_index + 2].y = y + tensorRadius*2 * 2

        new_op.inputs  = [t_index + 0, t_index + 1]
        new_op.outputs = [t_index + 2]
    }

    //top binary operator
    if(function_table[func].type == 1){

        //Add first input tensor
        networks[networkIndex].add_tensor(new Tensor(false))
        networks[networkIndex].tensors[t_index + 0].x = x + tensorRadius*2 * 0
        networks[networkIndex].tensors[t_index + 0].y = y + tensorRadius*2 * 2

        //Add second input tensor
        networks[networkIndex].add_tensor(new Tensor(false))
        networks[networkIndex].tensors[t_index + 1].x = x + tensorRadius*2 * 0
        networks[networkIndex].tensors[t_index + 1].y = y + tensorRadius*2 * 0

        //Add output tensor
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

    
    var intra_operator_index = 0; //index of tensor in either operator.inputs or operator.outputs
    var operator = networks[networkIndex].operators[operator_index]

    //Finding the intra_operator_index of the tensor
    if(forward){
        for(let i = 0; i < operator.inputs.length; i++){
            if(operator.inputs[i] == tensor_index){
                intra_operator_index = i
            }
        }
    }else{
        for(let i = 0; i < operator.outputs.length; i++){
            if(operator.outputs[i] == tensor_index){
                intra_operator_index = i
            }
        }
    }

    var input0 = networks[networkIndex].tensors[operator.inputs[0]]
    var output = networks[networkIndex].tensors[operator.outputs[0]]
    var input1
    if(operator.inputs.length > 1)
        input1 = networks[networkIndex].tensors[operator.inputs[1]]
    

    switch(operator.func){
        case 2://Fully Connected
            if(forward){
                if(intra_operator_index == 0){
                    if(output.live){
                        input1.form = [input0.size, output.size]
                        input1.live = true
                        input1.calc_size()
                        propogate_shape(input1.output_of, operator.inputs[1], false)
                    }else if(input1.live){
                        output.form = [input1.form[1]]
                        output.live = true
                        output.calc_size()
                        for(let i = 0; i < output.input_to; i++){
                            propogate_shape(output.input_to[i], operator.outputs[0], true)
                        }
                    }
                }else{
                    input0.form = [input1.form[0]]
                    input0.live = true
                    input0.calc_size()
                    propogate_shape(input0.output_of, operator.inputs[0], false)

                    output.form = [input1.form[1]]
                    output.live = true
                    output.calc_size()
                    for(let i = 0; i < output.input_to; i++){
                        propogate_shape(output.input_to[i], operator.outputs[0], true)
                    }
                }
            }else{
                if(input0.live){
                    input1.form = [input0.size, output.size]
                    input1.live = true
                    input1.calc_size()
                    propogate_shape(input1.output_of, operator.inputs[1], false)
                }
            }
            break;
        case 3://Convolution
            if(forward){
                if(intra_operator_index == 0){
                    if(output.live){
                        input1.form = [input0.form[0] - output.form[0] + 1, input0.form[1] - output.form[1] + 1, output.form[2]]
                        input1.live = true
                        input1.calc_size()
                        propogate_shape(input1.output_of, operator.inputs[1], false)
                    }else if(input1.live){
                        output.form = [input0.form[0] - input1.form[0] + 1, input0.form[1] - input1.form[1] + 1, input1.form[2]]
                        output.live = true
                        output.calc_size()
                        for(let i = 0; i < output.input_to; i++){
                            propogate_shape(output.input_to[i], operator.outputs[0], true)
                        }
                    }
                }else{
                    if(output.live){
                        input0.form = [input1.form[0] + output.form[0] - 1, input1.form[1] + output.form[1] - 1]
                        input0.live = true
                        input0.calc_size()
                        propogate_shape(input1.output_of, operator.inputs[1], false)
                    }else if(input0.live){
                        output.form = [input0.form[0] - input1.form[0] + 1, input0.form[1] - input1.form[1] + 1, input1.form[2]]
                        output.live = true
                        output.calc_size()
                        for(let i = 0; i < output.input_to; i++){
                            propogate_shape(output.input_to[i], operator.outputs[0], true)
                        }
                    }
                }
            }else{
                if(input0.live){
                    input1.form = [input0.form[0] - output.form[0] + 1, input0.form[1] - output.form[1] + 1, output.form[2]]
                    input1.live = true
                    input1.calc_size()
                    propogate_shape(input1.output_of, operator.inputs[1], false)
                }else if(input1.live){
                    input0.form = [input1.form[0] + output.form[0] - 1, input1.form[1] + output.form[1] - 1]
                    input0.live = true
                    input0.calc_size()
                    propogate_shape(input1.output_of, operator.inputs[1], false)
                }
            }
            break;
        case 4://ReLU
            if(forward){
                output.form = input0.form
                output.live = true
                output.calc_size()
                for(let i = 0; i < output.input_to; i++){
                    propogate_shape(output.input_to[i], operator.outputs[0], true)
                }
            }else{
                input0.form = output.form
                input0.live = true
                input0.calc_size()
                propogate_shape(input0.output_of, operator.inputs[0], false)
            }
            break;
        case 5://Softmax
            if(forward){
                output.form = input0.form
                output.live = true
                output.calc_size()
                for(let i = 0; i < output.input_to; i++){
                    propogate_shape(output.input_to[i], operator.outputs[0], true)
                }
            }else{
                input0.form = output.form
                input0.live = true
                input0.calc_size()
                propogate_shape(input0.output_of, operator.inputs[0], false)
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


//Initializes the input and output boxes
function network_init(){
    //Add initial input box , cus every network must have at least one input
    add_input_box(height/2 - (height/2 % (tensorRadius*2)))

    //Add initial output box, cus every network must have at least one output
    add_output_box(height/2 - (height/2 % (tensorRadius*2)))

    //new_operator(10)
}

// Initialize the canvas and some objects
//   is called after html canvas objects loads
export function init() {

    //Initliaze canvas so we can draw on it and listen to mouse events
    canvas = document.getElementById("gui_canvas")
    canvas.addEventListener("mousedown", doMouseDown, false)
    canvas.addEventListener("mousemove", doMouseMove, false)
    canvas.addEventListener("mouseup", doMouseUp, false)
    canvas.addEventListener("dblclick", doDoubleClick, false)
    ctx = canvas.getContext("2d");

    //making sure canvas takes up the space its given
    canvas.width = canvas.getBoundingClientRect().width
    canvas.height = canvas.getBoundingClientRect().height

    width = canvas.width;
    height = canvas.height;

    //Initializing frame times
    last_frame = Date.now()
    this_frame = Date.now()

    //Creating input and output boxes
    network_init()

    
    //Drawing the first frame
    window.requestAnimationFrame(draw);
}




// Draws the tensor specified by tensorIndex
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

//Draws 'parallel' solid bars.
// the bars will be in a quadrilateral defined by the four points
//  (x1, y1), (x2, y2), (x3, y3), (x4, y4)
// bars is the number of bars
// solid is the proportion of the size of the solid bar, to the gap between bars
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


//Drawing the operator defined by operatorIndex
function drawOperator(network, operatorIndex) {
    let o = network.operators[operatorIndex]
    
    let input1
    let input2

    let input = network.tensors[o.inputs[0]]
    let output = network.tensors[o.outputs[0]]

    function x_proportion(prop){
        return input.x + tensorRadius + prop*(output.x - input.x - tensorRadius*2)
    }
    function y_proportion(prop){
        return input.y + prop*(output.y - input.y)
    }

    let halfx = input.x + 0.5*(output.x - input.x)

    //The orange to blue gradient
    let functionGradient = ctx.createLinearGradient(0, 0, width, 0)
    if(o.highlighted){
        functionGradient.addColorStop(0, "#E5914D")
        functionGradient.addColorStop(1, "#4DA1E5")
    }else{
        functionGradient.addColorStop(0, "#DE7521")
        functionGradient.addColorStop(1, "#218ADE")
    }

    ctx.fillStyle = functionGradient

    switch (o.func) {
        case 0: // abstraction
            break
        case 1: // identity
            input = network.tensors[o.inputs[0]]
            output = network.tensors[o.outputs[0]]

            ctx.beginPath()
            ctx.moveTo(input.x + tensorRadius, input.y + tensorRadius)
            ctx.lineTo(input.x + tensorRadius, input.y - tensorRadius)

            ctx.lineTo(output.x - tensorRadius, output.y - tensorRadius)
            ctx.lineTo(output.x - tensorRadius, output.y + tensorRadius)

            ctx.closePath()
            ctx.fill()
            break
        
        case 2: // Fully Connected
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
        case 3: // convolution
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
        case 4: // ReLU
            input = network.tensors[o.inputs[0]]
            output = network.tensors[o.outputs[0]]

            
            ctx.beginPath()
            ctx.moveTo(input.x + tensorRadius, input.y - tensorRadius)
            ctx.lineTo(output.x - tensorRadius, output.y - tensorRadius)

            ctx.lineTo(output.x - tensorRadius, output.y)
            ctx.lineTo(input.x + tensorRadius + 0.5*(output.x - tensorRadius - input.x - tensorRadius), (input.y + output.y)/2 )

            ctx.lineTo(input.x + tensorRadius + 0.5*(output.x - tensorRadius - input.x - tensorRadius), (input.y + output.y)/2 +tensorRadius)
            ctx.lineTo(input.x + tensorRadius, input.y + tensorRadius)

            ctx.closePath()
            ctx.fill()
            
            break
        case 5: // softmax
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
        case 6: // MaxPool
            input = network.tensors[o.inputs[0]]
            output = network.tensors[o.outputs[0]]

            
            var center_portion  = 0.6

            ctx.beginPath()
            ctx.moveTo(input.x + tensorRadius, input.y - tensorRadius)
            ctx.lineTo(output.x - tensorRadius, output.y - tensorRadius)

            ctx.lineTo(output.x - tensorRadius, output.y)
            ctx.lineTo(halfx, (input.y + output.y)/2 - center_portion*tensorRadius)

            ctx.lineTo(halfx, (input.y + output.y)/2)
            ctx.lineTo(output.x - tensorRadius, output.y)

            ctx.lineTo(output.x - tensorRadius, output.y + tensorRadius)
            ctx.lineTo(halfx, (input.y + output.y)/2 + tensorRadius - center_portion*tensorRadius)

            ctx.lineTo(halfx, (input.y + output.y)/2 + tensorRadius)
            ctx.lineTo(input.x + tensorRadius, input.y + tensorRadius)

            ctx.closePath()
            ctx.fill()
            break
        case 7: //Zero padding layer
            input = network.tensors[o.inputs[0]]
            output = network.tensors[o.outputs[0]]

            let halfx = x_proportion(0.5)
            let skinnyness = 0.7;

            ctx.beginPath()
            ctx.moveTo(input.x + tensorRadius, input.y + tensorRadius * skinnyness)
            ctx.lineTo(input.x + tensorRadius, input.y - tensorRadius * skinnyness)

            ctx.lineTo(halfx, (input.y + output.y)/2 - tensorRadius * skinnyness)
            ctx.lineTo(halfx, (input.y + output.y)/2 - tensorRadius)

            ctx.lineTo(output.x - tensorRadius, output.y - tensorRadius)
            ctx.lineTo(output.x - tensorRadius, output.y + tensorRadius)

            
            ctx.lineTo(halfx, (input.y + output.y)/2 + tensorRadius)
            ctx.lineTo(halfx, (input.y + output.y)/2 + tensorRadius * skinnyness)

            ctx.closePath()
            ctx.fill()

            break;
        case 8:
            
            let stub_size = 0.3;

            ctx.beginPath()
            ctx.moveTo(input.x + tensorRadius, input.y + tensorRadius)
            ctx.lineTo(input.x + tensorRadius, input.y - tensorRadius)

            ctx.lineTo(input.x + tensorRadius + 1.0/8*(output.x - input.x - tensorRadius*2),input.y + 1.0/8*(output.y - input.y) - tensorRadius)
            ctx.lineTo(input.x + tensorRadius + 1.0/8*(output.x - input.x - tensorRadius*2),input.y + 1.0/8*(output.y - input.y) - (1+stub_size)*tensorRadius)
            
            ctx.lineTo(input.x + tensorRadius + 2.0/8*(output.x - input.x - tensorRadius*2),input.y + 2.0/8*(output.y - input.y) - (1+stub_size)*tensorRadius)
            ctx.lineTo(input.x + tensorRadius + 2.0/8*(output.x - input.x - tensorRadius*2),input.y + 2.0/8*(output.y - input.y) - tensorRadius)
                
            ctx.lineTo(output.x - tensorRadius, output.y - tensorRadius)
            ctx.lineTo(output.x - tensorRadius, output.y + tensorRadius)

            ctx.lineTo(input.x + tensorRadius + 3.0/8*(output.x - input.x - tensorRadius*2),input.y + 3.0/8*(output.y - input.y) + tensorRadius)
            ctx.lineTo(input.x + tensorRadius + 3.0/8*(output.x - input.x - tensorRadius*2),input.y + 3.0/8*(output.y - input.y) + (1+stub_size)*tensorRadius)

            ctx.lineTo(input.x + tensorRadius + 2.0/8*(output.x - input.x - tensorRadius*2),input.y + 2.0/8*(output.y - input.y) + (1+stub_size)*tensorRadius)
            ctx.lineTo(input.x + tensorRadius + 2.0/8*(output.x - input.x - tensorRadius*2),input.y + 2.0/8*(output.y - input.y) + tensorRadius)
            
            ctx.closePath()
            ctx.fill()

            break;
        case 10:

            let pinch_size = 0.5
            let pinch_x_prop = 0.55
            
            ctx.beginPath()
            ctx.moveTo(input.x + tensorRadius, input.y + tensorRadius)
            ctx.lineTo(input.x + tensorRadius, input.y - tensorRadius)

            ctx.lineTo(x_proportion(0.5),y_proportion(0.5) - tensorRadius)
            ctx.lineTo(x_proportion(pinch_x_prop),y_proportion(pinch_x_prop) - tensorRadius*pinch_size)

            ctx.lineTo(output.x - tensorRadius, output.y - tensorRadius)
            ctx.lineTo(output.x - tensorRadius, output.y + tensorRadius)

            ctx.lineTo(x_proportion(pinch_x_prop),y_proportion(pinch_x_prop) + tensorRadius*pinch_size)
            ctx.lineTo(x_proportion(0.5),y_proportion(0.5) + tensorRadius)

            ctx.closePath()
            ctx.fill()
            break;
        case 19: // add, NOT IN USE
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
        default:
            break
    }
}























var seconds = 0;
//Update function, this is called for every frame
function draw() {
    canvas.width = canvas.getBoundingClientRect().width
    canvas.height = canvas.getBoundingClientRect().height
    width = canvas.width
    height = canvas.height

    //Calculating time that has passed since last frame was drawn
    last_frame = this_frame
    this_frame = Date.now()
    var sec = (this_frame - last_frame) / 1000.0
    seconds += sec;

    //Draw grid lines
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
    
    //Draw all operators
    for (let i = 0; i < networks[0].operators.length; i++) {
        drawOperator(networks[0], i)
    }

    //Draw all tensors, and handle movement
    for (let i = 0; i < networks[0].tensors.length; i++) {
        drawTensor(networks[0], i)

        //If tensor is being dragged, move it
        if(networks[networkIndex].tensors[i].selected && !selecting && down){

            // These bounds restrict the tensor movement
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


    

    //Draw selection box
    if(selecting){
        ctx.fillStyle = "rgba(255,255,255,0)"
        ctx.lineWidth = 1
        ctx.strokeStyle = '#5dd2f0'
        ctx.setLineDash([3,2])
        ctx.beginPath()
        
        ctx.roundRect(tmX, tmY, mouseX-tmX, mouseY-tmY, tensorRadius * 0.2)
            
        ctx.stroke()
    }



    // Draw grid button
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

        //draw actual box
        ctx.fillStyle = "#F2C8A6"
        ctx.roundRect((inputs_margin - input_box_width)/2, input_boxes[i].y - input_box_height/2, input_box_width, input_box_height, tensorRadius)
        ctx.fill()

        // The rest of this draws the line that connects the box to the input tensor
        var t = networks[networkIndex].tensors[networks[networkIndex].input_tensors[input_boxes[i].list_index]]

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


    // Draw output box zone
    ctx.fillStyle = "#E0E0E0"
    ctx.fillRect(width - outputs_margin , 0, width, height + tensorRadius * 2)

    // Draw output boxes
    for(let i = 0; i < output_boxes.length; i++){

        //Draw the actual output box
        ctx.fillStyle = "#A6D0F2"
        ctx.roundRect( width - outputs_margin + (outputs_margin - output_box_width)/2, output_boxes[i].y - output_box_height/2, output_box_width, output_box_height, tensorRadius)
        ctx.fill()

        // The rest of this draws the line that connects the output box to the output tensor
        var t = networks[networkIndex].tensors[networks[networkIndex].output_tensors[output_boxes[i].list_index]]

        ctx.lineWidth = 1
        ctx.strokeStyle = "black"
        ctx.setLineDash([])
        ctx.beginPath()
        ctx.moveTo(width - outputs_margin + (outputs_margin - output_box_width)/2, output_boxes[i].y)
        
        
        if(Math.abs(output_boxes[i].y - t.y) < tensorRadius*2) {

            ctx.lineTo(width - outputs_margin + Math.abs(output_boxes[i].y - t.y)/2, output_boxes[i].y)
            if(output_boxes[i].y - t.y > 0){
                ctx.arc(  width - outputs_margin + Math.abs(output_boxes[i].y - t.y)/2, (output_boxes[i].y + t.y)/2, Math.abs(t.y - output_boxes[i].y)/2, Math.PI/2, Math.PI)
                ctx.arc(  width - outputs_margin - Math.abs(output_boxes[i].y - t.y)/2, output_boxes[i].y - (output_boxes[i].y - t.y)/2, Math.abs(t.y - output_boxes[i].y)/2, 0, -Math.PI/2, true )
            }else{
                ctx.arc(  width - outputs_margin + Math.abs(output_boxes[i].y - t.y)/2, (output_boxes[i].y + t.y)/2, Math.abs(t.y - output_boxes[i].y)/2, 3*Math.PI/2, Math.PI, true)
                ctx.arc(  width - outputs_margin - Math.abs(output_boxes[i].y - t.y)/2, output_boxes[i].y - (output_boxes[i].y - t.y)/2, Math.abs(t.y - output_boxes[i].y)/2, 0, Math.PI/2)
            }
            ctx.lineTo(t.x + tensorRadius, t.y)

        }else{
            
            if(output_boxes[i].y - t.y > 0){
                ctx.arc(  width - outputs_margin + tensorRadius, output_boxes[i].y - tensorRadius, tensorRadius, Math.PI/2, Math.PI)
                ctx.arc(  width - outputs_margin - Math.min(Math.abs(output_boxes[i].y - t.y)/2, width - outputs_margin - t.x-tensorRadius) , t.y + Math.min( Math.abs(t.y - output_boxes[i].y)/2, width - outputs_margin - t.x-tensorRadius), Math.min( Math.abs(t.y - output_boxes[i].y)/2, width - outputs_margin - t.x-tensorRadius), 0, -Math.PI/2, true)
            }else{
                ctx.arc(  width - outputs_margin + tensorRadius, output_boxes[i].y + tensorRadius, tensorRadius, 3*Math.PI/2, Math.PI, true)
                ctx.arc(  width - outputs_margin - Math.min(Math.abs(output_boxes[i].y - t.y)/2, width - outputs_margin - t.x-tensorRadius) , t.y - Math.min( Math.abs(t.y - output_boxes[i].y)/2, width - outputs_margin - t.x-tensorRadius), Math.min( Math.abs(t.y - output_boxes[i].y)/2, width - outputs_margin - t.x-tensorRadius),  0, Math.PI/2)
            }
            ctx.lineTo(t.x + tensorRadius, t.y)
        }

        ctx.stroke()

    }

    //re draw frame, for an infinite loop
    window.requestAnimationFrame(draw);
}






// Un select all tensors
function clear_selected(){
    for(let i = 0; i < networks[networkIndex].tensors.length; i++){
        networks[networkIndex].tensors[i].selected = false;
    }
}

// sets the operators in op_list to highlighted
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

    //Unmerge when we double click
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

    //If we placed tensors over eatchother, merge them
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
    
    // Reset mousedown variables
    down = false
    draggedIndex = -1
    dragged_operator_index = -1
}

function doMouseDown(e) {

    down = true

    //Record location of tensors when mouse was pressed down
    for(let i = 0; i < networks[networkIndex].tensors.length; i++){
        networks[networkIndex].tensors[i].tx = networks[networkIndex].tensors[i].x
        networks[networkIndex].tensors[i].ty = networks[networkIndex].tensors[i].y
    }
    tmX = mouseX;
    tmY = mouseY;


    //Find out which tensor is pressed
    let draggedList = getHoveredTensorIndices(networks[networkIndex], mouseX, mouseY)
    if (draggedList.length != 0) {
        draggedIndex = draggedList[0]

        //selecting the pressed tensor
        networks[networkIndex].tensors[draggedIndex].selected = true
    }

    //Find out which operator is pressed
    let dragged_operators = getHoveredOperatorIndices(networks[networkIndex], mouseX, mouseY)
    if (dragged_operators.length != 0 && draggedList.length == 0){
        
        dragged_operator_index = dragged_operators[0]
        
        var operator = networks[networkIndex].operators[dragged_operator_index]
        
        //Selecting all tensors associated with the pressed operator
        for(let i = 0; i < operator.inputs.length; i++){
            networks[networkIndex].tensors[operator.inputs[i]].selected = true
        }
        for(let i = 0; i < operator.outputs.length; i++){
            networks[networkIndex].tensors[operator.outputs[i]].selected = true
        }
    }

    //If we pressed nothing, unselect everything
    if(draggedList.length == 0 && dragged_operators.length == 0){
        selecting = true
        clear_selected()
    }

    //Check for button pressed
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

    //Check if our selection box is over a tensor, if so, select it
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
import {Network} from "./define_network_objects"
import {Tensor} from "./define_network_objects"
import {Operator} from "./define_network_objects"

import { placeTensor } from "./mouse_network_interaction"
import {nudgeTensor} from "./mouse_network_interaction"
import {getHoveredTensorIndices} from "./mouse_network_interaction"
import {getHoveredOperatorIndices} from "./mouse_network_interaction"

import {unmergeTensor} from "./network_logic"
import {mergeTensors} from "./network_logic"

var canvas = 0
var ctx = 0


var width = 0;
var height = 0;

const tensorRadius = 10
const scalarTensorRadius = 5
const defaultFunctionLength = 50

var down = false
var draggedIndex = -1
var dragged_operator_index = -1


var last_mouseX = 0;
var last_mouseY = 0;
var mouseX = 0;
var mouseY = 0;
var tmX = 0;
var tmY = 0;

var last_frame = Date.now()
var this_frame = Date.now()

var networks = []
var networkIndex = 0

var selecting = false

var grid = true




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


networks.push(new Network())



export function get_list_of_operators(){
    return networks[networkIndex].operators
}











export function clear_network(){
    networks[networkIndex] = new Network()
}

export function new_operator(type, x = tensorRadius*2 * 2, y = tensorRadius*2 * 3){
    clear_selected()
    var unary = false
    var side_binary = false
    var top_binary = false;

    switch(type){
        case 0:
            break
        case 1:
            break
        case 2: //add
            side_binary = true;
            break
        case 4://subtract
            side_binary = true;
            break;
        case 4://scalse
            top_binary = true;
            break;
        case 5://full
            top_binary = true;
            break;
        case 6://amass
            unary = true;
            break;
        case 7://softmax
            unary = true;
            break;
        case 8://hardmax
            unary = true;
            break;
        case 9://max
            unary = true;
            break;
        case 10://convolution
            top_binary = true;
            break;
        case 11://squared_dist
            side_binary = true
            break;
        case 12://ReLU
            unary = true
            break;
        default:
            break;
    }


    let new_op = new Operator()
    new_op.func = type

    var t_index = networks[networkIndex].tensors.length
    if(unary){

        networks[networkIndex].add_tensor(new Tensor(false))
        networks[networkIndex].tensors[t_index + 0].x = x + tensorRadius*2 * 0
        networks[networkIndex].tensors[t_index + 0].y = y + tensorRadius*2 * 0

        networks[networkIndex].add_tensor(new Tensor(false))
        networks[networkIndex].tensors[t_index + 1].x = x + tensorRadius*2 * 3
        networks[networkIndex].tensors[t_index + 1].y = y + tensorRadius*2 * 0

        new_op.inputs  = [t_index + 0]
        new_op.outputs = [t_index + 1]
    }
    if(top_binary){
        
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

    if(side_binary){

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


class Button{
    constructor(x, y, w, h, bool=false){
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.bool = bool;
    }
    press(x, y){
        if(this.x <= x && this.x + this.w >= x
        && this.y <= y && this.y + this.h >= y){
            this.bool = !this.bool
        }
    }
}





var Buttons = []
var b = new Button(tensorRadius*1, tensorRadius*1, tensorRadius*4, tensorRadius*4, true);
Buttons.push(b)
var grid_icon = new Image()
grid_icon.src = "grid_icon.png"





export function edit_tensor(tensor_index, new_shape){
    var t = networks[networkIndex].tensors[tensor_index]
    t.form = new_shape
    t.calc_size()
    console.log("whyy" + String(t.size))
    t.live = true
    for(let i = 0; i < t.input_to.length; i++){
        propogate_shape(t.input_to[i], tensor_index, true)
    }
    if(t.output_of != null){
        propogate_shape(t.output_of, tensor_index, false)
    }
}

// forward is bool
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

    
    window.requestAnimationFrame(draw);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


var seconds = 0;

function drawTensor(network, tensorIndex) {
    let t = network.tensors[tensorIndex]

    if (t.live) {
        ctx.fillStyle = "white"
        ctx.lineWidth = 1
        ctx.setLineDash([])
        ctx.strokeStyle = 'black'
    }
    else {
        ctx.fillStyle = "rgba(255,255,255,0)"
        ctx.lineWidth = 1
        ctx.setLineDash([3,4])
        ctx.strokeStyle = 'Grey'
    }

    ctx.beginPath()
    if (t.scalar) {
        ctx.rect(t.x - scalarTensorRadius, t.y - scalarTensorRadius, 2 * scalarTensorRadius, 2 * scalarTensorRadius)
    }
    else {
        ctx.rect(t.x - tensorRadius, t.y - tensorRadius, 2 * tensorRadius, 2 * tensorRadius)
    }
    ctx.fill()
    ctx.stroke()

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

// here we draw the function naively without checking for tensor positions. That must be handled 
// by movement logic
function drawOperator(network, operatorIndex) {
    let o = network.operators[operatorIndex]
    let input
    let input1
    let input2
    let output

    let functionGradient = ctx.createLinearGradient(0, 0, width, height)
    functionGradient.addColorStop(0, "#DE7521")
    functionGradient.addColorStop(1, "#218ADE")

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
            ctx.moveTo(input1.x + tensorRadius, input1.y - tensorRadius + (tensorRadius * 2 / (tapes*2 - 1)))
            ctx.lineTo(input1.x + tensorRadius, input1.y - tensorRadius)
            
            ctx.lineTo(input2.x - tensorRadius, input2.y + tensorRadius)
            ctx.lineTo(input2.x + tensorRadius, input2.y + tensorRadius)

            ctx.lineTo(output.x - tensorRadius, output.y - tensorRadius)
            ctx.lineTo(output.x - tensorRadius, output.y - tensorRadius + (tensorRadius * 2 / (tapes*2 - 1)))
            
            //not quite sure how this works but it does
            for(let i = 1; i < tapes*2 - 1; i += 2){
                ctx.lineTo(input1.x + tensorRadius, input1.y - tensorRadius + (tensorRadius * 2 / (tapes*2 - 1))*i )
                ctx.lineTo(input1.x + tensorRadius, input1.y - tensorRadius + (tensorRadius * 2 / (tapes*2 - 1))*(i+1) ) 

                ctx.lineTo(output.x - tensorRadius, output.y - tensorRadius + (tensorRadius * 2 / (tapes*2 - 1))*(i+1) )
                ctx.lineTo(output.x - tensorRadius, output.y - tensorRadius + (tensorRadius * 2 / (tapes*2 - 1))*(i+2) )
            }

            ctx.lineTo(input1.x + tensorRadius, input1.y + tensorRadius)
           
            ctx.closePath()
            ctx.fill()
            break
        case 11: // squared dist
            break
        case 12: // PReLU
            input = network.tensors[o.inputs[0]]
            output = network.tensors[o.outputs[0]]

            ctx.beginPath()
            ctx.moveTo(input.x + tensorRadius, input.y + tensorRadius)
            ctx.lineTo(input.x + tensorRadius, input.y - tensorRadius)


            ctx.lineTo(output.x - tensorRadius, output.y - tensorRadius)
            ctx.lineTo(output.x - tensorRadius, output.y - tensorRadius + (tensorRadius * 2 / (tapes*2 - 1))) 

            //very ugly i hate it
            for(let i = 1; i < tapes*2 - 1; i += 2){
                ctx.lineTo((output.x + input.x)/2, (output.y + input.y)/2 - tensorRadius + (tensorRadius * 2 / (tapes*2 - 1))*i )
                ctx.lineTo((output.x + input.x)/2, (output.y + input.y)/2 - tensorRadius + (tensorRadius * 2 / (tapes*2 - 1))*(i+1) ) 

                ctx.lineTo(output.x - tensorRadius, output.y - tensorRadius + (tensorRadius * 2 / (tapes*2 - 1))*(i+1) )
                ctx.lineTo(output.x - tensorRadius, output.y - tensorRadius + (tensorRadius * 2 / (tapes*2 - 1))*(i+2) )
            }

        
            ctx.closePath()
            ctx.fill()
            break
        default:
            console.log("Invalid operator types")
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
            placeTensor(networks[networkIndex],i,
                networks[networkIndex].tensors[i].tx + mouseX - tmX,
                networks[networkIndex].tensors[i].ty + mouseY - tmY, grid)
        }
    }


    


    if(selecting){
        ctx.fillStyle = "rgba(255,255,255,0)"
        ctx.lineWidth = 1
        ctx.strokeStyle = '#5dd2f0'
        ctx.setLineDash([3,2])
        ctx.beginPath()
        
        ctx.roundRect(tmX,tmY,mouseX-tmX,mouseY-tmY, tensorRadius * 0.2)
            
        ctx.stroke()
    }



    
    grid = Buttons[0].bool
    try{
        ctx.drawImage(grid_icon, Buttons[0].x, Buttons[0].y, Buttons[0].w, Buttons[0].h)
    }catch(e){
        ctx.fillStyle = "black"
        ctx.fillRect(Buttons[0].x, Buttons[0].y, Buttons[0].w, Buttons[0].h)
    }
    
    




    window.requestAnimationFrame(draw);
}







function clear_selected(){
    for(let i = 0; i < networks[networkIndex].tensors.length; i++){
        networks[networkIndex].tensors[i].selected = false;
    }
}




function doDoubleClick(e) {

    let clickedList = getHoveredTensorIndices(networks[networkIndex], mouseX, mouseY)

    for (let i = 0; i < clickedList.length; i++) {
        var clickedIndex = clickedList[i]
        var t0 = networks[networkIndex].tensors[clickedIndex]
        if (t0.output_of == null || t0.input_to.length == 0) {
            t0.live = !t0.live
            //TODO remove reshaping
            
            edit_tensor(clickedIndex, [10])

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
        if(!networks[networkIndex].tensors[draggedIndex].selected){
            clear_selected()
        }
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
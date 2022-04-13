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
networks[0].add_tensor(new Tensor(false))
networks[0].tensors[0].x = 200
networks[0].tensors[0].y = 200

networks[0].add_tensor(new Tensor(false))
networks[0].tensors[1].x = 100
networks[0].tensors[1].y = 200

networks[0].add_tensor(new Tensor(false))
networks[0].tensors[2].x = 140
networks[0].tensors[2].y = 140

let op0 = new Operator()
op0.inputs = [1, 2]
op0.outputs = [0]
op0.func = 10

networks[0].add_operator(op0)




networks[0].add_tensor(new Tensor(true))
networks[0].tensors[3].x = 400
networks[0].tensors[3].y = 200

networks[0].add_tensor(new Tensor(true))
networks[0].tensors[4].x = 300
networks[0].tensors[4].y = 200

networks[0].add_tensor(new Tensor(false))
networks[0].tensors[5].x = 340
networks[0].tensors[5].y = 140

networks[0].add_tensor(new Tensor(true))
networks[0].tensors[6].x = 340
networks[0].tensors[6].y = 340

let op1 = new Operator()
op1.inputs = [4, 5]
op1.outputs = [3]
op1.func = 2
networks[0].add_operator(op1)



networks[0].add_tensor(new Tensor(true))
networks[0].tensors[7].x = 500
networks[0].tensors[7].y = 200

networks[0].add_tensor(new Tensor(true))
networks[0].tensors[8].x = 400
networks[0].tensors[8].y = 200

networks[0].add_tensor(new Tensor(true))
networks[0].tensors[9].x = 440
networks[0].tensors[9].y = 140

networks[0].add_tensor(new Tensor(true))
networks[0].tensors[10].x = 440
networks[0].tensors[10].y = 340

let op2 = new Operator()
op2.inputs = [8, 9]
op2.outputs = [7]
op2.func = 5
networks[0].add_operator(op2)




let op3 = new Operator()
op3.inputs = [6]
op3.outputs = [10]
op3.func = 7
networks[0].add_operator(op3)

networks[0].add_tensor(new Tensor(true))
networks[0].tensors[11].x = 400
networks[0].tensors[11].y = 400

networks[0].add_tensor(new Tensor(true))
networks[0].tensors[12].x = 500
networks[0].tensors[12].y = 400



let op4 = new Operator()
op4.inputs = [11]
op4.outputs = [12]
op4.func = 12
networks[0].add_operator(op4)



export function clear_network(){
    networks[networkIndex] = new Network()
}

export function new_operator(type, x = tensorRadius*2 * 2, y = tensorRadius*2 * 3){
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

    new_operator(2)
    
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


    var delta_x = mouseX - last_mouseX;
    var delta_y = mouseY - last_mouseY;
    last_mouseX = mouseX;
    last_mouseY = mouseY;

    if(grid){
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

    /*
    if(draggedIndex != -1){

        placeTensor(networks[networkIndex], draggedIndex, mouseX, mouseY, grid)

    }else if(dragged_operator_index != -1){
        var dragged_op = networks[networkIndex].operators[dragged_operator_index]

        for(let i = 0; i < dragged_op.inputs.length; i++){
            placeTensor(networks[networkIndex],dragged_op.inputs[i],
                networks[networkIndex].tensors[dragged_op.inputs[i]].tx + mouseX - tmX,
                networks[networkIndex].tensors[dragged_op.inputs[i]].ty + mouseY - tmY, grid)
        }
        for(let i = 0; i < dragged_op.outputs.length; i++){
            placeTensor(networks[networkIndex],dragged_op.outputs[i],
                networks[networkIndex].tensors[dragged_op.outputs[i]].tx + mouseX - tmX,
                networks[networkIndex].tensors[dragged_op.outputs[i]].ty + mouseY - tmY, grid)
        }
    }
    */


    



    if(selecting){
        ctx.fillStyle = "rgba(255,255,255,0)"
        ctx.lineWidth = 0.5
        ctx.strokeStyle = '#5dd2f0'
        ctx.setLineDash([2,3])
        ctx.beginPath()
        
        ctx.roundRect(tmX,tmY,mouseX-tmX,mouseY-tmY, tensorRadius * 0.2)
            
        ctx.stroke()
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
    console.log("Clicked Indices ", clickedList)

    for (let i = 0; i < clickedList.length; i++) {
        var clickedIndex = clickedList[i]
        var t0 = networks[networkIndex].tensors[clickedIndex]
        if (t0.output_of == null || t0.input_to.length == 0) {
            t0.live = !t0.live
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
                
            var t1_index = networks[networkIndex].operators[dragged_operator_index].inputs[i];

            if(j == t1_index){
                continue
            }
            var t1 = networks[networkIndex].tensors[t1_index];
            var t2 = networks[networkIndex].tensors[j];

            if(Math.abs(t1.x - t2.x) < tensorRadius * 2 && Math.abs(t1.y - t2.y) < tensorRadius * 2){
                mergeTensors(networks[networkIndex], t1_index, j);
            }
        }
    }
    
    /*
    if(dragged_operator_index != -1){
        for(let i = 0; i < networks[networkIndex].operators[dragged_operator_index].inputs.length; i++){
            for(let j = 0; j < networks[networkIndex].tensors.length; j++){
                
                var t1_index = networks[networkIndex].operators[dragged_operator_index].inputs[i];

                if(j == t1_index){
                    continue
                }
                var t1 = networks[networkIndex].tensors[t1_index];
                var t2 = networks[networkIndex].tensors[j];

                if(Math.abs(t1.x - t2.x) < tensorRadius * 2 && Math.abs(t1.y - t2.y) < tensorRadius * 2){
                    mergeTensors(networks[networkIndex], t1_index, j);
                }
            }
        }
        for(let i = 0; i < networks[networkIndex].operators[dragged_operator_index].outputs.length; i++){
            for(let j = 0; j < networks[networkIndex].tensors.length; j++){
                
                var t1_index = networks[networkIndex].operators[dragged_operator_index].outputs[i];

                if(j == t1_index){
                    continue
                }
                var t1 = networks[networkIndex].tensors[t1_index];
                var t2 = networks[networkIndex].tensors[j];

                if(Math.abs(t1.x - t2.x) < tensorRadius * 2 && Math.abs(t1.y - t2.y) < tensorRadius * 2){
                    mergeTensors(networks[networkIndex], t1_index, j);
                }
            }
        }
    }
    */
    
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
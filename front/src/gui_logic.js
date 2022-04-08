import {Network} from "./define_network_objects"
import {Tensor} from "./define_network_objects"
import {Operator} from "./define_network_objects"

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



var last_frame = Date.now()
var this_frame = Date.now()

var networks = []
var networkIndex = 0

networks.push(new Network())
networks[0].add_tensor(new Tensor(false))
networks[0].tensors[0].x = 200
networks[0].tensors[0].y = 200

networks[0].add_tensor(new Tensor(false))
networks[0].tensors[1].x = 100
networks[0].tensors[1].y = 200

networks[0].add_tensor(new Tensor(false))
networks[0].tensors[2].x = 150
networks[0].tensors[2].y = 150
let op0 = new Operator()
op0.inputs = [1, 2]
op0.outputs = [0]
op0.func = 5
networks[0].add_operator(op0)
networks[0].add_tensor(new Tensor(true))
networks[0].tensors[3].x = 400
networks[0].tensors[3].y = 200

networks[0].add_tensor(new Tensor(true))
networks[0].tensors[4].x = 300
networks[0].tensors[4].y = 200

networks[0].add_tensor(new Tensor(false))
networks[0].tensors[5].x = 350
networks[0].tensors[5].y = 150

networks[0].add_tensor(new Tensor(true))
networks[0].tensors[6].x = 350
networks[0].tensors[6].y = 350

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
networks[0].tensors[9].x = 450
networks[0].tensors[9].y = 150

networks[0].add_tensor(new Tensor(true))
networks[0].tensors[10].x = 450
networks[0].tensors[10].y = 350

let op2 = new Operator()
op2.inputs = [8, 9]
op2.outputs = [7]
op2.func = 5
networks[0].add_operator(op2)


networks[0].add_tensor(new Tensor(true))
networks[0].tensors[11].x = 400
networks[0].tensors[11].y = 400

let op3 = new Operator()
op3.inputs = [6]
op3.outputs = [10]
op3.func = 7
networks[0].add_operator(op3)



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
}

// here we draw the function naively without checking for tensor positions. That must be handled 
// by movement logic
function drawOperator(network, operatorIndex) {
    let o = network.operators[operatorIndex]
    let input1
    let input2
    let output

    let functionGradient = ctx.createLinearGradient(0, 0, width, height)
    functionGradient.addColorStop(0, "#DE7521")
    functionGradient.addColorStop(1, "#218ADE")

    ctx.fillStyle = functionGradient

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
            let input = network.tensors[o.inputs[0]]
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
            break
        case 11: // squared dist
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
    

    for (let i = 0; i < networks[0].operators.length; i++) {
        drawOperator(networks[0], i)
    }

    for (let i = 0; i < networks[0].tensors.length; i++) {
        drawTensor(networks[0], i)
    }


    if(draggedIndex != -1){
        nudgeTensor(networks[networkIndex], draggedIndex, delta_x, delta_y)
    }

    if(dragged_operator_index != -1){
        var dragged_op = networks[networkIndex].operators[dragged_operator_index]
        for(let i = 0; i < dragged_op.inputs.length; i++){
            nudgeTensor(networks[networkIndex],dragged_op.inputs[i], delta_x, delta_y)
        }
        for(let i = 0; i < dragged_op.outputs.length; i++){
            nudgeTensor(networks[networkIndex],dragged_op.outputs[i], delta_x, delta_y)
        }
    }

    window.requestAnimationFrame(draw);
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
    // console.log("Mouse position: ",mouseX," ", mouseY)
    let draggedList = getHoveredTensorIndices(networks[networkIndex], mouseX, mouseY)

    if (draggedList.length != 0) {
        draggedIndex = draggedList[0]
    }

    let dragged_operators = getHoveredOperatorIndices(networks[networkIndex], mouseX, mouseY)

    if (dragged_operators.length != 0){
        dragged_operator_index = dragged_operators[0]
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

}
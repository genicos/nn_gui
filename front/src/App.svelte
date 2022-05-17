
<script>
	import Modal,{getModal} from './Modal.svelte'
	import Switch from './Switch.svelte'
    import { onMount } from "svelte";
	import * as objects from "./define_network_objects"
    import * as gui_logic from "./gui_logic"
    import * as network_logic from "./network_logic"
	import * as mouse_network_interaction from "./mouse_network_interaction"
	import { time_ranges_to_array } from 'svelte/internal';

	// Connecting python scripts
	brython()

	
	//This function is called after the html elements load
    onMount(() => {
        gui_logic.init()

		// We listen for the mouse in App.svelte se we can detect
		// a mouse hovering over an operator, so we can highlight
		// the corresponding entry on the toolbar
		var canvas = document.getElementById("gui_canvas")
		canvas.addEventListener("mousemove", doMouseMove, false)
		
    })

	//list toolbar entries, each one corresponding to an operator on the network
	var toolbarItems = [];

	
	function doMouseMove(e) {

		var mouseX
		var mouseY

		if (e.offsetX) {
			mouseX = e.offsetX;
			mouseY = e.offsetY;
		}
		else if (e.layerX) {
			mouseX = e.layerX;
			mouseY = e.layerY;
		}
		
		var ops = mouse_network_interaction.getHoveredOperatorIndices(gui_logic.get_network(),mouseX,mouseY)

		//clear all toolbar hovered statuses first
		for(let i = 0; i < toolbarItems.length;i++) {
			toolbarItems[i].hovered="false"
		}

		//set hovered for the toolbar entries corresponding to the highlighted operators 
		for(let i = 0; i < ops.length;i++) {
			toolbarItems[ops[i]].hovered="true"
		}
	}
	

	// Wrapper for yes clear function
	function yes_clear() {
		getModal('clear').close(1)
      	gui_logic.clear_network()
    }
	
	// Called when a new operator is added, or one is deleted
	function update_operator_list() {

		toolbarItems = []

		// get names for all operator types
		var op_names = gui_logic.get_network().operators.map((e) => (objects.function_table[e.func].name));
		
		// we are going to add numbers to the names, so that repeated types can be identified
		var op_names_with_numbers = []
		
		if(op_names.length == 0){
			return
		}

		op_names_with_numbers.push(op_names[0])
		for(let i = 1; i < op_names.length; i++){

			var count = 0; // operators with the same name before this one
			for(let j = 0; j < i; j++){
				if(op_names[i] == op_names[j]){
					count ++
				}
			}

			var new_name = op_names[i]
			if(count > 0){
				new_name += " "+String(count + 1)
			}

			op_names_with_numbers.push(new_name)
		}


		// Populate toolbarItems
		for(let i = 0; i < op_names_with_numbers.length; i++){
			toolbarItems.push({operator_type: op_names[i], operator_name: op_names_with_numbers[i], id:i ,highlighted:'T'})
		}
		console.log(toolbarItems)
		update_network_info()
	}

	//Update a tensors shape in the operator we are editing, according to the text inputs
	//tensor parameter is an int, 0 means input[0], 1 means input[1], 2 means output[0]
	// of the operator we are editing
	function update_tensor_shape(tensor) {
		var shape_str = ""
		switch(tensor) {
			case 0:
				shape_str = input
				break;
			case 1:
				shape_str = parameter_shape
				break;
			case 2:
				shape_str = output
				break;
		}
		
		if(shape_str == undefined){
			return
		}

		var shape = []

		//convert text of list to shape
		var current_num = ""
		for(let i = 0; i < shape_str.length; i++){
			if(shape_str[i] == ','){
				shape.push(parseInt(current_num))
				current_num = ""
			}else{
				current_num += shape_str[i]
			}
		}
		shape.push(parseInt(current_num))

		
		switch(tensor){
			case 0:
				gui_logic.edit_tensor_by_operator(operator_id, 0, true, shape)
				break;
			case 1:
				gui_logic.edit_tensor_by_operator(operator_id, 1, true, shape)
				break;
			case 2:
				gui_logic.edit_tensor_by_operator(operator_id, 0, false, shape)
				break;
		}
		


		update_network_info();
		update_fields()
	}

	function update_network_info(){
		var network = gui_logic.get_network()

		parameters = 0;
		layers = 0

		for(let i = 0; i < network.operators.length; i++){
			var operator = network.operators[i]
			if(objects.function_table[operator.func].layer){
				layers++;
			}
			if(objects.function_table[operator.func].num_inputs > 1){
				parameters += network.tensors[operator.inputs[1]].calc_size()
			}
			if(operator.func == 11){
				parameters += network.tensors[operator.inputs[1]].calc_size()
			}
		}
	}


	/*
		updates the following fields
			input;
			output;
			parameter_shape;
	*/
	function update_fields(){

		var network = gui_logic.get_network()
		var operator = network.operators[operator_id]

		//Some operators have special edit screens
		if(operator.func == 3){
			update_conv2d_fields()
			return
		}
		if(operator.func == 7){
			update_zeropadding_fields()
			return
		}
		
		//update input0 tensor text box
		var input0_str = ""
		for(let i = 0; i < network.tensors[operator.inputs[0]].form.length; i++){

			//include seperator between form elements
			if(i > 0){
				input0_str += ","
			}

			input0_str += String(network.tensors[operator.inputs[0]].form[i])
		}
		input=input0_str


		//update output tensor text box
		var output_str = ""
		for(let i = 0; i < network.tensors[operator.outputs[0]].form.length; i++){
			
			//include seperator between form elements
			if(i > 0){
				output_str += ","
			}

			output_str += String(network.tensors[operator.outputs[0]].form[i])
		}
		output=output_str


		//If this operator has no parameter then theres no need to update parameter_shape
		if(operator.inputs.length < 2){
			return
		}

		//update parameter tensor text box
		var input1_str = ""
		for(let i = 0; i < network.tensors[operator.inputs[1]].form.length; i++){
			
			//include seperator between form elements
			if(i > 0){
				input1_str += ","
			}

			input1_str += String(network.tensors[operator.inputs[1]].form[i])
		}
		parameter_shape=input1_str

		

	}


	
	//Certain special operators need different input fields

	function update_conv2d_fields(){
		var network = gui_logic.get_network()
		var operator = network.operators[operator_id]

		field_1 = String(network.tensors[operator.inputs[0]].form[0])
		if(field_1 === 'undefined') {
			field_1 = ""
		}
		field_2 = String(network.tensors[operator.inputs[0]].form[1])
		if(field_2 === 'undefined'){
			field_2 = ""
		}

		field_3 = String(network.tensors[operator.inputs[1]].form[0])
		if(field_3 === 'undefined'){
			field_3 = ""
		}
		field_4 = String(network.tensors[operator.inputs[1]].form[1])
		if(field_4 === 'undefined'){
			field_4 = ""
		}
		field_5 = String(network.tensors[operator.inputs[1]].form[2])
		if(field_5 === 'undefined'){
			field_5 = ""
		}
	}
	function edit_conv2d(){
		gui_logic.edit_tensor_by_operator(operator_id, 0, true, [parseInt(field_1), parseInt(field_2), 1])
		gui_logic.edit_tensor_by_operator(operator_id, 1, true, [parseInt(field_3), parseInt(field_4), parseInt(field_5)])
	}


	function update_zeropadding_fields(){
		var network = gui_logic.get_network()
		var operator = network.operators[operator_id]

		field_1 = String(network.tensors[operator.inputs[0]].form[0])
		if(field_1 === 'undefined') {
			field_1 = ""
		}
		field_2 = String(network.tensors[operator.inputs[0]].form[1])
		if(field_2 === 'undefined'){
			field_2 = ""
		}

		field_3 = String((network.tensors[operator.outputs[0]].form[0] - network.tensors[operator.inputs[0]].form[0])/2)
		
		if(field_3 === 'undefined' || field_3 === "NaN"){
			field_3 = ""
		}
	}
	function edit_zeropadding(){
		var network = gui_logic.get_network()
		var operator = network.operators[operator_id]

		var channels = 1

		if(network.tensors[operator.inputs[0]].form.length > 0){
			channels = network.tensors[operator.inputs[0]].form[2]
		}else if(network.tensors[operator.outputs[0]].form.length > 0){
			channels = network.tensors[operator.outputs[0]].form[2]
		}

		gui_logic.edit_tensor_by_operator(operator_id, 0, true, [parseInt(field_1), parseInt(field_2),channels])
		gui_logic.edit_tensor_by_operator(operator_id, 0, false, [parseInt(field_1)+2*parseInt(field_3), parseInt(field_1)+2*parseInt(field_3),channels])
	}

	function edit_localpool(){
		var network = gui_logic.get_network()
		var operator = network.operators[operator_id]

		var channels = 1

		if(network.tensors[operator.inputs[0]].form.length > 0){
			channels = network.tensors[operator.inputs[0]].form[2]
		}else if(network.tensors[operator.outputs[0]].form.length > 0){
			channels = network.tensors[operator.outputs[0]].form[2]
		}

		gui_logic.edit_tensor_by_operator(operator_id, 0, true, [parseInt(field_1), parseInt(field_2),channels])
		gui_logic.edit_tensor_by_operator(operator_id, 0, false, [Math.floor((parseInt(field_1) - parseInt(field_3)) / parseInt(field_3)) + 1, Math.floor((parseInt(field_2) - parseInt(field_3)) / parseInt(field_3)) + 1,channels])
	}



	//Called when an operator is being edited
	function set_edit_operator(op_id){
		console.log("hello")
		operator_id = op_id
		update_fields()
	}

	function add_operator_to_net(func){
		gui_logic.new_operator(func)
		getModal('add_operator').close(1)
		update_operator_list()
	}

	function remove_op() {
		var network = gui_logic.get_network();
		network_logic.deleteOperator(network,operator_id)
		update_operator_list()
	}
	
	// Constant images
    let bar_logo = './transparent_bar_logo.png'; // Neurula logo for nav bar
	let circle_logo = './transparent_circle_logo.png'; // Neurula logo for tutorial
	
	// Tutorial Images
	let generate_code_img = './generate_code.png';
	let tutorial_img = './tutorial.png';
	let clear_canvas_img = './clear_canvas.png';
	let toolbar_img = './toolbar.png';
	let add_img = './add.png';

	// Links
    let home_link = 'http://127.0.0.1:8000'; // Main domain
	let github_logo = 'https://cdn-icons-png.flaticon.com/512/25/25231.png';
	let forms_logo = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Google_Forms_logo_%282014-2020%29.svg/640px-Google_Forms_logo_%282014-2020%29.svg.png'; // google forms icon
	let github_link = 'https://github.com/genicos/nn_gui'; // Link to github repo for project
	let feedback_link = 'https://docs.google.com/forms/d/e/1FAIpQLSdMQYYT9P0cp507dm4xyCr9cvJJ9RUwAcFF21pWBhWLWyqPng/viewform?usp=sf_link'; // Link to google form for feedback
	
	// Function icons
	let fully_connected_icon = './Fully_Connected.png'; // Icon for toolbar_list
	let convolution_icon = './Convolution.png'; // Icon for toolbar_list
	let relu_icon = './PReLU.png'; // Icon for toolbar_list
	let softmax_icon = './Softmax.png'; // Icon for toolbar_list
	let maxpool_icon = './Maxpool.png'; // Icon for toolbar_list
	
	// Variables
	let clear_selection; // Value for Modal choice for clearing
	let layers = 0; // no of layers
	let parameters = 0;
	
	// Edit operator variables
	let operator_id;

	//tensor shapes
	let input;
	let output;
	let parameter_shape; // As tuple

	//Fields for special operators
	let field_1;
	let field_2;
	let field_3;
	let field_4;
	let field_5;

	// Generate code variables
	let code_selection; // Value for Modal choice for which code to generate network in
	let code_options = [
		{ id: 0, text: `Tensorflow` },
		{ id: 1, text: `Pytorch` }
	];

	// The different types of loss functions the user can generate code with
	let loss_selection; // Value of loss choice
	let loss_options = [
		{ id: 0, text: `Categorical Cross Entropy` },
		{ id: 1, text: `Absolute Error` },
		{ id: 2, text: `Hinge Loss` },
		{ id: 3, text: `Huber Loss` },
		{ id: 4, text: `Mean Squared Error` }
	];

	// The different types of optimizers the user can generate code with
	let optimizer_selection; // Value of optimizer choice
	let optimizer_options = [
		{ id: 0, text: `Adam` },
		{ id: 1, text: `Nadam` },
		{ id: 2, text: `Adadelta` },
		{ id: 3, text: `Adagrad` },
		{ id: 4, text: `Adamax` },
		{ id: 5, text: `RMSprop` },
		{ id: 6, text: `SGD` }
	];

	// Downloads code and alert pop-up after generate code button is clicked
	function handleGenerate() {
		code_selection.text == 'Tensorflow' ? generateTensor() : generatePyTorch(); // Calls function to download code
		
		alert(`Generating ${code_selection.text} code with optimizer ${optimizer_selection.text} and loss function ${loss_selection.text}`);
	}

	let items = [
    { id: 1, name: "Dense"},
    { id: 2, name: "Convolutional"},
    { id: 3, name: "ReLU"},
	{ id: 4, name: "Softmax"},
	{ id: 5, name: "Maxpool"}
  	];
	
  	let operator_type = "";
	
	const addItem = () => {
		items = [
		...items,
		{
			id: Math.random(),
			operator_type,
		}
		];
		operator_type = "";
  	};
	
	// Function for nav bar Modal options
	function setClear(res){
		clear_selection=res
	}
	
	// called when the button for generating pytorch code is clicked
	// generates the pytorch code and then downloads it to the user
	async function generatePyTorch(){
		var net_list = generate_network_list()
		var code = pytorch_code_generator(net_list)

		/*
		const res = await fetch('http://127.0.0.1:8000/generate_pytorch', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(net_list)
		})

		code = await res.json()  // waiting for the response back from the api
		*/

		download_string("pytorch.py", code)
		// var opt = await generatePyTorchOpt()
		// console.log(net + opt)
	}

	// generates the optimizer for the pytorch code
	// still need to add a way for this function to get input on which optimizer
	// and which loss function to use
	// returns a string that represents the optimizer code
	// should concatenate this with the result of generateTensor
	async function generatePyTorchOpt() { 
		// var net = generatePyTorch()
		var optimize = "Adam"
		var loss = "sparse_categorical_crossentropy"

		const res = await fetch('http://127.0.0.1:8000/optimize_pytorch', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify([optimize, loss])
		})

		const json = await res.json()
		var optimizer = JSON.stringify(json)
		return optimizer
	}

	// called when the button for generating tensor code is clicked
	// generates the tensor code and then downloads it to the user
	async function generateTensor(){
		var net_list = generate_network_list()
		var code = tf_code_generator(net_list)

		/*
		const res = await fetch('http://127.0.0.1:8000/generate_tensor', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(net_list)
		})

		code = await res.json()  // waiting for the api's response
		*/

		download_string("tf.py", code)
		// return net
	}

	// generates the optimizer for the tensor code
	// still need to add a way for this function to get input on which optimizer
	// and which loss function to use
	// returns a string that represents the optimizer code
	// should concatenate this with the result of generateTensor
	async function generateTensorOpt() { 
		var optimize = "Adam"
		var loss = "sparse_categorical_crossentropy"

		const res = await fetch('http://127.0.0.1:8000/optimize_tensor', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(net_list)
		})

		const json = await res.json()
		var optimizer = JSON.stringify(json)
		return optimizer
	}

	// takes in the network and then converts the implementation from the front end
	// to the backend format
	// STILL UNFINISHED FOR NONLINEAR NETWORKS
	// Need to do testing for linear networks
	function generate_network_list(){
		const net = gui_logic.get_network();

		const tensors = net.tensors;
		const operators = net.operators;

		const net_list = [];

		for (let i = 0; i < operators.length; i++){
			const operator_list = []; //Single layer, list of its attributes

			var this_operator = operators[i];

			// storing the operator type to the code that anish uses
			// python code uses a different type standard than js code

			if (this_operator.func == 2){           // Dense/Fully Connected
				operator_list.push(0);
			} else if (this_operator.func == 3){   // Convolutional layer
				
				// push operator type
				operator_list.push(1);
				
				// push number of filters
				operator_list.push(tensors[this_operator.inputs[1]].form[2])
			} else {
				console.log("Unexpected Operator");
				continue;
			}
			
			// push input size
			operator_list.push(tensors[this_operator.inputs[0]].calc_size()); // NEED TO CHANGE THIS TO MAKE IT WORK FOR NONLINEAR NETWORKS

			// if Dense, we need number of neurons
			if(this_operator.func == 2){
				// push output size (number of neurons in layer)
				operator_list.push(tensors[this_operator.outputs[0]].calc_size()); // NEED TO CHANGE THIS TO MAKE IT WORK FOR NONLINEAR NETWORKS
			}

			var next_operator = operators[tensors[this_operator.outputs[0]].input_to[0]]

			// Push operator function
			if ((this_operator.func == 2 || this_operator.func == 3) && (next_operator.func == 4 || next_operator.func == 5)){
				if (next_operator.func == 4){        // ReLU
					operator_list.push(2);
				} else if (next_operator.func == 5){ // Softmax
					operator_list.push(3);
				}
				i++;
			} else {
				console.log("Activation function expected, none given")
				operator_list.push(0);
			}

			//If convolution, we need kernel
			if(this_operator.func == 3){

				var kernel_str = "(" + tensors[this_operator.inputs[1]].form[0] + "," + tensors[this_operator.inputs[1]].form[1] + ")"
				operator_list.push(kernel_str)
			}


			net_list.push(operator_list);

		}

		return net_list
	}

	function setGenerate(res){
		// generate_selection=res
	}

	//Downloads a file containing just (str), with the name (name)
	function download_string(name, str){
		var element = document.createElement('a');
		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(str));
		element.setAttribute('download', name);

		element.style.display = 'none';
		document.body.appendChild(element);

		element.click();

		document.body.removeChild(element);
	}

	function optimize(){
		
	}
  
</script>
  
<main>
	<!-- Navigation Bar (At top of page) -->
	<nav>
		<div class="left">
			<ul class="navbar-list">
				<li><a href={home_link}><img src={bar_logo} alt="Neurula logo." style="max-height: 60px" ></a></li>
			</ul>
		</div>
		<div class="right">
			<ul class="navbar-list">
				<li><a href={undefined} class="nav-button" on:click={()=>getModal('clear').open(setClear)}>Clear Canvas</a></li>
				<li><a href={undefined} class="nav-button" on:click={()=>getModal('generate').open(setGenerate)}>Generate Code</a></li>
				<li><a href={undefined} class="nav-button" on:click={()=>getModal('tutorial').open()}>?</a></li>
			</ul>
		</div>
	</nav>

	<!-- Neural Network Workspace -->
	<div id="workspace">
		<!-- Workspace Toolbar -->
		<div id="toolbar">
			<!-- Left-aligned side of nav bar -->
			<div id="toolbar_title">
				<p style="display: inline-block; margin: 5px 0px 0px 5px">Operator Toolbar</p>
				<div class="dropdown" style="float:right">
					<a href={undefined} class="add_op_button" style="font-size: 20px; padding: 0px 5px;">+</a>
					<div class="dropdown-content">
						<a href={undefined} class="add_op_button" style="margin: 5px" on:click={()=>getModal('add_operator').open()}>+ add operator</a>
						<a href={undefined} class="add_op_button" style="margin: 5px" on:click={()=>getModal('add_block').open()}>+ add block</a>
					</div>
				</div>
			</div>
			<!-- Right-aligned side of nav bar -->
			<div id="toolbar_list">
				<div id="toolbar_add_operator">
					<!-- <strong>Current Operators: </strong> -->
					<p id="layers-title">Added Layers: </p>
				</div>
				<!-- Displays list of placeholder navItems as set in <script> -->
				{#each toolbarItems as item}

					<!-- Dense Operator -->
					{#if item.operator_type === "Fully Connected"}
						<li id={"list_item"+item.id} class="{item.hovered === "true" ? 'hovered' : ''}">
							<p   on:focus={()=>{}} on:mouseleave={() => {gui_logic.highlight_operators([])}} on:mouseover={() => {gui_logic.highlight_operators([item.id]);set_edit_operator(item.id)}}>
								<img src={fully_connected_icon} alt="Convolutional List icon." style="max-height: 20px; margin-right: 10px">
								<b on:click={()=>{getModal('edit_fully_connected').open()}}>{item.operator_name}</b>
								<button id="remove-button" style="margin-right: 10px" on:click={() => {remove_op()}}>&times;</button>
							</p>
							<!-- remove button: to do ... -->
						</li>

					<!-- Convolution Operator -->
					{:else if item.operator_type === "Convolution"}
						<li id={"list_item"+item.id} class="{item.hovered === "true" ? 'hovered' : ''}">
							<p  on:focus={()=>{}} on:mouseleave={() => {gui_logic.highlight_operators([])}} on:mouseover={() => {gui_logic.highlight_operators([item.id]);set_edit_operator(item.id)}}>
								<img src={convolution_icon} alt="Convolution List icon." style="max-height: 20px; margin-right: 10px">
								<b on:click={()=>{getModal('edit_convolution').open()}}>{item.operator_name}</b>
								<button id="remove-button" style="margin-right: 10px" on:click={() => remove_op()}>&times;</button>
							</p>
						</li>

					<!-- ReLU Operator -->
					{:else if item.operator_type === "ReLU"}
						<li id={"list_item"+item.id} class="{item.hovered === "true" ? 'hovered' : ''}">
							<p   on:focus={()=>{}} on:mouseleave={() => {gui_logic.highlight_operators([])}} on:mouseover={() => {gui_logic.highlight_operators([item.id]);set_edit_operator(item.id)}}>
								<img src={relu_icon} alt="ReLU List icon." style="max-height: 20px; margin-right: 10px">
								<b on:click={()=>{getModal('edit_relu').open()}}>{item.operator_name}</b>
								<button id="remove-button" style="margin-right: 10px" on:click={() => remove_op()}>&times;</button>
							</p>
						</li>

					<!-- Softmax Operator -->
					{:else if item.operator_type === "Softmax"}
						<li id={"list_item"+item.id} class="{item.hovered === "true" ? 'hovered' : ''}">
							<p   on:focus={()=>{}} on:mouseleave={() => {gui_logic.highlight_operators([])}} on:mouseover={() => {gui_logic.highlight_operators([item.id]);set_edit_operator(item.id)}}>
								<img src={softmax_icon} alt="Softmax List icon." style="max-height: 20px; margin-right: 10px">
								<b on:click={()=>{getModal('edit_softmax').open()}}>{item.operator_name}</b>
								<button id="remove-button" style="margin-right: 10px" on:click={() => remove_op()}>&times;</button>
							</p>
						</li>

					<!-- Max Pool Operator -->
					{:else if item.operator_type === "MaxPool"}
						<li id={"list_item"+item.id} class="{item.hovered === "true" ? 'hovered' : ''}">
							<p   on:focus={()=>{}} on:mouseleave={() => {gui_logic.highlight_operators([])}} on:mouseover={() => {gui_logic.highlight_operators([item.id]);set_edit_operator(item.id)}}>
								<img src={maxpool_icon} alt="Max Pool List icon." style="max-height: 20px; margin-right: 10px">
								<b on:click={()=>{getModal('edit_maxpool').open()}} >{item.operator_name}</b>
								<button id="remove-button" style="margin-right: 10px" on:click={() => remove_op()}>&times;</button>
							</p>
						</li>

					<!-- Zero Padding Operator -->
					{:else if item.operator_type === "Zero Padding Layer"}
						<li id={"list_item"+item.id} class="{item.hovered === "true" ? 'hovered' : ''}">
							<p   on:focus={()=>{}} on:mouseleave={() => {gui_logic.highlight_operators([])}} on:mouseover={() => {gui_logic.highlight_operators([item.id]);set_edit_operator(item.id)}}>
								<img src={maxpool_icon} alt="Max Pool List icon." style="max-height: 20px; margin-right: 10px">
								<b on:click={()=>{getModal('edit_zeropadding').open()}} >{item.operator_name}</b>
								<button id="remove-button" style="margin-right: 10px" on:click={() => remove_op()}>&times;</button>
							</p>
						</li>

					<!-- Zero Padding Operator -->
					{:else if item.operator_type === "Zero Padding Layer"}
						<li id={"list_item"+item.id} class="{item.hovered === "true" ? 'hovered' : ''}">
							<p   on:focus={()=>{}} on:mouseleave={() => {gui_logic.highlight_operators([])}} on:mouseover={() => {gui_logic.highlight_operators([item.id]);set_edit_operator(item.id)}}>
								<img src={maxpool_icon} alt="Max Pool List icon." style="max-height: 20px; margin-right: 10px">
								<b on:click={()=>{getModal('edit_zeropadding').open()}} >{item.operator_name}</b>
								<button id="remove-button" style="margin-right: 10px" on:click={() => remove_op()}>&times;</button>
							</p>
						</li>
					
					<!-- General Operator -->
					{:else}
						<li id={"list_item"+item.id} class="{item.hovered === "true" ? 'hovered' : ''}">
							<p   on:focus={()=>{}} on:mouseleave={() => {gui_logic.highlight_operators([])}} on:mouseover={() => {gui_logic.highlight_operators([item.id]);set_edit_operator(item.id)}}>
								<img src={fully_connected_icon} alt="Convolutional List icon." style="max-height: 20px; margin-right: 10px">
								<b on:click={()=>{(item.operator_type=="MaxPool" || (item.operator_type=="Avg Pooling") || (item.operator_type=="Zero Padding Layer"))?getModal('edit_unary').open():getModal('edit_unary_constant').open()}}>{item.operator_name}</b>
								<button id="remove-button" style="margin-right: 10px" on:click={() => {remove_op()}}>&times;</button>
							</p>
						</li>
					{/if}
				{/each}
			</div>
		</div>

		<!-- Workspace Canvas (For drawing the neural network) -->
        <div id="canvas_container">
            <canvas id="gui_canvas"></canvas>
			<div id="canvas_footer">
				Network Parameters: {parameters}	Layers: {layers}
			</div>
        </div>

    </div>

	<!-- Footer (at bottom of page) -->
	<div class="footer">
		<a href={undefined} class="footer-button" on:click={()=>getModal('about').open()}>About</a>
		<a href={github_link}><img id="git" src={github_logo} alt="Github logo." style="max-height: 20px">Github</a>
		<a href={feedback_link}><img id="git" src={forms_logo} alt="Google Forms logo." style="max-height: 20px">Feedback</a>
	</div>

	<!-- Modal Popups for Navigation Bar-->
	<Modal id="clear">
		Are you sure?
		<!-- Passing a value back to the callback function; Choice is saved in 'clear_selection' -->
		<button class="custom-button" on:click={yes_clear}>
			Yes
		</button>
		<button class="custom-button" on:click={()=>getModal('clear').close(0)}>
			No
		</button>
	</Modal>

	<Modal id="generate">
		<p>How would you like to download your neural network?</p>

		<!-- Select Code Generation Type-->
		<!-- OLD CODE FOR SWITCH I STILL SAVED FOR REFERENCE
		<p>Select Code: </p>
		<Switch bind:value={generate_selection} label="" design="code" /> 
		<p style="color: red">{generate_selection}</p>
		-->

		<!-- Generate Code Dropdowns with Optimizer and Loss -->
		<form on:submit|preventDefault={handleGenerate}>
			<!-- Select Code -->
			<p style="margin: 5px 0px 5px 0px; font-size: 20px">Select Code: </p>
			<div class="generate-select">
				<select bind:value={code_selection}>
					{#each code_options as option}
						<option value={option}>
							{option.text}
						</option>
					{/each}
				</select>
			</div><br>

			<!-- Select Optimizer -->
			<p style="margin: 5px 0px 5px 0px; font-size: 20px">Select Optimizer: </p>
			<div class="generate-select">
				<select bind:value={optimizer_selection}>
					{#each optimizer_options as option}
						<option value={option}>
							{option.text}
						</option>
					{/each}
				</select>
			</div><br>

			<!-- Select Loss-->
			<p style="margin: 5px 0px 5px 0px; font-size: 20px">Select Loss Function: </p>
			<div class="generate-select">
				<select bind:value={loss_selection}>
					{#each loss_options as option}
						<option value={option}>
							{option.text}
						</option>
					{/each}
				</select>
			</div><br>

			<!-- Values saved in: code_selection.text, optimizer_selection.text, and loss_selection.text -->
			<button class="custom-button" type=submit on:click={()=>{getModal('generate').close()}}>
				Generate
			</button>
		</form>
	</Modal>

	<Modal id="tutorial">
		<h1>Welcome to Neurula's Tutorial</h1>
		<p>To learn more about this project, click the 'About' at the bottom of the page.</p>

		<p style="font-size: 16px">Navigation Bar Options:</p>
		<ul style="list-style-type: none; padding: 0px;">
			<li>
				<img src={clear_canvas_img} alt="Tutorial." style="max-width: 350px;">
			</li>
			<li>
				<img src={generate_code_img} alt="Tutorial." style="max-width: 350px;">
				<p style="font-size: 14px">Generate and download your choice of Tensorflow or Pytorch code based on your canvas design. You must also select an optimizer and loss function.</p>
			</li>
			<li>
				<img src={tutorial_img} alt="Tutorial." style="max-width: 350px;">
			</li>
		</ul>

		<p style="font-size: 16px">Operator Toolbar Options:</p>
		<ul style="list-style-type: none; padding: 0px;">
			<li>
				<img src={toolbar_img} alt="Tutorial." style="max-width: 350px;">
			</li>
			<li>
				<img src={add_img} alt="Tutorial." style="max-width: 350px;">
			</li>
		</ul>
		
		
	</Modal>

	<Modal id="about">
		<h1>About Neurula</h1>
		<p>Machine learning can appear obscure and complicated, posing a barrier to people who are unfamiliar but interested.<br>
			However, designing working neural networks doesn’t have to be difficult.<br><br>
			That's why we created Neurula: a website in which you can drag and drop blocks allowing you to design
			neural networks in an intuitive fashion. Once you design a network, you can download auto-generated code that implements
			that network in tensorflow or pytorch. <br><br>
			<i>Made for UCSC's CSE 115A Spring 2022</i><br>
			<i>Developers: Nicolas Ayala, Anish Pahilajani, Kat Negrete, Mahesh Vegiraju, and Alexandra Hutchins</i>
		</p>
	</Modal>

	<Modal id="add_operator">
		Add Operator: <br>

		<!-- Calls function to call specific operator -->
		<p style="font-size: 14px">Classification: </p>
		<button class="custom-button" on:click={() => {add_operator_to_net(2)}}>
            Dense
        </button>
		<button class="custom-button" on:click={() => {add_operator_to_net(5)}}>
            Softmax
        </button>

		<p style="font-size: 14px">Linear Activations: </p>
		<button class="custom-button" on:click={() => {add_operator_to_net(1)}}>
            Identity
        </button>
        <button class="custom-button" on:click={() => {add_operator_to_net(4)}}>
            ReLU
        </button>
		<button class="custom-button" on:click={() => {add_operator_to_net(11)}}>
            PReLU
        </button>
		<button class="custom-button" on:click={() => {add_operator_to_net(13)}}>
            Softplus
        </button>
		<button class="custom-button" on:click={() => {add_operator_to_net(14)}}>
            Swish
        </button>

		<p style="font-size: 14px">Image Processing: </p>
        <button class="custom-button" on:click={() => {add_operator_to_net(3)}}>
            2DConvolutional
        </button>
        <button class="custom-button" on:click={() => {add_operator_to_net(7)}}>
            Zero Padding
        </button>
		<button class="custom-button" on:click={() => {add_operator_to_net(6)}}>
            Max Pool
        </button>
		<button class="custom-button" on:click={() => {add_operator_to_net(9)}}>
            Avg Pool
        </button>
		<button class="custom-button" on:click={() => {add_operator_to_net(10)}}>
            Global Avg Pool
        </button>
		<button class="custom-button" on:click={() => {add_operator_to_net(8)}}>
            Batchnorm
        </button>

		<p style="font-size: 14px">Sigmoid Activations: </p>
		<button class="custom-button" on:click={() => {add_operator_to_net(12)}}> 
            Sigmoid
        </button>
		<button class="custom-button" on:click={() => {add_operator_to_net(15)}}>
            Softsign
        </button>
		<button class="custom-button" on:click={() => {add_operator_to_net(16)}}>
            Tanh
        </button>
	</Modal>

	<Modal id="add_block">
		Add Operator Block: <br>
		<p style="font-size: 12px">Add operator blocks for abstractions of common architecture patterns</p>
		<br>
		<!-- Calls function to call specific operator -->
		<button class="custom-button" on:click={undefined}>
            <i>option 1</i>
        </button>
        <button class="custom-button" on:click={undefined}>
            <i>option 2</i>
        </button>
        <button class="custom-button" on:click={undefined}>
            <i>option 3</i>
        </button>
	</Modal>

	<!-- Modals for editing operators -->

	<!-- General Modal for binary operator (one with a parameter) -->
	<Modal id="edit_binary">
		<p>Edit operator: </p><br>
		<form on:submit|preventDefault={addItem}>
			<label for="name">Input:</label>
			<input id="name" type="text" bind:value={input} on:change={() => {update_tensor_shape(0)}}/><br>
			<label for="name">Output:</label>
			<input id="name" type="text" bind:value={output} on:change={() => {update_tensor_shape(2)}}/><br>
			<label for="name">Parameter Shape:</label>
			<input id="name" type="text" bind:value={parameter_shape} on:change={() => {update_tensor_shape(1)}}/>
		
			<br><br><button class="custom-button" on:click={()=>{getModal('edit_binary').close()}}>
				Submit
			</button>
		</form>
	</Modal>

	<!-- General Modal for unary operator where output shape = input shape -->
	<Modal id="edit_unary_constant">
		<p>Edit operator: </p><br>
		<form on:submit|preventDefault={addItem}>
			<label for="name">Input/Output size:</label>
			<input id="name" type="text" bind:value={input} on:change={() => {update_tensor_shape(0)}}/>
		
			<br><br><button class="custom-button" on:click={()=>{getModal('edit_unary_constant').close()}}>
				Submit
			</button>
		</form>
	</Modal>

	<!-- General Modal for unary operator -->
	<Modal id="edit_unary">
		<p>Edit operator: </p><br>
		<form on:submit|preventDefault={addItem}>
			<label for="name">Input:</label>
			<input id="name" type="text" bind:value={input} on:change={() => {update_tensor_shape(0)}}/><br>
			<label for="name">Output:</label>
			<input id="name" type="text" bind:value={output} on:change={() => {update_tensor_shape(2)}}/><br>
		
			<br><br><button class="custom-button" on:click={()=>{getModal('edit_unary').close()}}>
				Submit
			</button>
		</form>
	</Modal>


	<Modal id="edit_fully_connected">
		<p>Edit Dense/ Fully Connected Operator: </p><br><br>
		<!-- <Switch bind:value={I_switch} label="" design="I" />
		<p>{I_switch}</p>
		<Switch bind:value={O_switch} label="" design="O" />
		<p>{O_switch}</p> -->
		<form on:submit|preventDefault={addItem}>
			<label for="name">Input:</label>
			<input id="name" type="text" bind:value={input} on:change={() => {update_tensor_shape(0)}}/><br>
			<label for="name">Output:</label>
			<input id="name" type="text" bind:value={output} on:change={() => {update_tensor_shape(2)}}/><br>
			<label for="name">Parameter Shape:</label>
			<input id="name" type="text" bind:value={parameter_shape} on:change={() => {update_tensor_shape(1)}}/>
		
			<br><br><button class="custom-button" on:click={()=>{getModal('edit_fully_connected').close()}}>
				Submit
			</button>
		</form>
	</Modal>

	<Modal id="edit_convolution">
		<p>Edit Convolution Operator: </p><br><br>
		<!-- <Switch bind:value={I_switch} label="" design="I" />
		<p>{I_switch}</p>
		<Switch bind:value={O_switch} label="" design="O" />
		<p>{O_switch}</p> -->
		<form on:submit|preventDefault={addItem}>
			<label for="name">Input image width:</label>
			<input id="name" type="text" bind:value={field_1}/><br>
			<label for="name">Input image height:</label>
			<input id="name" type="text" bind:value={field_2}/><br>
			<label for="name">Kernel width:</label>
			<input id="name" type="text" bind:value={field_3}/><br>
			<label for="name">Kernel height:</label>
			<input id="name" type="text" bind:value={field_4}/><br>
			<label for="name">Filters:</label>
			<input id="name" type="text" bind:value={field_5}/><br>
		
			<br><br><button class="custom-button" on:click={()=>{getModal('edit_convolution').close();edit_conv2d()}}>
				Submit
			</button>
		</form>
	</Modal>

	<Modal id="edit_relu">
		<p>Edit ReLU Operator: </p><br><br>
		<!-- <Switch bind:value={I_switch} label="" design="I" />
		<p>{I_switch}</p>
		<Switch bind:value={O_switch} label="" design="O" />
		<p>{O_switch}</p> -->
		<form on:submit|preventDefault={addItem}>
			<label for="name">Input/Output size:</label>
			<input id="name" type="text" bind:value={input} on:change={() => {update_tensor_shape(0)}}/>
			<!-- <label for="name">Slope for -x:</label>
			<input id="name" type="text" bind:value={parameter_shape} /> -->
		
			<br><br><button class="custom-button" on:click={()=>{getModal('edit_relu').close()}}>
				Submit
			</button>
		</form>
	</Modal>

	<Modal id="edit_softmax">
		<p>Edit Softmax Operator: </p><br><br>
		<!-- <Switch bind:value={I_switch} label="" design="I" />
		<p>{I_switch}</p>
		<Switch bind:value={O_switch} label="" design="O" />
		<p>{O_switch}</p> -->
		<form on:submit|preventDefault={addItem}>
			<label for="name">Input/Output size:</label>
			<input id="name" type="text" bind:value={input} on:change={() => {update_tensor_shape(0)}}/>
		
			<br><br><button class="custom-button" on:click={()=>{getModal('edit_softmax').close()}}>
				Submit
			</button>
		</form>
	</Modal>

	<Modal id="edit_maxpool">
		<p>Edit Maxpool Operator: </p><br><br>
		<!-- <Switch bind:value={I_switch} label="" design="I" />
		<p>{I_switch}</p>
		<Switch bind:value={O_switch} label="" design="O" />
		<p>{O_switch}</p> -->
		<form on:submit|preventDefault={addItem}>
			<label for="name">Input/Output size:</label>
			<input id="name" type="text" bind:value={input} on:change={() => {update_tensor_shape(0)}}/>

			<br><br><button class="custom-button" on:click={()=>{getModal('edit_softmax').close()}}>
				Submit
			</button>
		</form>
	</Modal>

	
	<Modal id="edit_zeropadding">
		<p>Edit Zero Padding Operator: </p><br><br>
		<form on:submit|preventDefault={addItem}>
			<label for="name">Input image width:</label>
			<input id="name" type="text" bind:value={field_1}/><br>
			<label for="name">Input image height:</label>
			<input id="name" type="text" bind:value={field_2}/><br>
			<label for="name">Zero padding:</label>
			<input id="name" type="text" bind:value={field_3}/><br>

			<br><br><button class="custom-button" on:click={()=>{getModal('edit_zeropadding').close(); edit_zeropadding()}}>
				Submit
			</button>
		</form>
	</Modal>

</main>

<style>
	main {
		margin: 0px;
	}
	.footer {
		position: fixed;
		left: 0;
		bottom: 10px;
		width: 100%;
		color: rgba(0, 0, 0, 0.8);
		text-align: center;
	}
	nav {
		background-color: rgba(0, 0, 0, 0.8);
		font-family: "Helvetica Neue", "Helvetica", "Arial", sans-serif;
		height: 80px;
		margin-top: -10px;
		margin-left: -10px;
		margin-right: -10px;
		padding: 0;
	}  
	.left {
		float: left;
		align-items: center;
		margin-top: -5px;
		margin-left: 15px;
		margin-right: 15px;
	}
	.right {
		max-width: 980px;
		padding-left: 20px;
		padding-right: 20px;
		margin: auto;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		height: 100%;
		float: right;
	}
  
	.navbar-list {
		display: none;
		width: 100%;
		justify-content: space-between;
		padding: 0 40px;
	}
  
	.navbar-list li {
		list-style-type: none;
		margin-left: 20px;
	}
	a.nav-button {
		display: inline-block;
		padding: 0.5em 1.25em;
		border: 0.1em solid #FFFFFF;
		margin: 0;
		border-radius: 0.4em;
		box-sizing: border-box;
		text-decoration: none;
		font-family: 'Roboto', sans-serif;
		font-weight: 300;
		font-size: 15px;
		color: #FFFFFF;
		text-align: center;
		transition: all 0.4s;
	}
	a.nav-button:hover {
		color: rgba(0, 0, 0, 0.8);
		background-color: #FFFFFF;
	}

	a.add_op_button {
		display: inline-block;
		padding: 0.5em 1.25em;
		border: 0.1em solid #FFFFFF;
		margin: 0;
		border-radius: 0.4em;
		box-sizing: border-box;
		text-decoration: none;
		font-family: 'Roboto', sans-serif;
		font-weight: 300;
		font-size: 15px;
		color: #FFFFFF;
		text-align: center;
		transition: all 0.4s;
		width: 100%;
	}
	a.add_op_button:hover {
		color: rgba(0, 0, 0, 0.8);
		background-color: #FFFFFF;
	}

	#workspace{
        height: 100%;
		margin: 30px;
		border-radius: 0.4em;
		box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    }
    #toolbar {
        float: left;
        height: 500px;
        width: 220px;
		font-family: 'Roboto', sans-serif;
		border-radius: 0.4em 0em 0em 0.4em;
		background-color: white;
        display: flex;
        flex-flow: column;
    }
	#toolbar_title {
		background-color: #39c0ba;
		color: white;
		padding-left: 10px;
		padding-right: 10px;
		padding-top: 10px;
		padding-bottom: 10px;
		border-radius: 0.4em 0em 0em 0em;
	}
	#layers-title {
		margin-top: -5px;
		margin-bottom: 5px;
		margin-left: 10px;
		margin-right: 10px;
		font-size: 15px;
	}
	.dropdown {
  		position: relative;
  		display: inline-block;
	}

	.dropdown-content {
		display: none;
		position: absolute;
		background-color: rgba(0,0,0,0.8);
		border-radius: 0.4em;
		min-width: 160px;
		box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.8);
		padding: 5px 15px 5px 5px;
		z-index: 1;
	}
	.dropdown:hover .dropdown-content {
		display: block;
	}
	#toolbar_list {
		overflow-y: scroll;
		padding-top: 10px;
	}
	#toolbar li {
		list-style-type: none;
	}
    #toolbar_add_operator{
        flex: 1 1 auto;
    }
	#toolbar li {
		padding-left: 10px;
		padding-bottom: 1px;
		border-top: 0.1em solid whitesmoke;
	}
	#toolbar li:hover {
		background-color: whitesmoke;
		text-decoration: underline;
	}
	#toolbar li.hovered {
		background-color: whitesmoke;
		text-decoration: underline;
	}
    #canvas_container{
        overflow: hidden;
		border-radius: 0em 0.4em 0.4em 0em;
    }
	#canvas_footer {
		height: 20px;
		background-color: lightgrey;
		padding-right: 10px;
		font-size: 10px;
		margin-top: -4px;
		font-family: "Helvetica Neue", "Helvetica", "Arial", sans-serif;
		text-align: right;
		padding-top: 4px;
		padding-right: 10px;
		padding-left: 10px;
	}
    #gui_canvas{
        width: 100%;
        height: 500px;
    }
	.footer a {
		font-family: "Helvetica Neue", "Helvetica", "Arial", sans-serif;
		margin-top: 10px;
		margin-bottom: 10px;
		margin-right: 20px;
		margin-left: 20px;
		text-decoration: none;
		color: rgba(0, 0, 0, 0.8);
	}
	.footer:hover a {
		cursor: pointer;
	}
	#git {
		margin-right: 5px;
		margin-bottom: -3px;
	}
	.custom-button {
		background-color: white;
		border: 0.1em solid rgba(0, 0, 0, 0.8);
		color: rgba(0, 0, 0, 0.8);
		border-radius: 2em;
		text-decoration: none;
		font-family: 'Roboto',sans-serif;
		font-size: 15px;
		text-align: center;
		padding:0.3em 1.2em;
		transition: all 0.2s;
	}
	.custom-button:hover {
		background-color: rgba(0, 0, 0, 0.8);
		border: 0.1em solid rgba(0, 0, 0, 0.8);
		color: white;
	}
	#remove-button {
		float: right;
		border: none;
		background: transparent;
		padding: 0;
		margin: 0;
		color: #dc4f21;
		font-size: 18px;
		cursor: pointer;
	}
	#remove-button:hover {
    	transform: scale(1.5);
  	}
	.generate-select select{
		font-family: 'Roboto',sans-serif;
		font-size: 20px;
	}
	
	@media only screen and (min-width: 768px) {
		.navbar-list {
			display: flex;
			padding: 0;
		}
		.navbar-list a {
			display: inline-flex;
		}
	}
	@media only screen and (max-width: 767px) {
		#workspace {
			margin: 25px;
		}
		#toolbar {
			width: 175px;
			font-size: 12px;
		}
		.left {
			display: none;
		}
	}
</style>


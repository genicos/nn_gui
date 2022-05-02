
<script>
	import Modal,{getModal} from './Modal.svelte'
	import Switch from './Switch.svelte'
    import { onMount } from "svelte";
	import * as objects from "./define_network_objects"
    import * as gui_logic from "./gui_logic"
    import * as network_logic from "./network_logic"
	import { time_ranges_to_array } from 'svelte/internal';

	// Connecting python scripts
	brython()

	//example for mahesh
	/*
	console.log("Check this shit out:")
	var tf_code = tf_code_generator([[1, 24, 0, 2, "(3,3)"], [4, 0, 0, 0, "(2,2)"], [1, 36, 0, 2, "(3,3)"], [4, 0, 0, 0, "(2,2)"], [0,784,128,2], [0,128,10,2]])
	console.log(tf_code)
	var pytorch_code = pytorch_code_generator([[1, 24, 0, 2, "(3,3)"], [4, 0, 0, 0, "(2,2)"], [1, 36, 0, 2, "(3,3)"], [4, 0, 0, 0, "(2,2)"], [0,784,128,2], [0,128,10,2]])
	console.log(pytorch_code)
	*/
	

    onMount(() => {
        gui_logic.init()
		var canvas = document.getElementById("gui_canvas")
		canvas.addEventListener("mousemove", doMouseMove, false)
		
    })
	//list of operators
	var toolbarItems = [];


	function doMouseMove(e) {
		var ops = gui_logic.highlighted_operators()
		for(let i = 0; i < toolbarItems.length;i++){
			toolbarItems[i].hovered="false"
		}
		for(let i = 0; i < ops.length;i++){
			toolbarItems[ops[i]].hovered="true"
		}
	}
	// Wrapper for yes clear function
	function yes_clear() {
		getModal('clear').close(1)
      	gui_logic.clear_network()
    }
	
	function update_operator_list() {
		var op_names = gui_logic.get_network().operators.map((e) => (objects.function_table[e.func].name));
		var op_names_with_numbers = []
		if(op_names.length == 0){
			return
		}
		op_names_with_numbers.push(op_names[0])
		for(let i = 1; i < op_names.length; i++){
			var count = 0;
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
		for(let i = 0; i < op_names_with_numbers.length; i++){
			toolbarItems[i] = {operator_type: op_names[i], operator_name: op_names_with_numbers[i], id:i ,highlighted:'T'}
		}
		
	}
	//operator is the index in the operator list,
	//tensor is an int, 0 means input[0], 1 means input[1], 2 means output[0]
	function update_tensor_shape(tensor){
		var shape_str = ""
		switch(tensor){
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

		update_fields()
	}

	/*
		updates the following fields
			I_switch; // Value to toggle for operator as  input
			O_switch; // Value to toggle for operator as output
			input;
			output;
			parameter_shape;
	*/
	function update_fields(){

		var network = gui_logic.get_network()
		var operator = network.operators[operator_id]

		
		//update input toggle
		if(network.input_tensors.includes(operator.inputs[0])){
			I_switch = "off"
		}

		//update output toggle
		if(network.output_tensors.includes(operator.outputs[0])){
			O_switch = "off"
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

	function submit_edit(){
		if(I_switch === "off")
			gui_logic.set_op_as_input(operator_id)
		if(O_switch === "off")
			gui_logic.set_op_as_output(operator_id)
	}

	function set_edit_operator(op_id){
		operator_id = op_id
		I_switch = "None"
		O_switch = "None"
		update_fields()
	}

	// Add operator functions
	function add_dense() {
      	gui_logic.new_operator(5)
		getModal('add_operator').close(1)
		layers++;
		update_operator_list()
    }
	function add_conv() {
      	gui_logic.new_operator(10)
		getModal('add_operator').close(1)
		layers++;
		update_operator_list()
    }
	function add_prelu() {
      	gui_logic.new_operator(12)
		getModal('add_operator').close(1)
		update_operator_list()
    }
	function add_softmax() {
      	gui_logic.new_operator(7)
		getModal('add_operator').close(1)
		update_operator_list()
    }
	function add_maxpool() {
      	gui_logic.new_operator(15)
		getModal('add_operator').close(1)
		update_operator_list()
    }
	
	// Constants
    let bar_logo = './transparent_bar_logo.png'; // Neurula logo for nav bar
    let home_link = 'http://127.0.0.1:8000'; // Main domain
	let github_logo = 'https://cdn-icons-png.flaticon.com/512/25/25231.png';
	let forms_logo = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Google_Forms_logo_%282014-2020%29.svg/640px-Google_Forms_logo_%282014-2020%29.svg.png'; // google forms icon
	let github_link = 'https://github.com/genicos/nn_gui'; // Link to github repo for project
	let feedback_link = 'https://docs.google.com/forms/d/e/1FAIpQLSdMQYYT9P0cp507dm4xyCr9cvJJ9RUwAcFF21pWBhWLWyqPng/viewform?usp=sf_link'; // Link to google form for feedback
	let fully_connected_icon = './Fully_Connected.png'; // Icon for toolbar_list
	let convolution_icon = './Convolution.png'; // Icon for toolbar_list
	let prelu_icon = './PReLU.png'; // Icon for toolbar_list
	let softmax_icon = './Softmax.png'; // Icon for toolbar_list
	
	// Variables
	let clear_selection; // Value for Modal choice for clearing
	let grid; // Toggle on and off grid for canvas
	let layers = 0; // no of layers (dense and conv)
	
	// Edit operator variables
	let operator_id;
	let I_switch; // Value to toggle for operator as input
	let O_switch; // Value to toggle for operator as output
	let input;
	let output;
	let parameter_shape; // As tuple

	// Generate code variables
	let generate_selection = 'Tensorflow'; // Value for Modal choice for which code to generate network in
		// Default 0 is Tensorflow
		// 1 is Pytorch
	// let loss_selection = 0; // Value for Modal choice for which loss function to use
		// Default 0 is Categorical cross entropy
		// 1 is Absolute error
		// 3 is Hinge loss
		// 4 is Huber loss
		// 5 is Mean squared error
	// let optimizer_selection = 0; // Value for Modal choice for which optimizer to use
		// Default 0 is adam
		// 1 is Nadam
		// 2 is Adadelta
		// 3 is Adagrad
		// 4 is Adamax
		// 5 is RMSprop
		// 6 is SGD

	// The different types of loss functions the user can generate code with
	let loss_selection; // Value of loss choice
	let loss_options = [
		{ id: 0, text: `Categorical Cross Entropy` },
		{ id: 2, text: `Absolute Error` },
		{ id: 3, text: `Hinge Loss` },
		{ id: 4, text: `Huber Loss` },
		{ id: 5, text: `Mean Squared Error` }
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

	let items = [
    { id: 1, name: "Dense"},
    { id: 2, name: "Convolutional"},
    { id: 3, name: "PReLU"},
	{ id: 4, name: "Softmax"},
	{ id: 5, name: "Maxpool"}
  	];

	function handleSubmit() {
		alert(`Generating code in ${generate_selection} with optimizer ${optimizer_options.id} (${optimizer_options.text})`);
	}
	
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
		// var code = pytorch_code_generator(net_list)

		const res = await fetch('http://127.0.0.1:8000/generate_pytorch', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(net_list)
		})

		const net = await res.json()  // waiting for the response back from the api

		download_string("pytorch.py", net)
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
		// var code = tf_code_generator(net_list)
		const res = await fetch('http://127.0.0.1:8000/generate_tensor', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(net_list)
		})

		const net = await res.json()  // waiting for the api's response

		download_string("tf.py", net)
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

			if (this_operator.func == 5){           // Dense/Fully Connected
				operator_list.push(0);
			} else if (this_operator.func == 10){   // Convolutional layer
				
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
			if(this_operator.func == 5){
				// push output size (number of neurons in layer)
				operator_list.push(tensors[this_operator.outputs[0]].calc_size()); // NEED TO CHANGE THIS TO MAKE IT WORK FOR NONLINEAR NETWORKS
			}

			var next_operator = operators[tensors[this_operator.outputs[0]].input_to[0]]

			// Push operator function
			if ((this_operator.func == 5 || this_operator.func == 10) && (next_operator.func == 7 || next_operator.func == 12)){
				if (next_operator.func == 7){         // Soft Max
					operator_list.push(3);
				} else if (next_operator.func == 12){ // ReLU
					operator_list.push(2);
				}
				i++;
			} else {
				console.log("Activation function expected, none given")
				operator_list.push(0);
			}

			//If convolution, we need kernel
			if(this_operator.func == 10){

				var kernel_str = "(" + tensors[this_operator.inputs[1]].form[0] + "," + tensors[this_operator.inputs[1]].form[1] + ")"
				operator_list.push(kernel_str)
			}


			net_list.push(operator_list);

		}

		return net_list
	}

	function setGenerate(res){
		generate_selection=res
	}

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
				<li><a href={undefined} class="nav-button" on:click={optimize}>Optimize</a></li>
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
				<a href={undefined} class="add_op_button" on:click={()=>getModal('add_operator').open()}>+ add operator</a>
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
						<li id={"list_item"+item.id} class="{item.hovered === "true" ? 'hovered' : ''}" on:click={()=>{getModal('edit_fully_connected').open();set_edit_operator(item.id)}} on:focus={()=>{}} on:mouseleave={() => {gui_logic.highlight_operators([])}} on:mouseover={() => {gui_logic.highlight_operators([item.id])}}>
							<p><img src={fully_connected_icon} alt="Fully Connected List icon." style="max-height: 20px; margin-right: 10px">{item.operator_name}</p>
						</li>
					<!-- Convolution Operator -->
					{:else if item.operator_type === "Convolution"}
						<li id={"list_item"+item.id} class="{item.hovered === "true" ? 'hovered' : ''}" on:click={()=>{getModal('edit_convolution').open();set_edit_operator(item.id)}} on:focus={()=>{}} on:mouseleave={() => {gui_logic.highlight_operators([])}} on:mouseover={() => {gui_logic.highlight_operators([item.id])}}>
							<p><img src={convolution_icon} alt="Convolution List icon." style="max-height: 20px; margin-right: 10px">{item.operator_name}</p>
						</li>
					<!-- PReLU Operator -->
					{:else if item.operator_type === "PReLU"}
						<li id={"list_item"+item.id} class="{item.hovered === "true" ? 'hovered' : ''}" on:click={()=>{getModal('edit_prelu').open();set_edit_operator(item.id)}} on:focus={()=>{}} on:mouseleave={() => {gui_logic.highlight_operators([])}} on:mouseover={() => {gui_logic.highlight_operators([item.id])}}>
							<p><img src={prelu_icon} alt="PReLU List icon." style="max-height: 20px; margin-right: 10px">{item.operator_name}</p>
						</li>
					<!-- Softmax Operator -->
					{:else if item.operator_type === "Softmax"}
						<li id={"list_item"+item.id} class="{item.hovered === "true" ? 'hovered' : ''}" on:click={()=>{getModal('edit_softmax').open();set_edit_operator(item.id)}}  on:focus={()=>{}} on:mouseleave={() => {gui_logic.highlight_operators([])}} on:mouseover={() => {gui_logic.highlight_operators([item.id])}}>
							<p><img src={softmax_icon} alt="Softmax List icon." style="max-height: 20px; margin-right: 10px">{item.operator_name}</p>
						</li>
					{/if}
				{/each}
			</div>
		</div>

		<!-- Workspace Canvas (For drawing the neural network) -->
        <div id="canvas_container">
            <canvas id="gui_canvas"></canvas>
			<div id="canvas_footer">
				Network Parameters: _	Layers: {layers}
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
		<button class="option" on:click={yes_clear}>
			Yes
		</button>
		<button class="option" on:click={()=>getModal('clear').close(0)}>
			No
		</button>
	</Modal>

	<Modal id="generate">
		How would you like to download your neural network? <br><br>
		<!-- Passing a value back to the callback function; Choice is saved in 'generate_selection' -->
		<button class="option" on:click={generatePyTorch}>
			Pytorch
		</button>
		<button class="option" on:click={generateTensor}>
			Tensorflow
		</button>

		<!-- Select Code Generation Type-->
		<!-- <form on:submit|preventDefault={handleSubmit}>
			<Switch bind:value={generate_selection} label="Code: " design="code" /> 
			<p style="color: red">{generate_selection}</p> -->
			<!-- Select Optimizer -->
			<!-- <p>Select Loss Function: </p>
			<select value={loss_selection}>
				{#each loss_options as loss}
					<option value={loss}>
						{loss.text}
					</option>
				{/each}
			</select>
			<p style="color: red">{loss_selection}</p><br> -->
			<!-- Select Loss-->
			<!-- <p>Select Optimizer: </p>
			<select value={optimizer_selection}>
				{#each optimizer_options as optimizer}
					<option value={optimizer}>
						{optimizer.text}
					</option>
				{/each}
			</select>
			<p style="color: red">{optimizer_selection}</p>

			<button type=submit on:click={()=>{getModal('generate').close()}}>
				Generate
			</button> -->

		<!-- </form> -->

	</Modal>

	<Modal id="tutorial">
		<h1>Tutorial</h1>
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
		Add Operator: <br><br>
		<!-- Calls function to call specific operator -->
		<button class="option" on:click={add_dense}>
            Dense
        </button>
        <button class="option" on:click={add_conv}>
            Convolutional
        </button>
        <button class="option" on:click={add_prelu}>
            PReLU
        </button>
        <button class="option" on:click={add_softmax}>
            Softmax
        </button>
		<button class="option" on:click={add_maxpool}>
            Max Pool
        </button>
	</Modal>

	<!-- Modals for editing operators -->
	<Modal id="edit_fully_connected">
		Edit Fully Connected Operator: <br><br>
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
		</form>
		<button class="submit" on:click={()=>{getModal('edit_fully_connected').close();submit_edit()}}>
            Submit
        </button>
	</Modal>

	<Modal id="edit_convolution">
		Edit Convolution Operator: <br><br>
		<!-- <Switch bind:value={I_switch} label="" design="I" />
		<p>{I_switch}</p>
		<Switch bind:value={O_switch} label="" design="O" />
		<p>{O_switch}</p> -->
		<form on:submit|preventDefault={addItem}>
			<label for="name">Input:</label>
			<input id="name" type="text" bind:value={input} on:change={() => {update_tensor_shape(0)}}/><br>
			<label for="name">Output:</label>
			<input id="name" type="text" bind:value={output} on:change={() => {update_tensor_shape(2)}}/><br>
			<label for="name">Kernel Shape:</label>
			<input id="name" type="text" bind:value={parameter_shape} on:change={() => {update_tensor_shape(1)}}/>
		</form>
		<button class="submit" on:click={()=>{getModal('edit_convolution').close();submit_edit()}}>
            Submit
        </button>
	</Modal>

	<Modal id="edit_prelu">
		Edit PReLU Operator: <br><br>
		<!-- <Switch bind:value={I_switch} label="" design="I" />
		<p>{I_switch}</p>
		<Switch bind:value={O_switch} label="" design="O" />
		<p>{O_switch}</p> -->
		<form on:submit|preventDefault={addItem}>
			<label for="name">Input/Output size:</label>
			<input id="name" type="text" bind:value={input} on:change={() => {update_tensor_shape(0)}}/><br>
			<!-- <label for="name">Slope for -x:</label>
			<input id="name" type="text" bind:value={parameter_shape} /> -->
		</form>
		<button class="submit" on:click={()=>{getModal('edit_prelu').close();submit_edit()}}>
            Submit
        </button>
	</Modal>

	<Modal id="edit_softmax">
		Edit Softmax Operator: <br><br>
		<!-- <Switch bind:value={I_switch} label="" design="I" />
		<p>{I_switch}</p>
		<Switch bind:value={O_switch} label="" design="O" />
		<p>{O_switch}</p> -->
		<form on:submit|preventDefault={addItem}>
			<label for="name">Input/Output size:</label>
			<input id="name" type="text" bind:value={input} on:change={() => {update_tensor_shape(0)}}/><br>
		</form>
		<button class="submit" on:click={()=>{getModal('edit_softmax').close();submit_edit()}}>
            Submit
        </button>
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


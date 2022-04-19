<script>
	import Modal,{getModal} from './Modal.svelte'
	import Switch from './Switch.svelte'
    import { onMount } from "svelte";
	import * as objects from "./define_network_objects"
    import * as gui_logic from "./gui_logic"
	import { time_ranges_to_array } from 'svelte/internal';
	

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
		var op_names = gui_logic.get_list_of_operators().map((e) => (objects.function_table[e.func].name));
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
	function update_tensor_shape(operator, tensor){
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

		var shape = []
		var comma_index = shape_str.indexOf(',')
		if(comma_index == -1){
			shape.push(parseInt(shape_str))
		}else{
			shape.push(parseInt(shape_str.substring(0,comma_index)))
			shape.push(parseInt(shape_str.substring(start = comma_index)))
		}

		switch(tensor){
			case 0:
				gui_logic.edit_tensor_by_operator(operator, 0, true, shape)
				break;
			case 1:
				gui_logic.edit_tensor_by_operator(operator, 1, true, shape)
				break;
			case 2:
				gui_logic.edit_tensor_by_operator(operator, 0, false, shape)
				break;
		}

	}

	// Add operator functions
	function add_dense() {
      	gui_logic.new_operator(5)
		getModal('add_operator').close(1)
		update_operator_list()
    }
	function add_conv() {
      	gui_logic.new_operator(10)
		getModal('add_operator').close(1)
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
	let generate_selection; // Value for Modal choice for which code to generate network in
	let IO_switch; // Value to toggle for operator as input or output
	let grid; // Toggle on and off grid for canvas

	// Add operator variables
	let input;
	let output;
	let parameter_shape; // As tuple

	let items = [
    { id: 1, name: "Dense"},
    { id: 2, name: "Convolutional"},
    { id: 3, name: "PReLU"},
	{ id: 4, name: "Softmax"}
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

	function setGenerate(res){
		generate_selection=res

		
		var data = "testest"
		
		fetch("../net/"+data,
			{
			method: 'POST'
			}
			).then(x => {
			console.log("Request complete! response:", x);
		});

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
				<a href={undefined} class="nav-button" on:click={()=>getModal('add_operator').open()}>+ add operator</a>
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
						<li id={"list_item"+item.id} class="{item.hovered === "true" ? 'hovered' : ''}" on:click={()=>getModal('edit_fully_connected').open()} on:focus={()=>{}} on:mouseleave={() => {gui_logic.highlight_operators([])}} on:mouseover={() => {gui_logic.highlight_operators([item.id])}}>
							<p><img src={fully_connected_icon} alt="Fully Connected List icon." style="max-height: 20px; margin-right: 10px">{item.operator_name}</p>
						</li>
					<!-- Convolution Operator -->
					{:else if item.operator_type === "Convolution"}
						<li id={"list_item"+item.id} class="{item.hovered === "true" ? 'hovered' : ''}" on:click={()=>getModal('edit_convolution').open()} on:focus={()=>{}} on:mouseleave={() => {gui_logic.highlight_operators([])}} on:mouseover={() => {gui_logic.highlight_operators([item.id])}}>
							<p><img src={convolution_icon} alt="Convolution List icon." style="max-height: 20px; margin-right: 10px">{item.operator_name}</p>
						</li>
					<!-- PReLU Operator -->
					{:else if item.operator_type === "PReLU"}
						<li id={"list_item"+item.id} class="{item.hovered === "true" ? 'hovered' : ''}" on:click={()=>getModal('edit_prelu').open()} on:focus={()=>{}} on:mouseleave={() => {gui_logic.highlight_operators([])}} on:mouseover={() => {gui_logic.highlight_operators([item.id])}}>
							<p><img src={prelu_icon} alt="PReLU List icon." style="max-height: 20px; margin-right: 10px">{item.operator_name}</p>
						</li>
					<!-- Softmax Operator -->
					{:else if item.operator_type === "Softmax"}
						<li id={"list_item"+item.id} class="{item.hovered === "true" ? 'hovered' : ''}" on:click={()=>getModal('edit_softmax').open()}  on:focus={()=>{}} on:mouseleave={() => {gui_logic.highlight_operators([])}} on:mouseover={() => {gui_logic.highlight_operators([item.id])}}>
							<p><img src={softmax_icon} alt="Softmax List icon." style="max-height: 20px; margin-right: 10px">{item.operator_name}</p>
						</li>
					{/if}
				{/each}
			</div>
		</div>

		<!-- Workspace Canvas (For drawing the neural network) -->
        <div id="canvas_container">
            <canvas id="gui_canvas"></canvas>
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
		<button class="option" on:click={()=>getModal('generate').close(1)}>
			Pytorch
		</button>
		<button class="option" on:click={()=>getModal('generate').close(2)}>
			Tensorflow
		</button>
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
	</Modal>

	<!-- Modals for editing operators -->
	<Modal id="edit_fully_connected">
		Edit Fully Connected Operator: <br><br>
		<Switch bind:value={IO_switch} label="" design="IO" />
		<form on:submit|preventDefault={addItem}>
			<label for="name">Input:</label>
			<input id="name" type="text" bind:value={input} /><br>
			<label for="name">Output:</label>
			<input id="name" type="text" bind:value={output} /><br>
			<label for="name">Parameter Shape:</label>
			<input id="name" type="text" bind:value={parameter_shape} />
		</form>
		<button class="submit" on:click={()=>getModal('edit_fully_connected').close()}>
            Submit
        </button>
	</Modal>

	<Modal id="edit_convolution">
		Edit Convolution Operator: <br><br>
		<Switch bind:value={IO_switch} label="" design="IO" />
		<form on:submit|preventDefault={addItem}>
			<label for="name">Input:</label>
			<input id="name" type="text" bind:value={input} /><br>
			<label for="name">Output:</label>
			<input id="name" type="text" bind:value={output} /><br>
			<label for="name">Kernel Shape:</label>
			<input id="name" type="text" bind:value={parameter_shape} />
		</form>
		<button class="submit" on:click={()=>getModal('edit_convolution').close()}>
            Submit
        </button>
	</Modal>

	<Modal id="edit_prelu">
		Edit PReLU Operator: <br><br>
		<Switch bind:value={IO_switch} label="" design="IO" />
		<form on:submit|preventDefault={addItem}>
			<label for="name">Input/Output size:</label>
			<input id="name" type="text" bind:value={input} /><br>
			<label for="name">Slope for -x:</label>
			<input id="name" type="text" bind:value={parameter_shape} />
		</form>
		<button class="submit" on:click={()=>getModal('edit_prelu').close()}>
            Submit
        </button>
	</Modal>

	<Modal id="edit_softmax">
		Edit Softmax Operator: <br><br>
		<Switch bind:value={IO_switch} label="" design="IO" />
		<form on:submit|preventDefault={addItem}>
			<label for="name">Input/Output size:</label>
			<input id="name" type="text" bind:value={input} /><br>
		</form>
		<button class="submit" on:click={()=>getModal('edit_softmax').close()}>
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
	#workspace{
        height: 100%;
		margin: 100px;
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
		padding-top: 5px;
		padding-bottom: 5px;
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
<script>
	import Modal,{getModal} from './Modal.svelte'
    import { onMount } from "svelte";
	import "./define_network_objects"
    import * as gui_logic from "./gui_logic"

    onMount(() => {
        gui_logic.init()
    })

	// Wrapper for yes clear function
	function yes_clear() {
		getModal('clear').close(1)
      	gui_logic.clear_network()
    }

	// Add operator functions
	function add_dense() {
      	gui_logic.new_operator(5)
		getModal('add_operator').close(1)
    }
	function add_conv() {
      	gui_logic.new_operator(10)
			getModal('add_operator').close(1)
    }
	function add_prelu() {
      	gui_logic.new_operator(12)
		  getModal('add_operator').close(1)
    }
	function add_softmax() {
      	gui_logic.new_operator(7)
		  getModal('add_operator').close(1)
    }

	// Constants
    let bar_logo = './transparent_bar_logo.png'; // Neurula logo for nav bar
    let home_link = 'http://127.0.0.1:8000'; // Main domain 
	let dropdownTrigger;
	let clear_selection; // Value for Modal choice for clearing
	let generate_selection; // Value for Modal choice for which code to generate network in

	// Add operator variables
	let input;
	let output;
	let parameter_shape; // As tuple

	// Temporary list of operators (as placeholder for standard neural network)
	const toolbarItems = [
		{operator_type: "Dense"},
		{operator_type: "PReLU"},
		{operator_type: "Softmax"},
		{operator_type: "Convolutional"},
		{operator_type: "Dense"},
		{operator_type: "PReLU"},
		{operator_type: "Softmax"},
		{operator_type: "Convolutional"},
		{operator_type: "Dense"},
		{operator_type: "PReLU"},
		{operator_type: "Softmax"},
		{operator_type: "Convolutional"},
		{operator_type: "Dense"},
		{operator_type: "PReLU"},
		{operator_type: "Softmax"},
		{operator_type: "Convolutional"}
	];

	// Function for nav bar Modal options
	function setClear(res){
		clear_selection=res
	}

	function setGenerate(res){
		generate_selection=res
	}
  
</script>
  
<main>
	<!-- Navigation Bar (At top of page) -->
	<nav>
		<div class="inner">
			<ul class="navbar-list">
				<li><a href={home_link}><img src={bar_logo} alt="Neurula logo." style="max-height: 40px" ></a></li>
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
			<div id="toolbar_title">
				<a href={undefined} class="nav-button" on:click={()=>getModal('add_operator').open()}>+ add operator</a>
			</div>
			<div id="toolbar_list">
				<div id="toolbar_add_operator">
					<strong>Current Operators: </strong>
				</div>
				<!-- Displays list of placeholder navItems as set in <script> -->
				{#each toolbarItems as item}
					<li id="list_item" on:click={()=>getModal('edit_operator').open()}>
						<p>{item.operator_type}</p>
					</li>
				{/each}
			</div>
		</div>

		<!-- Workspace Canvas (For drawing the neural network) -->
        <div id="canvas_container">
            <canvas id="gui_canvas"></canvas>
        </div>
    </div>

	<!-- Modal Popups for Navigation Bar-->
	<Modal id="clear">
		Are you sure?
		<!-- Passing a value back to the callback function; Choice is saved in 'clear_selection' -->
		<button class="green" on:click={yes_clear}>
			Yes
		</button>
		<button class="green" on:click={()=>getModal('clear').close(0)}>
			No
		</button>
	</Modal>

	<Modal id="generate">
		How would you like to download your neural network? <br><br>
		<!-- Passing a value back to the callback function; Choice is saved in 'generate_selection' -->
		<button class="green" on:click={()=>getModal('generate').close(1)}>
			Pytorch
		</button>
		<button class="green" on:click={()=>getModal('generate').close(2)}>
			Tensorflow
		</button>
	</Modal>

	<Modal id="tutorial">
		<h1>Tutorial</h1>
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

	<Modal id="edit_operator">
		Edit Operator: <br><br>
	</Modal>

</main>

<style>
	main {
		margin: 0px;
	}
	nav {
		background-color: rgba(0, 0, 0, 0.8);
		font-family: "Helvetica Neue", "Helvetica", "Arial", sans-serif;
		height: 60px;
		margin: 0;
		padding: 0;
		border-radius: 0.4em;
	}  
	.inner {
		max-width: 980px;
		padding-left: 20px;
		padding-right: 20px;
		margin: auto;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		height: 100%;
	}
  
	.navbar-list {
		display: none;
		width: 100%;
		justify-content: space-between;
		margin: 0;
		padding: 0 40px;
	}
  
	.navbar-list li {
		list-style-type: none;
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
        width: 200px;
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
		border-radius: 0.4em 0em 0em 0em;
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
	#list_item {
		padding-left: 10px;
		padding-bottom: 1px;
		border-top: 0.1em solid whitesmoke;
	}
	#list_item:hover {
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
  
	@media only screen and (min-width: 767px) {
		a.nav-button{
			display: block;
			margin: 0.4em auto;
		}
		.navbar-list {
			display: flex;
			padding: 0;
		}
		.navbar-list a {
			display: inline-flex;
		}
	}
</style>


<script>
	import { onMount } from "svelte";

	import "./define_network_objects"
	import * as gui_logic from "./gui_logic"

	onMount(() => {
		gui_logic.init()
	})



	//EXAMPLE CODE
	let rand = -3;
	function getRand() {
		fetch("../rand")
		.then(d => d.text())      //This converts d to text
		.then(d => (rand = d));   //this turns rand into fetched number
	}
	//EXAMPLE CODE
</script>

<main>
	<div id="examplestuff">
		<h1>Hello {rand}!</h1>
		<button on:click={getRand}>Get a random number</button>
	</div>
	<div id="workspace">
		<div id="left_tool_bar">
			<div id="left_tool_bar_header">
				header
			</div>
			<div id="left_tool_bar_add_operator">
				add operator
			</div>
			<div id="left_tool_bar_footer">
				footer
			</div>
		</div>
		<div id="canvas_container">
			<canvas id="gui_canvas"></canvas>
		</div>
		
	</div>
</main>


<style>
	#examplestuff {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	#workspace{
		overflow: hidden;
		height:100%;
	}

	#left_tool_bar{
		float:left;
		height:100%;
		width:200px;
		border-radius: 5px;
		border-style: solid;

		margin: 0;
		display: flex;
		flex-flow: column;
	}

	#left_tool_bar_header{
		flex: 0 1 auto;
	}
	#left_tool_bar_add_operator{
		flex: 1 1 auto;
	}
	#left_tool_bar_footer{
		flex: 0 1 auto;
	}



	#canvas_container{
		overflow: hidden;
		border-radius: 25px;
		border-style: solid;
	}

	#gui_canvas{
		width:100%;
		height:500px;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
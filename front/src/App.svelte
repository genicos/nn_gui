<script>
	import Modal,{getModal} from './Modal.svelte'
    import { onMount } from "svelte";

	import "./define_network_objects"
    import * as gui_logic from "./gui_logic"

    onMount(() => {
        gui_logic.init()
    })

	// CONSTANTS
    let bar_logo = './transparent_bar_logo.png'; // Neurula logo for nav bar
    let home_link = 'http://127.0.0.1:8000'; // Main domain 
	let clear_selection // Value for Modal choice for clearing
	let generate_selection // Value for Modal choice for which code to generate network in

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
				<li><a href={home_link}><img src={bar_logo} alt="Neurula logo." style="max-height: 40px"></a></li>
				<li><a href={undefined} class="nav-button" on:click={()=>getModal('clear').open(setClear)}>Clear</a></li>
				<li><a href={undefined} class="nav-button" on:click={()=>getModal('generate').open(setGenerate)}>Generate Code</a></li>
				<li><a href={undefined} class="nav-button" on:click={()=>getModal('tutorial').open()}>?</a></li>
			</ul>
		</div>
	</nav>

	<!-- Neural Network Workspace -->
	<div id="workspace">
        <div id="toolbar">
            <div id="toolbar_header">
                header
            </div>
            <div id="toolbar_add_operator">
                add operator
            </div>
            <div id="toolbar_footer">
                footer
            </div>
        </div>
        <div id="canvas_container">
            <canvas id="gui_canvas"></canvas>
        </div>
        
    </div>

	<!-- Modal Popups -->
	<Modal id="clear">
		Are you sure?
		<button class="green" on:click={()=>getModal('clear').close(1)}>
			Yes
		</button>
		<button class="green" on:click={()=>getModal('clear').close(0)}>
			No
		</button>
	</Modal>
	<Modal id="generate">
		How would you like to download your neural network?
		<!-- Passing a value back to the callback function	 -->
		<button class="green" on:click={()=>getModal('second').close(1)}>
			Pytorch
		</button>
		<button class="green" on:click={()=>getModal('second').close(2)}>
			Tensorflow
		</button>
	</Modal>
	<Modal id="tutorial">
		<h1>Tutorial</h1>
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
        overflow: hidden;
        height:100%;
		margin: 100px;
    }

    #toolbar{
        float: left;
        height: 500px;
        width: 200px;
		margin-right: 20px;
        border-style: solid;
		border-width: thin;
		border-radius: 0.4em;
		border-color: lightgray;

        display: flex;
        flex-flow: column;
		overflow: scroll;
    }

    #toolbar_header{
        flex: 0 1 auto;
    }
    #toolbar_add_operator{
        flex: 1 1 auto;
    }
    #toolbar_footer{
        flex: 0 1 auto;
    }

    #canvas_container{
        overflow: hidden;
        border-style: solid;
		border-width: thin;
		border-radius: 0.4em;
		border-color: lightgray;
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



export class Network{
    constructor(){
        this.tensors = [] //actual tensor objects
        this.operators = [] //actual operator objects

        this.input_tensors = []
        this.param_tensors = []
        this.output_tensors = []
        this.truth_tensors = []
        this.loss = null
    }

    add_tensor(t){
        this.tensors.push(t);
    }

    add_operator(op){
        
        var o = op.clone()

        this.operators.push(o);
        
        for(let i = 0; i < o.inputs.length; i++){
            this.tensors[o.inputs[i]].input_to.push(this.operators.length - 1)
        }
        
        for(let i = 0; i < o.outputs.length; i++){
            this.tensors[o.outputs[i]].output_of = this.operators.length - 1
        }
    }

    update_tensors(){

        for(let i = 0; i < this.tensors.length; i++){
            this.tensors[i].input_to = []
            this.tensors[i].output_of = null
        }
        for(let k = 0; k < this.operators.length; k++){

            for(let i = 0; i < this.operators[k].inputs.length; i++){
                this.tensors[this.operators[k].inputs[i]].input_to.push(k)
            }
            
            for(let i = 0; i < this.operators[k].outputs.length; i++){
                this.tensors[this.operators[k].outputs[i]].output_of = k
            }

        }

    }

    //This function finds all abstraction operators and replaces them with their
    // inner network
    expand(){
        //assumes that network is alright, ok, and doin well
        //inner networks shouldn't have parameter tensors

        
        for(let i = 0; i < this.operators.length; i++){

            //finding an abstraction operator to expand
            if(this.operators[i].func == 0 && this.operators[i].network){
                
                //recursively expanding inner networks
                var inner_net = this.operators[i].network;
                inner_net.expand();

                //Take out abstraction operator
                var abstraction = this.operators[i]
                
                
                //add new operators
                var old_operators_length = this.operators.length

                
                this.operators[i] = inner_net.operators[0]
                for(let k = 1; k < inner_net.operators.length; k++){
                    this.add_operator(inner_net.operators[k])
                }
                

                //Loop through each inner net tensor
                //  this tensor will have a new id under the outer network
                //    we determine this new id
                //  in each tensor, find all operators it is associated with
                //      by checking inputs_to and output_of
                //    we then update the associations of these operators so that they
                //      point to the new id
                for(let k = 0; k < inner_net.tensors.length; k++){

                    //these tensors will have a new id as measured by the outer network
                    var new_id = k;

                    
                    if(inner_net.input_tensors.includes(k)){
                        var index = inner_net.input_tensors.indexOf(k)

                        new_id = abstraction.inputs[index]
                    }else if(inner_net.output_tensors.includes(k)){
                        var index = inner_net.output_tensors.indexOf(k)

                        new_id = abstraction.outputs[index]
                    }else{
                        this.add_tensor(inner_net.tensors[k])
                        new_id = this.tensors.length - 1
                    }

                    

                    //finding all associated operators
                    for(let j = 0; j < inner_net.tensors[k].input_to.length; j++){
                        
                        var index_of_op = inner_net.tensors[k].input_to[j]
                        var op_index = inner_net.operators[ index_of_op ].inputs.indexOf(k)
                        
                        

                        if(index_of_op == 0){
                            
                            this.operators[i].inputs[op_index] = new_id
                        }else{
                            
                            this.operators[index_of_op + old_operators_length - 1].inputs[op_index] = new_id
                        }
                    }
                    

                    if(inner_net.tensors[k].output_of || inner_net.tensors[k].output_of == 0){

                        
                        var index_of_op = inner_net.tensors[k].output_of
                        var op_index = inner_net.operators[ index_of_op ].outputs.indexOf(k)
                        
                        if(index_of_op == 0){
                            this.operators[i].outputs[op_index] = new_id
                        }else{
                            this.operators[index_of_op + old_operators_length - 1].outputs[op_index] = new_id
                        }
                    }



                }
                
                this.update_tensors()
            }
        }
        
    }

    //Peer inside network, for debugging
    to_string(){

        var str = ""
        
        str += "Tensors: \n"
        
        for(let i = 0; i < this.tensors.length; i++){
            str += "\t"+i+":\n"
            if(this.tensors[i].form){
                str += "\t\tform: "+String(this.tensors[i].form)+"\n"
            }

            str += "\t\tinput_to:\n"
            for(let k = 0; k < this.tensors[i].input_to.length; k++){
                str += "\t\t\t" + this.tensors[i].input_to[k] + "\n"
            }
            

            str += "\t\toutput_of\n"
            str += "\t\t\t"+this.tensors[i].output_of + "\n"
        }

        str += "Operators: \n"
        for(let i = 0; i < this.operators.length; i++){
            str += "\t"+i+":\n"

            str += "\t\tinputs:\n"
            for(let k = 0; k < this.operators[i].inputs.length; k++){
                str += "\t\t\t" + this.operators[i].inputs[k] + "\n"
            }

            str += "\t\toutputs:\n"
            for(let k = 0; k < this.operators[i].outputs.length; k++){
                str += "\t\t\t" + this.operators[i].outputs[k] + "\n"
            }

            str += "\t\tfunc: "+this.operators[i].func + "\n"
        }
        
        str += "input_tensors:\n"
        for(let i = 0; i < this.input_tensors.length; i++){
            str += "\t"+this.input_tensors[i]+"\n"
        }
        
        str += "param_tensors:\n"
        for(let i = 0; i < this.param_tensors.length; i++){
            str += "\t"+this.param_tensors[i]+"\n"
        }
        
        str += "output_tensors:\n"
        for(let i = 0; i < this.output_tensors.length; i++){
            str += "\t"+this.output_tensors[i]+"\n"
        }

        return str
    }
}

export class Tensor{
    constructor(live, form) {
        this.scalar = false //I dont think I ever use this, i just check if this.size == 1

        // live is boolean, it means the tensor has been defined
        if (live)
            this.live = live
        else
            this.live = false

        // form is like tensorflow shape
        if(form)
            this.form = form
        else
            this.form = []
        
        //center of tensor square
        this.x = 0;
        this.y = 0;

        this.tx = 0;
        this.ty = 0;

        this.selected = false

        //Which operators this tensor is an input to
        this.input_to = []
        //Which operator this tensor is an output of
        this.output_of = null;
    }

    // Number of elements in this tensor
    calc_size(){
        if(this.form){

            var size_of_tensor = 1;

            for(let k = 0; k < this.form.length; k++){
                size_of_tensor *= this.form[k]
            }

            this.size = size_of_tensor
            
        }else{
            this.size = 0
        }
        return this.size
    }
}



//Class for the actual function that operators perform
//There are three types:
//  0: unary
//  1: side binary
//  2: top binary
export class Func{
    constructor(name, num_inputs, type){
        this.name = name
        this.num_inputs = num_inputs
        this.type = type
    }

    //takes array of tensors, with forms computed
    //returns array of output forms
    calc_form(inputs, network){
        
        var out = []
        console.log(this.name)

        switch(this.name){
            case "identity":
                out.push(network.tensors[inputs[0]].form)
                break
            case "add":
                out.push(network.tensors[inputs[0]].form)
                break
            case "subtract":
                out.push(network.tensors[inputs[0]].form)
                break   
            case "scale":
                out.push(network.tensors[inputs[0]].form)
                break
            case "full":

                var form1 = network.tensors[inputs[0]].form
                var form2 = network.tensors[inputs[1]].form

                var form1_total = 1
                for(let i = 0; i < form1.length; i++){
                    form1_total *= form1[i]
                }
                var form2_total = 1
                for(let i = 0; i < form2.length; i++){
                    form2_total *= form2[i]
                }

                var out_form = []
                out_form.push(form2_total/form1_total)
                
                out.push(out_form)
                break
            case "amass":
                var out_form = []
                out_form.push(1)
                
                out.push(out_form)
                break
            case "softmax":
                out.push(network.tensors[inputs[0]].form)
                break
            case "hardmax":
                out.push(network.tensors[inputs[0]].form)
                break
            case "max":
                var out_form = []
                out_form.push(1)
                
                out.push(out_form)
                break
            case "convolution":
                form1 = network.tensors[inputs[0]].form
                form2 = network.tensors[inputs[1]].form
                var out_form = []

                
                for(let i = 0; i < form1.length; i++){
                    if(form2.length <= i){
                        out_form.push(form1[i])
                    }else{
                        out_form.push(form1[i] - form2[i] + 1)
                    }
                }
                
                out.push(out_form)
                break
            
            case "squared dist":
                out.push([1])
                break
            
            case "ReLU":
                out.push(network.tensors[inputs[0]].form)
                break

            case "LeakyReLU":
                out.push(network.tensors[inputs[0]].form)
                break

            case "Leaky to ReLU":
                out.push(network.tensors[inputs[0]].form)
                break
                

        }

        return out
    }
}



export class Operator{
    constructor(func){

        //input and output tensors of this operator
        this.inputs = []
        this.outputs = []


        this.func = func
        this.size = null

        this.network = null

        this.highlighted = false
        
    }

    //Create deep copy of this operator
    clone(){
        var clone = new Operator(this.func)
        clone.inputs = [...this.inputs]
        clone.outputs = [...this.outputs]
        clone.network = this.network
        return clone
    }

}




export var function_table = Array.apply(null, Array(12)).map(function () {})
function_table[0] = new Func("abstraction", 0, 1)
function_table[1] = new Func("identity",1, 0)
function_table[2] = new Func("add", 2, 1)
function_table[3] = new Func("subtract", 2, 1)
function_table[4] = new Func("scale", 2, 2)
function_table[5] = new Func("Fully Connected", 2, 2)
function_table[6] = new Func("amass", 1, 0)
function_table[7] = new Func("Softmax", 1, 0) // softmax exponent base is 2s
function_table[8] = new Func("hardmax", 1, 0)
function_table[9] = new Func("max", 1, 0)
function_table[10] = new Func("Convolution", 2, 2)
function_table[11] = new Func("squared dist", 2, 1)
function_table[12] = new Func("PReLU", 1, 0)
function_table[13] = new Func("LeakyReLU", 1, 0) //negative slope is 0.1
function_table[14] = new Func("Leaky to ReLU", 1, 0) //LeakyReLU in training, ReLU in deployment
function_table[15] = new Func("MaxPool", 1, 0)
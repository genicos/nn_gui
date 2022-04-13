var app=function(){"use strict";function t(){}function e(t){return t()}function n(){return Object.create(null)}function s(t){t.forEach(e)}function o(t){return"function"==typeof t}function r(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}let i,a;function l(t,e,n,s){return t[1]&&s?function(t,e){for(const n in e)t[n]=e[n];return t}(n.ctx.slice(),t[1](s(e))):n.ctx}function u(t,e){t.appendChild(e)}function c(t,e,n){t.insertBefore(e,n||null)}function p(t){t.parentNode.removeChild(t)}function f(t){return document.createElement(t)}function h(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}function d(t){return document.createTextNode(t)}function x(){return d(" ")}function y(t,e,n,s){return t.addEventListener(e,n,s),()=>t.removeEventListener(e,n,s)}function m(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function _(t,e,n){t.classList[n?"add":"remove"](e)}function g(t){a=t}function v(){if(!a)throw new Error("Function called outside component initialization");return a}const w=[],$=[],b=[],k=[],T=Promise.resolve();let L=!1;function M(t){b.push(t)}const P=new Set;let C=0;function j(){const t=a;do{for(;C<w.length;){const t=w[C];C++,g(t),E(t.$$)}for(g(null),w.length=0,C=0;$.length;)$.pop()();for(let t=0;t<b.length;t+=1){const e=b[t];P.has(e)||(P.add(e),e())}b.length=0}while(w.length);for(;k.length;)k.pop()();L=!1,P.clear(),g(t)}function E(t){if(null!==t.fragment){t.update(),s(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(M)}}const S=new Set;let R;function D(t,e){t&&t.i&&(S.delete(t),t.i(e))}function q(t,e,n,s){if(t&&t.o){if(S.has(t))return;S.add(t),undefined.c.push((()=>{S.delete(t),s&&(n&&t.d(1),s())})),t.o(e)}}function U(t){t&&t.c()}function A(t,n,r,i){const{fragment:a,on_mount:l,on_destroy:u,after_update:c}=t.$$;a&&a.m(n,r),i||M((()=>{const n=l.map(e).filter(o);u?u.push(...n):s(n),t.$$.on_mount=[]})),c.forEach(M)}function O(t,e){const n=t.$$;null!==n.fragment&&(s(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function B(t,e){-1===t.$$.dirty[0]&&(w.push(t),L||(L=!0,T.then(j)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function z(e,o,r,i,l,u,c,f=[-1]){const h=a;g(e);const d=e.$$={fragment:null,ctx:null,props:u,update:t,not_equal:l,bound:n(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(o.context||(h?h.$$.context:[])),callbacks:n(),dirty:f,skip_bound:!1,root:o.target||h.$$.root};c&&c(d.root);let x=!1;if(d.ctx=r?r(e,o.props||{},((t,n,...s)=>{const o=s.length?s[0]:n;return d.ctx&&l(d.ctx[t],d.ctx[t]=o)&&(!d.skip_bound&&d.bound[t]&&d.bound[t](o),x&&B(e,t)),n})):[],d.update(),x=!0,s(d.before_update),d.fragment=!!i&&i(d.ctx),o.target){if(o.hydrate){const t=function(t){return Array.from(t.childNodes)}(o.target);d.fragment&&d.fragment.l(t),t.forEach(p)}else d.fragment&&d.fragment.c();o.intro&&D(e.$$.fragment),A(e,o.target,o.anchor,o.customElement),j()}g(h)}class N{$destroy(){O(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}function W(t){let e,n,o,r,i,a,d,g,v,w,$;const b=t[5].default,k=function(t,e,n,s){if(t){const o=l(t,e,n,s);return t[0](o)}}(b,t,t[4],null);return{c(){e=f("div"),n=f("div"),o=h("svg"),r=h("circle"),i=h("line"),a=h("line"),d=x(),g=f("div"),k&&k.c(),m(r,"cx","6"),m(r,"cy","6"),m(r,"r","6"),m(i,"x1","3"),m(i,"y1","3"),m(i,"x2","9"),m(i,"y2","9"),m(i,"class","svelte-1q0isnv"),m(a,"x1","9"),m(a,"y1","3"),m(a,"x2","3"),m(a,"y2","9"),m(a,"class","svelte-1q0isnv"),m(o,"id","close"),m(o,"viewBox","0 0 12 12"),m(o,"class","svelte-1q0isnv"),m(g,"id","modal-content"),m(g,"class","svelte-1q0isnv"),m(n,"id","modal"),m(n,"class","svelte-1q0isnv"),m(e,"id","topModal"),m(e,"class","svelte-1q0isnv"),_(e,"visible",t[1])},m(s,l){var p;c(s,e,l),u(e,n),u(n,o),u(o,r),u(o,i),u(o,a),u(n,d),u(n,g),k&&k.m(g,null),t[7](e),v=!0,w||($=[y(o,"click",t[6]),y(n,"click",(p=I,function(t){return t.stopPropagation(),p.call(this,t)})),y(e,"click",t[8])],w=!0)},p(t,[n]){k&&k.p&&(!v||16&n)&&function(t,e,n,s,o,r){if(o){const i=l(e,n,s,r);t.p(i,o)}}(k,b,t,t[4],v?function(t,e,n,s){if(t[2]&&s){const o=t[2](s(n));if(void 0===e.dirty)return o;if("object"==typeof o){const t=[],n=Math.max(e.dirty.length,o.length);for(let s=0;s<n;s+=1)t[s]=e.dirty[s]|o[s];return t}return e.dirty|o}return e.dirty}(b,t[4],n,null):function(t){if(t.ctx.length>32){const e=[],n=t.ctx.length/32;for(let t=0;t<n;t++)e[t]=-1;return e}return-1}(t[4]),null),2&n&&_(e,"visible",t[1])},i(t){v||(D(k,t),v=!0)},o(t){q(k,t),v=!1},d(n){n&&p(e),k&&k.d(n),t[7](null),w=!1,s($)}}}const G={};function H(t=""){return G[t]}const I=()=>{};function X(t,e,n){let s,o,r,{$$slots:i={},$$scope:a}=e,l=!1,{id:u=""}=e;function c(t){"Escape"==t.key&&R==s&&p()}function p(t){l&&(window.removeEventListener("keydown",c),R=o,null==R&&(document.body.style.overflow=""),n(1,l=!1),r&&r(t))}var f;G[u]={open:function(t){r=t,l||(o=R,R=s,window.addEventListener("keydown",c),document.body.style.overflow="hidden",n(1,l=!0),document.body.appendChild(s))},close:p},f=()=>{delete G[u],window.removeEventListener("keydown",c)},v().$$.on_destroy.push(f);return t.$$set=t=>{"id"in t&&n(3,u=t.id),"$$scope"in t&&n(4,a=t.$$scope)},[s,l,p,u,a,i,()=>p(),function(t){$[t?"unshift":"push"]((()=>{s=t,n(0,s)}))},()=>p()]}class F extends N{constructor(t){super(),z(this,t,X,W,r,{id:3})}}class Y{constructor(){this.tensors=[],this.operators=[],this.input_tensors=[],this.param_tensors=[],this.output_tensors=[],this.truth_tensors=[],this.loss=null}add_tensor(t){this.tensors.push(t)}add_operator(t){var e=t.clone();this.operators.push(e);for(let t=0;t<e.inputs.length;t++)this.tensors[e.inputs[t]].input_to.push(this.operators.length-1);for(let t=0;t<e.outputs.length;t++)this.tensors[e.outputs[t]].output_of=this.operators.length-1}update_tensors(){for(let t=0;t<this.tensors.length;t++)this.tensors[t].input_to=[],this.tensors[t].output_of=null;for(let t=0;t<this.operators.length;t++){for(let e=0;e<this.operators[t].inputs.length;e++)this.tensors[this.operators[t].inputs[e]].input_to.push(t);for(let e=0;e<this.operators[t].outputs.length;e++)this.tensors[this.operators[t].outputs[e]].output_of=t}}expand(){for(let a=0;a<this.operators.length;a++)if(0==this.operators[a].func&&this.operators[a].network){var t=this.operators[a].network;t.expand();var e=this.operators[a],n=this.operators.length;this.operators[a]=t.operators[0];for(let e=1;e<t.operators.length;e++)this.add_operator(t.operators[e]);for(let l=0;l<t.tensors.length;l++){var s=l;if(t.input_tensors.includes(l)){var o=t.input_tensors.indexOf(l);s=e.inputs[o]}else if(t.output_tensors.includes(l)){o=t.output_tensors.indexOf(l);s=e.outputs[o]}else this.add_tensor(t.tensors[l]),s=this.tensors.length-1;for(let e=0;e<t.tensors[l].input_to.length;e++){var r=t.tensors[l].input_to[e],i=t.operators[r].inputs.indexOf(l);0==r?this.operators[a].inputs[i]=s:this.operators[r+n-1].inputs[i]=s}if(t.tensors[l].output_of||0==t.tensors[l].output_of){r=t.tensors[l].output_of,i=t.operators[r].outputs.indexOf(l);0==r?this.operators[a].outputs[i]=s:this.operators[r+n-1].outputs[i]=s}}this.update_tensors()}}to_string(){var t="";t+="Tensors: \n";for(let e=0;e<this.tensors.length;e++){t+="\t"+e+":\n",this.tensors[e].form&&(t+="\t\tform: "+String(this.tensors[e].form)+"\n"),t+="\t\tinput_to:\n";for(let n=0;n<this.tensors[e].input_to.length;n++)t+="\t\t\t"+this.tensors[e].input_to[n]+"\n";t+="\t\toutput_of\n",t+="\t\t\t"+this.tensors[e].output_of+"\n"}t+="Operators: \n";for(let e=0;e<this.operators.length;e++){t+="\t"+e+":\n",t+="\t\tinputs:\n";for(let n=0;n<this.operators[e].inputs.length;n++)t+="\t\t\t"+this.operators[e].inputs[n]+"\n";t+="\t\toutputs:\n";for(let n=0;n<this.operators[e].outputs.length;n++)t+="\t\t\t"+this.operators[e].outputs[n]+"\n";t+="\t\tfunc: "+this.operators[e].func+"\n"}t+="input_tensors:\n";for(let e=0;e<this.input_tensors.length;e++)t+="\t"+this.input_tensors[e]+"\n";t+="param_tensors:\n";for(let e=0;e<this.param_tensors.length;e++)t+="\t"+this.param_tensors[e]+"\n";t+="output_tensors:\n";for(let e=0;e<this.output_tensors.length;e++)t+="\t"+this.output_tensors[e]+"\n";return t}}class J{constructor(t,e){this.scalar=!1,this.live=t||!1,e?this.form=e:e=[],this.x=0,this.y=0,this.tx=0,this.ty=0,this.selected=!1,this.input_to=[],this.output_of=null}calc_size(){if(this.form){var t=1;for(let e=0;e<this.form.length;e++)t*=this.form[e];this.size=t}else this.size=0;return this.size}}class K{constructor(t){this.inputs=[],this.outputs=[],this.func=t,this.size=null,this.network=null}clone(){var t=new K(this.func);return t.inputs=[...this.inputs],t.outputs=[...this.outputs],t.network=this.network,t}}class Q{constructor(t,e){this.name=t,this.num_inputs=e}calc_form(t,e){var n=[];switch(console.log(this.name),this.name){case"identity":case"add":case"subtract":case"scale":case"softmax":case"hardmax":case"ReLU":case"LeakyReLU":case"Leaky to ReLU":n.push(e.tensors[t[0]].form);break;case"full":var s=e.tensors[t[0]].form,o=e.tensors[t[1]].form,r=1;for(let t=0;t<s.length;t++)r*=s[t];var i=1;for(let t=0;t<o.length;t++)i*=o[t];(a=[]).push(i/r),n.push(a);break;case"amass":case"max":(a=[]).push(1),n.push(a);break;case"convolution":s=e.tensors[t[0]].form,o=e.tensors[t[1]].form;var a=[];for(let t=0;t<s.length;t++)o.length<=t?a.push(s[t]):a.push(s[t]-o[t]+1);n.push(a);break;case"squared dist":n.push([1])}return n}}var V=Array.apply(null,Array(12)).map((function(){}));V[0]=new Q("abstraction",0),V[1]=new Q("identity",1),V[2]=new Q("add",2),V[3]=new Q("subtract",2),V[4]=new Q("scale",2),V[5]=new Q("full",2),V[6]=new Q("amass",1),V[7]=new Q("softmax",1),V[8]=new Q("hardmax",1),V[9]=new Q("max",1),V[10]=new Q("convolution",2),V[11]=new Q("squared dist",2),V[12]=new Q("PReLU",1),V[13]=new Q("LeakyReLU",1),V[14]=new Q("Leaky to ReLU",1);const Z=10;function tt(t,e,n){var s={x_min:-9999,x_max:1e4,y_min:-9999,y_max:1e4},o=t.operators[e],r=!1;for(let t=0;t<o.outputs.length;t++)o.outputs[t]==n&&(r=!0);var i=0;if(!r)for(let t=0;t<o.inputs.length;t++)o.inputs[t]==n&&(i=t);var a=!1,l=!1,u=!1;switch(o.func){case 0:case 1:break;case 2:case 4:case 11:l=!0;break;case 4:case 5:case 10:u=!0;break;case 6:case 7:case 8:case 9:case 12:a=!0}var c=t.tensors[o.inputs[0]],p=t.tensors[o.inputs[1]],f=t.tensors[o.outputs[0]];if(a&&(r?s.x_min=c.x+40:s.x_max=f.x-40),u)if(r)s.x_min=p.x+20,s.y_min=p.y+20;else if(1==i){s.x_min=c.x+20,s.x_max=f.x-20;var h=Math.min(f.y,c.y);s.y_max=h-20}else s.x_max=p.x-20,s.y_min=p.y+20;if(l)if(r){var d=Math.max(c.x,p.x);s.x_min=d+40}else 1==i?(s.x_max=f.x-40,s.y_max=c.y-20):(s.x_max=f.x-40,s.y_min=p.y+20);return s}function et(t,e,n,s,o=!1){t.tensors[e].x=n,t.tensors[e].y=s,o&&(t.tensors[e].x-=(t.tensors[e].x+Z)%20-Z,t.tensors[e].y-=(t.tensors[e].y+Z)%20-Z);var r={x_min:-9999,x_max:1e4,y_min:-9999,y_max:1e4};for(let n=0;n<t.tensors[e].input_to.length;n++){let s=tt(t,t.tensors[e].input_to[n],e);r.x_min=Math.max(r.x_min,s.x_min),r.x_max=Math.min(r.x_max,s.x_max),r.y_min=Math.max(r.y_min,s.y_min),r.y_max=Math.min(r.y_max,s.y_max)}if(null!=t.tensors[e].output_of){let n=tt(t,t.tensors[e].output_of,e);r.x_min=Math.max(r.x_min,n.x_min),r.x_max=Math.min(r.x_max,n.x_max),r.y_min=Math.max(r.y_min,n.y_min),r.y_max=Math.min(r.y_max,n.y_max)}t.tensors[e].x<r.x_min&&(t.tensors[e].x=r.x_min),t.tensors[e].x>r.x_max&&(t.tensors[e].x=r.x_max),t.tensors[e].y<r.y_min&&(t.tensors[e].y=r.y_min),t.tensors[e].y>r.y_max&&(t.tensors[e].y=r.y_max)}function nt(t,e,n){var s=[];for(let o=0;o<t.tensors.length;o++)t.tensors[o].x-Z<e&&t.tensors[o].x+Z>e&&t.tensors[o].y-Z<n&&t.tensors[o].y+Z>n&&s.push(o);return s}function st(t,e){var n=t.tensors[e],s=n.input_to;n.input_to=[];for(let l=0;l<s.length;l++){var o=s[l],r=t.operators[o],i=t.tensors.length;t.add_tensor(new J(!0));var a=r.inputs.findIndex((t=>t==e));r.inputs[a]=i,t.tensors[i].x=n.x+20,t.tensors[i].y=n.y,t.tensors[i].input_to=[o],t.tensors[i].output_of=null,t.tensors[i].live=!1}n.x-=20,n.live=!1}function ot(t,e,n){if(t.tensors[e].live&&t.tensors[n].live)return void console.log("Both merged tensors are live, so don't do anything.");let s=t.tensors[e],o=t.tensors[n],r=n,i=e;if(null!=s.output_of&&null==o.output_of);else{if(null==o.output_of||null!=s.output_of)return void console.log("Error merging, only one input must have an output");var a=o;o=s,s=a,r=e,i=n}if(console.log(s.output_of,o.input_to),s.output_of==o.input_to)return void console.log("Error merging, these are input and output of the same function");let l=t.operators[o.input_to].inputs.indexOf(r);t.operators[o.input_to].inputs[l]=i,s.input_to=o.input_to,s.live=!0,function(t,e){for(let n=0;n<t.operators.length;n++){for(let s=0;s<t.operators[n].inputs.length;s++)t.operators[n].inputs[s]>e&&(t.operators[n].inputs[s]-=1);for(let s=0;s<t.operators[n].outputs.length;s++)t.operators[n].outputs[s]>e&&(t.operators[n].outputs[s]-=1)}t.tensors.splice(e,1)}(t,r)}var rt=0,it=0,at=0,lt=0;const ut=10;var ct=-1,pt=-1,ft=0,ht=0,dt=0,xt=0,yt=[],mt=!1,_t=!0;CanvasRenderingContext2D.prototype.roundRect=function(t,e,n,s,o){return n<0&&(t-=n=-n),s<0&&(e-=s=-s),n<2*o&&(o=n/2),s<2*o&&(o=s/2),this.beginPath(),this.moveTo(t+o,e),this.arcTo(t+n,e,t+n,e+s,o),this.arcTo(t+n,e+s,t,e+s,o),this.arcTo(t,e+s,t,e,o),this.arcTo(t,e,t+n,e,o),this.closePath(),this},yt.push(new Y),yt[0].add_tensor(new J(!1)),yt[0].tensors[0].x=200,yt[0].tensors[0].y=200,yt[0].add_tensor(new J(!1)),yt[0].tensors[1].x=100,yt[0].tensors[1].y=200,yt[0].add_tensor(new J(!1)),yt[0].tensors[2].x=150,yt[0].tensors[2].y=150;let gt=new K;gt.inputs=[1,2],gt.outputs=[0],gt.func=10,yt[0].add_operator(gt),yt[0].add_tensor(new J(!0)),yt[0].tensors[3].x=400,yt[0].tensors[3].y=200,yt[0].add_tensor(new J(!0)),yt[0].tensors[4].x=300,yt[0].tensors[4].y=200,yt[0].add_tensor(new J(!1)),yt[0].tensors[5].x=350,yt[0].tensors[5].y=150,yt[0].add_tensor(new J(!0)),yt[0].tensors[6].x=350,yt[0].tensors[6].y=350;let vt=new K;vt.inputs=[4,5],vt.outputs=[3],vt.func=2,yt[0].add_operator(vt),yt[0].add_tensor(new J(!0)),yt[0].tensors[7].x=500,yt[0].tensors[7].y=200,yt[0].add_tensor(new J(!0)),yt[0].tensors[8].x=400,yt[0].tensors[8].y=200,yt[0].add_tensor(new J(!0)),yt[0].tensors[9].x=450,yt[0].tensors[9].y=150,yt[0].add_tensor(new J(!0)),yt[0].tensors[10].x=450,yt[0].tensors[10].y=350;let wt=new K;wt.inputs=[8,9],wt.outputs=[7],wt.func=5,yt[0].add_operator(wt);let $t=new K;$t.inputs=[6],$t.outputs=[10],$t.func=7,yt[0].add_operator($t),yt[0].add_tensor(new J(!0)),yt[0].tensors[11].x=400,yt[0].tensors[11].y=400,yt[0].add_tensor(new J(!0)),yt[0].tensors[12].x=500,yt[0].tensors[12].y=400;let bt=new K;function kt(){(rt=document.getElementById("gui_canvas")).addEventListener("mousedown",Et,!1),rt.addEventListener("mousemove",St,!1),rt.addEventListener("mouseup",jt,!1),rt.addEventListener("dblclick",Ct,!1),it=rt.getContext("2d"),rt.width=rt.getBoundingClientRect().width,rt.height=rt.getBoundingClientRect().height,at=rt.width,lt=rt.height,function(t){var e=!1,n=!1,s=!1;switch(t){case 0:case 1:break;case 2:case 4:case 11:n=!0;break;case 4:case 5:case 10:s=!0;break;case 6:case 7:case 8:case 9:case 12:e=!0}let o=new K;o.func=t;var r=yt[0].tensors.length;e&&(yt[0].add_tensor(new J(!0)),yt[0].tensors[r+0].x=20,yt[0].tensors[r+0].y=20,yt[0].add_tensor(new J(!0)),yt[0].tensors[r+1].x=80,yt[0].tensors[r+1].y=20,o.inputs=[r+0],o.outputs=[r+1]),s&&(yt[0].add_tensor(new J(!0)),yt[0].tensors[r+0].x=20,yt[0].tensors[r+0].y=60,yt[0].add_tensor(new J(!0)),yt[0].tensors[r+1].x=60,yt[0].tensors[r+1].y=20,yt[0].add_tensor(new J(!0)),yt[0].tensors[r+2].x=100,yt[0].tensors[r+2].y=60,o.inputs=[r+0,r+1],o.outputs=[r+2]),n&&(yt[0].add_tensor(new J(!0)),yt[0].tensors[r+0].x=20,yt[0].tensors[r+0].y=60,yt[0].add_tensor(new J(!0)),yt[0].tensors[r+1].x=20,yt[0].tensors[r+1].y=20,yt[0].add_tensor(new J(!0)),yt[0].tensors[r+2].x=80,yt[0].tensors[r+2].y=40,o.inputs=[r+0,r+1],o.outputs=[r+2]),yt[0].add_operator(o)}(2),window.requestAnimationFrame(Mt)}function Tt(t,e){let n=t.tensors[e];n.live?(it.fillStyle="white",it.lineWidth=1,it.setLineDash([]),it.strokeStyle="black"):(it.fillStyle="rgba(255,255,255,0)",it.lineWidth=1,it.setLineDash([3,4]),it.strokeStyle="Grey"),it.beginPath(),n.scalar?it.rect(n.x-5,n.y-5,10,10):it.rect(n.x-ut,n.y-ut,20,20),it.fill(),it.stroke(),n.selected&&(it.fillStyle="rgba(255,255,255,0)",it.lineWidth=1,it.strokeStyle="#5dd2f0",it.setLineDash([]),it.beginPath(),it.roundRect(n.x-15,n.y-15,30,30,2),it.stroke())}function Lt(t,e){let n,s,o,r,i=t.operators[e],a=it.createLinearGradient(0,0,at,lt);a.addColorStop(0,"#DE7521"),a.addColorStop(1,"#218ADE"),it.fillStyle=a;switch(i.func){case 0:case 1:case 4:case 6:case 8:case 9:case 11:break;case 2:s=t.tensors[i.inputs[0]],o=t.tensors[i.inputs[1]],r=t.tensors[i.outputs[0]],it.beginPath(),it.moveTo(r.x-ut,r.y-ut),it.lineTo(r.x-ut,r.y+ut),it.lineTo(s.x+ut,s.y+ut),it.lineTo(s.x+ut,s.y-ut),it.closePath(),it.fill(),it.beginPath(),it.moveTo(r.x-ut,r.y-ut),it.lineTo(r.x-ut,r.y+ut),it.lineTo(o.x+ut,o.y+ut),it.lineTo(o.x+ut,o.y-ut),it.closePath(),it.fill();break;case 3:s=t.tensors[i.inputs[0]],o=t.tensors[i.inputs[1]],r=t.tensors[i.outputs[0]];break;case 5:s=t.tensors[i.inputs[0]],o=t.tensors[i.inputs[1]],r=t.tensors[i.outputs[0]],it.beginPath(),it.moveTo(r.x-ut,r.y-ut),it.lineTo(r.x-ut,r.y+ut),it.lineTo(s.x+ut,s.y+ut),it.lineTo(s.x+ut,s.y-ut),it.lineTo(o.x-ut,o.y+ut),it.lineTo(o.x+ut,o.y+ut),it.closePath(),it.fill();break;case 7:n=t.tensors[i.inputs[0]],r=t.tensors[i.outputs[0]],it.beginPath(),it.moveTo(r.x-ut,r.y-5),it.lineTo(r.x-ut,r.y+5),it.lineTo(n.x+ut,n.y+ut),it.lineTo(n.x+ut,n.y-ut),it.closePath(),it.fill();break;case 10:s=t.tensors[i.inputs[0]],o=t.tensors[i.inputs[1]],r=t.tensors[i.outputs[0]],it.beginPath(),it.moveTo(s.x+ut,s.y-ut+4),it.lineTo(s.x+ut,s.y-ut),it.lineTo(o.x-ut,o.y+ut),it.lineTo(o.x+ut,o.y+ut),it.lineTo(r.x-ut,r.y-ut),it.lineTo(r.x-ut,r.y-ut+4);for(let t=1;t<5;t+=2)it.lineTo(s.x+ut,s.y-ut+4*t),it.lineTo(s.x+ut,s.y-ut+4*(t+1)),it.lineTo(r.x-ut,r.y-ut+4*(t+1)),it.lineTo(r.x-ut,r.y-ut+4*(t+2));it.lineTo(s.x+ut,s.y+ut),it.closePath(),it.fill();break;case 12:n=t.tensors[i.inputs[0]],r=t.tensors[i.outputs[0]],it.beginPath(),it.moveTo(n.x+ut,n.y+ut),it.lineTo(n.x+ut,n.y-ut),it.lineTo(r.x-ut,r.y-ut),it.lineTo(r.x-ut,r.y-ut+4);for(let t=1;t<5;t+=2)it.lineTo((r.x+n.x)/2,(r.y+n.y)/2-ut+4*t),it.lineTo((r.x+n.x)/2,(r.y+n.y)/2-ut+4*(t+1)),it.lineTo(r.x-ut,r.y-ut+4*(t+1)),it.lineTo(r.x-ut,r.y-ut+4*(t+2));it.closePath(),it.fill();break;default:console.log("Invalid operator types")}}function Mt(){rt.width=rt.getBoundingClientRect().width,rt.height=rt.getBoundingClientRect().height,at=rt.width,lt=rt.height;for(let t=-10;t<at;t+=20)it.moveTo(t,0),it.lineTo(t,lt);for(let t=-10;t<lt;t+=20)it.moveTo(0,t),it.lineTo(at,t);it.lineWidth=.5,it.setLineDash([1,4]),it.strokeStyle="Grey",it.stroke();for(let t=0;t<yt[0].operators.length;t++)Lt(yt[0],t);for(let t=0;t<yt[0].tensors.length;t++)Tt(yt[0],t);if(-1!=ct)et(yt[0],ct,ft,ht,_t);else if(-1!=pt){var t=yt[0].operators[pt];for(let e=0;e<t.inputs.length;e++)et(yt[0],t.inputs[e],yt[0].tensors[t.inputs[e]].tx+ft-dt,yt[0].tensors[t.inputs[e]].ty+ht-xt,_t);for(let e=0;e<t.outputs.length;e++)et(yt[0],t.outputs[e],yt[0].tensors[t.outputs[e]].tx+ft-dt,yt[0].tensors[t.outputs[e]].ty+ht-xt,_t)}mt&&(it.fillStyle="rgba(255,255,255,0)",it.lineWidth=1,it.strokeStyle="#5dd2f0",it.setLineDash([2,3]),it.beginPath(),it.roundRect(dt,xt,ft-dt,ht-xt,2),it.stroke()),window.requestAnimationFrame(Mt)}function Pt(){for(let t=0;t<yt[0].tensors.length;t++)yt[0].tensors[t].selected=!1}function Ct(t){let e=nt(yt[0],ft,ht);console.log("Clicked Indices ",e);for(let t=0;t<e.length;t++){var n=e[t],s=yt[0].tensors[n];null==s.output_of||0==s.input_to.length?s.live=!s.live:(console.log("Unmerge"),st(yt[0],n))}}function jt(t){if(mt=!1,-1!=pt){for(let t=0;t<yt[0].operators[pt].inputs.length;t++)for(let o=0;o<yt[0].tensors.length;o++){if(o!=(s=yt[0].operators[pt].inputs[t])){var e=yt[0].tensors[s],n=yt[0].tensors[o];Math.abs(e.x-n.x)<20&&Math.abs(e.y-n.y)<20&&ot(yt[0],s,o)}}for(let t=0;t<yt[0].operators[pt].outputs.length;t++)for(let o=0;o<yt[0].tensors.length;o++){var s;if(o!=(s=yt[0].operators[pt].outputs[t])){e=yt[0].tensors[s],n=yt[0].tensors[o];Math.abs(e.x-n.x)<20&&Math.abs(e.y-n.y)<20&&ot(yt[0],s,o)}}}ct=-1,pt=-1;let o=nt(yt[0],ft,ht);o.length>=2&&ot(yt[0],o[0],o[1])}function Et(t){let e=nt(yt[0],ft,ht);0!=e.length&&(ct=e[0],yt[0].tensors[ct].selected||Pt(),yt[0].tensors[ct].selected=!0);let n=function(t,e,n){var s=[];for(let x=0;x<t.operators.length;x++){var o=t.operators[x],r=!1,i=!1,a=!1;switch(o.func){case 0:case 1:break;case 2:case 4:case 11:i=!0;break;case 4:case 5:case 10:a=!0;break;case 6:case 7:case 8:case 9:case 12:r=!0}var l=t.tensors[o.inputs[0]],u=t.tensors[o.inputs[1]],c=t.tensors[o.outputs[0]],p=1e6,f=-1e6,h=1e6,d=-1e6;r&&(p=l.x+Z,f=c.x-Z,h=Math.min(l.y-Z,c.y-Z),d=Math.max(l.y+Z,c.y+Z)),a&&(p=l.x+Z,f=c.x-Z,h=u.y+Z,d=Math.max(l.y+Z,c.y+Z)),i&&(p=Math.min(l.x+Z,u.x+Z),f=c.x-Z,h=u.y-Z,d=l.y+Z),p<e&&f>e&&h<n&&d>n&&s.push(x)}return s}(yt[0],ft,ht);if(0!=n.length){pt=n[0];var s=yt[0].operators[pt];for(let t=0;t<s.inputs.length;t++)yt[0].tensors[s.inputs[t]].tx=yt[0].tensors[s.inputs[t]].x,yt[0].tensors[s.inputs[t]].ty=yt[0].tensors[s.inputs[t]].y;for(let t=0;t<s.outputs.length;t++)yt[0].tensors[s.outputs[t]].tx=yt[0].tensors[s.outputs[t]].x,yt[0].tensors[s.outputs[t]].ty=yt[0].tensors[s.outputs[t]].y;dt=ft,xt=ht}0==e.length&&0==n.length&&(dt=ft,xt=ht,mt=!0,Pt())}function St(t){if(t.offsetX?(ft=t.offsetX,ht=t.offsetY):t.layerX&&(ft=t.layerX,ht=t.layerY),mt)for(let t=0;t<yt[0].tensors.length;t++){var e=yt[0].tensors[t];Math.abs(e.x-(dt+ft)/2)<Math.abs(dt-(dt+ft)/2)&&Math.abs(e.y-(xt+ht)/2)<Math.abs(xt-(xt+ht)/2)?e.selected=!0:e.selected=!1}}function Rt(t,e,n){const s=t.slice();return s[20]=e[n],s}function Dt(e){let n,s,o,r,i=e[20].operator_type+"";return{c(){n=f("li"),s=f("p"),o=d(i),r=x(),m(n,"id","list_item"),m(n,"class","svelte-fjxowc")},m(t,e){c(t,n,e),u(n,s),u(s,o),u(n,r)},p:t,d(t){t&&p(n)}}}function qt(e){let n,o,r,i,a,l;return{c(){n=d("Are you sure?\n\t\t\n\t\t"),o=f("button"),o.textContent="Yes",r=x(),i=f("button"),i.textContent="No",m(o,"class","green"),m(i,"class","green")},m(t,s){c(t,n,s),c(t,o,s),c(t,r,s),c(t,i,s),a||(l=[y(o,"click",e[0]),y(i,"click",e[7])],a=!0)},p:t,d(t){t&&p(n),t&&p(o),t&&p(r),t&&p(i),a=!1,s(l)}}}function Ut(e){let n,o,r,i,a,l;return{c(){n=d("How would you like to download your neural network?\n\t\t\n\t\t"),o=f("button"),o.textContent="Pytorch",r=x(),i=f("button"),i.textContent="Tensorflow",m(o,"class","green"),m(i,"class","green")},m(t,s){c(t,n,s),c(t,o,s),c(t,r,s),c(t,i,s),a||(l=[y(o,"click",e[8]),y(i,"click",e[9])],a=!0)},p:t,d(t){t&&p(n),t&&p(o),t&&p(r),t&&p(i),a=!1,s(l)}}}function At(t){let e;return{c(){e=f("h1"),e.textContent="Tutorial"},m(t,n){c(t,e,n)},d(t){t&&p(e)}}}function Ot(t){let e,n,o,r,a,l,h,_,g,v,w,$,b,k,T,L,M,P,C,j,E,S,R,B,z,N,W,G,H,I,X,Y,J,K,Q,V,Z,tt,et,nt=t[1],st=[];for(let e=0;e<nt.length;e+=1)st[e]=Dt(Rt(t,nt,e));return Y=new F({props:{id:"clear",$$slots:{default:[qt]},$$scope:{ctx:t}}}),K=new F({props:{id:"generate",$$slots:{default:[Ut]},$$scope:{ctx:t}}}),V=new F({props:{id:"tutorial",$$slots:{default:[At]},$$scope:{ctx:t}}}),{c(){e=f("main"),n=f("nav"),o=f("div"),r=f("ul"),a=f("li"),l=f("a"),h=f("img"),g=x(),v=f("li"),w=f("a"),$=d("Clear Canvas"),b=x(),k=f("li"),T=f("a"),L=d("Generate Code"),M=x(),P=f("li"),C=f("a"),j=d("?"),E=x(),S=f("div"),R=f("div"),B=f("div"),B.innerHTML="<p><strong>Toolbar</strong></p>",z=x(),N=f("div"),W=f("div"),W.innerHTML="<strong>Current Operators:</strong>",G=x();for(let t=0;t<st.length;t+=1)st[t].c();var t,s,u,c,p,y;H=x(),I=f("div"),I.innerHTML='<canvas id="gui_canvas" class="svelte-fjxowc"></canvas>',X=x(),U(Y.$$.fragment),J=x(),U(K.$$.fragment),Q=x(),U(V.$$.fragment),t=h.src,s=_=Bt,i||(i=document.createElement("a")),i.href=s,t!==i.href&&m(h,"src",_),m(h,"alt","Neurula logo."),u=h,c="max-height",null===(p="40px")?u.style.removeProperty(c):u.style.setProperty(c,p,y?"important":""),m(l,"href",zt),m(l,"class","svelte-fjxowc"),m(a,"class","svelte-fjxowc"),m(w,"href",void 0),m(w,"class","nav-button svelte-fjxowc"),m(v,"class","svelte-fjxowc"),m(T,"href",void 0),m(T,"class","nav-button svelte-fjxowc"),m(k,"class","svelte-fjxowc"),m(C,"href",void 0),m(C,"class","nav-button svelte-fjxowc"),m(P,"class","svelte-fjxowc"),m(r,"class","navbar-list svelte-fjxowc"),m(o,"class","inner svelte-fjxowc"),m(n,"class","svelte-fjxowc"),m(B,"id","toolbar_title"),m(B,"class","svelte-fjxowc"),m(W,"id","toolbar_add_operator"),m(W,"class","svelte-fjxowc"),m(N,"id","toolbar_list"),m(N,"class","svelte-fjxowc"),m(R,"id","toolbar"),m(R,"class","svelte-fjxowc"),m(I,"id","canvas_container"),m(I,"class","svelte-fjxowc"),m(S,"id","workspace"),m(S,"class","svelte-fjxowc"),m(e,"class","svelte-fjxowc")},m(s,i){c(s,e,i),u(e,n),u(n,o),u(o,r),u(r,a),u(a,l),u(l,h),u(r,g),u(r,v),u(v,w),u(w,$),u(r,b),u(r,k),u(k,T),u(T,L),u(r,M),u(r,P),u(P,C),u(C,j),u(e,E),u(e,S),u(S,R),u(R,B),u(R,z),u(R,N),u(N,W),u(N,G);for(let t=0;t<st.length;t+=1)st[t].m(N,null);u(S,H),u(S,I),u(e,X),A(Y,e,null),u(e,J),A(K,e,null),u(e,Q),A(V,e,null),Z=!0,tt||(et=[y(w,"click",t[4]),y(T,"click",t[5]),y(C,"click",t[6])],tt=!0)},p(t,[e]){if(2&e){let n;for(nt=t[1],n=0;n<nt.length;n+=1){const s=Rt(t,nt,n);st[n]?st[n].p(s,e):(st[n]=Dt(s),st[n].c(),st[n].m(N,null))}for(;n<st.length;n+=1)st[n].d(1);st.length=nt.length}const n={};8388608&e&&(n.$$scope={dirty:e,ctx:t}),Y.$set(n);const s={};8388608&e&&(s.$$scope={dirty:e,ctx:t}),K.$set(s);const o={};8388608&e&&(o.$$scope={dirty:e,ctx:t}),V.$set(o)},i(t){Z||(D(Y.$$.fragment,t),D(K.$$.fragment,t),D(V.$$.fragment,t),Z=!0)},o(t){q(Y.$$.fragment,t),q(K.$$.fragment,t),q(V.$$.fragment,t),Z=!1},d(t){t&&p(e),function(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}(st,t),O(Y),O(K),O(V),tt=!1,s(et)}}}bt.inputs=[11],bt.outputs=[12],bt.func=12,yt[0].add_operator(bt);let Bt="./transparent_bar_logo.png",zt="http://127.0.0.1:8000";function Nt(t){var e;e=()=>{kt()},v().$$.on_mount.push(e);function n(t){}function s(t){}return[function(){H("clear").close(1),yt[0]=new Y},[{operator_type:"Dense"},{operator_type:"PReLU"},{operator_type:"Softmax"},{operator_type:"Convolutional"},{operator_type:"Dense"},{operator_type:"PReLU"},{operator_type:"Softmax"},{operator_type:"Convolutional"},{operator_type:"Dense"},{operator_type:"PReLU"},{operator_type:"Softmax"},{operator_type:"Convolutional"},{operator_type:"Dense"},{operator_type:"PReLU"},{operator_type:"Softmax"},{operator_type:"Convolutional"}],n,s,()=>H("clear").open(n),()=>H("generate").open(s),()=>H("tutorial").open(),()=>H("clear").close(0),()=>H("generate").close(1),()=>H("generate").close(2)]}return new class extends N{constructor(t){super(),z(this,t,Nt,Ot,r,{})}}({target:document.body,props:{name:"world"}})}();
//# sourceMappingURL=bundle.js.map

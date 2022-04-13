var app=function(){"use strict";function t(){}function e(t){return t()}function n(){return Object.create(null)}function s(t){t.forEach(e)}function o(t){return"function"==typeof t}function r(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}let i,a;function l(t,e,n,s){return t[1]&&s?function(t,e){for(const n in e)t[n]=e[n];return t}(n.ctx.slice(),t[1](s(e))):n.ctx}function u(t,e){t.appendChild(e)}function c(t,e,n){t.insertBefore(e,n||null)}function p(t){t.parentNode.removeChild(t)}function h(t){return document.createElement(t)}function f(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}function d(t){return document.createTextNode(t)}function m(){return d(" ")}function x(t,e,n,s){return t.addEventListener(e,n,s),()=>t.removeEventListener(e,n,s)}function y(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function _(t,e,n){t.classList[n?"add":"remove"](e)}function g(t){a=t}function v(){if(!a)throw new Error("Function called outside component initialization");return a}const $=[],b=[],w=[],k=[],T=Promise.resolve();let L=!1;function C(t){w.push(t)}const P=new Set;let M=0;function E(){const t=a;do{for(;M<$.length;){const t=$[M];M++,g(t),S(t.$$)}for(g(null),$.length=0,M=0;b.length;)b.pop()();for(let t=0;t<w.length;t+=1){const e=w[t];P.has(e)||(P.add(e),e())}w.length=0}while($.length);for(;k.length;)k.pop()();L=!1,P.clear(),g(t)}function S(t){if(null!==t.fragment){t.update(),s(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(C)}}const R=new Set;let D;function U(t,e){t&&t.i&&(R.delete(t),t.i(e))}function q(t,e,n,s){if(t&&t.o){if(R.has(t))return;R.add(t),undefined.c.push((()=>{R.delete(t),s&&(n&&t.d(1),s())})),t.o(e)}}function A(t){t&&t.c()}function O(t,n,r,i){const{fragment:a,on_mount:l,on_destroy:u,after_update:c}=t.$$;a&&a.m(n,r),i||C((()=>{const n=l.map(e).filter(o);u?u.push(...n):s(n),t.$$.on_mount=[]})),c.forEach(C)}function B(t,e){const n=t.$$;null!==n.fragment&&(s(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function z(t,e){-1===t.$$.dirty[0]&&($.push(t),L||(L=!0,T.then(E)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function N(e,o,r,i,l,u,c,h=[-1]){const f=a;g(e);const d=e.$$={fragment:null,ctx:null,props:u,update:t,not_equal:l,bound:n(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(o.context||(f?f.$$.context:[])),callbacks:n(),dirty:h,skip_bound:!1,root:o.target||f.$$.root};c&&c(d.root);let m=!1;if(d.ctx=r?r(e,o.props||{},((t,n,...s)=>{const o=s.length?s[0]:n;return d.ctx&&l(d.ctx[t],d.ctx[t]=o)&&(!d.skip_bound&&d.bound[t]&&d.bound[t](o),m&&z(e,t)),n})):[],d.update(),m=!0,s(d.before_update),d.fragment=!!i&&i(d.ctx),o.target){if(o.hydrate){const t=function(t){return Array.from(t.childNodes)}(o.target);d.fragment&&d.fragment.l(t),t.forEach(p)}else d.fragment&&d.fragment.c();o.intro&&U(e.$$.fragment),O(e,o.target,o.anchor,o.customElement),E()}g(f)}class W{$destroy(){B(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}function j(t){let e,n,o,r,i,a,d,g,v,$,b;const w=t[5].default,k=function(t,e,n,s){if(t){const o=l(t,e,n,s);return t[0](o)}}(w,t,t[4],null);return{c(){e=h("div"),n=h("div"),o=f("svg"),r=f("circle"),i=f("line"),a=f("line"),d=m(),g=h("div"),k&&k.c(),y(r,"cx","6"),y(r,"cy","6"),y(r,"r","6"),y(i,"x1","3"),y(i,"y1","3"),y(i,"x2","9"),y(i,"y2","9"),y(i,"class","svelte-1q0isnv"),y(a,"x1","9"),y(a,"y1","3"),y(a,"x2","3"),y(a,"y2","9"),y(a,"class","svelte-1q0isnv"),y(o,"id","close"),y(o,"viewBox","0 0 12 12"),y(o,"class","svelte-1q0isnv"),y(g,"id","modal-content"),y(g,"class","svelte-1q0isnv"),y(n,"id","modal"),y(n,"class","svelte-1q0isnv"),y(e,"id","topModal"),y(e,"class","svelte-1q0isnv"),_(e,"visible",t[1])},m(s,l){var p;c(s,e,l),u(e,n),u(n,o),u(o,r),u(o,i),u(o,a),u(n,d),u(n,g),k&&k.m(g,null),t[7](e),v=!0,$||(b=[x(o,"click",t[6]),x(n,"click",(p=X,function(t){return t.stopPropagation(),p.call(this,t)})),x(e,"click",t[8])],$=!0)},p(t,[n]){k&&k.p&&(!v||16&n)&&function(t,e,n,s,o,r){if(o){const i=l(e,n,s,r);t.p(i,o)}}(k,w,t,t[4],v?function(t,e,n,s){if(t[2]&&s){const o=t[2](s(n));if(void 0===e.dirty)return o;if("object"==typeof o){const t=[],n=Math.max(e.dirty.length,o.length);for(let s=0;s<n;s+=1)t[s]=e.dirty[s]|o[s];return t}return e.dirty|o}return e.dirty}(w,t[4],n,null):function(t){if(t.ctx.length>32){const e=[],n=t.ctx.length/32;for(let t=0;t<n;t++)e[t]=-1;return e}return-1}(t[4]),null),2&n&&_(e,"visible",t[1])},i(t){v||(U(k,t),v=!0)},o(t){q(k,t),v=!1},d(n){n&&p(e),k&&k.d(n),t[7](null),$=!1,s(b)}}}const G={};function I(t=""){return G[t]}const X=()=>{};function F(t,e,n){let s,o,r,{$$slots:i={},$$scope:a}=e,l=!1,{id:u=""}=e;function c(t){"Escape"==t.key&&D==s&&p()}function p(t){l&&(window.removeEventListener("keydown",c),D=o,null==D&&(document.body.style.overflow=""),n(1,l=!1),r&&r(t))}var h;G[u]={open:function(t){r=t,l||(o=D,D=s,window.addEventListener("keydown",c),document.body.style.overflow="hidden",n(1,l=!0),document.body.appendChild(s))},close:p},h=()=>{delete G[u],window.removeEventListener("keydown",c)},v().$$.on_destroy.push(h);return t.$$set=t=>{"id"in t&&n(3,u=t.id),"$$scope"in t&&n(4,a=t.$$scope)},[s,l,p,u,a,i,()=>p(),function(t){b[t?"unshift":"push"]((()=>{s=t,n(0,s)}))},()=>p()]}class H extends W{constructor(t){super(),N(this,t,F,j,r,{id:3})}}class Y{constructor(){this.tensors=[],this.operators=[],this.input_tensors=[],this.param_tensors=[],this.output_tensors=[],this.truth_tensors=[],this.loss=null}add_tensor(t){this.tensors.push(t)}add_operator(t){var e=t.clone();this.operators.push(e);for(let t=0;t<e.inputs.length;t++)this.tensors[e.inputs[t]].input_to.push(this.operators.length-1);for(let t=0;t<e.outputs.length;t++)this.tensors[e.outputs[t]].output_of=this.operators.length-1}update_tensors(){for(let t=0;t<this.tensors.length;t++)this.tensors[t].input_to=[],this.tensors[t].output_of=null;for(let t=0;t<this.operators.length;t++){for(let e=0;e<this.operators[t].inputs.length;e++)this.tensors[this.operators[t].inputs[e]].input_to.push(t);for(let e=0;e<this.operators[t].outputs.length;e++)this.tensors[this.operators[t].outputs[e]].output_of=t}}expand(){for(let a=0;a<this.operators.length;a++)if(0==this.operators[a].func&&this.operators[a].network){var t=this.operators[a].network;t.expand();var e=this.operators[a],n=this.operators.length;this.operators[a]=t.operators[0];for(let e=1;e<t.operators.length;e++)this.add_operator(t.operators[e]);for(let l=0;l<t.tensors.length;l++){var s=l;if(t.input_tensors.includes(l)){var o=t.input_tensors.indexOf(l);s=e.inputs[o]}else if(t.output_tensors.includes(l)){o=t.output_tensors.indexOf(l);s=e.outputs[o]}else this.add_tensor(t.tensors[l]),s=this.tensors.length-1;for(let e=0;e<t.tensors[l].input_to.length;e++){var r=t.tensors[l].input_to[e],i=t.operators[r].inputs.indexOf(l);0==r?this.operators[a].inputs[i]=s:this.operators[r+n-1].inputs[i]=s}if(t.tensors[l].output_of||0==t.tensors[l].output_of){r=t.tensors[l].output_of,i=t.operators[r].outputs.indexOf(l);0==r?this.operators[a].outputs[i]=s:this.operators[r+n-1].outputs[i]=s}}this.update_tensors()}}to_string(){var t="";t+="Tensors: \n";for(let e=0;e<this.tensors.length;e++){t+="\t"+e+":\n",this.tensors[e].form&&(t+="\t\tform: "+String(this.tensors[e].form)+"\n"),t+="\t\tinput_to:\n";for(let n=0;n<this.tensors[e].input_to.length;n++)t+="\t\t\t"+this.tensors[e].input_to[n]+"\n";t+="\t\toutput_of\n",t+="\t\t\t"+this.tensors[e].output_of+"\n"}t+="Operators: \n";for(let e=0;e<this.operators.length;e++){t+="\t"+e+":\n",t+="\t\tinputs:\n";for(let n=0;n<this.operators[e].inputs.length;n++)t+="\t\t\t"+this.operators[e].inputs[n]+"\n";t+="\t\toutputs:\n";for(let n=0;n<this.operators[e].outputs.length;n++)t+="\t\t\t"+this.operators[e].outputs[n]+"\n";t+="\t\tfunc: "+this.operators[e].func+"\n"}t+="input_tensors:\n";for(let e=0;e<this.input_tensors.length;e++)t+="\t"+this.input_tensors[e]+"\n";t+="param_tensors:\n";for(let e=0;e<this.param_tensors.length;e++)t+="\t"+this.param_tensors[e]+"\n";t+="output_tensors:\n";for(let e=0;e<this.output_tensors.length;e++)t+="\t"+this.output_tensors[e]+"\n";return t}}class J{constructor(t,e){this.scalar=!1,this.live=t||!1,e?this.form=e:e=[],this.x=0,this.y=0,this.tx=0,this.ty=0,this.selected=!1,this.input_to=[],this.output_of=null}calc_size(){if(this.form){var t=1;for(let e=0;e<this.form.length;e++)t*=this.form[e];this.size=t}else this.size=0;return this.size}}class K{constructor(t){this.inputs=[],this.outputs=[],this.func=t,this.size=null,this.network=null}clone(){var t=new K(this.func);return t.inputs=[...this.inputs],t.outputs=[...this.outputs],t.network=this.network,t}}class Q{constructor(t,e){this.name=t,this.num_inputs=e}calc_form(t,e){var n=[];switch(console.log(this.name),this.name){case"identity":case"add":case"subtract":case"scale":case"softmax":case"hardmax":case"ReLU":case"LeakyReLU":case"Leaky to ReLU":n.push(e.tensors[t[0]].form);break;case"full":var s=e.tensors[t[0]].form,o=e.tensors[t[1]].form,r=1;for(let t=0;t<s.length;t++)r*=s[t];var i=1;for(let t=0;t<o.length;t++)i*=o[t];(a=[]).push(i/r),n.push(a);break;case"amass":case"max":(a=[]).push(1),n.push(a);break;case"convolution":s=e.tensors[t[0]].form,o=e.tensors[t[1]].form;var a=[];for(let t=0;t<s.length;t++)o.length<=t?a.push(s[t]):a.push(s[t]-o[t]+1);n.push(a);break;case"squared dist":n.push([1])}return n}}var V=Array.apply(null,Array(12)).map((function(){}));V[0]=new Q("abstraction",0),V[1]=new Q("identity",1),V[2]=new Q("add",2),V[3]=new Q("subtract",2),V[4]=new Q("scale",2),V[5]=new Q("full",2),V[6]=new Q("amass",1),V[7]=new Q("softmax",1),V[8]=new Q("hardmax",1),V[9]=new Q("max",1),V[10]=new Q("convolution",2),V[11]=new Q("squared dist",2),V[12]=new Q("PReLU",1),V[13]=new Q("LeakyReLU",1),V[14]=new Q("Leaky to ReLU",1);const Z=10;function tt(t,e,n){var s={x_min:-9999,x_max:1e4,y_min:-9999,y_max:1e4},o=t.operators[e],r=!1;for(let t=0;t<o.outputs.length;t++)o.outputs[t]==n&&(r=!0);var i=0;if(!r)for(let t=0;t<o.inputs.length;t++)o.inputs[t]==n&&(i=t);var a=!1,l=!1,u=!1;switch(o.func){case 0:case 1:break;case 2:case 4:case 11:l=!0;break;case 4:case 5:case 10:u=!0;break;case 6:case 7:case 8:case 9:case 12:a=!0}var c=t.tensors[o.inputs[0]],p=t.tensors[o.inputs[1]],h=t.tensors[o.outputs[0]];if(a&&(r?s.x_min=c.x+40:s.x_max=h.x-40),u)if(r)s.x_min=p.x+20,s.y_min=p.y+20;else if(1==i){s.x_min=c.x+20,s.x_max=h.x-20;var f=Math.min(h.y,c.y);s.y_max=f-20}else s.x_max=p.x-20,s.y_min=p.y+20;if(l)if(r){var d=Math.max(c.x,p.x);s.x_min=d+40}else 1==i?(s.x_max=h.x-40,s.y_max=c.y-20):(s.x_max=h.x-40,s.y_min=p.y+20);return s}function et(t,e,n,s,o=!1){t.tensors[e].x=n,t.tensors[e].y=s,o&&(t.tensors[e].x-=(t.tensors[e].x+Z)%20-Z,t.tensors[e].y-=(t.tensors[e].y+Z)%20-Z);var r={x_min:-9999,x_max:1e4,y_min:-9999,y_max:1e4};for(let n=0;n<t.tensors[e].input_to.length;n++){let s=tt(t,t.tensors[e].input_to[n],e);r.x_min=Math.max(r.x_min,s.x_min),r.x_max=Math.min(r.x_max,s.x_max),r.y_min=Math.max(r.y_min,s.y_min),r.y_max=Math.min(r.y_max,s.y_max)}if(null!=t.tensors[e].output_of){let n=tt(t,t.tensors[e].output_of,e);r.x_min=Math.max(r.x_min,n.x_min),r.x_max=Math.min(r.x_max,n.x_max),r.y_min=Math.max(r.y_min,n.y_min),r.y_max=Math.min(r.y_max,n.y_max)}t.tensors[e].x<r.x_min&&(t.tensors[e].x=r.x_min),t.tensors[e].x>r.x_max&&(t.tensors[e].x=r.x_max),t.tensors[e].y<r.y_min&&(t.tensors[e].y=r.y_min),t.tensors[e].y>r.y_max&&(t.tensors[e].y=r.y_max)}function nt(t,e,n){var s=[];for(let o=0;o<t.tensors.length;o++)t.tensors[o].x-Z<e&&t.tensors[o].x+Z>e&&t.tensors[o].y-Z<n&&t.tensors[o].y+Z>n&&s.push(o);return s}function st(t,e){var n=t.tensors[e],s=n.input_to;n.input_to=[];for(let l=0;l<s.length;l++){var o=s[l],r=t.operators[o],i=t.tensors.length;t.add_tensor(new J(!0));var a=r.inputs.findIndex((t=>t==e));r.inputs[a]=i,t.tensors[i].x=n.x+20,t.tensors[i].y=n.y,t.tensors[i].input_to=[o],t.tensors[i].output_of=null,t.tensors[i].live=!1}n.x-=20,n.live=!1}function ot(t,e,n){if(t.tensors[e].live&&t.tensors[n].live)return void console.log("Both merged tensors are live, so don't do anything.");let s=t.tensors[e],o=t.tensors[n],r=n,i=e;if(null!=s.output_of&&null==o.output_of);else{if(null==o.output_of||null!=s.output_of)return void console.log("Error merging, only one input must have an output");var a=o;o=s,s=a,r=e,i=n}if(console.log(s.output_of,o.input_to),s.output_of==o.input_to)return void console.log("Error merging, these are input and output of the same function");let l=t.operators[o.input_to].inputs.indexOf(r);t.operators[o.input_to].inputs[l]=i,s.input_to=o.input_to,s.live=!0,t.tensors[i].selected=!0,function(t,e){for(let n=0;n<t.operators.length;n++){for(let s=0;s<t.operators[n].inputs.length;s++)t.operators[n].inputs[s]>e&&(t.operators[n].inputs[s]-=1);for(let s=0;s<t.operators[n].outputs.length;s++)t.operators[n].outputs[s]>e&&(t.operators[n].outputs[s]-=1)}t.tensors.splice(e,1)}(t,r)}var rt=0,it=0,at=0,lt=0;const ut=10;var ct=!1,pt=-1,ht=-1,ft=0,dt=0,mt=0,xt=0,yt=[],_t=!1;function gt(t,e=40,n=60){var s=!1,o=!1,r=!1;switch(t){case 0:case 1:break;case 2:case 4:case 11:o=!0;break;case 4:case 5:case 10:r=!0;break;case 6:case 7:case 8:case 9:case 12:s=!0}let i=new K;i.func=t;var a=yt[0].tensors.length;s&&(yt[0].add_tensor(new J(!1)),yt[0].tensors[a+0].x=e+0,yt[0].tensors[a+0].y=n+0,yt[0].add_tensor(new J(!1)),yt[0].tensors[a+1].x=e+60,yt[0].tensors[a+1].y=n+0,i.inputs=[a+0],i.outputs=[a+1]),r&&(yt[0].add_tensor(new J(!1)),yt[0].tensors[a+0].x=e+0,yt[0].tensors[a+0].y=n+40,yt[0].add_tensor(new J(!1)),yt[0].tensors[a+1].x=e+40,yt[0].tensors[a+1].y=n+0,yt[0].add_tensor(new J(!1)),yt[0].tensors[a+2].x=e+80,yt[0].tensors[a+2].y=n+40,i.inputs=[a+0,a+1],i.outputs=[a+2]),o&&(yt[0].add_tensor(new J(!1)),yt[0].tensors[a+0].x=e+0,yt[0].tensors[a+0].y=n+40,yt[0].add_tensor(new J(!1)),yt[0].tensors[a+1].x=e+0,yt[0].tensors[a+1].y=n+0,yt[0].add_tensor(new J(!1)),yt[0].tensors[a+2].x=e+60,yt[0].tensors[a+2].y=n+20,i.inputs=[a+0,a+1],i.outputs=[a+2]),yt[0].add_operator(i)}function vt(t,e){let n=t.tensors[e];n.live?(it.fillStyle="white",it.lineWidth=1,it.setLineDash([]),it.strokeStyle="black"):(it.fillStyle="rgba(255,255,255,0)",it.lineWidth=1,it.setLineDash([3,4]),it.strokeStyle="Grey"),it.beginPath(),n.scalar?it.rect(n.x-5,n.y-5,10,10):it.rect(n.x-ut,n.y-ut,20,20),it.fill(),it.stroke(),n.selected&&(it.fillStyle="rgba(255,255,255,0)",it.lineWidth=1,it.strokeStyle="#5dd2f0",it.setLineDash([]),it.beginPath(),it.roundRect(n.x-15,n.y-15,30,30,2),it.stroke())}function $t(t,e){let n,s,o,r,i=t.operators[e],a=it.createLinearGradient(0,0,at,lt);a.addColorStop(0,"#DE7521"),a.addColorStop(1,"#218ADE"),it.fillStyle=a;switch(i.func){case 0:case 1:case 4:case 6:case 8:case 9:case 11:break;case 2:s=t.tensors[i.inputs[0]],o=t.tensors[i.inputs[1]],r=t.tensors[i.outputs[0]],it.beginPath(),it.moveTo(r.x-ut,r.y-ut),it.lineTo(r.x-ut,r.y+ut),it.lineTo(s.x+ut,s.y+ut),it.lineTo(s.x+ut,s.y-ut),it.closePath(),it.fill(),it.beginPath(),it.moveTo(r.x-ut,r.y-ut),it.lineTo(r.x-ut,r.y+ut),it.lineTo(o.x+ut,o.y+ut),it.lineTo(o.x+ut,o.y-ut),it.closePath(),it.fill();break;case 3:s=t.tensors[i.inputs[0]],o=t.tensors[i.inputs[1]],r=t.tensors[i.outputs[0]];break;case 5:s=t.tensors[i.inputs[0]],o=t.tensors[i.inputs[1]],r=t.tensors[i.outputs[0]],it.beginPath(),it.moveTo(r.x-ut,r.y-ut),it.lineTo(r.x-ut,r.y+ut),it.lineTo(s.x+ut,s.y+ut),it.lineTo(s.x+ut,s.y-ut),it.lineTo(o.x-ut,o.y+ut),it.lineTo(o.x+ut,o.y+ut),it.closePath(),it.fill();break;case 7:n=t.tensors[i.inputs[0]],r=t.tensors[i.outputs[0]],it.beginPath(),it.moveTo(r.x-ut,r.y-5),it.lineTo(r.x-ut,r.y+5),it.lineTo(n.x+ut,n.y+ut),it.lineTo(n.x+ut,n.y-ut),it.closePath(),it.fill();break;case 10:s=t.tensors[i.inputs[0]],o=t.tensors[i.inputs[1]],r=t.tensors[i.outputs[0]],it.beginPath(),it.moveTo(s.x+ut,s.y-ut+4),it.lineTo(s.x+ut,s.y-ut),it.lineTo(o.x-ut,o.y+ut),it.lineTo(o.x+ut,o.y+ut),it.lineTo(r.x-ut,r.y-ut),it.lineTo(r.x-ut,r.y-ut+4);for(let t=1;t<5;t+=2)it.lineTo(s.x+ut,s.y-ut+4*t),it.lineTo(s.x+ut,s.y-ut+4*(t+1)),it.lineTo(r.x-ut,r.y-ut+4*(t+1)),it.lineTo(r.x-ut,r.y-ut+4*(t+2));it.lineTo(s.x+ut,s.y+ut),it.closePath(),it.fill();break;case 12:n=t.tensors[i.inputs[0]],r=t.tensors[i.outputs[0]],it.beginPath(),it.moveTo(n.x+ut,n.y+ut),it.lineTo(n.x+ut,n.y-ut),it.lineTo(r.x-ut,r.y-ut),it.lineTo(r.x-ut,r.y-ut+4);for(let t=1;t<5;t+=2)it.lineTo((r.x+n.x)/2,(r.y+n.y)/2-ut+4*t),it.lineTo((r.x+n.x)/2,(r.y+n.y)/2-ut+4*(t+1)),it.lineTo(r.x-ut,r.y-ut+4*(t+1)),it.lineTo(r.x-ut,r.y-ut+4*(t+2));it.closePath(),it.fill();break;default:console.log("Invalid operator types")}}function bt(){rt.width=rt.getBoundingClientRect().width,rt.height=rt.getBoundingClientRect().height,at=rt.width,lt=rt.height;for(let t=-10;t<at;t+=20)it.moveTo(t,0),it.lineTo(t,lt);for(let t=-10;t<lt;t+=20)it.moveTo(0,t),it.lineTo(at,t);it.lineWidth=.5,it.setLineDash([1,4]),it.strokeStyle="Grey",it.stroke();for(let t=0;t<yt[0].operators.length;t++)$t(yt[0],t);for(let t=0;t<yt[0].tensors.length;t++)vt(yt[0],t),yt[0].tensors[t].selected&&!_t&&ct&&et(yt[0],t,yt[0].tensors[t].tx+ft-mt,yt[0].tensors[t].ty+dt-xt,true);_t&&(it.fillStyle="rgba(255,255,255,0)",it.lineWidth=.5,it.strokeStyle="#5dd2f0",it.setLineDash([2,3]),it.beginPath(),it.roundRect(mt,xt,ft-mt,dt-xt,2),it.stroke()),window.requestAnimationFrame(bt)}function wt(){for(let t=0;t<yt[0].tensors.length;t++)yt[0].tensors[t].selected=!1}function kt(t){let e=nt(yt[0],ft,dt);console.log("Clicked Indices ",e);for(let t=0;t<e.length;t++){var n=e[t],s=yt[0].tensors[n];null==s.output_of||0==s.input_to.length?s.live=!s.live:(console.log("Unmerge"),st(yt[0],n))}}function Tt(t){_t=!1;for(let t=0;t<yt[0].tensors.length;t++)for(let s=0;s<yt[0].tensors.length;s++)if(s!=t){var e=yt[0].tensors[t],n=yt[0].tensors[s];Math.abs(e.x-n.x)<20&&Math.abs(e.y-n.y)<20&&ot(yt[0],t,s)}ct=!1,pt=-1,ht=-1;let s=nt(yt[0],ft,dt);s.length>=2&&ot(yt[0],s[0],s[1])}function Lt(t){ct=!0;for(let t=0;t<yt[0].tensors.length;t++)yt[0].tensors[t].tx=yt[0].tensors[t].x,yt[0].tensors[t].ty=yt[0].tensors[t].y;mt=ft,xt=dt;let e=nt(yt[0],ft,dt);0!=e.length&&(pt=e[0],yt[0].tensors[pt].selected||wt(),yt[0].tensors[pt].selected=!0);let n=function(t,e,n){var s=[];for(let m=0;m<t.operators.length;m++){var o=t.operators[m],r=!1,i=!1,a=!1;switch(o.func){case 0:case 1:break;case 2:case 4:case 11:i=!0;break;case 4:case 5:case 10:a=!0;break;case 6:case 7:case 8:case 9:case 12:r=!0}var l=t.tensors[o.inputs[0]],u=t.tensors[o.inputs[1]],c=t.tensors[o.outputs[0]],p=1e6,h=-1e6,f=1e6,d=-1e6;r&&(p=l.x+Z,h=c.x-Z,f=Math.min(l.y-Z,c.y-Z),d=Math.max(l.y+Z,c.y+Z)),a&&(p=l.x+Z,h=c.x-Z,f=u.y+Z,d=Math.max(l.y+Z,c.y+Z)),i&&(p=Math.min(l.x+Z,u.x+Z),h=c.x-Z,f=u.y-Z,d=l.y+Z),p<e&&h>e&&f<n&&d>n&&s.push(m)}return s}(yt[0],ft,dt);if(0!=n.length&&0==e.length){ht=n[0];var s=yt[0].operators[ht];for(let t=0;t<s.inputs.length;t++)yt[0].tensors[s.inputs[t]].selected=!0;for(let t=0;t<s.outputs.length;t++)yt[0].tensors[s.outputs[t]].selected=!0}0==e.length&&0==n.length&&(_t=!0,wt())}function Ct(t){if(t.offsetX?(ft=t.offsetX,dt=t.offsetY):t.layerX&&(ft=t.layerX,dt=t.layerY),_t)for(let t=0;t<yt[0].tensors.length;t++){var e=yt[0].tensors[t];Math.abs(e.x-(mt+ft)/2)<Math.abs(mt-(mt+ft)/2)&&Math.abs(e.y-(xt+dt)/2)<Math.abs(xt-(xt+dt)/2)?e.selected=!0:e.selected=!1}}function Pt(t,e,n){const s=t.slice();return s[21]=e[n],s}function Mt(e){let n,s,o,r,i=e[21].operator_type+"";return{c(){n=h("li"),s=h("p"),o=d(i),r=m(),y(n,"id","list_item"),y(n,"class","svelte-tdi8m6")},m(t,e){c(t,n,e),u(n,s),u(s,o),u(n,r)},p:t,d(t){t&&p(n)}}}function Et(e){let n,o,r,i,a,l;return{c(){n=d("Are you sure?\n\t\t\n\t\t"),o=h("button"),o.textContent="Yes",r=m(),i=h("button"),i.textContent="No",y(o,"class","green"),y(i,"class","green")},m(t,s){c(t,n,s),c(t,o,s),c(t,r,s),c(t,i,s),a||(l=[x(o,"click",e[0]),x(i,"click",e[12])],a=!0)},p:t,d(t){t&&p(n),t&&p(o),t&&p(r),t&&p(i),a=!1,s(l)}}}function St(e){let n,o,r,i,a,l,u,f,_;return{c(){n=d("How would you like to download your neural network? "),o=h("br"),r=h("br"),i=m(),a=h("button"),a.textContent="Pytorch",l=m(),u=h("button"),u.textContent="Tensorflow",y(a,"class","green"),y(u,"class","green")},m(t,s){c(t,n,s),c(t,o,s),c(t,r,s),c(t,i,s),c(t,a,s),c(t,l,s),c(t,u,s),f||(_=[x(a,"click",e[13]),x(u,"click",e[14])],f=!0)},p:t,d(t){t&&p(n),t&&p(o),t&&p(r),t&&p(i),t&&p(a),t&&p(l),t&&p(u),f=!1,s(_)}}}function Rt(t){let e;return{c(){e=h("h1"),e.textContent="Tutorial"},m(t,n){c(t,e,n)},d(t){t&&p(e)}}}function Dt(e){let n,o,r,i,a,l,u,f,_,g,v,$,b;return{c(){n=d("Add Operator "),o=h("br"),r=h("br"),i=m(),a=h("button"),a.textContent="Dense",l=m(),u=h("button"),u.textContent="Convolutional",f=m(),_=h("button"),_.textContent="PReLU",g=m(),v=h("button"),v.textContent="Softmax",y(a,"class","option"),y(u,"class","option"),y(_,"class","option"),y(v,"class","option")},m(t,s){c(t,n,s),c(t,o,s),c(t,r,s),c(t,i,s),c(t,a,s),c(t,l,s),c(t,u,s),c(t,f,s),c(t,_,s),c(t,g,s),c(t,v,s),$||(b=[x(a,"click",e[1]),x(u,"click",e[2]),x(_,"click",e[3]),x(v,"click",e[4])],$=!0)},p:t,d(t){t&&p(n),t&&p(o),t&&p(r),t&&p(i),t&&p(a),t&&p(l),t&&p(u),t&&p(f),t&&p(_),t&&p(g),t&&p(v),$=!1,s(b)}}}function Ut(t){let e,n,o,r,a,l,f,_,g,v,$,b,w,k,T,L,C,P,M,E,S,R,D,z,N,W,j,G,I,X,F,Y,J,K,Q,V,Z,tt,et,nt,st,ot,rt,it=t[5],at=[];for(let e=0;e<it.length;e+=1)at[e]=Mt(Pt(t,it,e));return K=new H({props:{id:"clear",$$slots:{default:[Et]},$$scope:{ctx:t}}}),V=new H({props:{id:"generate",$$slots:{default:[St]},$$scope:{ctx:t}}}),tt=new H({props:{id:"tutorial",$$slots:{default:[Rt]},$$scope:{ctx:t}}}),nt=new H({props:{id:"add_operator",$$slots:{default:[Dt]},$$scope:{ctx:t}}}),{c(){e=h("main"),n=h("nav"),o=h("div"),r=h("ul"),a=h("li"),l=h("a"),f=h("img"),g=m(),v=h("li"),$=h("a"),b=d("Clear Canvas"),w=m(),k=h("li"),T=h("a"),L=d("Generate Code"),C=m(),P=h("li"),M=h("a"),E=d("?"),S=m(),R=h("div"),D=h("div"),z=h("div"),N=h("a"),W=d("+ add operator"),j=m(),G=h("div"),I=h("div"),I.innerHTML="<strong>Current Operators:</strong>",X=m();for(let t=0;t<at.length;t+=1)at[t].c();var t,s,u,c,p,x;F=m(),Y=h("div"),Y.innerHTML='<canvas id="gui_canvas" class="svelte-tdi8m6"></canvas>',J=m(),A(K.$$.fragment),Q=m(),A(V.$$.fragment),Z=m(),A(tt.$$.fragment),et=m(),A(nt.$$.fragment),t=f.src,s=_=qt,i||(i=document.createElement("a")),i.href=s,t!==i.href&&y(f,"src",_),y(f,"alt","Neurula logo."),u=f,c="max-height",null===(p="40px")?u.style.removeProperty(c):u.style.setProperty(c,p,x?"important":""),y(l,"href",At),y(l,"class","svelte-tdi8m6"),y(a,"class","svelte-tdi8m6"),y($,"href",void 0),y($,"class","nav-button svelte-tdi8m6"),y(v,"class","svelte-tdi8m6"),y(T,"href",void 0),y(T,"class","nav-button svelte-tdi8m6"),y(k,"class","svelte-tdi8m6"),y(M,"href",void 0),y(M,"class","nav-button svelte-tdi8m6"),y(P,"class","svelte-tdi8m6"),y(r,"class","navbar-list svelte-tdi8m6"),y(o,"class","inner svelte-tdi8m6"),y(n,"class","svelte-tdi8m6"),y(N,"href",void 0),y(N,"class","nav-button svelte-tdi8m6"),y(z,"id","toolbar_title"),y(z,"class","svelte-tdi8m6"),y(I,"id","toolbar_add_operator"),y(I,"class","svelte-tdi8m6"),y(G,"id","toolbar_list"),y(G,"class","svelte-tdi8m6"),y(D,"id","toolbar"),y(D,"class","svelte-tdi8m6"),y(Y,"id","canvas_container"),y(Y,"class","svelte-tdi8m6"),y(R,"id","workspace"),y(R,"class","svelte-tdi8m6"),y(e,"class","svelte-tdi8m6")},m(s,i){c(s,e,i),u(e,n),u(n,o),u(o,r),u(r,a),u(a,l),u(l,f),u(r,g),u(r,v),u(v,$),u($,b),u(r,w),u(r,k),u(k,T),u(T,L),u(r,C),u(r,P),u(P,M),u(M,E),u(e,S),u(e,R),u(R,D),u(D,z),u(z,N),u(N,W),u(D,j),u(D,G),u(G,I),u(G,X);for(let t=0;t<at.length;t+=1)at[t].m(G,null);u(R,F),u(R,Y),u(e,J),O(K,e,null),u(e,Q),O(V,e,null),u(e,Z),O(tt,e,null),u(e,et),O(nt,e,null),st=!0,ot||(rt=[x($,"click",t[8]),x(T,"click",t[9]),x(M,"click",t[10]),x(N,"click",t[11])],ot=!0)},p(t,[e]){if(32&e){let n;for(it=t[5],n=0;n<it.length;n+=1){const s=Pt(t,it,n);at[n]?at[n].p(s,e):(at[n]=Mt(s),at[n].c(),at[n].m(G,null))}for(;n<at.length;n+=1)at[n].d(1);at.length=it.length}const n={};16777216&e&&(n.$$scope={dirty:e,ctx:t}),K.$set(n);const s={};16777216&e&&(s.$$scope={dirty:e,ctx:t}),V.$set(s);const o={};16777216&e&&(o.$$scope={dirty:e,ctx:t}),tt.$set(o);const r={};16777216&e&&(r.$$scope={dirty:e,ctx:t}),nt.$set(r)},i(t){st||(U(K.$$.fragment,t),U(V.$$.fragment,t),U(tt.$$.fragment,t),U(nt.$$.fragment,t),st=!0)},o(t){q(K.$$.fragment,t),q(V.$$.fragment,t),q(tt.$$.fragment,t),q(nt.$$.fragment,t),st=!1},d(t){t&&p(e),function(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}(at,t),B(K),B(V),B(tt),B(nt),ot=!1,s(rt)}}}CanvasRenderingContext2D.prototype.roundRect=function(t,e,n,s,o){return n<0&&(t-=n=-n),s<0&&(e-=s=-s),n<2*o&&(o=n/2),s<2*o&&(o=s/2),this.beginPath(),this.moveTo(t+o,e),this.arcTo(t+n,e,t+n,e+s,o),this.arcTo(t+n,e+s,t,e+s,o),this.arcTo(t,e+s,t,e,o),this.arcTo(t,e,t+n,e,o),this.closePath(),this},yt.push(new Y);let qt="./transparent_bar_logo.png",At="http://127.0.0.1:8000";function Ot(t){var e;e=()=>{(rt=document.getElementById("gui_canvas")).addEventListener("mousedown",Lt,!1),rt.addEventListener("mousemove",Ct,!1),rt.addEventListener("mouseup",Tt,!1),rt.addEventListener("dblclick",kt,!1),it=rt.getContext("2d"),rt.width=rt.getBoundingClientRect().width,rt.height=rt.getBoundingClientRect().height,at=rt.width,lt=rt.height,window.requestAnimationFrame(bt)},v().$$.on_mount.push(e);function n(t){}function s(t){}return[function(){I("clear").close(1),yt[0]=new Y},function(){gt(5),I("add_operator").close(1)},function(){gt(10),I("add_operator").close(1)},function(){gt(12),I("add_operator").close(1)},function(){gt(7),I("add_operator").close(1)},[{operator_type:"Dense"},{operator_type:"PReLU"},{operator_type:"Softmax"},{operator_type:"Convolutional"},{operator_type:"Dense"},{operator_type:"PReLU"},{operator_type:"Softmax"},{operator_type:"Convolutional"},{operator_type:"Dense"},{operator_type:"PReLU"},{operator_type:"Softmax"},{operator_type:"Convolutional"},{operator_type:"Dense"},{operator_type:"PReLU"},{operator_type:"Softmax"},{operator_type:"Convolutional"}],n,s,()=>I("clear").open(n),()=>I("generate").open(s),()=>I("tutorial").open(),()=>I("add_operator").open(),()=>I("clear").close(0),()=>I("generate").close(1),()=>I("generate").close(2)]}return new class extends W{constructor(t){super(),N(this,t,Ot,Ut,r,{})}}({target:document.body,props:{name:"world"}})}();
//# sourceMappingURL=bundle.js.map

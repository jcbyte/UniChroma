"use strict";(self.webpackChunksrc=self.webpackChunksrc||[]).push([[495],{8495:(e,t,a)=>{a.r(t),a.d(t,{default:()=>w});var l=a(7294),n=a(2658),o=a(1828),r=a(3981),c=a(9149),i=a(542),s=a(4212),u=a(5723),m=a(3382),d=a(3516),p=a(1458),v=a(8441),f=a(5856),g=a(1951),h=a(6867),E=a(6540),y=a(1733),x=a(1571),b=a(7426);function C({colPos:e,setColPos:t,maxPos:a,loop:n,forceResize_FLAG:r}){const[c,i]=(0,b.uT)(f()),[s,u]=(0,b.Jd)(800),[m,d]=(0,l.useState)(0),[p,v]=(0,b.m7)(!1);function f(){return e.length>1?e.map((e=>({pos:e.pos/a*100,left:0,col:e.col}))):[{pos:0,left:0,col:e.length>0?e[0].col:[0,0,0]},{pos:100,left:0,col:e.length>0?e[0].col:[0,0,0]}]}function C(){for(var e=document.getElementById("colourBarCanvas"),t=e.getContext("2d"),a=e.width,l=new ImageData(a,e.height),n=l.data,o=[...Array(a)].fill([0,0,0]),r=0,i=0;i<a;i++)try{var s=i/a*100;c[r+1].pos<s&&r++;var u=(s-c[r].pos)/(c[r+1].pos-c[r].pos);o[i]=(0,x.e)(c[r].col,c[r+1].col,u)}catch{}for(i=0;i<a*e.height;i++)n[4*i]=o[i%a][0],n[4*i+1]=o[i%a][1],n[4*i+2]=o[i%a][2],n[4*i+3]=255;t.putImageData(l,0,0)}function Z(){var e=a?a/100:1;v(!0).then((()=>{t(c.map((t=>({pos:t.pos*e,col:t.col})))).then((()=>{v(!1)}))}))}function w(){var e=document.getElementById("colourBarDiv");return e?e.getBoundingClientRect().width:null}function P(){u(w())}return(0,l.useEffect)((()=>{p.value||i(f()).then((()=>{P()}))}),[e]),(0,l.useEffect)((()=>{Z(),C()}),[c]),(0,l.useEffect)((()=>{Z()}),[a]),(0,l.useEffect)((()=>{P(),window.addEventListener("resize",P)}),[]),(0,l.useEffect)((()=>{P()}),[r]),(0,l.useEffect)((()=>{C(),function(){for(var e=w(),t=[...c],a=0;a<c.length;a++)t[a].left=c[a].pos/100*e;i(t)}()}),[s]),l.createElement(l.Fragment,null,l.createElement("div",{style:{display:"flex",alignItems:"center",marginBottom:"40px"}},l.createElement("div",{id:"colourBarDiv",style:{margin:"10px",marginRight:"20px",width:"100%",minWidth:0,height:"24px",position:"relative"}},l.createElement(o.ZP,{sx:{height:0,"& .MuiSlider-track":{border:"none"},"& .MuiSlider-thumb":{height:"20px",width:"10px",borderRadius:"4px",backgroundColor:"#fff","&:focus, &:hover, &.Mui-active":{backgroundColor:"#ddd","@media (hover: none)":{backgroundColor:"#fff"}}}},style:{width:"100%",position:"absolute",zIndex:1},value:c.map((e=>e.pos)),onChange:(e,t,a)=>{!function(e,t){if(d(e),!(0==e|e==c.length-1)){var a=[...c];a[e].pos=t;var l=w();a[e].left=c[e].pos/100*l,i(a)}}(a,t[a])},valueLabelDisplay:"auto",min:0,max:100,step:.1}),l.createElement("canvas",{id:"colourBarCanvas",style:{position:"relative",zIndex:0},width:s.value,height:"24px"}),c.map(((e,t)=>l.createElement("div",{style:{position:"absolute",top:"28px",left:e.left-18}},l.createElement(g.zH,{disableAlpha:!0,hideTextfield:!0,value:(0,x.v)(e.col),onChange:e=>{!function(e,t){d(e);var a=[...c];n&(0==e|e==c.length-1)?(a[0].col=t,a[c.length-1].col=t):a[e].col=t,i(a)}(t,e.rgb)}}))))),l.createElement(h.Z,{onClick:function(){var e=[...c],t=c.length-1,a=(c[t-1].pos+c[t].pos)/2,l=a/100*w();e.splice(t,0,{pos:a,left:l,col:[0,0,0]}),i(e),d(t)}},l.createElement(E.Z,null)),l.createElement(h.Z,{onClick:function(){if(!(0==m|m==c.length-1)){var e=[...c];e.splice(m,1),i(e)}}},l.createElement(y.Z,null))))}var Z=a(1216);function w({ledNum:e,selectedColPos:t,setSelectedColPos:a,cycleTime:h,setCycleTime:E,colourMode:y,setColourMode:w,ledSelected:P,smartSave:S,setSmartSave:k,openPages:B,showAlert:F,savingServerColour_FLAG:W,setSavingServerColour_FLAG:T}){const[L,D]=(0,l.useState)(0),[R,A]=(0,l.useState)(!1),[z,I]=(0,l.useState)(20),[j,_]=(0,l.useState)(1),[G,M]=(0,l.useState)(!1),[N,O]=(0,b.uT)(!1),[H,U]=(0,l.useState)(0);function Y(e){A(!0),k(function(){var e={...S},a={type:"disabled"};switch(y){case"static":a={type:"static",col:t[0].col};break;case"cycle":a={type:"cycle",cycleTime:h,colPos:t};break;case"wave":a={type:"wave",cycleTime:h,colPos:t,spread:z,flip:G}}var l=e.objects.push(a)-1;return P.forEach(((t,a)=>{t&&(e.data[a]=l)})),e}()).then((()=>{e?O(!0).then((()=>{T({do:!0,result:null})})):F("Saved to virtual","success")}))}function J(t){I(t),_((t*e/h).toFixed(2))}function K(t){I((t*h/e).toFixed(0)),_(t)}(0,l.useEffect)((()=>{D(P.filter((e=>e)).length),function(){var e=[];if(P.forEach(((t,a)=>{if(t){var l=S.data[a];e.includes(l)||e.push(l)}})),1==e.length){var t=S.objects[e[0]];switch(t.type){case"disabled":A(!1);break;case"enabled":A(!0);break;case"static":A(!0),w("static"),a([{pos:0,col:t.col}]);break;case"cycle":A(!0),w("cycle"),E(t.cycleTime),a(t.colPos);break;case"wave":A(!0),w("wave"),E(t.cycleTime),a(t.colPos),_(t.width),M(t.flip)}}else if(e.length>1){var l=!1,n=!1;P.forEach(((e,t)=>{e&&("disabled"==S.objects[S.data[t]].type?n=!0:l=!0)})),A(l&n?null:!!l)}}()}),[P]),(0,l.useEffect)((()=>{if(N&&null!=W.result){if(O(!1),W.result==Z.Y.OK)return void F("Saved","success");if(W.result==Z.Y.NOT_FOUND)return void F("Cannot connect to Server","error");F("Unknown error","error")}}),[W]),(0,l.useEffect)((()=>{U((e=>++e))}),[B]),(0,l.useEffect)((()=>{K(j)}),[h]);var q={static:l.createElement(l.Fragment,null,l.createElement("div",{style:{display:"flex",justifyContent:"center"}},l.createElement(g.zH,{style:{borderRadius:"10px"},disableAlpha:!0,value:(0,x.v)(t[0].col),onChange:e=>{a([{pos:0,col:e.rgb}])},hideTextfield:!0}))),cycle:l.createElement(l.Fragment,null,l.createElement(C,{colPos:t,setColPos:a,maxPos:h,loop:!0,forceResize_FLAG:H}),l.createElement("div",{style:{margin:"10px"}},l.createElement(n.Z,{variant:"body1",noWrap:!0,gutterBottom:!0},"Cycle Time"),l.createElement("div",{style:{display:"flex",gap:"20px",width:"100%",marginBottom:"10px"}},l.createElement(o.ZP,{value:h,onChange:(e,t)=>{E(t)},valueLabelDisplay:"auto",min:10,max:1e4}),l.createElement(r.Z,{value:h,onChange:e=>{E(e.target.value)},inputProps:{min:10,type:"number"}}),l.createElement(n.Z,null,"ms")))),wave:l.createElement(l.Fragment,null,l.createElement(C,{colPos:t,setColPos:a,maxPos:h,loop:!0,forceResize_FLAG:H}),l.createElement("div",{style:{margin:"10px"}},l.createElement(n.Z,{variant:"body1",noWrap:!0,gutterBottom:!0},"Cycle Time"),l.createElement("div",{style:{display:"flex",gap:"20px",width:"100%",marginBottom:"10px"}},l.createElement(o.ZP,{value:h,onChange:(e,t)=>{E(t)},valueLabelDisplay:"auto",min:10,max:1e4}),l.createElement(r.Z,{value:h,onChange:e=>{E(e.target.value)},inputProps:{min:10,type:"number"}}),l.createElement(n.Z,null,"ms")),l.createElement(n.Z,{variant:"body1",noWrap:!0,gutterBottom:!0},"Wave Spread"),l.createElement("div",{style:{display:"flex",gap:"20px",width:"100%",marginBottom:"10px"}},l.createElement(o.ZP,{value:z,onChange:(e,t)=>{J(t)},valueLabelDisplay:"auto",min:1,max:100}),l.createElement(r.Z,{value:z,onChange:e=>{J(e.target.value)},inputProps:{min:1,type:"number"}}),l.createElement(n.Z,null,"ms")),l.createElement("div",{style:{marginBottom:"10px"}},l.createElement(n.Z,{variant:"body1",noWrap:!0,gutterBottom:!0},"Width"),l.createElement(r.Z,{value:j,onChange:e=>{K(e.target.value)},inputProps:{min:1,type:"number"}})),l.createElement("div",null,l.createElement(n.Z,{variant:"body1",noWrap:!0,gutterBottom:!0},"Flip direction"),l.createElement(c.Z,{value:G,onClick:()=>{M(!G)}}))))};return l.createElement(l.Fragment,null,l.createElement("div",{style:{display:"flex",alignItems:"center",margin:"10px"}},l.createElement(n.Z,{variant:"body2"},"Selected ",L," LEDs"),l.createElement(i.Z,{sx:{marginLeft:"auto"},label:"Enable",labelPlacement:"start",control:l.createElement(s.Z,{checked:R,indeterminate:null==R,onChange:(e,t)=>{!function(e){var t={...S},a=t.objects.push({type:e?"enabled":"disabled"})-1;P.forEach(((l,n)=>{l&&(e?"disabled"==S.objects[S.data[n]].type&&(t.data[n]=a):t.data[n]=a)})),k(t),A(e)}(t)}})})),l.createElement("div",{style:{margin:"10px"}},l.createElement(u.Z,{value:y,exclusive:!0,onChange:(e,t)=>{t&&w(t)},fullWidth:!0},l.createElement(m.Z,{value:"static"},l.createElement(p.Z,{sx:{marginRight:"10px"}}),l.createElement(n.Z,{variant:"body1"},"Static")),l.createElement(m.Z,{value:"cycle"},l.createElement(v.Z,{sx:{marginRight:"10px"}}),l.createElement(n.Z,{variant:"body1"},"Cycle")),l.createElement(m.Z,{value:"wave"},l.createElement(f.Z,{sx:{marginRight:"10px"}}),l.createElement(n.Z,{variant:"body1"},"Wave"))),l.createElement("div",{style:{margin:"10px"}},q[y]),l.createElement("div",{style:{display:"flex",justifyContent:"center",gap:"10px"}},l.createElement(d.Z,{variant:"contained",loading:N,fullWidth:!0,onClick:()=>{Y(!1)},sx:{maxWidth:"200px"}},"Save to virtual"),l.createElement(d.Z,{variant:"contained",loading:N,fullWidth:!0,onClick:()=>{Y(!0)},sx:{maxWidth:"200px"}},"Save"))))}}}]);
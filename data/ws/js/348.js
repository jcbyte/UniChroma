"use strict";(self.webpackChunksrc=self.webpackChunksrc||[]).push([[348],{348:(e,t,l)=>{l.r(t),l.d(t,{default:()=>E});var n=l(7294),a=l(8044),r=l(2642),i=l(2658),c=l(4212),s=l(1828),d=l(3981),o=l(5538);function m({size:e,col:t,glow:l}){return n.createElement(n.Fragment,null,n.createElement("div",{style:{height:e,width:e,backgroundColor:t,borderRadius:"50%",boxShadow:"0 0 "+l+" "+t,display:"flex",alignItems:"center",justifyContent:"center"}},n.createElement(i.Z,{variant:"caption"},t)))}var u=l(1571);const f=50;function E({ledNum:e,vLedHardware:t,ledSelected:l,setLedSelected:E,ledSliderVal:v,setLedSliderVal:y,ledListScroll:p,setLedListScroll:x,useRgb:g}){function h(t){E(Array(e).fill(t))}function C(e){var t=[...l],n=v[0]-1,a=v[1]-n;t.splice(n,a,...Array(a).fill(e)),E(t)}function w(e,t){var l=[...v];l[e?1:0]=t,y(l)}return(0,n.useEffect)((()=>{var e=document.getElementById("selectLedList");!function t(l,n){e.clientHeight>0?l():setTimeout((()=>{t(l,n)}),n)}((()=>{e.scrollTo(0,p)}),10),e.addEventListener("scroll",(()=>{x(e.scrollTop)}))}),[]),n.createElement(n.Fragment,null,n.createElement("div",{style:{display:"flex",flexFlow:"column",height:"100%"}},n.createElement("div",{style:{flex:"0 1 auto",margin:"10px"}},n.createElement(a.Z,{variant:"outlined",fullWidth:!0},n.createElement(r.Z,{onClick:()=>{h(!0)}},"Select All"),n.createElement(r.Z,{onClick:()=>{h(!1)}},"Deselect ALl"))),n.createElement("div",{style:{flex:"1 1 auto",display:"contents"}},n.createElement("div",{style:{height:"100%",width:"100%"}},n.createElement(o.qj,null,(({height:a,width:r})=>n.createElement(o.aV,{id:"selectLedList",width:r,height:a,rowHeight:f+20,rowRenderer:({index:e,style:a})=>n.createElement("div",{style:{...a,display:"flex",alignItems:"center",backgroundColor:l[e]?"#22b2":"#0000"}},n.createElement("div",{style:{flex:1,order:1}},n.createElement("div",{style:{display:"flex",justifyContent:"center"}},n.createElement(i.Z,{variant:"subtitle1"},e+1))),n.createElement("div",{style:{flex:1,order:2}},n.createElement("div",{style:{display:"flex",justifyContent:"center"}},n.createElement(m,{col:g?"rgb("+t[e].join(",")+")":(0,u.v)(t[e]),size:f,glow:"10px"}))),n.createElement("div",{style:{flex:1,order:3}},n.createElement("div",{style:{display:"flex",justifyContent:"center"}},n.createElement(c.Z,{checked:l[e],onChange:()=>{var t,n;t=e,(n=[...l])[t]=!l[t],E(n)}})))),rowCount:e}))))),n.createElement("div",{style:{flex:"0 1 auto",margin:"10px"}},n.createElement(a.Z,{variant:"outlined",fullWidth:!0},n.createElement(r.Z,{onClick:()=>{C(!0)}},"Select"),n.createElement(r.Z,{onClick:()=>{C(!1)}},"Deselect")),n.createElement("div",{style:{margin:"10px 10px 0 10px"}},n.createElement(s.ZP,{value:v,onChange:(e,t)=>{y(t)},valueLabelDisplay:"auto",min:1,max:e})),n.createElement("div",{style:{display:"flex"}},n.createElement(d.Z,{value:v[0],size:"small",onChange:e=>{w(!1,e.target.value)},inputProps:{step:10,min:1,max:v[1],type:"number"},sx:{margin:"0 10px 0 10px"},fullWidth:!0}),n.createElement(d.Z,{value:v[1],size:"small",onChange:e=>{w(!0,e.target.value)},inputProps:{step:10,min:v[0],max:e,type:"number"},sx:{margin:"0 10px 0 10px"},fullWidth:!0})))))}}}]);
import React from 'react';
import {Img,interpolate,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {clamp,red} from '../visual';
export const Brand=()=> <div style={{position:'absolute',top:60,left:65,background:'white',padding:'16px 20px'}}><Img src={staticFile('media/logo.png')} style={{width:280,height:70,objectFit:'contain'}}/></div>;
export const Label:React.FC<{children:React.ReactNode}>=({children})=><div style={{fontSize:24,fontWeight:800,letterSpacing:3,color:red,textTransform:'uppercase',marginBottom:25}}>{children}</div>;
export const Heading:React.FC<{children:React.ReactNode;size?:number}>=({children,size=80})=>{const f=useCurrentFrame();const {fps}=useVideoConfig();return <div style={{fontSize:size,fontWeight:900,letterSpacing:-3,lineHeight:1.03,opacity:interpolate(f,[0,.25*fps],[0,1],clamp),translate:`0 ${interpolate(f,[0,.4*fps],[28,0],clamp)}px`}}>{children}</div>};
export const Foot=()=> <div style={{position:'absolute',bottom:55,left:65,right:65,display:'flex',justifyContent:'space-between',fontSize:22,fontWeight:700}}><span>FERRETERÍA AVENIDA</span><span>MISIONES ↗</span></div>;

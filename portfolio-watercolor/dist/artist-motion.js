// Hair warp and blink timing reused from Dotted Artist. Eye anchors and field
// registration fit the current artwork; RGBA sampling preserves its colors.

(() => {
  'use strict';
  const still=document.querySelector('#dotted-artist');
  const canvas=document.createElement('canvas');
  canvas.id='dotted-artist-motion';
  canvas.className='artist-motion';
  canvas.setAttribute('role','img');
  canvas.setAttribute('aria-label',still.alt);
  canvas.hidden=true;
  still.after(canvas);

  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const gl=canvas.getContext('webgl',{alpha:true,premultipliedAlpha:false,antialias:false,preserveDrawingBuffer:true});
  let ready=false,paused=false,visible=true,frame=0,previous=0,time=0,manualWink=-100;
  const size=[1089,1445];
  const fabric=[[350,920],[505,940],[630,860],[735,800],[850,890],[955,1000],[995,1090],[955,1140],[925,1130],[890,1020],[820,1070],[745,1165],[700,1285],[650,1330],[560,1300],[490,1270],[440,1210],[375,1210],[220,1240],[150,1210],[105,1180],[180,1060],[265,965]];
  const protectedAreas=[[[685,690],[1050,1040],68],[[885,1060],[985,1340],70],[[180,1310],[435,1245],55],[[1045,1010],[1045,1135],52]];
  function segmentDistance(x,y,a,b){
    const dx=b[0]-a[0],dy=b[1]-a[1];
    const t=Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/(dx*dx+dy*dy)));
    return Math.hypot(x-a[0]-dx*t,y-a[1]-dy*t);
  }
  function fabricStrength(x,y){
    let inside=false,edge=Infinity;
    for(let i=0,j=fabric.length-1;i<fabric.length;j=i++){
      const a=fabric[j],b=fabric[i];
      if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])inside=!inside;
      edge=Math.min(edge,segmentDistance(x,y,a,b));
    }
    if(!inside)return 0;
    for(const [a,b,radius] of protectedAreas)edge=Math.min(edge,segmentDistance(x,y,a,b)-radius);
    const fold=Math.max(0,Math.min(1,(380-x)/80))*Math.max(0,Math.min(1,(y-900)/50));
    const inset=20-16*fold,feather=35-11*fold;
    return Math.max(0,Math.min(1,(edge-inset)/feather));
  }
  const skirt={x:630,y:1330,dx:0,dy:0,targetX:630,targetY:1330,targetDx:0,targetDy:0};
  const hairHover={x:250,y:550,dx:0,dy:0,targetX:250,targetY:550,targetDx:0,targetDy:0};
  let hairField,lastPointer=null;
  function hairStrength(x,y){
    if(!hairField||x<0||y<0||x>=size[0]||y>=size[1])return 0;
    const fx=Math.floor((x+33)/1.16/size[0]*hairField.width);
    const fy=Math.floor((y+40)/1.16/size[1]*hairField.height);
    if(fx<0||fy<0||fx>=hairField.width||fy>=hairField.height)return 0;
    const value=hairField.data[(fy*hairField.width+fx)*4]/255;
    return Math.max(0,Math.min(1,(value-.08)/.27));
  }
  let program,locations={},artworkRequest=0;
  const textures=[];
  function fallback() {
    ready=false;cancelAnimationFrame(frame);frame=0;
    canvas.hidden=true;still.style.visibility='';

  }
  if(!gl){fallback();return;}

  const vertex=`
    attribute vec2 a_position;
    varying vec2 v_uv;
    void main(){v_uv=a_position*.5+.5;gl_Position=vec4(a_position,0.,1.);}
  `;
  const fragment=`
    precision highp float;
    uniform sampler2D u_art;
    uniform sampler2D u_field;
    uniform vec2 u_resolution;
    uniform vec2 u_size;
    uniform vec2 u_blink;
    uniform vec4 u_skirt;
    uniform vec4 u_hairHover;
    uniform float u_time;
    uniform float u_motion;
    varying vec2 v_uv;

    vec4 art(vec2 p){
      if(p.x<0.||p.y<0.||p.x>=u_size.x||p.y>=u_size.y)return vec4(0.);
      return texture2D(u_art,p/u_size);
    }

    // A single continuous inverse warp. No hair is cut out, drawn twice,
    // composited under the body, or connected with synthetic strokes.
    vec2 hairOffset(vec2 p){
      float f=texture2D(u_field,((p+vec2(33.,40.))/1.16)/u_size).r;
      float phase=p.y*.0035+(710.-p.x)*.0007;
      float t=u_time;
      return u_motion*f*1.5*vec2(
        18.*sin(t*.58-phase)+2.*sin(t*.92-phase*1.1),
        9.*sin(t*.58-phase+1.)+1.4*sin(t*1.08-phase)
      );
    }

    vec2 hairHoverOffset(vec2 p){
      float field=texture2D(u_field,((p+vec2(33.,40.))/1.16)/u_size).r;
      vec2 delta=(p-u_hairHover.xy)/150.;
      float influence=exp(-dot(delta,delta)*1.5)*smoothstep(.08,.35,field);
      float flutter=sin(u_time*2.4+p.y*.018)*length(u_hairHover.zw)*.09;
      return u_motion*influence*.5*(u_hairHover.zw+vec2(0.,flutter));
    }

    float edgeDistance(vec2 p,vec2 a,vec2 b){
      vec2 edge=b-a;
      return length(p-a-edge*clamp(dot(p-a,edge)/dot(edge,edge),0.,1.));
    }
    float fabricMask(vec2 p){
      float edge=2000.;
      bool inside=false;
      ${fabric.map((b,i)=>{const a=fabric[(i+fabric.length-1)%fabric.length];const v=p=>`vec2(${p.map(n=>n.toFixed(1)).join(',')})`;return `edge=min(edge,edgeDistance(p,${v(a)},${v(b)}));`+(a[1]!==b[1]?`if(((${a[1].toFixed(1)}>p.y)!=(${b[1].toFixed(1)}>p.y)) && p.x<${(b[0]-a[0]).toFixed(1)}*(p.y-${a[1].toFixed(1)})/${(b[1]-a[1]).toFixed(1)}+${a[0].toFixed(1)})inside=!inside;`:``);}).join('\n')}
      ${protectedAreas.map(([a,b,r])=>`edge=min(edge,edgeDistance(p,vec2(${a.map(n=>n.toFixed(1)).join(',')}),vec2(${b.map(n=>n.toFixed(1)).join(',')}))-${r.toFixed(1)});`).join('\n')}
      float fold=(1.-smoothstep(300.,380.,p.x))*smoothstep(900.,950.,p.y);
      return inside?smoothstep(mix(20.,4.,fold),mix(55.,28.,fold),edge):0.;
    }
    vec2 skirtOffset(vec2 p){
      vec2 delta=(p-u_skirt.xy)/150.;
      float influence=exp(-dot(delta,delta)*1.5)*fabricMask(p);
      float flutter=sin(u_time*2.4+p.x*.018)*length(u_skirt.zw)*.09;
      return u_motion*influence*.5*(u_skirt.zw+vec2(0.,flutter));
    }

    vec4 eyelid(vec2 p,vec4 color,vec2 center,vec2 radius,float angle,float blink,float skinSide){
      if(blink<.0001)return color;
      float c=cos(angle),s=sin(angle);
      vec2 delta=p-center;
      vec2 local=vec2(c*delta.x+s*delta.y,-s*delta.x+c*delta.y);
      float r=length(local/radius);
      if(r>=1.15)return color;
      float patch=1.-smoothstep(1.00,1.15,r);
      float horizontal=local.x/radius.x;
      float lid=7.*max(0.,1.-horizontal*horizontal);
      float openness=max(.018,1.-blink);
      float originalV=(local.y-lid*blink)/openness;
      vec2 sourceLocal=vec2(local.x,originalV);
      vec2 source=center+vec2(c*sourceLocal.x-s*sourceLocal.y,s*sourceLocal.x+c*sourceLocal.y);

      // Reveal sampled surrounding skin as the existing eye closes. The
      // feathered oval stays inside the face and clear of the eyebrow.
      vec2 skinAt=skinSide>0.
        ?vec2(610.,362.)+local*vec2(.25,.25)
        :vec2(666.,328.)+local*vec2(.25,.45);
      vec4 skin=art(skinAt);
      float eyeRadius=length(sourceLocal/radius);
      float eyeCoverage=1.-smoothstep(.87,1.08,eyeRadius);
      vec4 closing=mix(skin,art(source),eyeCoverage);
      // Blend the closed lid into the surrounding skin color.
      closing=mix(closing,skin,smoothstep(.78,.98,blink));
      float lash=(1.-smoothstep(.65,1.65,abs(local.y-lid)))
        *(1.-smoothstep(.62,.80,abs(horizontal)))*smoothstep(.76,.99,blink);
      closing=mix(closing,vec4(skin.rgb*.53,skin.a),lash);
      return mix(color,closing,patch*smoothstep(0.,.14,blink));
    }

    vec4 toneAt(vec2 p){
      vec4 color=art(p);
      color=eyelid(p,color,vec2(605.,314.),vec2(35.,31.),.13,u_blink.x,1.);
      color=eyelid(p,color,vec2(699.,348.),vec2(25.,26.),-.76,u_blink.y,-1.);
      return color;
    }

    void main(){
      vec2 view=vec2(v_uv.x,1.-v_uv.y)*u_resolution;
      float scale=min(u_resolution.x/u_size.x,u_resolution.y/u_size.y);
      vec2 p=(view-(u_resolution-u_size*scale)*.5)/scale;
      if(p.x<0.||p.y<0.||p.x>=u_size.x||p.y>=u_size.y){gl_FragColor=vec4(0.);return;}
      vec2 source=p-hairOffset(p)-hairHoverOffset(p)-skirtOffset(p);
      vec4 color=toneAt(source);
      gl_FragColor=color;
    }
  `;

  function compile(type,source){
    const shader=gl.createShader(type);
    gl.shaderSource(shader,source);gl.compileShader(shader);
    if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(shader));
    return shader;
  }
  function upload(image,unit){
    gl.activeTexture(gl.TEXTURE0+unit);
    const texture=textures[unit]||(textures[unit]=gl.createTexture());gl.bindTexture(gl.TEXTURE_2D,texture);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);
  }
  async function loadImage(src){
    const image=new Image();image.src=src;await image.decode();return image;
  }
  async function updateArtwork(){
    const request=++artworkRequest;
    const image=await loadImage(still.src);
    if(request!==artworkRequest||!ready)return;
    gl.useProgram(program);upload(image,0);draw();
  }
  async function setup(){
    textures.length=0;
    const [image,field]=await Promise.all([
      loadImage(still.src),
      loadImage('assets/artist-hair-field.png')
    ]);
    const fieldCanvas=document.createElement('canvas');
    fieldCanvas.width=field.naturalWidth;fieldCanvas.height=field.naturalHeight;
    const fieldContext=fieldCanvas.getContext('2d');
    fieldContext.drawImage(field,0,0);
    hairField=fieldContext.getImageData(0,0,fieldCanvas.width,fieldCanvas.height);
    program=gl.createProgram();
    gl.attachShader(program,compile(gl.VERTEX_SHADER,vertex));
    gl.attachShader(program,compile(gl.FRAGMENT_SHADER,fragment));
    gl.linkProgram(program);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));
    gl.useProgram(program);
    const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
    const position=gl.getAttribLocation(program,'a_position');
    gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
    for(const name of ['resolution','size','blink','time','motion','skirt','hairHover'])locations[name]=gl.getUniformLocation(program,'u_'+name);
    upload(image,0);upload(field,1);
    gl.uniform1i(gl.getUniformLocation(program,'u_art'),0);
    gl.uniform1i(gl.getUniformLocation(program,'u_field'),1);
    gl.uniform2f(locations.size,...size);
    ready=true;canvas.hidden=false;still.style.visibility='hidden';resize();sync();
    if(still.src!==image.src)await updateArtwork();
  }
  function pulse(elapsed,wink=false){
    const close=wink?.13:.085,hold=wink?.075:.020,open=wink?.24:.17;
    if(elapsed<0||elapsed>=close+hold+open)return 0;
    if(elapsed<close)return (1-Math.cos(Math.PI*elapsed/close))*.5;
    if(elapsed<close+hold)return 1;
    return (1+Math.cos(Math.PI*(elapsed-close-hold)/open))*.5;
  }
  function eyesAt(t){
    if(reduced.matches)return [0,0];
    const cycle=t%28.6;
    let both=0;
    for(const start of [5.2,12.8,26.7])both=Math.max(both,pulse(cycle-start));
    const wink=Math.max(pulse(cycle-20.1,true),pulse(t-manualWink,true));
    return [Math.max(both,wink),both];
  }
  function draw(){
    if(!ready)return;
    gl.uniform2f(locations.resolution,canvas.width,canvas.height);
    gl.uniform1f(locations.time,reduced.matches?0:time);
    gl.uniform1f(locations.motion,reduced.matches?0:1);
    gl.uniform2f(locations.blink,...eyesAt(time));
    gl.uniform4f(locations.skirt,skirt.x,skirt.y,reduced.matches?0:skirt.dx,reduced.matches?0:skirt.dy);
    gl.uniform4f(locations.hairHover,hairHover.x,hairHover.y,reduced.matches?0:hairHover.dx,reduced.matches?0:hairHover.dy);
    gl.drawArrays(gl.TRIANGLES,0,3);
  }
  function resize(){
    if(!ready)return;
    const rect=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);
    canvas.width=Math.max(1,Math.round(rect.width*dpr));
    canvas.height=Math.max(1,Math.round(rect.height*dpr));
    gl.viewport(0,0,canvas.width,canvas.height);draw();
  }
  const running=()=>ready&&!paused&&!reduced.matches&&visible&&!document.hidden;
  function tick(now){
    frame=0;if(!running()){previous=0;return;}
    const dt=previous?Math.min((now-previous)/1000,.05):1/60;
    time+=dt;
    const ease=1-Math.exp(-dt*9);
    for(const [key,target] of [['x','targetX'],['y','targetY'],['dx','targetDx'],['dy','targetDy']]){
      for(const response of [skirt,hairHover])response[key]+=(response[target]-response[key])*ease;
    }
    previous=now;draw();frame=requestAnimationFrame(tick);
  }
  function sync(){
    cancelAnimationFrame(frame);frame=0;previous=0;
    draw();if(running())frame=requestAnimationFrame(tick);
  }
  function releaseHover(){
    for(const response of [skirt,hairHover]){response.targetDx=0;response.targetDy=0;}
    lastPointer=null;
  }
  window.addEventListener('pointermove',event=>{
    if(event.pointerType!=='mouse'||reduced.matches||!ready){releaseHover();return;}
    const rect=canvas.getBoundingClientRect();
    const scale=Math.min(rect.width/size[0],rect.height/size[1]);
    const x=(event.clientX-rect.left-(rect.width-size[0]*scale)*.5)/scale;
    const y=(event.clientY-rect.top-(rect.height-size[1]*scale)*.5)/scale;
    const strengths=[fabricStrength(x,y),hairStrength(x,y)];
    if(!strengths.some(value=>value>0)){releaseHover();return;}
    const dx=lastPointer?Math.max(-18,Math.min(18,(x-lastPointer.x)*.7)):0;
    const dy=lastPointer?Math.max(-10,Math.min(10,(y-lastPointer.y)*.5)):0;
    for(const [i,response] of [skirt,hairHover].entries()){
      response.targetX=x;response.targetY=y;
      response.targetDx=dx*strengths[i];response.targetDy=(-18+dy)*strengths[i];
    }
    lastPointer={x,y};
  },{passive:true});
  document.documentElement.addEventListener('pointerleave',releaseHover);
  window.addEventListener('blur',releaseHover);
  window.addEventListener('scroll',releaseHover,{passive:true,capture:true});
  reduced.addEventListener('change',()=>{releaseHover();for(const response of [skirt,hairHover]){response.dx=0;response.dy=0;}sync();});
  document.addEventListener('visibilitychange',sync);
  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();}).observe(canvas);
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();fallback();});
  canvas.addEventListener('webglcontextrestored',()=>{setup().catch(fallback);});
  new MutationObserver(()=>{if(ready)updateArtwork().catch(fallback);}).observe(still,{attributes:true,attributeFilter:['src']});
  setup().catch(error=>{console.error('Artist animation:',error);fallback();});
})();

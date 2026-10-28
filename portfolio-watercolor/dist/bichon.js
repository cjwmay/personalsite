(() => {
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const dog=document.createElement('div');
  dog.className='bichon is-sleeping';
  dog.setAttribute('aria-hidden','true');
  const canvas=document.createElement('canvas');
  canvas.width=152;canvas.height=152;
  dog.append(canvas);
  document.body.append(dog);
  let timer,hovered=false,phase=0,frame=0,paint=null;
  function draw(){
    if(paint)paint(phase);
    else dog.style.backgroundImage=`url('assets/bichon-${phase<.5?'sleep':'awake'}.webp')`;
  }
  function pose(target){
    cancelAnimationFrame(frame);
    if(reduced.matches){phase=0;draw();return;}
    const from=phase,start=performance.now();
    function tick(now){
      const progress=Math.min(1,(now-start)/1600);
      phase=from+(target-from)*(1-Math.cos(progress*Math.PI))*.5;
      draw();
      if(progress<1&&!document.hidden)frame=requestAnimationFrame(tick);
    }
    frame=requestAnimationFrame(tick);
  }
  async function setup(){
    const gl=canvas.getContext('webgl',{alpha:true,premultipliedAlpha:false,preserveDrawingBuffer:true});
    if(!gl)return;
    const images=await Promise.all(['sleep','awake'].map(async name=>{
      const image=new Image();image.src=`assets/bichon-${name}.webp`;await image.decode();return image;
    }));
    const vertex=`attribute vec2 position;varying vec2 uv;void main(){uv=position*.5+.5;gl_Position=vec4(position,0.,1.);}`;
    const fragment=`precision mediump float;varying vec2 uv;uniform sampler2D sleeping;uniform sampler2D awake;uniform float phase;
      void main(){
        vec2 p=vec2(uv.x,1.-uv.y);
        float head=smoothstep(.50,.65,p.x)*(1.-smoothstep(.68,.76,p.y))*smoothstep(.32,.43,p.y);
        vec2 source=p;
        if(phase<.5){source.y+=phase*.08*head;gl_FragColor=texture2D(sleeping,source);}
        else{source.y-=(1.-phase)*.08*head;gl_FragColor=texture2D(awake,source);}
      }`;
    function shader(type,source){
      const result=gl.createShader(type);gl.shaderSource(result,source);gl.compileShader(result);
      if(!gl.getShaderParameter(result,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(result));
      return result;
    }
    const program=gl.createProgram();
    gl.attachShader(program,shader(gl.VERTEX_SHADER,vertex));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));
    gl.useProgram(program);
    const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
    const position=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
    images.forEach((image,i)=>{
      gl.activeTexture(gl.TEXTURE0+i);gl.bindTexture(gl.TEXTURE_2D,gl.createTexture());
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);
      gl.uniform1i(gl.getUniformLocation(program,i?'awake':'sleeping'),i);
    });
    const location=gl.getUniformLocation(program,'phase');gl.viewport(0,0,152,152);
    paint=value=>{gl.uniform1f(location,value);gl.drawArrays(gl.TRIANGLES,0,3);};
    dog.style.backgroundImage='none';canvas.hidden=false;draw();
    canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();paint=null;canvas.hidden=true;draw();});
  }
  canvas.hidden=true;
  setup().catch(error=>console.error('Bichon animation:',error));
  function sleep(){
    clearTimeout(timer);
    dog.classList.add('is-sleeping');dog.classList.remove('is-looking');pose(0);
    if(!reduced.matches&&!document.hidden)timer=setTimeout(wake,20000+Math.random()*20000);
  }
  function wake(){
    clearTimeout(timer);
    if(reduced.matches||document.hidden)return;
    dog.classList.remove('is-sleeping');dog.classList.add('is-looking');pose(1);
    if(!hovered)timer=setTimeout(sleep,7000+Math.random()*3000);
  }
  function sync(){
    hovered=false;
    dog.classList.toggle('is-paused',document.hidden);
    sleep();
  }
  dog.addEventListener('pointerenter',event=>{
    if(event.pointerType!=='mouse')return;
    hovered=true;wake();
  });
  dog.addEventListener('pointerleave',()=>{
    hovered=false;clearTimeout(timer);
    if(!reduced.matches&&!document.hidden)timer=setTimeout(sleep,2200);
  });
  reduced.addEventListener('change',sync);
  document.addEventListener('visibilitychange',sync);
  sync();
})();

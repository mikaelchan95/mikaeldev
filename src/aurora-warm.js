/* ============================================================
   Aurora (warm) — WebGL hero.
   Flowing burnt-orange / gold light over near-black.
   CSS fallback if WebGL unavailable or reduced-motion.
   ============================================================ */
(function () {
  const canvas = document.getElementById('aurora');
  if (!canvas) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function cssFallback() {
    canvas.style.background =
      'radial-gradient(65% 90% at 22% 30%, rgba(235,89,57,.5), transparent 60%),' +
      'radial-gradient(55% 80% at 82% 72%, rgba(197,155,100,.42), transparent 60%),' +
      'radial-gradient(40% 60% at 55% 50%, rgba(235,89,57,.18), transparent 60%),' +
      '#0D0D0D';
  }

  const gl = canvas.getContext('webgl', { antialias: true, alpha: false, powerPreference: 'high-performance' });
  if (!gl || reduce) { cssFallback(); return; }

  const vert = `attribute vec2 p; void main(){ gl_Position = vec4(p,0.0,1.0); }`;

  const frag = `
    precision highp float;
    uniform vec2 u_res; uniform float u_time;
    float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453123); }
    float noise(vec2 p){
      vec2 i=floor(p), f=fract(p); vec2 u=f*f*(3.0-2.0*f);
      return mix(mix(hash(i+vec2(0,0)),hash(i+vec2(1,0)),u.x),
                 mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);
    }
    float fbm(vec2 p){ float v=0.0,a=0.5; for(int i=0;i<5;i++){ v+=a*noise(p); p*=2.02; a*=0.5; } return v; }
    void main(){
      vec2 uv = gl_FragCoord.xy/u_res.xy;
      float asp = u_res.x/u_res.y;
      vec2 p = uv; p.x*=asp;
      float t = u_time*0.04;
      vec2 q = vec2(fbm(p*1.5+vec2(0.0,t*2.0)), fbm(p*1.5+vec2(5.2,t*1.2)));
      float n = fbm(p*2.0+q*1.5+vec2(t,-t*0.6));
      float curtains = fbm(vec2(p.x*2.2+n*1.1+t*0.7, p.y*0.65));
      float band = smoothstep(0.18,0.95,curtains)*(1.0-uv.y*0.55);
      band *= 0.85+0.55*sin(p.x*2.6+t*3.4+n*5.0);
      vec3 deep  = vec3(0.137,0.063,0.043);   // dark ember
      vec3 acc   = vec3(0.922,0.349,0.224);   // burnt orange #EB5939
      vec3 gold  = vec3(0.773,0.608,0.392);   // gold #C59B64
      vec3 col = mix(deep, acc, clamp(band*1.2,0.0,1.0));
      col = mix(col, gold, clamp(pow(band,2.4)*0.85,0.0,1.0));
      vec3 bg = vec3(0.051,0.051,0.051);
      float v = smoothstep(1.3,0.2,length((uv-0.5)*vec2(asp,1.0)));
      col = mix(bg, col, clamp(band*1.4,0.0,1.0));
      col *= 0.55+0.45*v;
      col += (hash(uv*u_res.xy+t)*0.035-0.0175);
      gl_FragColor = vec4(col,1.0);
    }`;

  function compile(type, src) {
    const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn('aurora:', gl.getShaderInfoLog(s)); return null; }
    return s;
  }
  const vs = compile(gl.VERTEX_SHADER, vert), fs = compile(gl.FRAGMENT_SHADER, frag);
  if (!vs || !fs) { cssFallback(); return; }
  const prog = gl.createProgram(); gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { cssFallback(); return; }
  gl.useProgram(prog);

  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const uRes = gl.getUniformLocation(prog, 'u_res'), uTime = gl.getUniformLocation(prog, 'u_time');

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    canvas.width = Math.max(1, Math.floor(canvas.clientWidth*dpr));
    canvas.height = Math.max(1, Math.floor(canvas.clientHeight*dpr));
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  window.addEventListener('resize', resize); resize();

  const start = performance.now(); let running = true;
  const hero = document.querySelector('.hero');
  if (hero && 'IntersectionObserver' in window) {
    new IntersectionObserver((es) => { running = es[0].isIntersecting; if (running) requestAnimationFrame(loop); },
      { threshold: 0.01 }).observe(hero);
  }
  function loop(now) {
    if (!running) return;
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, (now-start)/1000);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();

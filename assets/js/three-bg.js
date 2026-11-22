/**
 * Three.js Interactive Digital Wave Grid, Aerodynamic Streamlines & Hero Physics
 * Built with techniques from Soumik Ghosh's Agent Skills:
 * - 3d-hero-interactions (pointer tracking, damped lerp, click impulses, drag-to-rotate, particle burst)
 * - scroll-driven-3d-story (scroll progress camera choreography)
 * - ai-website-aesthetics (dark-first tokens, fog, glowing nodes)
 * - Option 1: Ambient 3D Flow Streamlines & Wind-Tunnel Tracers
 */

(function () {
  'use strict';

  const canvas = document.getElementById('three-bg-canvas');
  if (!canvas) return;

  // Grid & Streamline Configuration
  const CONFIG = {
    gridWidth: 1700,
    gridDepth: 1500,
    segmentsX: window.innerWidth < 768 ? 40 : 60,
    segmentsY: window.innerWidth < 768 ? 40 : 55,
    cameraHeight: 230,
    cameraDistance: 560,
    cameraPitch: -0.32,
    baseWaveSpeed: 0.0018,
    baseWaveHeight: 34,
    particleBurstCount: 40,
    streamlineCount: window.innerWidth < 768 ? 3 : 5,
    streamlineSegments: 75
  };

  let scene, camera, renderer;
  let wireframeMesh, pointsMesh, geometry;
  let originalPositions;
  let isVisible = true;
  let lastTime = 0;

  // 1. Pointer Tracking (Single NDC Vector, Damped Everywhere)
  const pointer = new THREE.Vector2(0, 0);     // Raw (-1..1)
  const smooth = new THREE.Vector2(0, 0);      // Damped follower
  let isPointerDown = false;
  let dragStart = { x: 0, y: 0 };
  let isDragging = false;
  let dragRotation = { x: 0, y: 0, velX: 0, velY: 0 };

  // 2. Click Shockwave / Impulse System
  const shockwaves = [];

  // 3. Recycled Particle Burst Pool
  let burstPointsMesh, burstGeometry;
  const burstParticles = [];
  const burstPositions = new Float32Array(CONFIG.particleBurstCount * 3);
  const burstColors = new Float32Array(CONFIG.particleBurstCount * 3);
  let nextBurstIndex = 0;

  // 4. Ambient 3D Flow Streamlines (CFD Wind Tunnel Flow)
  const streamlines = [];
  let tracerPointsMesh, tracerGeometry;
  const tracerPositions = new Float32Array(CONFIG.streamlineCount * 3);
  const tracerColors = new Float32Array(CONFIG.streamlineCount * 3);

  // 5. Scroll-Driven Storyboard State
  let scrollProgress = 0;
  let targetScrollProgress = 0;

  // Theme palettes (ai-website-aesthetics tokens)
  const THEMES = {
    dark: {
      gridColor: 0x6366f1,       // Accent indigo
      gridOpacity: 0.35,
      pointsColor: 0x00d4ff,     // Accent-2 cyan
      pointsOpacity: 0.85,
      streamlineColor: 0x38bdf8, // Luminous sky-cyan
      streamlineOpacity: 0.38,
      tracerColor: 0x00d4ff,
      burstColor: 0x38bdf8,
      fogColor: 0x0a0a0e,        // --bg-0
      fogDensity: 0.00115
    },
    light: {
      gridColor: 0x4f46e5,
      gridOpacity: 0.22,
      pointsColor: 0x0284c7,
      pointsOpacity: 0.70,
      streamlineColor: 0x0284c7,
      streamlineOpacity: 0.28,
      tracerColor: 0x0369a1,
      burstColor: 0x0284c7,
      fogColor: 0xf8fafc,
      fogDensity: 0.0011
    }
  };

  function getCurrentTheme() {
    return document.documentElement.classList.contains('dark') ? THEMES.dark : THEMES.light;
  }

  function init() {
    // 1. Scene & Depth Fog
    scene = new THREE.Scene();
    const theme = getCurrentTheme();
    scene.fog = new THREE.FogExp2(theme.fogColor, theme.fogDensity);

    // 2. Camera Setup
    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 3200);
    camera.position.set(0, CONFIG.cameraHeight, CONFIG.cameraDistance);
    camera.rotation.x = CONFIG.cameraPitch;

    // 3. WebGL Renderer
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 4. Construct Digital Wave Grid
    createWaveGrid();

    // 5. Construct Particle Burst System
    createParticleBurstPool();

    // 6. Construct 3D Aerodynamic Flow Streamlines (Option 1)
    createStreamlines();

    // 7. Event Listeners
    setupInteractions();

    // 8. Start Animation Loop
    lastTime = performance.now();
    requestAnimationFrame(tick);
  }

  function createWaveGrid() {
    const theme = getCurrentTheme();

    geometry = new THREE.PlaneGeometry(
      CONFIG.gridWidth,
      CONFIG.gridDepth,
      CONFIG.segmentsX,
      CONFIG.segmentsY
    );
    geometry.rotateX(-Math.PI / 2);

    const posAttr = geometry.attributes.position;
    originalPositions = new Float32Array(posAttr.array.length);
    originalPositions.set(posAttr.array);

    // Cyber Grid Wireframe
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: theme.gridColor,
      wireframe: true,
      transparent: true,
      opacity: theme.gridOpacity,
      blending: THREE.AdditiveBlending
    });
    wireframeMesh = new THREE.Mesh(geometry, wireframeMaterial);
    scene.add(wireframeMesh);

    // Glowing Intersection Nodes
    const glowTexture = createGlowTexture();
    const pointsMaterial = new THREE.PointsMaterial({
      color: theme.pointsColor,
      size: window.innerWidth < 768 ? 4 : 5.5,
      map: glowTexture,
      transparent: true,
      opacity: theme.pointsOpacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    pointsMesh = new THREE.Points(geometry, pointsMaterial);
    scene.add(pointsMesh);
  }

  function createGlowTexture() {
    const c = document.createElement('canvas');
    c.width = 32;
    c.height = 32;
    const ctx = c.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.3, 'rgba(0, 212, 255, 0.9)');
    grad.addColorStop(0.7, 'rgba(99, 102, 241, 0.3)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);

    const texture = new THREE.Texture(c);
    texture.needsUpdate = true;
    return texture;
  }

  function createParticleBurstPool() {
    burstGeometry = new THREE.BufferGeometry();

    for (let i = 0; i < CONFIG.particleBurstCount; i++) {
      burstParticles.push({
        x: 0, y: -9999, z: 0,
        vx: 0, vy: 0, vz: 0,
        life: 0,
        maxLife: 1.0
      });
      burstPositions[i * 3 + 1] = -9999;
    }

    burstGeometry.setAttribute('position', new THREE.BufferAttribute(burstPositions, 3));
    burstGeometry.setAttribute('color', new THREE.BufferAttribute(burstColors, 3));

    const burstMaterial = new THREE.PointsMaterial({
      size: 7,
      map: createGlowTexture(),
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    burstPointsMesh = new THREE.Points(burstGeometry, burstMaterial);
    scene.add(burstPointsMesh);
  }

  // 3D Aerodynamic Flow Streamlines (Wind Tunnel Flow Field)
  function createStreamlines() {
    const theme = getCurrentTheme();
    const count = CONFIG.streamlineCount;
    const segs = CONFIG.streamlineSegments;

    // Distribute streamlines at distinct altitudes and depths
    const configs = [
      { baseY: 85,  baseZ: -240, speed: 0.0016, phase: 0.0 },
      { baseY: 135, baseZ: -120, speed: 0.0021, phase: 1.4 },
      { baseY: 180, baseZ: -30,  speed: 0.0019, phase: 2.8 },
      { baseY: 225, baseZ: 70,   speed: 0.0023, phase: 4.1 },
      { baseY: 270, baseZ: 170,  speed: 0.0018, phase: 5.5 }
    ];

    const c1 = new THREE.Color(theme.streamlineColor);
    const c2 = new THREE.Color(theme.pointsColor);

    for (let s = 0; s < count; s++) {
      const cfg = configs[s % configs.length];
      const positions = new Float32Array((segs + 1) * 3);
      const colors = new Float32Array((segs + 1) * 3);

      for (let i = 0; i <= segs; i++) {
        const u = i / segs;
        const x = -850 + u * 1700;
        const i3 = i * 3;

        positions[i3] = x;
        positions[i3 + 1] = cfg.baseY;
        positions[i3 + 2] = cfg.baseZ;

        // Alpha fade toward ends: high in center, zero at edges
        const edgeDist = Math.abs(u - 0.5) * 2; // 0 at center, 1 at edge
        const alpha = Math.max(0, 1 - Math.pow(edgeDist, 2.5));

        const blended = c1.clone().lerp(c2, Math.sin(u * Math.PI));
        colors[i3] = blended.r * alpha;
        colors[i3 + 1] = blended.g * alpha;
        colors[i3 + 2] = blended.b * alpha;
      }

      const geom = new THREE.BufferGeometry();
      geom.setAttribute('position', new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage));
      geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const mat = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: theme.streamlineOpacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      const lineMesh = new THREE.Line(geom, mat);
      scene.add(lineMesh);

      streamlines.push({
        mesh: lineMesh,
        geometry: geom,
        positions: positions,
        baseY: cfg.baseY,
        baseZ: cfg.baseZ,
        speed: cfg.speed,
        phase: cfg.phase,
        tracerT: Math.random() // Normalized 0..1 tracer bead position
      });
    }

    // Tracer Beads traveling along streamlines (smoke wire visualization)
    tracerGeometry = new THREE.BufferGeometry();
    for (let s = 0; s < count; s++) {
      tracerPositions[s * 3 + 1] = -9999;
      tracerColors[s * 3] = c2.r;
      tracerColors[s * 3 + 1] = c2.g;
      tracerColors[s * 3 + 2] = c2.b;
    }
    tracerGeometry.setAttribute('position', new THREE.BufferAttribute(tracerPositions, 3));
    tracerGeometry.setAttribute('color', new THREE.BufferAttribute(tracerColors, 3));

    const tracerMat = new THREE.PointsMaterial({
      size: 6.5,
      map: createGlowTexture(),
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    tracerPointsMesh = new THREE.Points(tracerGeometry, tracerMat);
    scene.add(tracerPointsMesh);
  }

  function emitParticleBurst(worldX, worldZ) {
    const burstCount = 12;
    const theme = getCurrentTheme();
    const c = new THREE.Color(theme.burstColor);

    for (let k = 0; k < burstCount; k++) {
      const idx = (nextBurstIndex + k) % CONFIG.particleBurstCount;
      const angle = Math.random() * Math.PI * 2;
      const speed = 2.0 + Math.random() * 4.5;

      burstParticles[idx] = {
        x: worldX,
        y: 15,
        z: worldZ,
        vx: Math.cos(angle) * speed,
        vy: 3.5 + Math.random() * 4.0,
        vz: Math.sin(angle) * speed,
        life: 1.0,
        maxLife: 0.8 + Math.random() * 0.4
      };
    }
    nextBurstIndex = (nextBurstIndex + burstCount) % CONFIG.particleBurstCount;
  }

  function setupInteractions() {
    window.addEventListener('pointermove', (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;

      if (isPointerDown) {
        const dx = e.clientX - dragStart.x;
        const dy = e.clientY - dragStart.y;
        if (Math.hypot(dx, dy) > 5) {
          isDragging = true;
          dragRotation.velY = dx * 0.0004;
          dragRotation.velX = dy * 0.0003;
        }
      }
    }, { passive: true });

    window.addEventListener('pointerdown', (e) => {
      isPointerDown = true;
      isDragging = false;
      dragStart = { x: e.clientX, y: e.clientY };

      const worldX = pointer.x * (CONFIG.gridWidth * 0.45);
      const worldZ = -pointer.y * (CONFIG.gridDepth * 0.45);

      shockwaves.push({
        x: worldX,
        z: worldZ,
        radius: 0,
        amplitude: 45,
        speed: 16
      });

      emitParticleBurst(worldX, worldZ);
    });

    window.addEventListener('pointerup', () => {
      isPointerDown = false;
    });

    window.addEventListener('scroll', () => {
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      targetScrollProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    }, { passive: true });

    window.addEventListener('resize', onResize, { passive: true });
    document.addEventListener('visibilitychange', () => {
      isVisible = !document.hidden;
      if (isVisible) lastTime = performance.now();
    });

    const themeObserver = new MutationObserver(onThemeChange);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  }

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  function onThemeChange() {
    const theme = getCurrentTheme();
    if (scene && scene.fog) {
      scene.fog.color.setHex(theme.fogColor);
      scene.fog.density = theme.fogDensity;
    }
    if (wireframeMesh && wireframeMesh.material) {
      wireframeMesh.material.color.setHex(theme.gridColor);
      wireframeMesh.material.opacity = theme.gridOpacity;
    }
    if (pointsMesh && pointsMesh.material) {
      pointsMesh.material.color.setHex(theme.pointsColor);
      pointsMesh.material.opacity = theme.pointsOpacity;
    }
    streamlines.forEach(sl => {
      if (sl.mesh && sl.mesh.material) {
        sl.mesh.material.opacity = theme.streamlineOpacity;
      }
    });
  }

  // Animation Loop
  function tick(timestamp) {
    requestAnimationFrame(tick);
    if (!isVisible || !geometry) return;

    const dt = Math.min((timestamp - lastTime) / 1000, 0.1);
    lastTime = timestamp;

    // A. Frame-rate independent damped follower
    smooth.lerp(pointer, 1 - Math.pow(0.001, dt));

    // B. Scroll Progress Interpolation
    scrollProgress += (targetScrollProgress - scrollProgress) * 0.08;

    // C. Drag Inertia with Spring-back
    if (!isDragging) {
      dragRotation.velX += 0.04 * (0 - dragRotation.x);
      dragRotation.velY += 0.04 * (0 - dragRotation.y);
      dragRotation.velX *= 0.88;
      dragRotation.velY *= 0.88;
    }
    dragRotation.x += dragRotation.velX;
    dragRotation.y += dragRotation.velY;

    // D. Camera Choreography
    const scrollHeightOffset = scrollProgress * 60;
    const scrollPitchOffset = scrollProgress * -0.06;

    camera.position.x = smooth.x * 90 + dragRotation.y * 300;
    camera.position.y = CONFIG.cameraHeight - scrollHeightOffset + (smooth.y * 30) - (dragRotation.x * 200);
    camera.position.z = CONFIG.cameraDistance - scrollProgress * 100;
    camera.rotation.x = CONFIG.cameraPitch + scrollPitchOffset + (-smooth.y * 0.08) - (dragRotation.x * 0.3);
    camera.rotation.y = (-smooth.x * 0.06) + (dragRotation.y * 0.3);

    // E. Update Wave Grid Vertices
    const pos = geometry.attributes.position.array;
    const count = pos.length / 3;
    const t = timestamp * CONFIG.baseWaveSpeed;
    const waveHeight = CONFIG.baseWaveHeight * (1.0 - scrollProgress * 0.25);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const x = originalPositions[i3];
      const z = originalPositions[i3 + 2];

      const wave1 = Math.sin(x * 0.007 + t) * Math.cos(z * 0.007 + t * 0.8) * waveHeight;
      const wave2 = Math.sin((x + z) * 0.004 + t * 1.3) * 14;

      const curWorldX = smooth.x * (CONFIG.gridWidth * 0.45);
      const curWorldZ = -smooth.y * (CONFIG.gridDepth * 0.45);
      const dx = x - curWorldX;
      const dz = z - curWorldZ;
      const dist = Math.sqrt(dx * dx + dz * dz);
      let hoverRipple = 0;
      if (dist < 260) {
        const factor = 1 - dist / 260;
        hoverRipple = Math.sin(dist * 0.05 - t * 3) * (factor * 30);
      }

      let shockwaveHeight = 0;
      for (let s = 0; s < shockwaves.length; s++) {
        const sw = shockwaves[s];
        const sdx = x - sw.x;
        const sdz = z - sw.z;
        const sdist = Math.sqrt(sdx * sdx + sdz * sdz);
        const ringDist = Math.abs(sdist - sw.radius);
        if (ringDist < 60) {
          const factor = (1 - ringDist / 60) * (sw.amplitude / 45);
          shockwaveHeight += Math.sin(ringDist * 0.1) * factor * sw.amplitude;
        }
      }

      pos[i3 + 1] = wave1 + wave2 + hoverRipple + shockwaveHeight;
    }
    geometry.attributes.position.needsUpdate = true;

    // F. Update 3D Aerodynamic Flow Streamlines & Wind-Tunnel Tracers (Option 1)
    const segs = CONFIG.streamlineSegments;
    const tracerPosArr = tracerGeometry ? tracerGeometry.attributes.position.array : null;

    for (let s = 0; s < streamlines.length; s++) {
      const sl = streamlines[s];
      const posArray = sl.positions;
      const st = timestamp * sl.speed;

      // Update tracer progress along the streamline
      sl.tracerT = (sl.tracerT + dt * 0.18) % 1.0;
      const tracerIndex = Math.min(segs, Math.floor(sl.tracerT * segs));

      for (let i = 0; i <= segs; i++) {
        const u = i / segs;
        const x = -850 + u * 1700;
        const i3 = i * 3;

        // Harmonic Navier-Stokes streamline flow equation
        const flowWarpY = Math.sin(x * 0.005 + st * 1.5 + sl.phase) * 20 + Math.cos(x * 0.002 + st) * 10;
        const flowWarpZ = Math.cos(x * 0.004 + st * 1.2 + sl.phase) * 18;

        // Interactive pointer deflection (deflecting over virtual obstacle)
        const curX = smooth.x * 600;
        const pdist = Math.abs(x - curX);
        const deflection = Math.exp(-Math.pow(pdist / 180, 2)) * (smooth.y * 35);

        posArray[i3] = x;
        posArray[i3 + 1] = sl.baseY + flowWarpY + deflection;
        posArray[i3 + 2] = sl.baseZ + flowWarpZ;

        // If this is the tracer bead coordinate, save it
        if (i === tracerIndex && tracerPosArr) {
          tracerPosArr[s * 3] = x;
          tracerPosArr[s * 3 + 1] = sl.baseY + flowWarpY + deflection;
          tracerPosArr[s * 3 + 2] = sl.baseZ + flowWarpZ;
        }
      }
      sl.geometry.attributes.position.needsUpdate = true;
    }

    if (tracerGeometry) {
      tracerGeometry.attributes.position.needsUpdate = true;
    }

    // G. Update Shockwaves
    for (let s = shockwaves.length - 1; s >= 0; s--) {
      shockwaves[s].radius += shockwaves[s].speed;
      shockwaves[s].amplitude *= 0.95;
      if (shockwaves[s].amplitude < 0.5 || shockwaves[s].radius > 900) {
        shockwaves.splice(s, 1);
      }
    }

    // H. Update Particle Bursts
    const burstPosArr = burstGeometry.attributes.position.array;
    const burstColArr = burstGeometry.attributes.color.array;
    const theme = getCurrentTheme();
    const burstColor = new THREE.Color(theme.burstColor);

    for (let p = 0; p < CONFIG.particleBurstCount; p++) {
      const pt = burstParticles[p];
      const p3 = p * 3;

      if (pt.life > 0) {
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.z += pt.vz;
        pt.vy -= 0.12;
        pt.life -= dt / pt.maxLife;

        burstPosArr[p3] = pt.x;
        burstPosArr[p3 + 1] = pt.y;
        burstPosArr[p3 + 2] = pt.z;

        const alpha = Math.max(0, pt.life);
        burstColArr[p3] = burstColor.r * alpha;
        burstColArr[p3 + 1] = burstColor.g * alpha;
        burstColArr[p3 + 2] = burstColor.b * alpha;
      } else {
        burstPosArr[p3 + 1] = -9999;
      }
    }
    burstGeometry.attributes.position.needsUpdate = true;
    burstGeometry.attributes.color.needsUpdate = true;

    // Render Scene
    renderer.render(scene, camera);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

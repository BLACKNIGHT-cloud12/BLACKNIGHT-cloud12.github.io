/**
 * Three.js Interactive Digital Wave Grid & Hero Physics
 * Built with techniques from Soumik Ghosh's Agent Skills:
 * - 3d-hero-interactions (pointer tracking, damped lerp, click impulses, drag-to-rotate, particle burst)
 * - scroll-driven-3d-story (scroll progress camera choreography)
 * - ai-website-aesthetics (dark-first tokens, fog, glowing nodes)
 */

(function () {
  'use strict';

  const canvas = document.getElementById('three-bg-canvas');
  if (!canvas) return;

  // Grid Configuration
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
    particleBurstCount: 40
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
  const shockwaves = []; // { x, z, time, maxRadius, amplitude, speed }

  // 3. Recycled Particle Burst Pool (Zero garbage collection during interaction)
  let burstPointsMesh, burstGeometry;
  const burstParticles = [];
  const burstPositions = new Float32Array(CONFIG.particleBurstCount * 3);
  const burstColors = new Float32Array(CONFIG.particleBurstCount * 3);
  let nextBurstIndex = 0;

  // 4. Scroll-Driven Storyboard State
  let scrollProgress = 0;
  let targetScrollProgress = 0;

  // Theme palettes (ai-website-aesthetics tokens)
  const THEMES = {
    dark: {
      gridColor: 0x6366f1,       // Accent indigo
      gridOpacity: 0.35,
      pointsColor: 0x00d4ff,     // Accent-2 cyan
      pointsOpacity: 0.85,
      burstColor: 0x38bdf8,
      fogColor: 0x0a0a0e,        // --bg-0
      fogDensity: 0.00115
    },
    light: {
      gridColor: 0x4f46e5,
      gridOpacity: 0.22,
      pointsColor: 0x0284c7,
      pointsOpacity: 0.70,
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

    // 2. Camera Rig Group (for clean parallax + scroll layering)
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

    // 6. Event Listeners
    setupInteractions();

    // 7. Start Animation Loop
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
    const theme = getCurrentTheme();
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

  function emitParticleBurst(worldX, worldZ) {
    const burstCount = 12; // Emit batch per click
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
    // 1. Pointer Tracking
    window.addEventListener('pointermove', (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;

      // Drag check
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

    // 2. Click Reaction / Impulse Trigger (Start on pointerdown <=16ms)
    window.addEventListener('pointerdown', (e) => {
      isPointerDown = true;
      isDragging = false;
      dragStart = { x: e.clientX, y: e.clientY };

      // Calculate approximate 3D ground coordinates
      const worldX = pointer.x * (CONFIG.gridWidth * 0.45);
      const worldZ = -pointer.y * (CONFIG.gridDepth * 0.45);

      // Trigger Shockwave ripple
      shockwaves.push({
        x: worldX,
        z: worldZ,
        radius: 0,
        amplitude: 45,
        speed: 16
      });

      // Spawn particle burst
      emitParticleBurst(worldX, worldZ);
    });

    window.addEventListener('pointerup', () => {
      isPointerDown = false;
    });

    // 3. Scroll-Driven Storytelling (Passive scroll observer)
    window.addEventListener('scroll', () => {
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      targetScrollProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    }, { passive: true });

    // 4. Resize & Theme Observer
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
  }

  // Animation Loop (Damped Tick)
  function tick(timestamp) {
    requestAnimationFrame(tick);
    if (!isVisible || !geometry) return;

    const dt = Math.min((timestamp - lastTime) / 1000, 0.1);
    lastTime = timestamp;

    // A. Frame-rate independent damped follower: smooth.lerp(pointer, 1 - Math.pow(0.001, dt))
    smooth.lerp(pointer, 1 - Math.pow(0.001, dt));

    // B. Scroll Progress Interpolation (Story beats)
    scrollProgress += (targetScrollProgress - scrollProgress) * 0.08;

    // C. Drag Inertia with Spring-back to Rest Pose (v += k*(rest - x); v *= damp)
    if (!isDragging) {
      dragRotation.velX += 0.04 * (0 - dragRotation.x);
      dragRotation.velY += 0.04 * (0 - dragRotation.y);
      dragRotation.velX *= 0.88;
      dragRotation.velY *= 0.88;
    }
    dragRotation.x += dragRotation.velX;
    dragRotation.y += dragRotation.velY;

    // D. Camera Choreography (Scroll Storyboard + Parallax + Drag Tilt)
    // Beat 1 (Hero: progress ~0): Overview
    // Beat 2 (About/Projects: progress ~0.5): Camera descends closer, streamlined
    // Beat 3 (Contact: progress ~1.0): Deep horizon view
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

    // Dynamic wave parameters influenced by scroll progress
    const waveHeight = CONFIG.baseWaveHeight * (1.0 - scrollProgress * 0.25);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const x = originalPositions[i3];
      const z = originalPositions[i3 + 2];

      // Harmonic fluid streamlines
      const wave1 = Math.sin(x * 0.007 + t) * Math.cos(z * 0.007 + t * 0.8) * waveHeight;
      const wave2 = Math.sin((x + z) * 0.004 + t * 1.3) * 14;

      // Cursor hover perturbation
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

      // Propagate active shockwaves from user clicks
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

    // F. Update Shockwaves (radius expand and fade)
    for (let s = shockwaves.length - 1; s >= 0; s--) {
      shockwaves[s].radius += shockwaves[s].speed;
      shockwaves[s].amplitude *= 0.95;
      if (shockwaves[s].amplitude < 0.5 || shockwaves[s].radius > 900) {
        shockwaves.splice(s, 1);
      }
    }

    // G. Update Particle Bursts
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
        pt.vy -= 0.12; // Gravity
        pt.life -= dt / pt.maxLife;

        burstPosArr[p3] = pt.x;
        burstPosArr[p3 + 1] = pt.y;
        burstPosArr[p3 + 2] = pt.z;

        const alpha = Math.max(0, pt.life);
        burstColArr[p3] = burstColor.r * alpha;
        burstColArr[p3 + 1] = burstColor.g * alpha;
        burstColArr[p3 + 2] = burstColor.b * alpha;
      } else {
        burstPosArr[p3 + 1] = -9999; // Hide off-screen
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

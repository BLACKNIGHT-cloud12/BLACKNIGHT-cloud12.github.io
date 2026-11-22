/**
 * Three.js 3D Interactive Digital Wave Grid Background
 * 
 * Features:
 * - Dynamic undulating 3D wireframe cyber terrain / digital mesh
 * - Glowing intersection nodes
 * - Interactive mouse ripple & cursor perturbation
 * - Theme-reactive colors (Dark mode cyber cyan/indigo vs Light mode slate/blue)
 * - Battery-friendly visibility throttling
 */

(function () {
  'use strict';

  const canvas = document.getElementById('three-bg-canvas');
  if (!canvas) return;

  // Grid Configuration
  const CONFIG = {
    gridWidth: 1600,
    gridDepth: 1400,
    segmentsX: window.innerWidth < 768 ? 40 : 60,
    segmentsY: window.innerWidth < 768 ? 40 : 55,
    cameraHeight: 220,
    cameraDistance: 540,
    cameraPitch: -0.32,
    waveSpeed: 0.0016,
    waveHeight: 32,
    mouseWaveRadius: 300,
    mouseSensitivity: 0.0008,
  };

  let scene, camera, renderer;
  let wireframeMesh, pointsMesh;
  let geometry;
  let originalPositions;
  let mouse = { x: 0, y: 0, targetX: 0, targetY: 0, worldX: 0, worldZ: 0 };
  let isVisible = true;

  // Theme Palette definitions
  const THEMES = {
    dark: {
      gridColor: 0x6366f1,        // Indigo-500
      gridOpacity: 0.35,
      pointsColor: 0x38bdf8,      // Sky-400 cyan
      pointsOpacity: 0.85,
      fogColor: 0x070b14,
      fogDensity: 0.0012
    },
    light: {
      gridColor: 0x4f46e5,        // Indigo-600
      gridOpacity: 0.22,
      pointsColor: 0x0284c7,      // Sky-600
      pointsOpacity: 0.70,
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

    // 2. Camera Setup (Perspective looking across the digital ocean grid)
    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 3000);
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

    // 4. Create the Digital Wave Terrain
    createWaveGrid();

    // 5. Event Listeners
    window.addEventListener('resize', onWindowResize, { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange);

    // Watch for dark/light mode toggle
    const observer = new MutationObserver(onThemeChange);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    // 6. Begin Animation Loop
    animate(0);
  }

  function createWaveGrid() {
    const theme = getCurrentTheme();

    // Create plane geometry facing upward
    geometry = new THREE.PlaneGeometry(
      CONFIG.gridWidth,
      CONFIG.gridDepth,
      CONFIG.segmentsX,
      CONFIG.segmentsY
    );
    // Rotate to lay flat like a floor / digital matrix ocean
    geometry.rotateX(-Math.PI / 2);

    // Store original flat positions for wave calculations
    const posAttr = geometry.attributes.position;
    originalPositions = new Float32Array(posAttr.array.length);
    originalPositions.set(posAttr.array);

    // Wireframe Mesh for the cyber grid
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: theme.gridColor,
      wireframe: true,
      transparent: true,
      opacity: theme.gridOpacity,
      blending: THREE.AdditiveBlending
    });
    wireframeMesh = new THREE.Mesh(geometry, wireframeMaterial);
    scene.add(wireframeMesh);

    // Glowing Intersection Nodes (Points) on each vertex
    const particleTexture = createGlowTexture();
    const pointsMaterial = new THREE.PointsMaterial({
      color: theme.pointsColor,
      size: window.innerWidth < 768 ? 4 : 5.5,
      map: particleTexture,
      transparent: true,
      opacity: theme.pointsOpacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    pointsMesh = new THREE.Points(geometry, pointsMaterial);
    scene.add(pointsMesh);
  }

  function createGlowTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.3, 'rgba(56, 189, 248, 0.9)');
    grad.addColorStop(0.7, 'rgba(99, 102, 241, 0.3)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);

    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
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

  function onMouseMove(e) {
    const nx = (e.clientX / window.innerWidth) * 2 - 1;
    const ny = -(e.clientY / window.innerHeight) * 2 + 1;
    mouse.targetX = nx * 80;
    mouse.targetY = ny * 40;

    // Approximate 3D world projection for interactive ripples
    mouse.worldX = nx * (CONFIG.gridWidth * 0.45);
    mouse.worldZ = -ny * (CONFIG.gridDepth * 0.45);
  }

  function onTouchMove(e) {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      const nx = (touch.clientX / window.innerWidth) * 2 - 1;
      const ny = -(touch.clientY / window.innerHeight) * 2 + 1;
      mouse.targetX = nx * 60;
      mouse.targetY = ny * 30;
      mouse.worldX = nx * (CONFIG.gridWidth * 0.4);
      mouse.worldZ = -ny * (CONFIG.gridDepth * 0.4);
    }
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  function onVisibilityChange() {
    isVisible = !document.hidden;
  }

  function animate(timestamp) {
    requestAnimationFrame(animate);

    if (!isVisible || !geometry) return;

    // Smooth cursor interpolation (lerp)
    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;

    // Subtle camera parallax tilt
    camera.position.x = mouse.x;
    camera.position.y = CONFIG.cameraHeight + mouse.y * 0.5;
    camera.lookAt(0, 0, -250);

    const pos = geometry.attributes.position.array;
    const count = pos.length / 3;
    const t = timestamp * CONFIG.waveSpeed;

    // Update vertex wave height
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const x = originalPositions[i3];
      const z = originalPositions[i3 + 2];

      // Dual harmonic sine wave equation for cyber terrain flow
      const wave1 = Math.sin(x * 0.007 + t) * Math.cos(z * 0.007 + t * 0.8) * CONFIG.waveHeight;
      const wave2 = Math.sin((x + z) * 0.004 + t * 1.2) * 14;

      // Distance from mouse projection for interactive cursor ripple
      const dx = x - mouse.worldX;
      const dz = z - mouse.worldZ;
      const dist = Math.sqrt(dx * dx + dz * dz);
      let mouseRipple = 0;

      if (dist < CONFIG.mouseWaveRadius) {
        const factor = 1 - dist / CONFIG.mouseWaveRadius;
        mouseRipple = Math.sin(dist * 0.05 - t * 3) * (factor * 35);
      }

      // Update Y (height)
      pos[i3 + 1] = wave1 + wave2 + mouseRipple;
    }

    geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

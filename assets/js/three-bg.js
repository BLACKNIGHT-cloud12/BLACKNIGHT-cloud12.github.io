/**
 * Three.js 3D Interactive Background
 * Features:
 * - Particle network constellation + floating wireframe geometry
 * - Smooth camera parallax following cursor / touch
 * - Theme-reactive colors (Dark mode neon vs Light mode slate/blue)
 * - Battery-friendly visibility and performance throttling
 */

(function () {
  'use strict';

  const canvas = document.getElementById('three-bg-canvas');
  if (!canvas) return;

  // Configuration settings
  const CONFIG = {
    particleCount: window.innerWidth < 768 ? 70 : 130,
    maxDistance: 130,
    mouseSensitivity: 0.0006,
    cameraZ: 700,
    rotationSpeed: 0.0008,
  };

  // State
  let scene, camera, renderer;
  let particlesGeometry, particlesMesh;
  let linesMesh, linesGeometry;
  let floatingShapes = [];
  let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  let windowHalfX = window.innerWidth / 2;
  let windowHalfY = window.innerHeight / 2;
  let isVisible = true;
  let isDarkMode = document.documentElement.classList.contains('dark') || !('theme' in localStorage);

  // Color palettes
  const THEMES = {
    dark: {
      particleColor: 0x6366f1, // Indigo-500
      particleSecondary: 0x38bdf8, // Sky-400
      lineColor: 0x818cf8, // Indigo-400
      lineOpacity: 0.18,
      shapeColor: 0x4f46e5,
      shapeOpacity: 0.12,
      fogColor: 0x090d16
    },
    light: {
      particleColor: 0x4f46e5, // Indigo-600
      particleSecondary: 0x0284c7, // Sky-600
      lineColor: 0x6366f1,
      lineOpacity: 0.12,
      shapeColor: 0x6366f1,
      shapeOpacity: 0.08,
      fogColor: 0xf8fafc
    }
  };

  function getCurrentTheme() {
    return document.documentElement.classList.contains('dark') ? THEMES.dark : THEMES.light;
  }

  function init() {
    // 1. Scene & Camera
    scene = new THREE.Scene();
    const currentTheme = getCurrentTheme();
    scene.fog = new THREE.FogExp2(currentTheme.fogColor, 0.0009);

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.z = CONFIG.cameraZ;

    // 2. Renderer
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 3. Create Particles
    createParticles();

    // 4. Create Floating Wireframe Polyhedra
    createFloatingGeometry();

    // 5. Event Listeners
    window.addEventListener('resize', onWindowResize, { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange);

    // Watch for theme changes (dark/light toggle)
    const observer = new MutationObserver(onThemeChange);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    // 6. Start Loop
    animate();
  }

  // Particle positions and velocity data
  let positions, velocities, particleData = [];

  function createParticles() {
    const count = CONFIG.particleCount;
    positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const theme = getCurrentTheme();

    const color1 = new THREE.Color(theme.particleColor);
    const color2 = new THREE.Color(theme.particleSecondary);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Spread in 3D volume
      positions[i3] = (Math.random() - 0.5) * 1100;
      positions[i3 + 1] = (Math.random() - 0.5) * 900;
      positions[i3 + 2] = (Math.random() - 0.5) * 600;

      // Random velocities
      particleData.push({
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.7,
          (Math.random() - 0.5) * 0.7,
          (Math.random() - 0.5) * 0.7
        ),
        numConnections: 0
      });

      // Subtle gradient color per particle
      const mixedColor = color1.clone().lerp(color2, Math.random());
      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    }

    particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Create glowing circle particle texture programmatically
    const particleTexture = createCircleTexture();

    const particlesMaterial = new THREE.PointsMaterial({
      size: window.innerWidth < 768 ? 6 : 8,
      map: particleTexture,
      transparent: true,
      opacity: 0.85,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Dynamic Connecting Lines
    const maxLines = (count * (count - 1)) / 2;
    const linePositions = new Float32Array(maxLines * 6);
    const lineColors = new Float32Array(maxLines * 6);

    linesGeometry = new THREE.BufferGeometry();
    linesGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage));
    linesGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3).setUsage(THREE.DynamicDrawUsage));

    const linesMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: theme.lineOpacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    linesMesh = new THREE.LineSegments(linesGeometry, linesMaterial);
    scene.add(linesMesh);
  }

  function createCircleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.3, 'rgba(200, 225, 255, 0.8)');
    gradient.addColorStop(0.7, 'rgba(100, 150, 255, 0.2)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);

    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  function createFloatingGeometry() {
    const theme = getCurrentTheme();
    const shapes = [
      new THREE.IcosahedronGeometry(75, 1),
      new THREE.OctahedronGeometry(60, 0),
      new THREE.TorusGeometry(55, 15, 12, 36)
    ];

    const positionsArr = [
      { x: -320, y: 160, z: -180 },
      { x: 340, y: -120, z: -200 },
      { x: 280, y: 220, z: -260 }
    ];

    shapes.forEach((geom, idx) => {
      const wireframeGeom = new THREE.WireframeGeometry(geom);
      const wireframeMaterial = new THREE.LineBasicMaterial({
        color: theme.shapeColor,
        transparent: true,
        opacity: theme.shapeOpacity,
        blending: THREE.AdditiveBlending
      });

      const shapeMesh = new THREE.LineSegments(wireframeGeom, wireframeMaterial);
      const pos = positionsArr[idx % positionsArr.length];
      shapeMesh.position.set(pos.x, pos.y, pos.z);
      shapeMesh.userData = {
        rotX: (Math.random() - 0.5) * 0.008,
        rotY: (Math.random() - 0.5) * 0.008,
        floatSpeed: 0.001 + Math.random() * 0.001,
        initialY: pos.y
      };

      scene.add(shapeMesh);
      floatingShapes.push(shapeMesh);
    });
  }

  function onThemeChange() {
    const theme = getCurrentTheme();
    if (scene && scene.fog) {
      scene.fog.color.setHex(theme.fogColor);
    }
    if (linesMesh && linesMesh.material) {
      linesMesh.material.opacity = theme.lineOpacity;
    }
    floatingShapes.forEach(shape => {
      if (shape.material) {
        shape.material.color.setHex(theme.shapeColor);
        shape.material.opacity = theme.shapeOpacity;
      }
    });
  }

  function onMouseMove(event) {
    mouse.targetX = (event.clientX - windowHalfX) * CONFIG.mouseSensitivity;
    mouse.targetY = (event.clientY - windowHalfY) * CONFIG.mouseSensitivity;
  }

  function onTouchMove(event) {
    if (event.touches.length > 0) {
      mouse.targetX = (event.touches[0].clientX - windowHalfX) * CONFIG.mouseSensitivity * 0.7;
      mouse.targetY = (event.touches[0].clientY - windowHalfY) * CONFIG.mouseSensitivity * 0.7;
    }
  }

  function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  function onVisibilityChange() {
    isVisible = !document.hidden;
  }

  function animate(time) {
    requestAnimationFrame(animate);

    if (!isVisible) return;

    // Smooth cursor interpolation (lerp)
    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;

    // Gentle camera orbit based on mouse
    camera.position.x += (mouse.x * 250 - camera.position.x) * 0.04;
    camera.position.y += (-mouse.y * 200 - camera.position.y) * 0.04;
    camera.lookAt(scene.position);

    // Slowly rotate scene
    scene.rotation.y += CONFIG.rotationSpeed * 0.5;

    // Animate floating geometric wireframes
    const timeSec = time * 0.001;
    floatingShapes.forEach((shape) => {
      shape.rotation.x += shape.userData.rotX;
      shape.rotation.y += shape.userData.rotY;
      shape.position.y = shape.userData.initialY + Math.sin(timeSec * 1.5 + shape.position.x) * 20;
    });

    // Update particle positions and connection lines
    let vertexPosIndex = 0;
    let colorPosIndex = 0;
    let numConnectedLines = 0;

    const count = CONFIG.particleCount;
    const posAttr = particlesGeometry.attributes.position.array;
    const linePosAttr = linesGeometry.attributes.position.array;
    const lineColAttr = linesGeometry.attributes.color.array;

    const theme = getCurrentTheme();
    const lColor = new THREE.Color(theme.lineColor);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      particleData[i].numConnections = 0;

      // Update positions
      posAttr[i3] += particleData[i].velocity.x;
      posAttr[i3 + 1] += particleData[i].velocity.y;
      posAttr[i3 + 2] += particleData[i].velocity.z;

      // Boundaries bounce
      if (posAttr[i3] < -550 || posAttr[i3] > 550) particleData[i].velocity.x = -particleData[i].velocity.x;
      if (posAttr[i3 + 1] < -450 || posAttr[i3 + 1] > 450) particleData[i].velocity.y = -particleData[i].velocity.y;
      if (posAttr[i3 + 2] < -350 || posAttr[i3 + 2] > 350) particleData[i].velocity.z = -particleData[i].velocity.z;

      // Check distance with subsequent particles for line connections
      for (let j = i + 1; j < count; j++) {
        const j3 = j * 3;
        const dx = posAttr[i3] - posAttr[j3];
        const dy = posAttr[i3 + 1] - posAttr[j3 + 1];
        const dz = posAttr[i3 + 2] - posAttr[j3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < CONFIG.maxDistance) {
          particleData[i].numConnections++;
          particleData[j].numConnections++;

          const alpha = (1.0 - dist / CONFIG.maxDistance);

          linePosAttr[vertexPosIndex++] = posAttr[i3];
          linePosAttr[vertexPosIndex++] = posAttr[i3 + 1];
          linePosAttr[vertexPosIndex++] = posAttr[i3 + 2];

          linePosAttr[vertexPosIndex++] = posAttr[j3];
          linePosAttr[vertexPosIndex++] = posAttr[j3 + 1];
          linePosAttr[vertexPosIndex++] = posAttr[j3 + 2];

          lineColAttr[colorPosIndex++] = lColor.r * alpha;
          lineColAttr[colorPosIndex++] = lColor.g * alpha;
          lineColAttr[colorPosIndex++] = lColor.b * alpha;

          lineColAttr[colorPosIndex++] = lColor.r * alpha;
          lineColAttr[colorPosIndex++] = lColor.g * alpha;
          lineColAttr[colorPosIndex++] = lColor.b * alpha;

          numConnectedLines++;
        }
      }
    }

    linesGeometry.setDrawRange(0, numConnectedLines * 2);
    linesGeometry.attributes.position.needsUpdate = true;
    linesGeometry.attributes.color.needsUpdate = true;
    particlesGeometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
  }

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

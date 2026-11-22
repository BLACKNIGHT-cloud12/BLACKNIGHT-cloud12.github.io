# Building High-Performance 3D Web Experiences with Three.js

Interactive 3D visuals can turn an ordinary portfolio or web application into an unforgettable experience. However, bringing WebGL into production requires balancing visual flair with real-world performance constraints like mobile thermal throttling, frame rate drops, and battery drain.

In this article, we'll examine core techniques for achieving smooth 60fps Three.js scenes that look incredible without melting your user's GPU.

---

## 1. Optimize Geometry and Draw Calls

The single most common performance bottleneck in WebGL is too many **draw calls**. Every individual mesh rendered in Three.js incurs CPU overhead communicating with the GPU.

### BufferGeometry & Dynamic Usage
Always use `THREE.BufferGeometry` over legacy geometry representations. When creating custom particle point clouds or dynamic connection lines, allocate a typed array once and use `setUsage(THREE.DynamicDrawUsage)`:

```javascript
const count = 150;
const positions = new Float32Array(count * 3);

// Allocate buffer geometry
const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage));

// Update in your animation loop efficiently
positions[0] = x;
positions[1] = y;
positions[2] = z;
geometry.attributes.position.needsUpdate = true;
```

> **Pro Tip:** Never recreate geometries or materials inside your `requestAnimationFrame` loop. Allocate buffers up front and mutate existing typed arrays.

---

## 2. Smart Pixel Ratio Clamping

Modern smartphones and 4K displays often feature Device Pixel Ratios (DPR) of 3x or even 4x. Rendering a full-screen WebGL canvas at 4x resolution multiplies pixel shading work by **16x**!

```javascript
// Cap pixel ratio at 2.0 to preserve battery and maintain 60 FPS
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));
```

This simple line cuts unnecessary GPU fill-rate load drastically with virtually zero noticeable loss in visual crispness.

---

## 3. Battery-Friendly Visibility Throttling

When users switch browser tabs or scroll away from the 3D viewport, pausing rendering saves immense device resources:

```javascript
let isVisible = true;

document.addEventListener('visibilitychange', () => {
  isVisible = !document.hidden;
});

function animate(time) {
  requestAnimationFrame(animate);
  if (!isVisible) return; // Skip rendering when tab is hidden

  renderer.render(scene, camera);
}
```

---

## 4. Lighting & Shaders

Complex dynamic point lights with real-time shadow casting are expensive. For subtle ambient background scenes:
- Use `FogExp2` to add natural depth falloff.
- Prefer unlit vertex-colored materials like `THREE.PointsMaterial` and `THREE.LineBasicMaterial` with additive blending.
- Add camera parallax interpolated via **lerp** (`current += (target - current) * 0.05`) for fluid, organic cursor tracking.

## Conclusion

With careful memory allocation, capped pixel ratios, and tab visibility hooks, you can create immersive 3D graphics that run flawlessly across both low-end mobile phones and high-refresh desktop monitors.

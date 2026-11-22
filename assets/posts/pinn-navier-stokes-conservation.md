# Physics-Informed Deep Learning: Embedding Navier-Stokes Invariance into Neural Loss

Standard deep neural networks are unconstrained function approximators. In high-dimensional regression tasks, if you feed a model sparse flow-field measurements, it will happily fit a curve that violates the most fundamental principles of physics: mass will disappear, momentum will be generated out of nowhere, and energy conservation will be ignored.

**Physics-Informed Neural Networks (PINNs)** resolve this by embedding partial differential equations (PDEs) directly into the computational graph via automatic differentiation.

---

## 1. The Incompressible Navier-Stokes Equations

For an incompressible Newtonian fluid with constant kinematic viscosity $\nu$, the governing conservation equations are:

### Continuity (Conservation of Mass)
$$\nabla \cdot \mathbf{u} = \frac{\partial u}{\partial x} + \frac{\partial v}{\partial y} = 0$$

### Momentum Conservation (Navier-Stokes)
$$\frac{\partial u}{\partial t} + u \frac{\partial u}{\partial x} + v \frac{\partial u}{\partial y} = -\frac{1}{\rho}\frac{\partial p}{\partial x} + \nu \nabla^2 u$$

$$\frac{\partial v}{\partial t} + u \frac{\partial v}{\partial x} + v \frac{\partial v}{\partial y} = -\frac{1}{\rho}\frac{\partial p}{\partial y} + \nu \nabla^2 v$$

Where:
- $\mathbf{u} = (u, v)$ is the velocity vector field
- $p$ is the scalar pressure field
- $\nu$ is kinematic viscosity and $\rho$ is density

---

## 2. Formulating the Physics Loss Residuals

Rather than learning from labeled $(u, v, p)$ data points alone, we evaluate the PDE residuals at thousands of interior **collocation points** across the computational domain:

```python
import torch

def compute_navier_stokes_residuals(model, x, y, t, nu=0.01, rho=1.0):
    # Enable gradient tracking for inputs
    x.requires_grad_(True)
    y.requires_grad_(True)
    t.requires_grad_(True)
    
    # Forward pass through neural network: (x, y, t) -> (u, v, p)
    outputs = model(torch.cat([x, y, t], dim=1))
    u = outputs[:, 0:1]
    v = outputs[:, 1:2]
    p = outputs[:, 2:3]
    
    # First derivatives via reverse-mode automatic differentiation
    u_x = torch.autograd.grad(u, x, torch.ones_like(u), create_graph=True)[0]
    u_y = torch.autograd.grad(u, y, torch.ones_like(u), create_graph=True)[0]
    u_t = torch.autograd.grad(u, t, torch.ones_like(u), create_graph=True)[0]
    
    v_x = torch.autograd.grad(v, x, torch.ones_like(v), create_graph=True)[0]
    v_y = torch.autograd.grad(v, y, torch.ones_like(v), create_graph=True)[0]
    v_t = torch.autograd.grad(v, t, torch.ones_like(v), create_graph=True)[0]
    
    p_x = torch.autograd.grad(p, x, torch.ones_like(p), create_graph=True)[0]
    p_y = torch.autograd.grad(p, y, torch.ones_like(p), create_graph=True)[0]
    
    # Second derivatives (Laplacian terms)
    u_xx = torch.autograd.grad(u_x, x, torch.ones_like(u_x), create_graph=True)[0]
    u_yy = torch.autograd.grad(u_y, y, torch.ones_like(u_y), create_graph=True)[0]
    v_xx = torch.autograd.grad(v_x, x, torch.ones_like(v_x), create_graph=True)[0]
    v_yy = torch.autograd.grad(v_y, y, torch.ones_like(v_y), create_graph=True)[0]
    
    # Differential PDE Residuals
    f_continuity = u_x + v_y
    f_momentum_u = u_t + (u * u_x + v * u_y) + (1.0 / rho) * p_x - nu * (u_xx + u_yy)
    f_momentum_v = v_t + (u * v_x + v * v_y) + (1.0 / rho) * p_y - nu * (v_xx + v_yy)
    
    return f_continuity, f_momentum_u, f_momentum_v
```

---

## 3. Total Loss Objective

The global optimization objective combines boundary conditions ($\mathcal{L}_{\text{BC}}$), initial conditions ($\mathcal{L}_{\text{IC}}$), and the physics residual loss ($\mathcal{L}_{\text{PDE}}$):

$$\mathcal{L}_{\text{total}} = \lambda_{\text{data}} \mathcal{L}_{\text{data}} + \lambda_{\text{BC}} \mathcal{L}_{\text{BC}} + \lambda_{\text{PDE}} \left( \|f_{\text{cont}}\|^2 + \|f_{\text{mom}, u}\|^2 + \|f_{\text{mom}, v}\|^2 \right)$$

By penalizing PDE violations across collocation points, the model acts as a continuous, meshless surrogate that enforces exact physical laws even in regions where zero experimental measurement data exists.

---

## Key Takeaways

1. **Meshless Solvers**: No requirement to build complex tetrahedral or hexahedral meshes for geometry exploration.
2. **Inverse Problem Solving**: Unknown parameters (e.g., Reynolds number or viscosity $\nu$) can be treated as learnable parameters and inferred directly from sparse sensor probes.
3. **Overcoming Spectral Bias**: Neural Tangent Kernel (NTK) analysis reveals PINNs can suffer from spectral bias on high-frequency boundary layers; multi-scale Fourier feature embeddings or adaptive loss weighting are essential for sharp gradient convergence.

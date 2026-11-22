/**
 * Portfolio & Blog Configuration
 * Tailored for Soumik Ghosh (BLACKNIGHT-cloud12)
 * Scientific Machine Learning (SciML) · Computational Fluid Dynamics · Quant
 */
window.SITE_CONFIG = {
  profile: {
    name: "Soumik Ghosh",
    title: "Scientific Machine Learning (SciML) & Computational Engineering",
    statusBadge: "Where Navier-Stokes Meets Deep Learning",
    location: "Kolkata, India",
    avatar: "https://avatars.githubusercontent.com/u/238549548?v=4",
    shortBio: "Building machine learning architectures that respect physical conservation laws. Specializing in physics-informed neural operators (PINO, FNO), data-driven turbulence closures (TBNN + OpenFOAM), and quantitative modeling.",
    about: `
      I am a Scientific Machine Learning (SciML) and Computational Engineering practitioner working at the intersection of fluid dynamics, physics-informed deep learning, and quantitative modeling.
      My work focuses on building architectures that do not treat physical systems as black-box interpolators, but instead respect the underlying conservation laws (Navier-Stokes mass, momentum, and energy conservation, frame indifference, and thermodynamics).
    `,
    socials: {
      github: "https://github.com/BLACKNIGHT-cloud12",
      linkedin: "https://www.linkedin.com/in/soumik-ghosh-434164377",
      email: "mailto:soumikghosh30.03.07@gmail.com",
      twitter: ""
    },
    resumeUrl: "https://www.linkedin.com/in/soumik-ghosh-434164377"
  },

  skills: [
    {
      category: "SciML & Deep Learning",
      items: [
        { name: "PyTorch", level: "Expert" },
        { name: "PINNs & DeepONet", level: "Expert" },
        { name: "Neural Operators (FNO, PINO)", level: "Advanced" },
        { name: "JAX & Automatic Diff", level: "Advanced" },
        { name: "LibTorch C++", level: "Advanced" },
        { name: "SciPy / NumPy", level: "Expert" }
      ]
    },
    {
      category: "CFD & Computational Fluid Dynamics",
      items: [
        { name: "OpenFOAM (v2606)", level: "Advanced" },
        { name: "Turbulence Modeling (k-ω SST, RANS)", level: "Advanced" },
        { name: "TBNN (Reynolds Stress Anisotropy)", level: "Advanced" },
        { name: "ParaView", level: "Advanced" },
        { name: "Aero-Structural Wingbox Analysis", level: "Advanced" }
      ]
    },
    {
      category: "Systems, 3D & Production",
      items: [
        { name: "C++ / Python", level: "Expert" },
        { name: "Linux / WSL2 / Bash", level: "Expert" },
        { name: "Three.js / WebGL", level: "Advanced" },
        { name: "FastAPI / Next.js", level: "Advanced" },
        { name: "Docker", level: "Intermediate" },
        { name: "Git & GitHub Actions", level: "Expert" }
      ]
    }
  ],

  projects: [
    {
      id: "project-1",
      title: "NeuroFoil-Core: Industrial SciML Aerodynamic Platform",
      description: "End-to-end automated OpenFOAM-to-SciML surrogate platform predicting aerodynamic forces (CL, CD, Cm) and continuous 161-point pressure fields Cp(x) with sub-millisecond latency (R² = 0.992), coupled with wingbox structural sizing and Mahalanobis epistemic uncertainty quantification.",
      tags: ["Python", "C++", "OpenFOAM", "PyTorch", "MDAO", "SciPy"],
      github: "https://github.com/BLACKNIGHT-cloud12/NeuroFoil-Core",
      demo: "https://github.com/BLACKNIGHT-cloud12/NeuroFoil-Core",
      featured: true,
      badge: "Flagship SciML"
    },
    {
      id: "project-2",
      title: "tbnnFoam: Data-Driven Turbulence Closures in OpenFOAM",
      description: "Galilean-invariant Tensor Basis Neural Networks for RANS Reynolds stress anisotropy closures. Enforces material frame indifference under spatial rotations, integrated directly into OpenFOAM C++ solver loops via LibTorch runtime bindings.",
      tags: ["C++", "OpenFOAM", "LibTorch", "Tensor Algebra", "Turbulence"],
      github: "https://github.com/BLACKNIGHT-cloud12/tbnnFoam",
      demo: "https://github.com/BLACKNIGHT-cloud12/tbnnFoam",
      featured: true,
      badge: "OpenFOAM & C++"
    },
    {
      id: "project-3",
      title: "TO-PINN-Aerodynamics: Unsupervised Topology Optimization",
      description: "Aerodynamic shape and topology optimization directly governed by Navier-Stokes PDE loss constraints without relying on costly discrete adjoint CFD solvers. Embeds SIMP density penalties within PINN loss formulations.",
      tags: ["Python", "PyTorch", "PINNs", "Navier-Stokes", "AutoDiff"],
      github: "https://github.com/BLACKNIGHT-cloud12/TO-PINN-Aerodynamics",
      demo: "https://github.com/BLACKNIGHT-cloud12/TO-PINN-Aerodynamics",
      featured: true,
      badge: "Research"
    },
    {
      id: "project-4",
      title: "real-estate-lob-ssm: Deep State Space Models",
      description: "Deep State Space Model (SSM) for Real Estate Limit Order Book (LOB) counterfactual simulations with a nested Next.js frontend for quantitative market microstructure modeling.",
      tags: ["TypeScript", "Python", "State Space Models", "Next.js", "Quant"],
      github: "https://github.com/BLACKNIGHT-cloud12/real-estate-lob-ssm",
      demo: "https://github.com/BLACKNIGHT-cloud12/real-estate-lob-ssm",
      featured: false
    },
    {
      id: "project-5",
      title: "3D Web & Interactive Graphics Agent Skills",
      description: "A suite of production agent skills for modern creative web development: 3d-hero-interactions (pointer parallax, magnetic buttons), 3d-physics-simulations (Rapier, GPU particles), and AI website design tokens.",
      tags: ["Three.js", "WebGL", "GLSL", "Physics", "Design Systems"],
      github: "https://github.com/BLACKNIGHT-cloud12/3d-hero-interactions",
      demo: "https://github.com/BLACKNIGHT-cloud12/ai-website-aesthetics",
      featured: false,
      badge: "Creative Tech"
    }
  ],

  experience: [
    {
      role: "Scientific Machine Learning & CFD Researcher",
      company: "Independent Research & Open-Source",
      period: "2024 - Present",
      description: "Developing neural turbulence closures (TBNN), sub-millisecond aerodynamic surrogates with epistemic uncertainty guardrails, and physics-informed neural operators."
    },
    {
      role: "Computational Engineering Practitioner",
      company: "Aerodynamics & SciML Projects",
      period: "2023 - 2024",
      description: "Automated end-to-end OpenFOAM C-grid simulation pipelines, integrated LibTorch runtime bindings into C++ CFD solvers, and researched spectral bias control via NTK."
    }
  ],

  posts: [
    {
      slug: "pinn-navier-stokes-conservation",
      title: "Physics-Informed Deep Learning: Embedding Navier-Stokes Invariance into Neural Loss",
      date: "Nov 20, 2026",
      readingTime: "7 min read",
      tags: ["SciML", "PINNs", "Navier-Stokes", "PyTorch"],
      excerpt: "Why unconstrained neural networks fail on fluid dynamics, and how formulating conservation of mass, momentum, and energy directly inside loss functions eliminates hallucinated physics.",
      file: "assets/posts/pinn-navier-stokes-conservation.md"
    },
    {
      slug: "tbnn-openfoam-turbulence",
      title: "Data-Driven Turbulence Closures: Coupling Tensor Basis Neural Networks with OpenFOAM",
      date: "Nov 12, 2026",
      readingTime: "8 min read",
      tags: ["OpenFOAM", "Turbulence", "LibTorch", "C++"],
      excerpt: "Overcoming linear eddy-viscosity Boussinesq limits under strong adverse pressure gradients with Pope's tensor basis representation and C++ LibTorch solver loops.",
      file: "assets/posts/tbnn-openfoam-turbulence.md"
    },
    {
      slug: "fourier-neural-operators",
      title: "Learning Infinite-Dimensional Operators: From CNNs to Fourier Neural Operators (FNO)",
      date: "Nov 04, 2026",
      readingTime: "6 min read",
      tags: ["Neural Operators", "FNO", "SciML", "DeepONet"],
      excerpt: "Mesh-independent parameterization of integral kernels directly in the Fourier domain to solve parametric PDEs at orders of magnitude faster than conventional CFD.",
      file: "assets/posts/fourier-neural-operators.md"
    }
  ]
};

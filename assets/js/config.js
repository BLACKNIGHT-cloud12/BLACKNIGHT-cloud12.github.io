/**
 * Portfolio & Blog Configuration
 * Soumik Ghosh (BLACKNIGHT-cloud12)
 * Jadavpur University · Scientific Machine Learning (SciML) · CFD
 */
window.SITE_CONFIG = {
  profile: {
    name: "Soumik Ghosh",
    title: "Scientific Machine Learning (SciML) & Computational Engineering",
    affiliation: "Jadavpur University, Kolkata",
    statusBadge: "Where Navier-Stokes Meets Deep Learning",
    location: "Kolkata, India",
    avatar: "https://avatars.githubusercontent.com/u/238549548?v=4",
    shortBio: "Undergraduate researcher at Jadavpur University building machine learning architectures that respect physical conservation laws. Specializing in physics-informed neural operators (PINO, FNO), aerodynamic topology optimization (TO-PINN), and sub-millisecond SciML surrogates (NeuroFoil).",
    about: `
      I am a Scientific Machine Learning (SciML) and Computational Engineering practitioner at Jadavpur University working at the intersection of fluid dynamics, physics-informed deep learning, and quantitative modeling.
      My work focuses on building architectures that do not treat physical systems as black-box interpolators, but instead respect the underlying conservation laws (Navier-Stokes mass, momentum, and energy conservation, frame indifference, and thermodynamics).
    `,
    emails: {
      personal: "soumikghosh30.03.07@gmail.com",
      college: "soumikg.civil.ug@jadavpuruniversity.in"
    },
    socials: {
      github: "https://github.com/BLACKNIGHT-cloud12",
      linkedin: "https://www.linkedin.com/in/soumik-ghosh-434164377",
      email: "mailto:soumikghosh30.03.07@gmail.com",
      collegeEmail: "mailto:soumikg.civil.ug@jadavpuruniversity.in"
    },
    resumeUrl: "https://www.linkedin.com/in/soumik-ghosh-434164377"
  },

  // Focused exclusively on Flagship SciML Projects
  projects: [
    {
      id: "project-neurofoil",
      title: "NeuroFoil: Industrial SciML Aerodynamic Platform",
      description: "End-to-end automated OpenFOAM-to-SciML surrogate and design platform trained on a 504-point CFD grid across 21 NACA airfoils. Predicts aerodynamic lift (CL), drag (CD), moment (Cm), and continuous 161-point surface pressure fields Cp(x) with sub-millisecond latency (unseen airfoil R² = 0.966). Features coupled aero-structural wingbox mechanics (spar web sizing, fuel volume, inertia Ixx), Mahalanobis epistemic uncertainty quantification with 95% conformal prediction bands, and an MDAO SLSQP optimizer for CFD-validated constrained inverse design.",
      tags: ["Python", "C++", "OpenFOAM v2606", "PyTorch", "MDAO SLSQP", "Uncertainty Quantification", "SciPy"],
      github: "https://github.com/BLACKNIGHT-cloud12/NeuroFoil-Core",
      demo: "https://github.com/BLACKNIGHT-cloud12/NeuroFoil-Core",
      featured: true,
      badge: "Flagship SciML Platform"
    },
    {
      id: "project-to-pinn",
      title: "TO-PINN: Unsupervised Aerodynamic Topology Optimization",
      description: "An autonomous aerodynamic architect governed strictly by Navier-Stokes PDE residuals without relying on costly pre-computed CFD datasets or discrete adjoint solvers. Uses continuous Brinkman Penalization and a novel Two-Phase Training Architecture (warmup phase locking fluid physics, followed by an unconstrained sculpting phase under a 20% volume constraint) to carve out optimal aerodynamic teardrop profiles and prevent trivial collapse.",
      tags: ["Python", "PyTorch", "PINNs", "Navier-Stokes", "2nd-Order Autograd", "Brinkman Penalization", "Topology Optimization"],
      github: "https://github.com/BLACKNIGHT-cloud12/TO-PINN-Aerodynamics",
      demo: "https://github.com/BLACKNIGHT-cloud12/TO-PINN-Aerodynamics",
      featured: true,
      badge: "Unsupervised PINN Research"
    }
  ],

  experience: [
    {
      role: "Scientific Machine Learning & CFD Researcher",
      company: "Jadavpur University & Open-Source Research",
      period: "2024 - Present",
      description: "Developing unsupervised topology optimization architectures (TO-PINN), sub-millisecond aerodynamic surrogates with epistemic uncertainty guardrails (NeuroFoil), and physics-informed neural operators."
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

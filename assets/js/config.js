/**
 * Portfolio & Blog Configuration
 * Soumik Ghosh (BLACKNIGHT-cloud12)
 * Jadavpur University · Machine Learning & Deep Learning Systems
 */
window.SITE_CONFIG = {
  profile: {
    name: "Soumik Ghosh",
    title: "Machine Learning Engineer & Deep Learning Researcher",
    affiliation: "Jadavpur University, Kolkata",
    statusBadge: "Training Neural Architectures & Scalable ML Systems",
    location: "Kolkata, India",
    avatar: "https://avatars.githubusercontent.com/u/238549548?v=4",
    shortBio: "Undergraduate researcher at Jadavpur University engineering deep neural network architectures, representation learning systems, continuous neural operators, and high-performance inference pipelines.",
    about: `
      I am a Machine Learning Engineer and Deep Learning Researcher at Jadavpur University specializing in neural network architectures, representation learning, continuous operators, and scalable deep learning systems.
      My work focuses on developing expressive model architectures, optimizing loss manifolds, and designing high-throughput inference engines that bridge theoretical mathematical foundations with production-grade computational performance.
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

  projects: [
    {
      id: "project-neurofoil",
      title: "NeuroFoil: Neural Operator & Accelerated Inference Platform",
      description: "High-throughput deep learning inference platform featuring continuous neural surrogates capable of sub-millisecond multi-field prediction (unseen test R² = 0.966). Integrates Mahalanobis epistemic uncertainty quantification with 95% conformal prediction intervals and constrained SLSQP latent optimization.",
      tags: ["PyTorch", "Deep Learning", "Neural Surrogates", "Uncertainty Quantification", "C++", "SLSQP Optimization"],
      github: "https://github.com/BLACKNIGHT-cloud12/NeuroFoil-Core",
      demo: "https://github.com/BLACKNIGHT-cloud12/NeuroFoil-Core",
      featured: true,
      badge: "High-Throughput ML Platform"
    },
    {
      id: "project-to-pinn",
      title: "TO-PINN: Continuous Representation Learning & Geometry Synthesis",
      description: "Autonomous neural field synthesis framework trained end-to-end via continuous PDE residual constraints without requiring pre-labeled offline datasets. Employs second-order automatic differentiation and two-phase curriculum learning to discover optimal manifold structures.",
      tags: ["PyTorch", "Neural Fields", "Curriculum Learning", "2nd-Order Autograd", "Representation Learning"],
      github: "https://github.com/BLACKNIGHT-cloud12/TO-PINN-Aerodynamics",
      demo: "https://github.com/BLACKNIGHT-cloud12/TO-PINN-Aerodynamics",
      featured: true,
      badge: "Unsupervised Neural Research"
    }
  ],

  experience: [
    {
      role: "Machine Learning & Deep Learning Researcher",
      company: "Jadavpur University & Open-Source Research",
      period: "2024 - Present",
      description: "Developing deep neural architectures, continuous operator models, and representation learning frameworks with scalable training loops and robust uncertainty metrics."
    },
    {
      role: "Machine Learning Systems Engineer",
      company: "Distributed ML & Systems Projects",
      period: "2023 - 2024",
      description: "Engineered custom C++ LibTorch inference bindings, accelerated neural network forward kernels, and optimized distributed training performance."
    }
  ],

  posts: [
    {
      slug: "pinn-navier-stokes-conservation",
      title: "Continuous Neural Architectures: Embedding Mathematical Invariants into Loss Manifolds",
      date: "Nov 20, 2026",
      readingTime: "7 min read",
      tags: ["Deep Learning", "Loss Manifolds", "PyTorch", "Neural Architectures"],
      excerpt: "Why standard unconstrained neural networks suffer from generalization collapse on complex continuous manifolds, and how structuring invariant constraints directly into optimization objectives guarantees stability.",
      file: "assets/posts/pinn-navier-stokes-conservation.md"
    },
    {
      slug: "tbnn-openfoam-turbulence",
      title: "High-Performance ML Inference: Coupling Tensor Neural Networks with C++ Runtimes",
      date: "Nov 12, 2026",
      readingTime: "8 min read",
      tags: ["C++", "LibTorch", "Inference Optimization", "Systems"],
      excerpt: "Building production-grade, zero-overhead neural network inference loops by integrating PyTorch LibTorch C++ runtimes into native compiled architectures.",
      file: "assets/posts/tbnn-openfoam-turbulence.md"
    },
    {
      slug: "fourier-neural-operators",
      title: "Learning Infinite-Dimensional Operators: From Convolutions to Fourier Neural Operators (FNO)",
      date: "Nov 04, 2026",
      readingTime: "6 min read",
      tags: ["Neural Operators", "FNO", "Deep Learning", "Representation Learning"],
      excerpt: "Parameterizing deep learning kernels directly in the Fourier domain to learn continuous operator mappings at orders of magnitude faster than conventional iterative solvers.",
      file: "assets/posts/fourier-neural-operators.md"
    }
  ]
};

/**
 * Portfolio & Blog Configuration
 * AI / ML Engineer & Deep Learning Researcher
 */
window.SITE_CONFIG = {
  profile: {
    name: "Soumik",
    title: "AI / ML Engineer & Deep Learning Researcher",
    statusBadge: "Training LLMs & Building AI Systems",
    location: "Global / Remote",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    shortBio: "Specializing in Large Language Models (LLMs), deep neural architectures, distributed model training, and high-throughput inference engines.",
    about: `
      I am an AI / ML engineer focused on the intersection of deep learning research and high-performance production systems.
      My work centers on scaling Large Language Models, optimizing inference latency with CUDA/TensorRT, fine-tuning foundation models with parameter-efficient methods (LoRA/QLoRA), and designing robust retrieval-augmented systems.
      I'm deeply interested in distributed systems, multimodal reasoning, and building developer tools for the next generation of intelligent software.
    `,
    socials: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
      email: "mailto:your-email@example.com"
    },
    resumeUrl: "#contact"
  },

  skills: [
    {
      category: "Deep Learning & LLMs",
      items: [
        { name: "PyTorch", level: "Expert" },
        { name: "Hugging Face", level: "Expert" },
        { name: "vLLM / TensorRT-LLM", level: "Advanced" },
        { name: "LoRA / QLoRA / PEFT", level: "Advanced" },
        { name: "LangChain / LlamaIndex", level: "Advanced" }
      ]
    },
    {
      category: "ML Systems & MLOps",
      items: [
        { name: "Distributed Training (FSDP / DeepSpeed)", level: "Advanced" },
        { name: "CUDA & Triton Kernels", level: "Intermediate" },
        { name: "Vector DBs (Qdrant, Milvus)", level: "Advanced" },
        { name: "Ray & MLflow", level: "Advanced" },
        { name: "Docker & Kubernetes", level: "Intermediate" }
      ]
    },
    {
      category: "Core Engineering & Backend",
      items: [
        { name: "Python / C++", level: "Expert" },
        { name: "FastAPI / gRPC", level: "Expert" },
        { name: "PostgreSQL & Redis", level: "Advanced" },
        { name: "Linux Systems & Git", level: "Expert" },
        { name: "Three.js / WebGL", level: "Advanced" }
      ]
    }
  ],

  projects: [
    {
      id: "project-1",
      title: "TurboDec - High-Throughput Speculative Decoding",
      description: "Low-latency inference engine combining draft model speculation with PagedAttention, achieving 2.8x faster token generation for 70B parameter models.",
      tags: ["PyTorch", "vLLM", "CUDA", "TensorRT", "FastAPI"],
      github: "https://github.com",
      demo: "https://github.com",
      featured: true,
      badge: "Featured AI Project"
    },
    {
      id: "project-2",
      title: "OmniRAG - Enterprise Multi-Modal Knowledge Engine",
      description: "Hybrid dense-sparse retrieval system indexing over 10M multimodal documents with automated cross-encoder re-ranking and sub-50ms query latency.",
      tags: ["Qdrant", "Transformers", "Python", "Ray", "Docker"],
      github: "https://github.com",
      demo: "https://github.com",
      featured: true,
      badge: "LLM & Vector Search"
    },
    {
      id: "project-3",
      title: "QuantizeX - 4-Bit Activation & Weight Quantizer",
      description: "Automated post-training quantization pipeline supporting GPTQ and AWQ schemes with negligible perplexity loss across diverse LLM benchmarks.",
      tags: ["PyTorch", "Hugging Face", "CUDA", "Benchmarking"],
      github: "https://github.com",
      demo: "https://github.com",
      featured: true,
      badge: "Open Source"
    },
    {
      id: "project-4",
      title: "DeepFlow - Vision-Language Action Agent",
      description: "Embodied AI policy network mapping visual observations to robot manipulation trajectories using diffusion models and attention mechanisms.",
      tags: ["PyTorch", "Computer Vision", "Diffusion Models", "Robotics"],
      github: "https://github.com",
      demo: "https://github.com",
      featured: false
    }
  ],

  experience: [
    {
      role: "Senior Machine Learning Engineer",
      company: "Apex AI Labs",
      period: "2024 - Present",
      description: "Architected distributed model fine-tuning infrastructure using FSDP, reduced training iteration cycles by 40%, and deployed high-throughput vLLM clusters."
    },
    {
      role: "AI Research Engineer",
      company: "Cognitive Systems Research",
      period: "2022 - 2024",
      description: "Researched multi-modal embedding spaces, authored internal evaluation benchmarks, and scaled vector similarity search across multi-billion token corpora."
    },
    {
      role: "Machine Learning Intern",
      company: "NeuralTech Solutions",
      period: "2021 - 2022",
      description: "Trained transformer-based classification models and automated data ingestion and quality scoring pipelines using PyTorch and Ray."
    }
  ],

  // Registered blog posts
  posts: [
    {
      slug: "optimizing-llm-inference",
      title: "Optimizing LLM Inference: KV Cache Compression, PagedAttention, and vLLM",
      date: "Nov 21, 2026",
      readingTime: "6 min read",
      tags: ["LLMs", "vLLM", "CUDA", "Inference"],
      excerpt: "An in-depth breakdown of memory bottlenecks during LLM generation, how PagedAttention cures memory fragmentation, and key strategies for batch throughput.",
      file: "assets/posts/optimizing-llm-inference.md"
    },
    {
      slug: "distributed-training-pytorch",
      title: "Mastering Distributed Model Training in PyTorch: FSDP vs DeepSpeed",
      date: "Nov 14, 2026",
      readingTime: "8 min read",
      tags: ["PyTorch", "Distributed", "DeepSpeed", "FSDP"],
      excerpt: "A practical guide to sharding model parameters, gradients, and optimizer states across multi-node GPU clusters without out-of-memory bottlenecks.",
      file: "assets/posts/distributed-training-pytorch.md"
    },
    {
      slug: "building-production-rag",
      title: "Architecting Production-Grade RAG: Hybrid Search and Re-Ranking",
      date: "Nov 06, 2026",
      readingTime: "5 min read",
      tags: ["RAG", "Vector Search", "LLMs", "Architecture"],
      excerpt: "Moving beyond naive vector retrieval: implementing reciprocal rank fusion (RRF), cross-encoder re-ranking, and chunking strategies that prevent hallucination.",
      file: "assets/posts/building-production-rag.md"
    }
  ]
};

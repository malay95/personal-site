/* ==========================================================================
   SITE DATA - the only file you normally edit.
   Adding a project?  copy a block in SITE.projects.
   Adding a post?     drop posts/<slug>.md and add a block to SITE.posts (top = newest).
   Adding a tab?      add a line to SITE.nav and create the matching .html page.
   No build step, no dependencies. Save, commit, push.
   ========================================================================== */

window.SITE = {

  /* ---- tabs, rendered on every page ----------------------------------- */
  nav: [
    { label: "Home",     href: "index.html" },
    // Writing is built and ready. Uncomment this line the day posts/ holds a post
    // you actually wrote -- see the three drafts in posts/ waiting for content.
    // { label: "Writing",  href: "writing.html" },
    { label: "Projects", href: "projects.html" },
    { label: "About",    href: "about.html" },
    { label: "Now",      href: "now.html" },
  ],

  contact: [
    { label: "Email",    text: "malayshah781@gmail.com", href: "mailto:malayshah781@gmail.com" },
    { label: "GitHub",   text: "malay95",                href: "https://github.com/malay95" },
    { label: "LinkedIn", text: "msshah11",               href: "https://linkedin.com/in/msshah11" },
  ],

  /* ---- home hero. `lede` allows one <span class="mark"> highlight ------ */
  hero: {
    lede: 'I build the infrastructure that makes language models <span class="mark">useful in production</span> \u2014 agent frameworks, retrieval and grounding, and the layers that decide what actually ships.',
    sub: "Eight years across machine learning and platform engineering, the last five at BILL, where I went from ML engineer to staff engineer building AI systems for financial workflows. Evenings I am rebuilding inference from the bottom up on a 6 GB GPU, mostly to find out what I only thought I understood.",
  },

  /* ---- "Now" page + the ticker line on the home page ------------------- */
  now: [
    { label: "Building", text: "mini-inference-server \u2014 continuous batching milestone, chasing the p99 tail." },
    { label: "Reading", text: "Designing Data-Intensive Applications, again, slower this time." },
    { label: "Learning", text: "CUDA properly, rather than by copying kernels that already work." },
    { label: "Away from screens", text: "Getting the house ready for a very small new arrival." },
  ],

  metrics: [
    { big: "5\u00d7", note: "Document processing throughput, enterprise OCR system" },
    { big: "<5s", note: "End-to-end agent inference over structured + unstructured data" },
    { big: "25% \u2192 5%", note: "Processing timeouts after infra tuning and quantization" },
    { big: "Org-wide", note: "Adoption of the agent scaffolding and evaluation platform" },
  ],

  /* ---- writing index. Newest first; each slug needs posts/<slug>.md ---- */
  posts: [
    { slug: "paged-kv-cache-by-hand", title: "Writing a paged KV cache by hand", date: "Aug 2026", read: "12 min", kind: "deep dive",
      blurb: "What virtual memory taught me about attention caches, and the three bugs that only show up above concurrency four.",
      tags: ["llm inference", "cuda", "benchmarks"] },
    { slug: "benchmarks-you-can-trust", title: "Benchmarks you can actually trust", date: "Jul 2026", read: "7 min", kind: "notes",
      blurb: "Same prompts, same seed, same token budget. A short checklist I run before I let myself claim a speedup.",
      tags: ["benchmarks"] },
    { slug: "critic-loops", title: "Critic loops beat bigger models", date: "Jun 2026", read: "9 min", kind: "essay",
      blurb: "A cheap verifier that sends weak drafts back did more for grounding accuracy than any model upgrade I tried.",
      tags: ["agents", "evaluation"] },
    { slug: "six-gb-gpu", title: "Everything I learned from a 6 GB GPU", date: "May 2026", read: "6 min", kind: "notes",
      blurb: "Constraints as a teaching tool: quantization, batching, and the moment memory fragmentation stops being abstract.",
      tags: ["llm inference"] },
  ],

  roles: [
    { when: "2025 \u2014 now", title: "Staff Software Engineer", org: "\u00b7 BILL", body: "Agent frameworks, RAG and grounding systems, the evaluation platform, and the OCR extraction stack behind financial document workflows." },
    { when: "2023 \u2014 2024", title: "Senior Software Engineer", org: "\u00b7 BILL", body: "Document-processing latency and reliability, SageMaker serving with a custom feature store, and AI-driven spend and expense automation rolled out in phases." },
    { when: "2021 \u2014 2023", title: "Machine Learning Engineer", org: "\u00b7 BILL", body: "Python MLOps pipelines moving document-extraction models from research into high-availability production, plus automated feature engineering for financial datasets." },
    { when: "2018 \u2014 2021", title: "AI Solutions Architect", org: "\u00b7 CYR3CON", body: "Led a team building production CI/CD and AWS Batch pipelines for feature extraction and large-scale model training, and modeled vulnerability-exploitation patterns with NLP and entity recognition." },
    { when: "2013 \u2014 2019", title: "M.S. Computer Science", org: "\u00b7 Arizona State University", body: "B.E. Computer Science & Engineering, Nirma Institute of Technology, Ahmedabad." },
  ],

  langs: [
    { name: "Python", pct: 96, level: "primary" },
    { name: "SQL", pct: 82, level: "daily" },
    { name: "Bash", pct: 74, level: "daily" },
  ],

  stack: [
    { title: "LLM & agents", body: "LangChain, Google ADK, MCP, n8n, RAG, vector stores, grounding and hallucination mitigation, LLM-as-judge evaluation, multi-provider routing." },
    { title: "Inference & serving", body: "MLX, vLLM, SGLang, self-hosted open-weight models, paged KV cache, continuous batching, INT8/INT4 quantization." },
    { title: "ML & MLOps", body: "SageMaker, feature stores, MLflow, OCR and vision-language models, TensorFlow, Keras, CI/CD, Pytest, TDD." },
    { title: "Distributed & cloud", body: "AWS Batch, Step Functions, Fargate, ECS, Lambda, SQS, S3, Bedrock, CloudWatch; GCP with GKE and Vertex AI; Terraform, Docker; OpenSearch and Elasticsearch." },
    { title: "Data", body: "PostgreSQL, MySQL, MongoDB, Linux." },
  ],

  pubs: [
    { title: "Object Detection using Deep Neural Networks", meta: "IEEE Xplore, 2017 \u00b7 first author \u00b7 custom inception network, 10% top-5 error on ImageNet" },
    { title: "Finding Cryptocurrency Attack Indicators Using Temporal Logic and Dark Web Data", meta: "IEEE, 2018 \u00b7 co-author" },
    { title: "A Hybrid KRR-ML Approach to Predict Malicious Email Campaigns", meta: "ASONAM, 2019 \u00b7 co-author \u00b7 +14% recall over the ML-only baseline" },
  ],

  facts: [
    { label: "ROLE", text: "Staff Software Engineer, AI Platform & LLM Infrastructure at BILL" },
    { label: "BASED", text: "San Jose, California" },
    { label: "DEPTH", text: "Eight years across ML and platform engineering" },
    { label: "DEGREES", text: "M.S. Computer Science, Arizona State University" },
    { label: "REACH ME", text: "malayshah781@gmail.com" },
  ],

  /* ======================================================================
     PROJECTS - field reference is unchanged from v1:
       slug title org period status(active|shipped|research|archived)
       featured summary points[] result tags[] tech[] links[{label,href}]
     ====================================================================== */
  projects: [

    {
      slug: "mini-inference-server",
      title: "mini-inference-server",
      org: "Personal",
      period: "2026, ongoing",
      status: "active",
      featured: true,
      summary: "An LLM inference server written from scratch that reimplements the core ideas behind vLLM and TGI at small scale: an HTTP serving API, a paged KV cache, and continuous in-flight batching, benchmarked on a 6 GB consumer GPU with no tensor cores.",
      points: [
        "Paged KV cache: attention keys and values stored in fixed-size blocks like OS virtual memory pages, so many requests share GPU memory without fragmentation.",
        "Continuous batching: requests admitted and evicted at the token level rather than per batch, so the GPU never idles behind the slowest sequence.",
        "Every milestone is benchmarked against the same prompts, seed, and token budget, so each claimed speedup is measured rather than asserted.",
      ],
      result: "M0 sequential baseline measured: 21.4 tok/s at concurrency 1, 31.1 tok/s at concurrency 8 with p99 5.6x worse, isolating the serialization cliff that batching is meant to remove.",
      tags: ["llm inference", "distributed systems"],
      tech: ["Python", "PyTorch", "CUDA", "FastAPI", "paged KV cache", "continuous batching"],
      links: [],
    },

    {
      slug: "adk-research-assistant",
      title: "ADK Research Assistant",
      org: "Personal",
      period: "2026, ongoing",
      status: "active",
      featured: true,
      summary: "A multi-agent research assistant on Google's Agent Development Kit: a coordinator orchestrating a retriever, a synthesizer, and a critic that checks the draft for faithfulness and sends it back when the grounding is weak.",
      points: [
        "Vector search over a document corpus in Cloud Storage, with the critic loop as the quality gate rather than a single-shot generation.",
        "Two deployment targets on purpose: Vertex AI Agent Engine for the managed runtime, and GKE Autopilot with Workload Identity for the Kubernetes path.",
        "Terraform for infrastructure, Helm for the cluster workload, and an evaluation harness so agent changes are scored instead of eyeballed.",
      ],
      tags: ["agents", "rag", "evaluation", "distributed systems"],
      tech: ["Python", "Google ADK", "GCP", "GKE", "Vertex AI", "Terraform", "Helm"],
      links: [],
    },

    {
      slug: "babyhq",
      title: "BabyHQ",
      org: "Personal",
      period: "2026, ongoing",
      status: "active",
      featured: true,
      summary: "An AI-first tracker for guests, registry, budget, vendors, tasks, and appointments, designed from day one so agents do the heavy lifting: researching topics, drafting emails, validating calendar entries, and turning goals into tracked to-dos.",
      points: [
        "Hybrid split: a Next.js app owns the data and exposes CRUD, while Python ADK agents call that same API, so there is one database and no schema drift.",
        "Postgres-in-WASM (PGlite) through Drizzle ORM, persisted locally, which keeps the whole stack runnable without a database server.",
        "An MCP bridge exposes the tracker API to external assistants under a separately scoped key.",
      ],
      tags: ["agents"],
      tech: ["Next.js", "React", "TypeScript", "Python", "Google ADK", "MCP", "PGlite", "Drizzle"],
      links: [],
    },

    {
      slug: "home-photo-nas",
      title: "Home Photo NAS",
      org: "Personal",
      period: "2026, ongoing",
      status: "active",
      summary: "Self-hosted photo backup for two phones running Immich in Docker on WSL2, replacing a cloud photo subscription with storage that stays in the house.",
      points: [
        "Automated phone-to-server backup for both iOS and Android, with scripted health and disk-usage checks.",
        "Scheduled backup to a second drive, plus a documented path to remote access over Tailscale.",
      ],
      tags: ["self-hosted"],
      tech: ["Docker", "WSL2", "Immich", "PowerShell", "Linux"],
      links: [],
    },

    {
      slug: "agent-framework",
      title: "AI agent framework over structured and unstructured data",
      org: "BILL",
      period: "2025",
      status: "shipped",
      featured: true,
      summary: "An agent framework that synthesizes structured database records with unstructured document content through an OpenSearch vector store, then orchestrates multi-step LLM chains across providers for financial reasoning tasks.",
      points: [
        "Grounding and verification layers constrain every response to authoritative internal sources.",
        "Multi-step chains orchestrated with LangChain and n8n, scaled for sophisticated financial reasoning.",
      ],
      result: "sub-5s end-to-end inference; hallucinations eliminated on grounded paths",
      tags: ["agents", "rag"],
      tech: ["Python", "LangChain", "n8n", "OpenSearch", "AWS Bedrock"],
      links: [],
    },

    {
      slug: "agent-in-a-box",
      title: "Agent-in-a-Box: templatized agent scaffolding",
      org: "BILL",
      period: "2025",
      status: "shipped",
      featured: true,
      summary: "A framework that lets any engineering team bootstrap a new LLM agent with evaluation and observability already wired in, turning agent setup from a multi-week project into a template instantiation.",
      result: "weeks to minutes for a working, instrumented agent; became the default path for new agent development org-wide",
      tags: ["agents", "evaluation", "platform"],
      tech: ["Python", "LangChain", "observability tooling"],
      links: [],
    },

    {
      slug: "eval-platform",
      title: "Enterprise evaluation platform and grounding standards",
      org: "BILL",
      period: "2025",
      status: "shipped",
      featured: true,
      summary: "Led the design of the company's LLM evaluation platform and authored the technical standards teams benchmark against for retrieval performance and grounding accuracy, giving the organization one shared definition of whether a model change is an improvement.",
      result: "org-wide benchmarking standard for RAG and grounding",
      tags: ["evaluation", "rag", "platform"],
      tech: ["Python", "LLM-as-judge", "benchmark harnesses"],
      links: [],
    },

    {
      slug: "ocr-extraction",
      title: "Enterprise OCR extraction system",
      org: "BILL",
      period: "2024-2025",
      status: "shipped",
      summary: "A high-throughput document extraction system built to modern MLOps standards, with the reliability tail attacked directly through infrastructure tuning and model quantization.",
      points: [
        "SageMaker endpoints backed by a custom feature store enabling repeat-model predictions.",
      ],
      result: "5x throughput; timeouts 25% to 5%; +2% production model accuracy",
      tags: ["mlops", "distributed systems"],
      tech: ["Python", "SageMaker", "feature store", "AWS Batch", "Step Functions", "quantization"],
      links: [],
    },

    {
      slug: "mlx-local-serving",
      title: "Local LLM serving on MLX",
      org: "Personal",
      period: "2026",
      status: "research",
      summary: "Deployed Qwen 3.5 7B locally via MLX server to study serving mechanics hands-on, tuning the configuration for a measurable cost and evaluation lift over the vanilla model. Ongoing comparative work across MLX, vLLM, and SGLang.",
      result: "~15 bps cost and eval lift over baseline",
      tags: ["llm inference", "research"],
      tech: ["MLX", "Qwen 3.5 7B", "quantization"],
      links: [],
    },

    {
      slug: "parking-prediction",
      title: "Parking availability forecasting",
      org: "ASU",
      period: "2018",
      status: "archived",
      summary: "Compared multivariate linear regression, ARIMA, RNN, and hidden Markov models for forecasting campus parking availability. Feature engineering mattered more than model choice: the 32-feature linear model won.",
      result: "RMS error 7.43",
      tags: ["research"],
      tech: ["Python", "scikit-learn", "ARIMA", "RNN", "HMM"],
      links: [
        { label: "Code", href: "https://github.com/malay95/Parking-Spot-Prediction" },
      ],
    },

  ],
};

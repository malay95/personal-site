/* ==========================================================================
   SITE DATA — this is the only file you need to edit for day-to-day updates.
   Adding a project? Copy a block in SITE.projects and fill it in.
   Adding a tab?     Add a line to SITE.nav and create the matching .html page.
   No build step, no dependencies. Save, commit, push. GitHub Pages does the rest.
   ========================================================================== */

window.SITE = {

  /* ---- tabs in the left rail, rendered on every page ------------------- */
  nav: [
    { label: "Home",     href: "index.html" },
    { label: "Projects", href: "projects.html" },
    // Add a tab:
    // { label: "Writing", href: "writing.html" },
    // Sub-links to a section on a page use `sub: true`:
    // { label: "Experience", href: "index.html#experience", sub: true },
  ],

  /* ---- who + where to reach you --------------------------------------- */
  contact: [
    { label: "Email",    text: "malayshah781@gmail.com", href: "mailto:malayshah781@gmail.com" },
    { label: "GitHub",   text: "malay95",                href: "https://github.com/malay95" },
    { label: "LinkedIn", text: "msshah11",               href: "https://linkedin.com/in/msshah11" },
  ],

  /* ======================================================================
     PROJECTS

     Field reference
       slug      unique id, kebab-case. Used for deep links (#slug).
       title     what it is called
       org       where it happened: "BILL", "Personal", "ASU"
       period    free text: "2025", "2024-2025", "ongoing"
       status    "active"   — building it right now
                 "shipped"  — done and in use
                 "research" — study / experiment / paper
                 "archived" — finished, not maintained
       featured  true puts it on the home page too
       summary   one or two sentences, what it is and why it exists
       points    optional bullets: the interesting engineering details
       result    optional measured outcome. Numbers only, no adjectives.
       tags      COARSE themes, and only these. They generate the filter buttons,
                 so keep the vocabulary small or the filter bar stops being usable.
                 In use: "llm inference", "agents", "rag", "evaluation",
                 "distributed systems", "mlops", "platform", "self-hosted", "research".
                 Reuse an existing one before inventing a new one.
       tech      the concrete stack, shown as chips on the card. Be as specific as
                 you like here: this list is display-only and never filtered.
       links     [{ label, href }]. Omit or leave [] if there is nothing public yet.
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
      result: "M0 sequential baseline measured: 21.4 tok/s at concurrency 1, 31.1 tok/s at concurrency 8 with p99 5.6x worse, isolating the serialization cliff that batching is meant to remove. Batching and paging milestones in progress.",
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

import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

interface KnowledgeTopic {
  keywords: string[];
  title: string;
  text: string;
  sources: Array<{ title: string; uri: string }>;
}

const CURATED_KNOWLEDGE_BASE: KnowledgeTopic[] = [
  {
    keywords: ["drift", "terraform", "iac", "state"],
    title: "Terraform State & Infrastructure Drift Detection",
    text: `### Production Drift Detection & State Governance

1. **Automated Continuous Detection**:
   - Schedule non-mutating \`terraform plan -detailed-exitcode\` pipelines via GitHub Actions or GitLab CI.
   - Exit code \`0\` signifies clean state match; exit code \`2\` flags unauthorized out-of-band modifications.

2. **Remediation & GitOps Strategy**:
   - Integrate automated notifications to Slack/Teams with resource-level diffs.
   - For intentional hotfixes, back-port changes to HCL modules and execute \`terraform refresh\` to align remote state.
   - Enforce AWS CloudTrail / Azure Activity Log event alerts to detect manual console alterations in real-time.

3. **Enterprise State Locking**:
   - Store remote state in Amazon S3 with SSE-KMS encryption, versioning, and DynamoDB state locking (or Terraform Cloud / HCP Terraform remote backend).`,
    sources: [
      { title: "HashiCorp Terraform: Detecting and Managing Drift", uri: "https://developer.hashicorp.com/terraform/tutorials/state/drift" },
      { title: "AWS Well-Architected Framework: Reliability with IaC", uri: "https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html" },
      { title: "Terraform Cloud Automated Drift Detection", uri: "https://developer.hashicorp.com/terraform/cloud-docs/workspaces/health" },
    ],
  },
  {
    keywords: ["well-architected", "well architected", "six pillars"],
    title: "AWS Well-Architected Framework & Six Pillars Review",
    text: `### AWS Well-Architected Framework Six Pillars Governance

1. **Operational Excellence & Reliability**:
   - Codify every environment as versioned infrastructure templates with automated game-day chaos verification and multi-AZ fault isolation.
   - Define measurable RTO/RPO recovery targets tested automatically against isolated staging accounts.

2. **Security, Performance & Cost Optimization**:
   - Enforce AWS Organizations SCP guardrails, short-lived IAM Identity Center sessions, and KMS customer-managed key encryption by default.
   - Right-size compute via Compute Optimizer, Savings Plans telemetry, and automated S3 Intelligent-Tiering lifecycle policies.

3. **Sustainability & Workload Reviews**:
   - Conduct formal Well-Architected Tool milestone reviews prior to production cutover and track high-risk issues (HRIs) to resolution.`,
    sources: [
      { title: "AWS Well-Architected Framework Documentation", uri: "https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html" },
      { title: "AWS Well-Architected Tool User Guide", uri: "https://docs.aws.amazon.com/wellarchitected/latest/userguide/intro.html" },
      { title: "AWS Security Reference Architecture", uri: "https://docs.aws.amazon.com/prescriptive-guidance/latest/security-reference-architecture/welcome.html" },
    ],
  },
  {
    keywords: ["python", "dbt", "fastapi", "pandas", "postgresql", "automation"],
    title: "Python ETL Pipelines, FastAPI & Analytics Automation",
    text: `### Production Python ETL & Analytics Engineering Baselines

1. **Resilient Ingestion & Validation**:
   - Build idempotent API extractors with exponential backoff, structured logging, and Pydantic schema contracts before writing to warehouse staging tables.
   - Enforce connection pooling and batched upserts into PostgreSQL to prevent lock contention during peak ingestion windows.

2. **Modular Transformations with dbt**:
   - Separate raw staging models from tested business marts, enforcing \`unique\`, \`not_null\`, and referential integrity assertions in CI.
   - Publish freshness SLAs and automated lineage documentation for downstream BI teams.

3. **Service Packaging & Scheduling**:
   - Package ETL workers and FastAPI endpoints in multi-stage Docker images with non-root execution and deterministic dependency locks.`,
    sources: [
      { title: "dbt Best Practices: How We Structure Projects", uri: "https://docs.getdbt.com/best-practices/how-we-structure-our-projects" },
      { title: "FastAPI Production Deployment Guide", uri: "https://fastapi.tiangolo.com/deployment/" },
      { title: "PostgreSQL Indexing & Bulk Loading Docs", uri: "https://www.postgresql.org/docs/current/populate.html" },
    ],
  },
  {
    keywords: ["aws", "azure", "multi-cloud", "hybrid", "gcp"],
    title: "AWS vs Azure Multi-Cloud Hybrid Architecture",
    text: `### Enterprise Multi-Cloud Hybrid Architecture Standards

1. **Identity & Access Management (IAM) Federation**:
   - Centralize identity in Microsoft Entra ID (formerly Azure AD) or Okta with SCIM automated provisioning.
   - Federate cross-cloud role assumption into AWS IAM using OIDC trust policies, eliminating static IAM access keys entirely.

2. **Hybrid Networking & Zero-Trust Transit**:
   - Implement redundant site-to-site connectivity using AWS Direct Connect and Azure ExpressRoute with IPSec VPN failover.
   - Deploy Transit Gateway (AWS) and Virtual WAN (Azure) with unified BGP route advertisement.

3. **Workload Portability & Observability**:
   - Standardize on containerized orchestration via Amazon EKS and Azure AKS managed with ArgoCD GitOps pipelines.
   - Unify telemetry across clouds using OpenTelemetry collectors exporting to Datadog, Prometheus, or Grafana Cloud.`,
    sources: [
      { title: "AWS Multi-Cloud Architecture Guidance", uri: "https://aws.amazon.com/architecture/" },
      { title: "Microsoft Azure Architecture Center: Hybrid & Multi-Cloud", uri: "https://learn.microsoft.com/en-us/azure/architecture/" },
      { title: "OpenTelemetry Multi-Cloud Collector Standard", uri: "https://opentelemetry.io/docs/" },
    ],
  },
  {
    keywords: ["cis", "nist", "cybersecurity", "compliance", "soc2", "iso27001", "benchmark"],
    title: "CIS Benchmarks vs NIST Cybersecurity Frameworks",
    text: `### CIS Benchmarks vs. NIST Cybersecurity Framework (CSF 2.0)

1. **Strategic Distinction**:
   - **NIST CSF 2.0** provides executive governance and risk-management structure across six core functions: *Govern, Identify, Protect, Detect, Respond, and Recover*.
   - **CIS Benchmarks** provide prescriptively hard technical hardening guidelines (OS, cloud tenant, Docker, Kubernetes, database).

2. **Cloud Security Posture Management (CSPM)**:
   - Deploy automated auditing tools (Prowler, ScoutSuite, AWS Security Hub, Microsoft Defender for Cloud) continuously checking against CIS AWS/Azure Foundations Benchmarks v3.0.
   - Map CIS technical safeguards into NIST 800-53 rev 5 and ISO/IEC 27001:2022 control matrices.

3. **Zero-Trust Access & Least Privilege**:
   - Enforce mandatory hardware-token MFA (FIDO2/WebAuthn), just-in-time privilege escalation, and TLS 1.3 encryption across all internal services.`,
    sources: [
      { title: "Center for Internet Security (CIS) Benchmarks", uri: "https://www.cisecurity.org/cis-benchmarks" },
      { title: "NIST Cybersecurity Framework (CSF 2.0)", uri: "https://www.nist.gov/cyberframework" },
      { title: "AWS Security Hub CIS Benchmark Controls", uri: "https://docs.aws.amazon.com/securityhub/latest/userguide/standards-cis-to-controls.html" },
    ],
  },
  {
    keywords: ["kubernetes", "k8s", "cluster", "helm", "container"],
    title: "Production Kubernetes & Container Orchestration Baselines",
    text: `### Production Kubernetes Engineering Standards

1. **Cluster Hardening & Governance**:
   - Disallow root containers and enforce \`readOnlyRootFilesystem\` via Kyverno or OPA Gatekeeper admission controllers.
   - Implement strict NetworkPolicies denying inter-namespace traffic by default.

2. **Autoscaling & High Availability**:
   - Configure Horizontal Pod Autoscaler (HPA) using custom Prometheus metrics.
   - Deploy Karpenter or Cluster Autoscaler with multi-AZ node affinity and PodDisruptionBudgets (PDB).

3. **Continuous Deployment with GitOps**:
   - Employ ArgoCD or Flux for declarative, audited cluster reconciliations directly from Git source repositories.`,
    sources: [
      { title: "Kubernetes Production Best Practices", uri: "https://kubernetes.io/docs/setup/best-practices/" },
      { title: "CIS Kubernetes Benchmark", uri: "https://www.cisecurity.org/benchmark/kubernetes" },
      { title: "CNCF Cloud Native Interactive Landscape", uri: "https://landscape.cncf.io/" },
    ],
  },
  {
    keywords: ["sql", "etl", "data", "power bi", "dax", "tableau", "pipeline"],
    title: "Data Engineering, Relational SQL & BI Pipeline Architecture",
    text: `### Enterprise Data Modeling & Analytics Engineering Standards

1. **Dimensional Modeling & Schema Design**:
   - Adopt Kimball Star Schema methodology with optimized surrogate keys, slowly changing dimensions (SCD Type 2), and aggregated fact tables.
   - Index clustered columnstore tables for sub-second analytical aggregations across multi-million row datasets.

2. **Automated ELT/ETL Pipelines**:
   - Orchestrate data ingestion with Apache Airflow or dbt (data build tool), ensuring comprehensive unit testing of nullability, uniqueness, and referential integrity.
   - Validate upstream schema drift before loading into enterprise cloud warehouses (Snowflake, BigQuery, or Databricks Lakehouse).

3. **Executive BI Visualization**:
   - Structure Power BI semantic models with pure DAX measures, row-level security (RLS), and incremental refresh partitions for seamless executive reporting.`,
    sources: [
      { title: "dbt (data build tool) Best Practices", uri: "https://docs.getdbt.com/best-practices" },
      { title: "Microsoft Learn: DAX Optimization Guidance", uri: "https://learn.microsoft.com/en-us/dax/best-practices/" },
      { title: "Kimball Dimensional Modeling Techniques", uri: "https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/" },
    ],
  },
];

function getFallbackInsight(query: string, category?: string) {
  const qLower = query.toLowerCase();
  let matched: KnowledgeTopic | undefined;
  let bestScore = 0;

  for (const item of CURATED_KNOWLEDGE_BASE) {
    let score = 0;
    for (const kw of item.keywords) {
      if (qLower.includes(kw)) {
        // Prefer specific multi-word keywords over broad single-token matches
        score = Math.max(score, kw.length + (kw.includes(" ") || kw.includes("-") ? 10 : 0));
      }
    }
    if (score > bestScore) {
      bestScore = score;
      matched = item;
    }
  }

  if (matched) {
    return {
      text: matched.text,
      sources: matched.sources,
    };
  }

  return {
    text: `### Elites Tech Solutions Technical Guidance: ${query}

1. **Foundational Architecture**:
   - Align implementation with industry standard reference models across ${category || "Cloud, Data & Cybersecurity"}.
   - Enforce automated infrastructure verification, least-privilege identity boundaries, and comprehensive telemetry.

2. **Production Implementation Workflow**:
   - Prototype and test in isolated sandbox environments with automated CI/CD validation.
   - Document technical runbooks, disaster recovery parameters, and team operational ownership.

3. **Curriculum Alignment**:
   - Detailed practical lab exercises for this topic are available inside the active Elites Tech Academy course tracks.`,
    sources: [
      { title: "Elites Tech Solutions Engineering Practices", uri: "https://www.elitestechsolutions.com/services" },
      { title: "Elites Tech Academy Curriculum Guide", uri: "https://www.elitestechsolutions.com/academy" },
    ],
  };
}

export async function POST(req: NextRequest) {
  try {
    const { query, category } = await req.json();
    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Return curated architectural advisory insight
      const fallback = getFallbackInsight(query, category);
      return NextResponse.json({ ...fallback, mode: "curated" });
    }

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const prompt = `You are the Elites Tech Academy Expert Advisor. A student studying "${category || "Cloud, Data & DevOps"}" is searching for real-time industry trends, documentation, or best practices regarding: "${query}". Provide a concise, professional, structured breakdown with actionable insights, industry standards (AWS, Azure, GCP, Terraform, Kubernetes, etc.), and reference guidance.`;

      // Use standard modern Gemini models
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          systemInstruction:
            "You are an expert technical solutions architect and curriculum lead at Elites Tech Solutions LLC. Provide accurate, up-to-date, real-time grounded insights and documentation references for cloud engineers and data professionals.",
        },
      });

      const text = response.text || "No insights found.";
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

      const sources = chunks
        .filter((chunk: any) => chunk.web?.uri && chunk.web?.title)
        .map((chunk: any) => ({
          title: chunk.web.title,
          uri: chunk.web.uri,
        }));

      return NextResponse.json({ text, sources, mode: "live" });
    } catch (genError) {
      console.warn("Gemini API call failed, using curated fallback:", genError);
      const fallback = getFallbackInsight(query, category);
      return NextResponse.json({ ...fallback, mode: "curated" });
    }
  } catch (error: any) {
    console.error("Academy search error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process advisory query" },
      { status: 500 }
    );
  }
}

# Security Policy

## Supported Versions

Only the latest version receives active security updates and vulnerability patches.

| Version |     Supported      | Status            |
| :------ | :----------------: | :---------------- |
| `1.0.x` | :white_check_mark: | Current / Active  |
| `< 1.0` |        :x:         | End of Life (EOL) |

---

## Reporting a Vulnerability

We take the security of this project and its infrastructure seriously. If you discover a security vulnerability, please disclose it responsibly.

**Do NOT open a public GitHub issue for security vulnerabilities.**

### Preferred Reporting Methods:

1. **GitHub Private Vulnerability Advisory (Recommended)**:
   Navigate to the repository's **Security** tab → **Advisories** → **Report a vulnerability**.
2. **Direct Email**:
   Send details directly to: [grihiniworld@gmail.com](mailto:grihiniworld@gmail.com)

### Please Include:

- Type of issue (e.g., XSS, dependency vulnerability, secret leak)
- Step-by-step instructions or proof-of-concept (PoC) to reproduce the vulnerability
- Assessment of potential impact and proposed mitigation (if available)

### Response Timeline

- **Initial acknowledgment**: Within **48 hours**.
- **Assessment & resolution**: We will investigate and coordinate a patch before any public release.

---

## Security Controls & Quality Gates

### 1. Automated CI/CD Pipeline

Every commit and pull request must pass the automated security controls defined in [`.github/workflows/ci.yml`](.github/workflows/ci.yml):

- **Secret Scanning**: [Gitleaks](https://github.com/gitleaks/gitleaks) scans repository history and commit diffs for accidentally committed credentials, tokens, or API keys.
- **Static Application Security Testing (SAST)**: GitHub [CodeQL](https://codeql.github.com/) scans JavaScript/TypeScript code for security flaws and injection vulnerabilities.
- **Dependency Audit**: Automated `pnpm audit --audit-level=high` runs to flag and block known package CVEs.

### 2. Branch & Promotion Protection

- **`main` Branch**: Production code target. Protected with required CI checks, linear history, and disabled direct pushes.
- **Promotion Restrictions**: Enforced by [`validate-pr-target.yml`](.github/workflows/validate-pr-target.yml)—pull requests into `main` must originate strictly from the `development` branch and must be authored by the repository owner.
- **Fork Restrictions**: Pull requests from forks cannot target `main` directly.

### 3. Dependency Management

- **Reproducible Builds**: Strict lockfile integrity is enforced via `pnpm install --frozen-lockfile`.
- **Audit Cadence**: A dedicated weekly workflow ([`.github/workflows/dependency-audit.yml`](.github/workflows/dependency-audit.yml)) runs security scans against all project dependencies.

### 4. Secrets Management & Environment Security

- Never commit `.env*` secrets or private credentials to git.
- CI workflows run under least-privilege tokens (`contents: read`).
- Production environment variables are managed securely through the hosting deployment dashboard.

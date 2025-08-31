# Vercel Deployment Setup

## Prerequisites

- Vercel account
- GitHub repository access with admin permissions

## Steps to Configure Vercel Deployment

### 1. Get Vercel Token

1. Go to [Vercel Account Settings](https://vercel.com/account/tokens)
2. Click "Create Token"
3. Name it (e.g., "GitHub Actions")
4. Copy the token (you won't see it again!)

### 2. Link Project with Vercel CLI (Local)

Run these commands in your project directory:

```bash
# Login to Vercel
vercel login

# Link the project (creates .vercel directory)
vercel link

# Get the project and org IDs
cat .vercel/project.json
```

The output will show:

```json
{
  "projectId": "prj_xxxxx",
  "orgId": "team_xxxxx"
}
```

### 3. Add Secrets to GitHub Repository

1. Go to your GitHub repository
2. Navigate to Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add these three secrets:

| Secret Name         | Value                       |
| ------------------- | --------------------------- |
| `VERCEL_TOKEN`      | The token from step 1       |
| `VERCEL_ORG_ID`     | The `orgId` from step 2     |
| `VERCEL_PROJECT_ID` | The `projectId` from step 2 |

### 4. Verify Deployment

1. Push a commit to the `main` branch
2. Check the Actions tab in GitHub
3. The "Deploy to Vercel" workflow should run successfully

## Troubleshooting

### Error: "No existing credentials found"

This means the `VERCEL_TOKEN` secret is not set or is invalid.

### Error: "Project not found"

This means the `VERCEL_PROJECT_ID` or `VERCEL_ORG_ID` are incorrect.

## Alternative: Manual Vercel Integration

If you prefer, you can use Vercel's GitHub integration:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import from GitHub
4. Select your repository
5. Configure and deploy

This will automatically handle deployments without needing GitHub Actions.

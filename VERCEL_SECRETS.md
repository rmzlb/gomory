# Vercel GitHub Secrets Setup

## ⚠️ IMPORTANT: Do not commit this file to GitHub!

To fix the Vercel deployment in GitHub Actions, you need to add these secrets to your GitHub repository:

### 1. Go to GitHub Repository Settings

Navigate to: https://github.com/rmzlb/gomory/settings/secrets/actions

### 2. Add These Secrets

Click "New repository secret" for each:

1. **VERCEL_TOKEN**
   - Get this from: https://vercel.com/account/tokens
   - Create a new token and copy it

2. **VERCEL_ORG_ID**

   ```
   team_aJex759vUHbHoQBYGhJyBCG8
   ```

3. **VERCEL_PROJECT_ID**
   ```
   prj_I83sKyiOa1EsNUd5iq6Buo8MhpvB
   ```

### 3. After Adding Secrets

The GitHub Actions deployment workflow should work on the next push to main branch.

### Alternative: Use Vercel's GitHub Integration

If you prefer automatic deployments without GitHub Actions:

1. Go to https://vercel.com/dashboard
2. Import the project from GitHub
3. It will handle deployments automatically

---

⚠️ Delete this file after setting up the secrets!

@echo off
SETLOCAL EnableDelayedExpansion

echo Starting deployment process...

REM Check if netlify-cli is installed globally
call npm list -g netlify-cli >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Installing Netlify CLI globally...
    call npm install -g netlify-cli
)

REM Store current branch name
for /f "tokens=* USEBACKQ" %%F in (`git rev-parse --abbrev-ref HEAD`) do set CURRENT_BRANCH=%%F

echo Current branch: %CURRENT_BRANCH%

REM Switch to main branch and pull latest changes
echo Switching to main branch...
git checkout main
if %ERRORLEVEL% NEQ 0 (
    echo Failed to switch to main branch
    exit /b 1
)
git pull origin main

REM Attempt to merge current branch into main
echo Merging %CURRENT_BRANCH% into main...
git merge %CURRENT_BRANCH%

REM Check if there are merge conflicts
git diff --check
if %ERRORLEVEL% NEQ 0 (
    echo Merge conflicts detected. Please resolve conflicts and run the script again.
    exit /b 1
)

REM Push changes to main
echo Pushing changes to main...
git push origin main
if %ERRORLEVEL% NEQ 0 (
    echo Failed to push to main branch
    exit /b 1
)

REM Build the project
echo Building the project...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo Build failed
    exit /b 1
)

REM Deploy to Netlify
echo Deploying to Netlify...
call netlify login
call netlify deploy --prod > netlify_deploy.txt

REM Extract deployment URL from netlify_deploy.txt
for /f "tokens=* USEBACKQ" %%F in (`findstr /C:"Website URL:" netlify_deploy.txt`) do set DEPLOY_URL=%%F
set DEPLOY_URL=!DEPLOY_URL:Website URL: =!

echo Deployment URL: !DEPLOY_URL!

REM Get Jira ticket ID from scrum-9.txt
for /f "tokens=1,* delims=:" %%a in (scrum-9.txt) do (
    if "%%a"=="Title" set JIRA_ID=%%b
)
set JIRA_ID=!JIRA_ID: =!

REM TODO: Add your Jira API integration here to post the comment
echo Jira ticket %JIRA_ID% has been updated with deployment URL: !DEPLOY_URL!

echo Deployment process completed successfully!
pause 
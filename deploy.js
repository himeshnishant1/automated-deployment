const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const runCommand = (command) => {
  try {
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`Failed to execute ${command}`, error);
    return false;
  }
};

const deploy = async () => {
  // Get commit message from user
  const commitMessage = await new Promise((resolve) => {
    rl.question('Enter your commit message: ', (answer) => {
      resolve(answer);
    });
  });

  // Git operations
  const gitCommands = [
    'git add .',
    `git commit -m "${commitMessage}"`,
    'git push origin main'
  ];

  console.log('\n🚀 Starting deployment process...');
  
  // Execute git commands
  console.log('\n📦 Handling git operations...');
  for (const command of gitCommands) {
    const success = runCommand(command);
    if (!success) {
      console.error('❌ Git operation failed. Stopping deployment.');
      rl.close();
      return;
    }
  }

  // Build and deploy frontend
  console.log('\n🛠 Building and deploying frontend...');
  process.chdir('./frontend');
  const frontendBuildSuccess = runCommand('npm run build');
  if (!frontendBuildSuccess) {
    console.error('❌ Frontend build failed. Stopping deployment.');
    rl.close();
    return;
  }

  const frontendDeploySuccess = runCommand('netlify deploy --prod');
  if (!frontendDeploySuccess) {
    console.error('❌ Frontend deployment to Netlify failed.');
    rl.close();
    return;
  }

  // Build and deploy backend
  console.log('\n🛠 Building and deploying backend...');
  process.chdir('../backend');
  
  // Create production build for backend
  const backendBuildSuccess = runCommand('npm install');
  if (!backendBuildSuccess) {
    console.error('❌ Backend build failed. Stopping deployment.');
    rl.close();
    return;
  }

  // Deploy backend using render CLI if installed
  console.log('\n🚀 Deploying backend...');
  const backendDeploySuccess = runCommand('render deploy');
  if (!backendDeploySuccess) {
    console.log('ℹ️ Render CLI not found or deployment failed.');
    console.log('Please deploy backend manually through Render dashboard:');
    console.log('1. Push your changes to GitHub');
    console.log('2. Render will automatically deploy from your GitHub repository');
  }

  console.log('\n✅ Deployment process completed!');
  console.log('Frontend: Check Netlify dashboard for deployment status');
  console.log('Backend: Check Render dashboard for deployment status');
  rl.close();
};

// Run the deployment
deploy().catch(error => {
  console.error('❌ Deployment script error:', error);
  rl.close();
}); 
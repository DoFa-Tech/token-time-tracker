const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

async function executeLogic(userId) {
    console.log(`Executing token-time-tracker for user: ${userId}`);
    console.log(`Current time: ${new Date().toISOString()}`);
    
    try {
        const command = `npx token-time-tracker@latest ${userId}`;
        console.log(`Running command: ${command}`);
        
        const { stdout, stderr } = await execAsync(command);
        
        if (stdout) {
            console.log('Output:', stdout);
        }
        
        if (stderr) {
            console.error('Error output:', stderr);
        }
        
        const result = {
            userId: userId,
            timestamp: new Date().toISOString(),
            message: 'Token time tracker executed successfully',
            output: stdout
        };
        
        console.log('Execution completed successfully');
        return result;
        
    } catch (error) {
        console.error('Failed to execute token-time-tracker:', error);
        throw error;
    }
}

module.exports = {
    executeLogic
};
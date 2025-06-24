const vscode = require('vscode');
const { executeLogic } = require('./index.js');

let intervalId;

function activate(context) {
    console.log('Timer Extension is now active!');

    const config = vscode.workspace.getConfiguration('timerExtension');
    let userId = config.get('userId');

    const runLogic = () => {
        if (!userId) {
            vscode.window.showWarningMessage('Timer Extension: Please set your userId in settings');
            return;
        }
        
        executeLogic(userId)
            .then(() => {
                console.log('Timer Extension: Logic executed successfully');
            })
            .catch((error) => {
                console.error('Timer Extension: Error executing logic:', error);
                vscode.window.showErrorMessage(`Timer Extension: Error - ${error.message}`);
            });
    };

    runLogic();

    intervalId = setInterval(runLogic, 15 * 60 * 1000);

    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration((e) => {
            if (e.affectsConfiguration('timerExtension.userId')) {
                userId = vscode.workspace.getConfiguration('timerExtension').get('userId');
                console.log('Timer Extension: userId updated to', userId);
            }
        })
    );

    context.subscriptions.push({
        dispose: () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        }
    });
}

function deactivate() {
    if (intervalId) {
        clearInterval(intervalId);
    }
}

module.exports = {
    activate,
    deactivate
};
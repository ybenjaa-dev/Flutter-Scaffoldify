const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	for (const { command } of commands) {
    const disposable = vscode.commands.registerCommand(command, () => {
      vscode.window.showInputBox({ prompt: 'Enter feature name:' }).then((featureName) => {
        if (!featureName) {
          vscode.window.showErrorMessage('Invalid feature name');
          return;
        }
        if (command === 'scaffoldify.generateCleanArchitecture') {
          generateCleanArchitecture(vscode.workspace.rootPath);
          vscode.window.showInformationMessage('Clean Architecture generated successfully!');
        } else if (command === 'scaffoldify.generateFeatureFiles') {
          vscode.window.showQuickPick(
            [
              { label: 'Data Layer', description: 'Generate files for the Data layer' },
              { label: 'Domain Layer', description: 'Generate files for the Domain layer' },
              { label: 'Presentation Layer', description: 'Generate files for the Presentation layer' },
            ],
            { canPickMany: true, placeHolder: 'Select files to generate' },
          ).then((selectedFiles) => {
            if (!selectedFiles) {
              vscode.window.showErrorMessage('Invalid file selection');
              return;
            }

            const selectedFileLabels = selectedFiles.map((file) => file.label);

            if (selectedFileLabels.includes('Data Layer')) {
							generateDataLayerFiles(vscode.workspace.rootPath, featureName);
							vscode.window.showInformationMessage('Data Layer files generated successfully!');
            }

            if (selectedFileLabels.includes('Domain Layer')) {
							generateDomainLayerFiles(vscode.workspace.rootPath, featureName);
							vscode.window.showInformationMessage('Domain Layer files generated successfully!');
            }

            if (selectedFileLabels.includes('Presentation Layer')) {
							generatePresentationFiles(vscode.workspace.rootPath, featureName);
							vscode.window.showInformationMessage('Presentation Layer files generated successfully!');
            }
          });
        }
      });
    });
    context.subscriptions.push(disposable);
  }
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}

const commands = [
  {
    command: 'scaffoldify.generateCleanArchitecture',
    title: 'Generate Clean Architecture',
  },
  {
    command: 'scaffoldify.generateFeatureFiles',
    title: 'Generate Feature Files',
  },
];


function generateCleanArchitecture(rootPath) {
  const dataDir = path.join(rootPath, 'lib', 'data');
  const domainDir = path.join(rootPath, 'lib', 'domain');
  const presentationDir = path.join(rootPath, 'lib', 'presentation');
  const dataSourcesDir = path.join(dataDir, 'datasources');
  const repositoriesDir = path.join(dataDir, 'repositories');
  const modelsDir = path.join(dataDir, 'models');
  const entitiesDir = path.join(domainDir, 'entities');
  const domainRepositoriesDir = path.join(domainDir, 'repositories');
  const usecasesDir = path.join(domainDir, 'usecases');
  const sharedDir = path.join(presentationDir, 'shared');
  const constantsDir = path.join(sharedDir, 'constants');
  const themeDir = path.join(sharedDir, 'theme');
  const utilsDir = path.join(sharedDir, 'utils');
  const widgetsDir = path.join(sharedDir, 'widgets');

  // Create directories
  fs.mkdirSync(dataDir);
  fs.mkdirSync(domainDir);
  fs.mkdirSync(presentationDir);
  fs.mkdirSync(dataSourcesDir);
  fs.mkdirSync(repositoriesDir);
  fs.mkdirSync(modelsDir);
  fs.mkdirSync(entitiesDir);
  fs.mkdirSync(domainRepositoriesDir);
  fs.mkdirSync(usecasesDir);
  fs.mkdirSync(sharedDir);
  fs.mkdirSync(constantsDir);
  fs.mkdirSync(themeDir);
  fs.mkdirSync(utilsDir);
  fs.mkdirSync(widgetsDir);

  // Create files
  fs.writeFileSync(path.join(dataSourcesDir, 'remote_data_source.dart'), '');
  fs.writeFileSync(path.join(dataSourcesDir, 'remote_data_source_impl.dart'), '');
  fs.writeFileSync(path.join(repositoriesDir, 'repository_impl.dart'), '');
  fs.writeFileSync(path.join(modelsDir, 'model.dart'), '');
  fs.writeFileSync(path.join(entitiesDir, 'entity.dart'), '');
  fs.writeFileSync(path.join(domainRepositoriesDir, 'repository.dart'), '');
  fs.writeFileSync(path.join(usecasesDir, 'usecase.dart'), '');
  fs.writeFileSync(path.join(constantsDir, 'constants.dart'), '');
  fs.writeFileSync(path.join(themeDir, 'theme.dart'), '');
  fs.writeFileSync(path.join(utilsDir, 'utils.dart'), '');
  fs.writeFileSync(path.join(widgetsDir, 'widgets.dart'), '');
}

function generateDataLayerFiles(rootPath, featureName) {
  const dataDir = path.join(rootPath, 'lib', 'data');
  const featureDir = path.join(dataDir, 'features', featureName);
  const dataSourcesDir = path.join(featureDir, 'datasources');
  const repositoriesDir = path.join(featureDir, 'repositories');
  const modelsDir = path.join(featureDir, 'models');

  // Create directories
  fs.mkdirSync(featureDir);
  fs.mkdirSync(dataSourcesDir);
  fs.mkdirSync(repositoriesDir);
  fs.mkdirSync(modelsDir);

  // Create files
  fs.writeFileSync(path.join(dataSourcesDir, `${featureName}_remote_data_source.dart`), '');
  fs.writeFileSync(path.join(dataSourcesDir, `${featureName}_remote_data_source_impl.dart`), '');
  fs.writeFileSync(path.join(repositoriesDir, `${featureName}_repository_impl.dart`), '');
  fs.writeFileSync(path.join(modelsDir, `${featureName}_model.dart`), '');
}


function generateDomainLayerFiles(rootPath, featureName) {
  const domainDir = path.join(rootPath, 'lib', 'domain');
  const featureDir = path.join(domainDir, 'features', featureName);
  const entitiesDir = path.join(featureDir, 'entities');
  const repositoriesDir = path.join(featureDir, 'repositories');
  const usecasesDir = path.join(featureDir, 'usecases');

  // Create directories
  fs.mkdirSync(featureDir);
  fs.mkdirSync(entitiesDir);
  fs.mkdirSync(repositoriesDir);
  fs.mkdirSync(usecasesDir);

  // Create files
  fs.writeFileSync(path.join(entitiesDir, `${featureName}.dart`), '');
  fs.writeFileSync(path.join(repositoriesDir, `${featureName}_repository.dart`), '');
  fs.writeFileSync(path.join(usecasesDir, `get_${featureName}s_usecase.dart`), '');
  fs.writeFileSync(path.join(usecasesDir, `add_${featureName}_usecase.dart`), '');
  fs.writeFileSync(path.join(usecasesDir, `update_${featureName}_usecase.dart`), '');
  fs.writeFileSync(path.join(usecasesDir, `get_${featureName}_usecase.dart`), '');
  fs.writeFileSync(path.join(usecasesDir, `delete_${featureName}_usecase.dart`), '');
}


function generatePresentationFiles(rootPath, featureName) {
  const presentationDir = path.join(rootPath, 'lib', 'presentation');
  const featureDir = path.join(presentationDir, 'features', featureName);
  const screensDir = path.join(featureDir, 'screens');

  // Create directories
  fs.mkdirSync(featureDir);
  fs.mkdirSync(screensDir);

  // Create files
  fs.writeFileSync(path.join(screensDir, `${featureName}s_screen.dart`), '');
  fs.writeFileSync(path.join(screensDir, `create_${featureName}_screen.dart`), '');
  fs.writeFileSync(path.join(screensDir, `update_${featureName}_screen.dart`), '');
}

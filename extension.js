const vscode = require("vscode");
const path = require("path");
const fs = require("fs");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  for (const { command } of commands) {
    const disposable = vscode.commands.registerCommand(command, () => {
      if (command === "scaffoldify.generateCleanArchitecture") {
        generateCleanArchitecture(vscode.workspace.rootPath);
        vscode.window.showInformationMessage(
          "Clean Architecture generated successfully!"
        );
      } else if (command === "scaffoldify.generateFeatureFiles") {
        vscode.window
          .showInputBox({ prompt: "Enter feature name:" })
          .then((featureName) => {
            if (!featureName) {
              vscode.window.showErrorMessage("Invalid feature name");
              return;
            }
            // check if start with number or special character or space or empty string or null or undefined then show error message
            if (
              !featureName.match(/^[a-zA-Z][a-zA-Z0-9]*$/) ||
              featureName.match(/^[0-9]/) ||
              featureName.match(/^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/) ||
              featureName.match(/^[ ]/) ||
              featureName === "" ||
              featureName === null ||
              featureName === undefined
            ) {
              vscode.window.showErrorMessage(
                "Invalid feature name. Feature name should start with a letter and can only contain letters and numbers"
              );
              return;
            }
            if (featureName.charAt(0) === featureName.charAt(0).toUpperCase()) {
              featureName = featureName.charAt(0).toLowerCase() + featureName.slice(1);
            }
            vscode.window
              .showQuickPick(
                [
                  {
                    label: "Data Layer",
                    description: "Generate files for the Data layer",
                  },
                  {
                    label: "Domain Layer",
                    description: "Generate files for the Domain layer",
                  },
                  {
                    label: "Presentation Layer",
                    description: "Generate files for the Presentation layer",
                  },
                ],
                { canPickMany: true, placeHolder: "Select files to generate" }
              )
              .then((selectedFiles) => {
                if (!selectedFiles) {
                  vscode.window.showErrorMessage("Invalid file selection");
                  return;
                }

                const selectedFileLabels = selectedFiles.map(
                  (file) => file.label
                );
                if (selectedFileLabels.includes("Data Layer")) {
                  generateDataLayerFiles(
                    vscode.workspace.rootPath,
                    featureName
                  );
                  vscode.window.showInformationMessage(
                    "Data Layer files generated successfully!"
                  );
                }

                if (selectedFileLabels.includes("Domain Layer")) {
                  generateDomainLayerFiles(
                    vscode.workspace.rootPath,
                    featureName
                  );
                  vscode.window.showInformationMessage(
                    "Domain Layer files generated successfully!"
                  );
                }

                if (selectedFileLabels.includes("Presentation Layer")) {
                  generatePresentationFiles(
                    vscode.workspace.rootPath,
                    featureName
                  );
                  vscode.window.showInformationMessage(
                    "Presentation Layer files generated successfully!"
                  );
                }
              });
          });
      }
    });
    context.subscriptions.push(disposable);
  }
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};

const commands = [
  {
    command: "scaffoldify.generateCleanArchitecture",
    title: "Generate Clean Architecture",
  },
  {
    command: "scaffoldify.generateFeatureFiles",
    title: "Generate Feature Files",
  },
];

/**
 * @param {string} rootPath
 */
function generateCleanArchitecture(rootPath) {
  const dataDir = path.join(rootPath, "lib", "data");
  const domainDir = path.join(rootPath, "lib", "domain");
  const presentationDir = path.join(rootPath, "lib", "presentation");
  const dataSourcesDir = path.join(dataDir, "datasources");
  const repositoriesDir = path.join(dataDir, "repositories");
  const modelsDir = path.join(dataDir, "models");
  const entitiesDir = path.join(domainDir, "entities");
  const domainRepositoriesDir = path.join(domainDir, "repositories");
  const usecasesDir = path.join(domainDir, "usecases");
  const sharedDir = path.join(presentationDir, "shared");
  const featuresDir = path.join(presentationDir, "features");
  const constantsDir = path.join(sharedDir, "constants");
  const themeDir = path.join(sharedDir, "theme");
  const utilsDir = path.join(sharedDir, "utils");
  const widgetsDir = path.join(sharedDir, "widgets");

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
  fs.mkdirSync(featuresDir);
  fs.mkdirSync(constantsDir);
  fs.mkdirSync(themeDir);
  fs.mkdirSync(utilsDir);
  fs.mkdirSync(widgetsDir);
}

/**
 * @param {string} rootPath
 * @param {string} featureName
 */
function generateDataLayerFiles(rootPath, featureName) {
  const dataDir = path.join(rootPath, "lib", "data");
  const dataSourcesDir = path.join(dataDir, "datasources");
  const repositoriesDir = path.join(dataDir, "repositories");
  const modelsDir = path.join(dataDir, "models");

  try {
    if (!fs.existsSync(dataSourcesDir)) {
      fs.mkdirSync(dataSourcesDir);
    }
    if (!fs.existsSync(repositoriesDir)) {
      fs.mkdirSync(repositoriesDir);
    }
    if (!fs.existsSync(modelsDir)) {
      fs.mkdirSync(modelsDir);
    }

    const dataSourcesTemplate = fs.readFileSync(
      path.join(__dirname, "templates", "data", "remote_data_source.template")
    );
    const dataSourcesImplTemplate = fs.readFileSync(
      path.join(
        __dirname,
        "templates",
        "data",
        "remote_data_source_impl.template"
      )
    );
    const repositoriesTemplate = fs.readFileSync(
      path.join(__dirname, "templates", "data", "repository.template")
    );
    const modelTemplate = fs.readFileSync(
      path.join(__dirname, "templates", "data", "model.template")
    );

    const featureNameUpper =
      featureName.charAt(0).toUpperCase() + featureName.slice(1);

    const dataSourceContent = dataSourcesTemplate
      .toString()
      .replace(/FEATURE_NAME/g, featureNameUpper)
      .replace(/FEATURE_LOWER_NAME/g, featureName);

    const dataSourceImplContent = dataSourcesImplTemplate
      .toString()
      .replace(/FEATURE_NAME/g, featureNameUpper)
      .replace(/FEATURE_LOWER_NAME/g, featureName);

    const repositoryContent = repositoriesTemplate
      .toString()
      .replace(/FEATURE_NAME/g, featureNameUpper)
      .replace(/FEATURE_LOWER_NAME/g, featureName);

    const modelContent = modelTemplate
      .toString()
      .replace(/FEATURE_NAME/g, featureNameUpper)
      .replace(/FEATURE_LOWER_NAME/g, featureName);

    if (
      !fs.existsSync(
        path.join(dataSourcesDir, `${featureName}_remote_data_source.dart`)
      )
    ) {
      fs.writeFileSync(
        path.join(dataSourcesDir, `${featureName}_remote_data_source.dart`),
        dataSourceContent
      );
    }
    if (
      !fs.existsSync(
        path.join(dataSourcesDir, `${featureName}_remote_data_source_impl.dart`)
      )
    ) {
      fs.writeFileSync(
        path.join(
          dataSourcesDir,
          `${featureName}_remote_data_source_impl.dart`
        ),
        dataSourceImplContent
      );
    }
    if (
      !fs.existsSync(
        path.join(repositoriesDir, `${featureName}_repository.dart`)
      )
    ) {
      fs.writeFileSync(
        path.join(repositoriesDir, `${featureName}_repository.dart`),
        repositoryContent
      );
    }
    if (!fs.existsSync(path.join(modelsDir, `${featureName}_model.dart`))) {
      fs.writeFileSync(
        path.join(modelsDir, `${featureName}_model.dart`),
        modelContent
      );
    }

    vscode.window.showInformationMessage(
      `Data layer files for ${featureName} feature generated successfully.`
    );
  } catch (err) {
    vscode.window.showErrorMessage(
      `Error generating data layer files for ${featureName} feature: ${err.message}`
    );
  }
}

/**
 * @param {string} rootPath
 * @param {string} featureName
 */
function generateDomainLayerFiles(rootPath, featureName) {
  const domainDir = path.join(rootPath, "lib", "domain");
  const entitiesDir = path.join(domainDir, "entities");
  const repositoriesDir = path.join(domainDir, "repositories");
  const usecasesDir = path.join(domainDir, "usecases");

  try {
    if (!fs.existsSync(entitiesDir)) {
      fs.mkdirSync(entitiesDir);
    }
    if (!fs.existsSync(repositoriesDir)) {
      fs.mkdirSync(repositoriesDir);
    }
    if (!fs.existsSync(usecasesDir)) {
      fs.mkdirSync(usecasesDir);
    }

    const entityTemplate = fs.readFileSync(
      path.join(__dirname, "templates", "domain", "entity.template")
    );
    const repositoryTemplate = fs.readFileSync(
      path.join(__dirname, "templates", "domain", "repository.template")
    );
    const getusecaseTemplate = fs.readFileSync(
      path.join(__dirname, "templates", "domain", "get_usecase.template")
    );

    const getidusecaseTemplate = fs.readFileSync(
      path.join(__dirname, "templates", "domain", "get_id_usecase.template")
    );

    const addusecaseTemplate = fs.readFileSync(
      path.join(__dirname, "templates", "domain", "add_usecase.template")
    );

    const updateusecaseTemplate = fs.readFileSync(
      path.join(__dirname, "templates", "domain", "update_usecase.template")
    );

    const deleteusecaseTemplate = fs.readFileSync(
      path.join(__dirname, "templates", "domain", "delete_usecase.template")
    );

    const featureNameUpper =
      featureName.charAt(0).toUpperCase() + featureName.slice(1);

    const entityContent = entityTemplate
      .toString()
      .replace(/FEATURE_NAME/g, featureNameUpper)
      .replace(/FEATURE_LOWER_NAME/g, featureName);

    const repositoryContent = repositoryTemplate
      .toString()
      .replace(/FEATURE_NAME/g, featureNameUpper)
      .replace(/FEATURE_LOWER_NAME/g, featureName);

    const getusecaseContent = getusecaseTemplate
      .toString()
      .replace(/FEATURE_NAME/g, featureNameUpper)
      .replace(/FEATURE_LOWER_NAME/g, featureName);

    const getidusecaseContent = getidusecaseTemplate
      .toString()
      .replace(/FEATURE_NAME/g, featureNameUpper)
      .replace(/FEATURE_LOWER_NAME/g, featureName);

    const addusecaseContent = addusecaseTemplate
      .toString()
      .replace(/FEATURE_NAME/g, featureNameUpper)
      .replace(/FEATURE_LOWER_NAME/g, featureName);

    const updateusecaseContent = updateusecaseTemplate
      .toString()
      .replace(/FEATURE_NAME/g, featureNameUpper)
      .replace(/FEATURE_LOWER_NAME/g, featureName);

    const deleteusecaseContent = deleteusecaseTemplate
      .toString()
      .replace(/FEATURE_NAME/g, featureNameUpper)
      .replace(/FEATURE_LOWER_NAME/g, featureName);

    if (!fs.existsSync(path.join(entitiesDir, `${featureName}.dart`))) {
      fs.writeFileSync(
        path.join(entitiesDir, `${featureName}.dart`),
        entityContent
      );
    }
    if (
      !fs.existsSync(
        path.join(repositoriesDir, `${featureName}_repository.dart`)
      )
    ) {
      fs.writeFileSync(
        path.join(repositoriesDir, `${featureName}_repository.dart`),
        repositoryContent
      );
    }
    if (
      !fs.existsSync(path.join(usecasesDir, `get_${featureName}s_usecase.dart`))
    ) {
      fs.writeFileSync(
        path.join(usecasesDir, `get_${featureName}s_usecase.dart`),
        getusecaseContent
      );
    }
    if (
      !fs.existsSync(path.join(usecasesDir, `add_${featureName}_usecase.dart`))
    ) {
      fs.writeFileSync(
        path.join(usecasesDir, `add_${featureName}_usecase.dart`),
        addusecaseContent
      );
    }
    if (
      !fs.existsSync(
        path.join(usecasesDir, `update_${featureName}_usecase.dart`)
      )
    ) {
      fs.writeFileSync(
        path.join(usecasesDir, `update_${featureName}_usecase.dart`),
        updateusecaseContent
      );
    }
    if (
      !fs.existsSync(path.join(usecasesDir, `get_${featureName}_usecase.dart`))
    ) {
      fs.writeFileSync(
        path.join(usecasesDir, `get_${featureName}_usecase.dart`),
        getidusecaseContent
      );
    }
    if (
      !fs.existsSync(
        path.join(usecasesDir, `delete_${featureName}_usecase.dart`)
      )
    ) {
      fs.writeFileSync(
        path.join(usecasesDir, `delete_${featureName}_usecase.dart`),
        deleteusecaseContent
      );
    }

    vscode.window.showInformationMessage(
      `Domain layer files for ${featureName} feature generated successfully.`
    );
  } catch (err) {
    vscode.window.showErrorMessage(
      `Error generating domain layer files for ${featureName} feature: ${err.message}`
    );
  }
}

/**
 * @param {string} rootPath
 * @param {string} featureName
 */
function generatePresentationFiles(rootPath, featureName) {
  const presentationDir = path.join(rootPath, "lib", "presentation");
  const featureDir = path.join(presentationDir, "features", featureName);
  const screensDir = path.join(featureDir, "screens");

  try {
    if (!fs.existsSync(featureDir)) {
      fs.mkdirSync(featureDir);
    }
    if (!fs.existsSync(screensDir)) {
      fs.mkdirSync(screensDir);
    }

    if (!fs.existsSync(path.join(screensDir, `${featureName}s_screen.dart`))) {
      fs.writeFileSync(
        path.join(screensDir, `${featureName}s_screen.dart`),
        ""
      );
    }
    if (
      !fs.existsSync(path.join(screensDir, `create_${featureName}_screen.dart`))
    ) {
      fs.writeFileSync(
        path.join(screensDir, `create_${featureName}_screen.dart`),
        ""
      );
    }
    if (
      !fs.existsSync(path.join(screensDir, `update_${featureName}_screen.dart`))
    ) {
      fs.writeFileSync(
        path.join(screensDir, `update_${featureName}_screen.dart`),
        ""
      );
    }

    vscode.window.showInformationMessage(
      `Presentation layer files for ${featureName} feature generated successfully.`
    );
  } catch (err) {
    vscode.window.showErrorMessage(
      `Error generating presentation layer files for ${featureName} feature: ${err.message}`
    );
  }
}

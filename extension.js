const vscode = require("vscode");
const path = require("path");
const fs = require("fs");

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
        return;
      }

      if (command !== "scaffoldify.generateFeatureFiles") {
        return;
      }

      vscode.window
        .showInputBox({ prompt: "Enter feature name:" })
        .then((featureName) => {
          if (!featureName) {
            vscode.window.showErrorMessage("Invalid feature name");
            return;
          }

          if (!isValidFeatureName(featureName)) {
            vscode.window.showErrorMessage("Invalid feature name");
            return;
          }

          featureName =
            featureName.charAt(0).toLowerCase() + featureName.slice(1);

          vscode.window
            .showQuickPick(
              [
                {
                  label: "Data Layer",
                  description: "Generate files for the Data layer",
                  picked: true,
                },
                {
                  label: "Domain Layer",
                  description: "Generate files for the Domain layer",
                  picked: true,
                },
                {
                  label: "Presentation Layer",
                  description: "Generate files for the Presentation layer",
                  picked: true,
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
                generateDataLayerFiles(vscode.workspace.rootPath, featureName);
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
      context.subscriptions.push(disposable);
    });
  }
}

function isValidFeatureName(featureName) {
  const startsWithLetter = /^[a-zA-Z]/.test(featureName);
  const onlyLettersAndNumbers = /^[a-zA-Z0-9]*$/.test(featureName);
  return startsWithLetter && onlyLettersAndNumbers;
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};


/**
 * @param {string} rootPath
 */
function generateCleanArchitecture(rootPath) {
  const dataDir = path.join(rootPath, "lib", "data");
  const dataUtilsDir = path.join(dataDir, "utils");
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

  const dirsToCreate = [
    dataDir,
    dataUtilsDir,
    domainDir,
    presentationDir,
    dataSourcesDir,
    repositoriesDir,
    modelsDir,
    entitiesDir,
    domainRepositoriesDir,
    usecasesDir,
    sharedDir,
    featuresDir,
    constantsDir,
    themeDir,
    utilsDir,
    widgetsDir,
  ];

  for (const dir of dirsToCreate) {
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
    } catch (err) {
      vscode.window.showErrorMessage(
        `Error creating directory ${dir}: ${err.message}`
      );
    }
  }

  const dataUtilsTemplates = [
    { fileName: "http_service.dart", templateName: "http_service.template" },
    { fileName: "failure.dart", templateName: "failure.template" },
    { fileName: "api_response.dart", templateName: "api_response.template" },
  ];

  for (const { fileName, templateName } of dataUtilsTemplates) {
    try {
      const content = fs.readFileSync(
        path.join(__dirname, "templates", "data", "utils", templateName),
        "utf8"
      );
      const filePath = path.join(dataUtilsDir, fileName);
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, content);
      }
    } catch (err) {
      vscode.window.showErrorMessage(
        `Error creating file ${fileName}: ${err.message}`
      );
    }
  }

  vscode.window.showInformationMessage(
    `Clean architecture files generated successfully.`
  );
}

/**
 * @param {string} rootPath
 * @param {string} featureName
 */
function generateDataLayerFiles(rootPath, featureName) {
  const dataDir = path.join(rootPath, "lib", "data");
  const dataSourcesDir = path.join(dataDir, "datasources");
  // make folder name featureName in plural
  const featureDir = path.join(dataSourcesDir, featureName + "_data_source");
  const repositoriesDir = path.join(dataDir, "repositories");
  const modelsDir = path.join(dataDir, "models");

  try {
    if (!fs.existsSync(dataSourcesDir)) {
      fs.mkdirSync(dataSourcesDir);
    }
    if (!fs.existsSync(featureDir)) {
      fs.mkdirSync(featureDir);
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
        path.join(featureDir, `${featureName}_remote_data_source.dart`)
      )
    ) {
      fs.writeFileSync(
        path.join(featureDir, `${featureName}_remote_data_source.dart`),
        dataSourceContent
      );
    }
    if (
      !fs.existsSync(
        path.join(featureDir, `${featureName}_remote_data_source_impl.dart`)
      )
    ) {
      fs.writeFileSync(
        path.join(featureDir, `${featureName}_remote_data_source_impl.dart`),
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

  const dirs = [entitiesDir, repositoriesDir, usecasesDir];
  dirs.forEach((dir) => {
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
    } catch (err) {
      vscode.window.showErrorMessage(
        `Error creating directory ${dir}: ${err.message}`
      );
    }
  });

  const templates = [
    { template: "entity.template", file: `${featureName}.dart` },
    {
      template: "repository.template",
      file: `${featureName}_repository.dart`,
    },
    {
      template: "fetch_usecase.template",
      file: `fetch_${featureName}s_usecase.dart`,
    },
    {
      template: "fetch_id_usecase.template",
      file: `fetch_${featureName}_usecase.dart`,
    },
    {
      template: "add_usecase.template",
      file: `create_${featureName}_usecase.dart`,
    },
    {
      template: "update_usecase.template",
      file: `update_${featureName}_usecase.dart`,
    },
    {
      template: "delete_usecase.template",
      file: `delete_${featureName}_usecase.dart`,
    },
  ];

  templates.forEach((t) => {
    try {
      const templateContent = fs.readFileSync(
        path.join(__dirname, "templates", "domain", t.template)
      );
      const fileContent = templateContent
        .toString()
        .replace(
          /FEATURE_NAME/g,
          featureName.charAt(0).toUpperCase() + featureName.slice(1)
        )
        .replace(/FEATURE_LOWER_NAME/g, featureName);
      const filePath = path.join(usecasesDir, t.file);
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, fileContent);
      }
    } catch (err) {
      vscode.window.showErrorMessage(
        `Error generating ${t.file} for ${featureName} feature: ${err.message}`
      );
    }
  });

  vscode.window.showInformationMessage(
    `Domain layer files for ${featureName} feature generated successfully.`
  );
}

/**
 * @param {string} rootPath
 * @param {string} featureName
 */
function generatePresentationFiles(rootPath, featureName) {
  const presentationDir = path.join(rootPath, "lib", "presentation");
  const featureDir = path.join(presentationDir, "features", featureName + "s");
  const screensDir = path.join(featureDir, "screens");
  const widgetsDir = path.join(featureDir, "widgets");

  const dirsToCreate = [featureDir, screensDir, widgetsDir];
  for (const dir of dirsToCreate) {
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
    } catch (err) {
      vscode.window.showErrorMessage(
        `Error creating directory ${dir}: ${err.message}`
      );
      return;
    }
  }

  const templates = [
    {
      template: "main_screen.template",
      fileName: `${featureName}s_screen.dart`,
    },
    {
      template: "view_screen.template",
      fileName: `${featureName}_screen.dart`,
    },
    {
      template: "create_screen.template",
      fileName: `create_${featureName}_screen.dart`,
    },
    {
      template: "update_screen.template",
      fileName: `update_${featureName}_screen.dart`,
    },
  ];

  const featureNameUpper =
    featureName.charAt(0).toUpperCase() + featureName.slice(1);

  for (const { template, fileName } of templates) {
    try {
      const content = fs
        .readFileSync(
          path.join(__dirname, "templates", "presentation", template)
        )
        .toString()
        .replace(/FEATURE_NAME/g, featureNameUpper)
        .replace(/FEATURE_LOWER_NAME/g, featureName);

      const filePath = path.join(screensDir, fileName);
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, content);
      }
    } catch (err) {
      vscode.window.showErrorMessage(
        `Error generating file ${fileName}: ${err.message}`
      );
    }
  }

  vscode.window.showInformationMessage(
    `Presentation layer files for ${featureName} feature generated successfully.`
  );
}

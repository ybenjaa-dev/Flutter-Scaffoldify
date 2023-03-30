import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";


class DataLayerGenerator {
  constructor() {}

  /**
   * @param {string} rootPath
   * @param {string} featureName
   */
  generateDataLayerFiles(rootPath, featureName) {
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
}
module.exports = DataLayerGenerator;

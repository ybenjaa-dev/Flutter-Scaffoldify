# Scaffoldify

Scaffoldify is a VS Code extension that automates the creation of files and directories for Flutter projects following the Clean Architecture pattern.

## Features

Scaffoldify provides the following commands:

- `Generate All Files`: Generates all files needed for a Clean Architecture Flutter project.
- `Generate Data Layer Files`: Generates files for the Data layer of a Clean Architecture Flutter project.
- `Generate Domain Layer Files`: Generates files for the Domain layer of a Clean Architecture Flutter project.
- `Generate Presentation Files`: Generates files for the Presentation layer of a Clean Architecture Flutter project.
- `Generate Model Files`: Generates files for the Model layer of a Clean Architecture Flutter project.
- `Generate Entity Files`: Generates files for the Entity layer of a Clean Architecture Flutter project.

## Requirements

To use Scaffoldify, you must have the following software installed on your system:

- Flutter SDK
- Visual Studio Code
- Dart extension for Visual Studio Code

## Installation

To install Scaffoldify, follow these steps:

1. In Visual Studio Code, press `Ctrl + Shift + X` (Windows/Linux) or `Cmd + Shift + X` (Mac) to open the Extensions pane.

2. Search for `Scaffoldify`.

3. Click the `Install` button next to Scaffoldify in the search results.

## Usage

To use Scaffoldify, follow these steps:

1. Open the VS Code Command Palette by pressing `Ctrl + Shift + P` (Windows/Linux) or `Cmd + Shift + P` (Mac).

2. Type in one of the commands listed above and press `Enter`.

3. Follow the prompts to customize the generation of files.

## Configuration

Scaffoldify can be configured by modifying the following settings in the VS Code user settings:

- `scaffoldify.excludeDataSource`: Set to `true` to exclude the Data layer from file generation.
- `scaffoldify.excludeRemoteDataSource`: Set to `true` to exclude the Remote Data Source from file generation.
- `scaffoldify.excludeLocalDataSource`: Set to `true` to exclude the Local Data Source from file generation.
- `scaffoldify.excludeRepository`: Set to `true` to exclude the Repository from file generation.
- `scaffoldify.excludeModel`: Set to `true` to exclude the Model from file generation.
- `scaffoldify.excludeEntity`: Set to `true` to exclude the Entity from file generation.

## License

Scaffoldify is licensed under the MIT License. See the `LICENSE` file for more information.

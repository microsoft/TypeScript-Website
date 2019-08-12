# TypeScript portal

This is the current website for TypeScript. It uses Jekyll for the majority of the work, and uses git submodules for 
the playground and the handbook.

### Meta

* __URLs:__ [production](https://www.typescriptlang.org), [staging](http://testsite-typescript-41eeb979-7eaa-4c74-9d47-9d182c7b61ab.azurewebsites.net/)

## Staging

A live version with the daily build can be found [here](http://typescript:3000)

## Configure your build environment:

1. Install the latest Ruby and add it to your environment's PATH during setup. Allow the installer to install MSYS2 via `ridk install`.
    * Download Ruby [from here](http://rubyinstaller.org/downloads/).
1. Install the latest Node.js.
    * Download Node.js [from here](https://nodejs.org/en/)
1. Establish your new environment by opening up a new PowerShell/Command Prompt.
1. Fork https://github.com/Microsoft/TypeScript-Website to your own GitHub account
1. Clone https://github.com/[YOUR_ACCOUNT]/TypeScript-Website
1. Run the following from the cloned repository:

    ```shell
    gem install bundler
    bundler install

    yarn install
    npm install -g gulp-cli

    git submodule init
    git submodule update

    cd src/play
    yarn install
    yarn setup
    cd ../..
    ```

## Build the site:

Ensure that you have configured your build environment as explained above.
In a shell, navigate to your clone of this repository and run:

```shell
gulp 
```

Your default web browser should start up and show the built site.

## Deployment

Deployment is a 2 step process, first use these commands to push [to staging](http://testsite-typescript-41eeb979-7eaa-4c74-9d47-9d182c7b61ab.azurewebsites.net/):

```sh
# Creates a ./site folder
gulp publish
# Pushes to a special branch
gulp deploy
```

Then run the script `sync-staging-to-prod.ps1`.

## Direct Links to Downloads for Windows:

* Ruby: http://dl.bintray.com/oneclick/rubyinstaller/rubyinstaller-2.2.3-x64.exe
* RubyDevKit: http://dl.bintray.com/oneclick/rubyinstaller/DevKit-mingw64-64-4.7.2-20130224-1432-sfx.exe
* Python Installer: https://www.python.org/ftp/python/2.7.10/python-2.7.10.amd64.msi
* Node.js Installer: https://nodejs.org/dist/v5.0.0/node-v5.0.0-x64.msi


# Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

# Legal Notices

Microsoft and any contributors grant you a license to the Microsoft documentation and other content
in this repository under the [Creative Commons Attribution 4.0 International Public License](https://creativecommons.org/licenses/by/4.0/legalcode),
see the [LICENSE](LICENSE) file, and grant you a license to any code in the repository under the [MIT License](https://opensource.org/licenses/MIT), see the
[LICENSE-CODE](LICENSE-CODE) file.

Microsoft, Windows, Microsoft Azure and/or other Microsoft products and services referenced in the documentation
may be either trademarks or registered trademarks of Microsoft in the United States and/or other countries.
The licenses for this project do not grant you rights to use any Microsoft names, logos, or trademarks.
Microsoft's general trademark guidelines can be found at http://go.microsoft.com/fwlink/?LinkID=254653.

Privacy information can be found at https://privacy.microsoft.com/en-us/

Microsoft and any contributors reserve all other rights, whether under their respective copyrights, patents,
or trademarks, whether by implication, estoppel or otherwise.

![Logo](https://i.imgur.com/e5M1WqR.png)
## Screenshot remote wepages from console --- __BETA__

[![Powered by Electron](https://i.imgur.com/MZqkD2n.png)](http://electronjs.org/) ![Windows](https://img.shields.io/badge/Windows-0078D6?style=for-the-badge&logo=windows&logoColor=white)
&nbsp;
>A Windows console app that can screenshot any remote webpage

&nbsp;
## Usage
To screenshot a wepage open a command line interface (CLI) instance and use the command `RSS` or `REMOTESCREENSHOT`. Running the command without any parameters will return the help page.

```
RSS --url=<url> [--scroll=<value>] [--scrollh=<value>] [--location=<path>] [--name=<name>] [--resolution=<resolution>] [--format=<format>] [--silent]

--url           URL of the wepage to take a screenshot of.
                Example: --url="https://google.com"
--scroll        Vertical scroll value of the screenshotted wepage in pixels.
                Example: --scroll=100, default: 0
--scrollh       Horizontal scroll value of the screenshotted wepage in pixels.
                Example: --scrollh=100, default: 0
--location      Path where to save the screenshot file.
                Example: --location="C:\Users\PC\Desktop", default: current directory
--name          Name of the screenshot file.
                Example: --name=\"Screenshot\", default: Remote Screenshot (current date and time)
--resolution    Resolution of the screenshot image.
                Example: --resolution="1920x1080", default: "1280x720"
--format        Format of the screenshot file (png, jpg or jpeg).
                Example: --format="jpg", default: "png"
--silent        Do not echo any potential errors into the CLI.
                Example: --silent, default: false
```

&nbsp;
## Installation

The app currently only supports Windows operating systems.

To download head over to [releases](https://github.com/Toxic48/Remote-Screenshot/releases) section, and choose the setup file (.exe) from the latest release.
After the setup file is downloaded run it and follow further instructions.

The installation setup will add an input to the system path enviroment variable, allowing you to use the command `RSS` or `REMOTESCREENSHOT` from any directory on your system.
&nbsp;
## Built with
- [Electron](https://www.electronjs.org/)
- [Node.js](http://nodejs.org)
- [JQuery](https://jquery.com/)
- [InstallForge](https://installforge.net/)
- [AutoHotkey](https://www.autohotkey.com/)
&nbsp;
## License

This project is licensed under the terms of the MIT license.

# Graphical User Interface for TactJam

This GUI uses the [Electron](https://www.electronjs.org/) framework. It includes a [Node](https://nodejs.org/en/) server and an HTML renderer all packed in one application.
The server is handled in the [main.js](https://github.com/derikon/TactJam/blob/develop/software/GUI%20(Electron)/main.js) file.

Currently, the application is not fully functional, only some major graphical features are implemented. For now, the application consists of:

- [login page](https://github.com/derikon/TactJam/blob/develop/software/GUI%20(Electron)/login.html) (entry point): simply asks the user to connect with a username and password

![login screenshot](https://github.com/derikon/TactJam/blob/develop/software/GUI%20(Electron)/screenshots/tactjam_login.jpg)


- [tabs view](https://github.com/derikon/TactJam/blob/develop/software/GUI%20(Electron)/tabs.html) (three tabs in total), that include each a visual representation of a tacton (i.e., time profile and body placement of the actuators. This view also contains the connection panel (bottom left) that display the connection status with the device, and enables uploading tactons on it.


![tabs view](https://github.com/derikon/TactJam/blob/develop/software/GUI%20(Electron)/screenshots/tactjam_tabs.jpg)



- [save view](https://github.com/derikon/TactJam/blob/develop/software/GUI%20(Electron)/save.html) that enables one to save meta data about (title, description, tags) a Tacton and upload it eventually on a server.


![save view](https://github.com/derikon/TactJam/blob/develop/software/GUI%20(Electron)/screenshots/tactjam_save.jpg)





## Style of the GUI

All the styling happens using [SASS](https://sass-lang.com) and the .scss files. You need to compile these files into css that the html files can read. For more info, check [this](https://sass-lang.com/guide). The resulting stylesheet can be found in [compiled-css](https://github.com/derikon/TactJam/tree/develop/software/GUI%20(Electron)/compiled-css).

"use strict";
exports.__esModule = true;
var general_1 = require("./general");
var Settings = (function () {
    function Settings() {
    }
    return Settings;
}());
Settings.usetilecolor = true;
Settings.tilehovercolor = new general_1.Color(255, 215, 0, 1);
Settings.tilehoverlinewidth = 2;
Settings.fpslimit = 50;
exports.Settings = Settings;

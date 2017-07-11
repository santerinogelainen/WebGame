"use strict";
exports.__esModule = true;
/*
* Abstract class
*/
var Mouse = (function () {
    function Mouse() {
    }
    /*
    * Updates the mouse position in relation to the canvas.
    */
    Mouse.updateMousePosition = function (e) {
        e = e || window.event;
        Mouse.position.world.x = e.pageX;
        Mouse.position.world.y = e.pageY;
    };
    return Mouse;
}());
Mouse.position = {
    world: { x: 0, y: 0 },
    chunk: { x: 0, y: 0 },
    tile: { x: 0, y: 0 }
};
exports.Mouse = Mouse;

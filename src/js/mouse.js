"use strict";
exports.__esModule = true;
var canvas_1 = require("./canvas");
var Mouse = (function () {
    function Mouse() {
    }
    /*
    * onmousemove event that changes the classes page position to corresponding
    * e.pageX and e.pageY
    */
    Mouse.updatePagePosition = function (e) {
        e = e || window.event;
        Mouse.position.page.x = e.pageX;
        Mouse.position.page.y = e.pageY;
        Mouse.updateWorldPosition();
    };
    /*
    * Updates the mouse's position in relation to the center of the world.
    * Uses the page position to calculate the position
    */
    Mouse.updateWorldPosition = function () {
        Mouse.position.world.x = -(canvas_1.Canvas.center.x - Mouse.position.page.x);
        Mouse.position.world.y = (canvas_1.Canvas.center.y - Mouse.position.page.y);
    };
    return Mouse;
}());
Mouse.position = {
    page: { x: 0, y: 0 },
    world: { x: 0, y: 0 }
};
exports.Mouse = Mouse;

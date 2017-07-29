import { Canvas } from "./canvas";

export class Mouse {
    static position = {
      page: {x: 0, y: 0},
      world: {x: 0, y: 0}
    };

    /*
    * onmousemove event that changes the classes page position to corresponding
    * e.pageX and e.pageY
    */
    static updatePagePosition(e) {
      e = e || window.event;
      Mouse.position.page.x = e.pageX;
      Mouse.position.page.y = e.pageY;
      Mouse.updateWorldPosition();
    }

    /*
    * Updates the mouse's position in relation to the center of the world.
    * Uses the page position to calculate the position
    */
    static updateWorldPosition() {
      Mouse.position.world.x = -(Canvas.center.x - Mouse.position.page.x);
      Mouse.position.world.y = (Canvas.center.y - Mouse.position.page.y);
    }

}

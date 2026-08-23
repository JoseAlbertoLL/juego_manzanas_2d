import {
    type Application,
    Stage,
    ColorLayer,
    BitmapText,
    pool,
} from "melonjs";

class PlayScreen extends Stage {
    /**
     * action to perform on state change
     */
    onResetEvent(app: Application) {
        // add a gray background to the default Stage
        app.world.addChild(new ColorLayer("background", "#202020"));

        // add a font text display object
        app.world.addChild(
            new BitmapText(app.viewport.width / 2, app.viewport.height / 2, {
                font: "PressStart2P",
                size: 4.0,
                textBaseline: "middle",
                textAlign: "center",
                text: "Hello World!",
            })
        );

        app.world.addChild(
            pool.pull("mainPlayer", 100, 100, {
                image: "player",
            })
        );
    }
}

export default PlayScreen;
import { Application, audio, loader, state, plugin, pool, input } from "melonjs";
import TitleScreen from "./scripts/stage/title";
import PlayScreen from "./scripts/stage/play";
import PlayerEntity from "./scripts/renderables/player";
import DataManifest from "./manifest";
import "./index.css";
import AppleEntity from "./scripts/renderables/apple";

// create a new melonJS Application
const app = new Application(500, 590, {
    parent: "screen",
    scale: "auto",
});

input.bindKey(input.KEY.LEFT, "left");
input.bindKey(input.KEY.RIGHT, "right");
input.bindKey(input.KEY.UP, "up");
input.bindKey(input.KEY.DOWN, "down");

// initialize the audio
audio.init("mp3,ogg");

// allow cross-origin for image/texture loading
loader.setOptions({ crossOrigin: "anonymous" });

// initialize the debug plugin in development mode
if (import.meta.env.DEV) {
    import("@melonjs/debug-plugin").then((debugPlugin) => {
        plugin.register(debugPlugin.DebugPanelPlugin, "debugPanel");
    });
}

// set and load all resources
loader.preload(DataManifest, () => {
    // set the user defined game stages
    state.set(state.MENU, new TitleScreen());
    state.set(state.PLAY, new PlayScreen());

    // add our player entity in the entity pool
    pool.register("mainPlayer", PlayerEntity);
    
    // add apple
    pool.register("apple",AppleEntity);

    // start the game
    state.change(state.PLAY, false);
});

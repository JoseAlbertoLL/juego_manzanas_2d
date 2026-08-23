import { Sprite, input } from "melonjs";

class PlayerEntity extends Sprite {

    constructor(
        x: number,
        y: number,
        settings: { image: string; [key: string]: unknown }
    ) {
        super(x, y, settings);
    }

    override update(dt: number) {

        console.log("PLAYER UPDATE");

        if (input.isKeyPressed("left")) {
            this.pos.x -= 5;
        }

        if (input.isKeyPressed("right")) {
            this.pos.x += 5;
        }

        if (input.isKeyPressed("up")) {
            this.pos.y -= 5;
        }

        if (input.isKeyPressed("down")) {
            this.pos.y += 5;
        }

        return super.update(dt);
    }

    override onCollision() {
        return true;
    }
}

export default PlayerEntity;
import {
    Sprite,
    input,
    Body,
    Rect,
    collision,
    type CollisionResponse,
    type Entity
} from "melonjs";

import AppleEntity from "./apple";

class PlayerEntity extends Sprite {

    public pausado = false;
    constructor(
        x: number,
        y: number,
        settings: { image: string; [key: string]: unknown }
    ) {

        super(x, y, settings);

        this.body = new Body(this);

        this.body.gravityScale = 0;

        // Tipo de colisión de la canasta
        this.body.collisionType = collision.types.PLAYER_OBJECT;

        // La canasta puede detectar objetos enemigos
        this.body.collisionMask = collision.types.ENEMY_OBJECT;

        // Hitbox de la canasta
        this.body.addShape(
            new Rect(
                0,
                0,
                this.width,
                this.height
            )
        );
    }

    override update(dt: number) {
        if (this.pausado){
            return false;
        }

        if (input.isKeyPressed("left")) {
            this.pos.x -= 6;
        }

        if (input.isKeyPressed("right")) {
            this.pos.x += 6;
        }

        // Mantener la canasta dentro de los límites horizontales
        this.pos.x = Math.max(
            this.width / 2,
            Math.min(
                this.pos.x,
                500 - this.width / 2
            )
        );

        return super.update(dt);
    }

    override onCollision(
    response: CollisionResponse,
    other: Entity
    ) {

        console.log("COLISIÓN PLAYER");

        if (other instanceof AppleEntity) {
            console.log("ES MANZANA");
            other.atrapar();
            console.log("ATRAPAR TERMINÓ");
        }

        console.log("COLISIÓN TERMINÓ");

        return true;
    }
}

export default PlayerEntity;
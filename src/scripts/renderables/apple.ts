import { Sprite, Body, Rect, collision } from "melonjs";

class AppleEntity extends Sprite {
    public pausado = false;

    private velocityY = 0;
    
    private falling = false;
    private delay = 0;
    private atrapada = false;

    private onRemoved?: (tipo: string) => void;
    private onCaught?: (tipo: string) => void;
    private tipoManzana = "";


    constructor(
        x: number,
        y: number,
        settings: {
            image: string;
            velocidadCaida?: number;
            onRemoved?: (tipo: string) => void;
            onCaught?: (tipo: string) => void;
        }
    ) {
        super(x, y, settings);

        this.scale(2);

        this.body = new Body(this);
        this.body.gravityScale = 0;

        this.body.collisionType = collision.types.ENEMY_OBJECT;
        this.body.collisionMask = collision.types.PLAYER_OBJECT;

        this.body.addShape(
            new Rect(
                0,
                0,
                this.width,
                this.height
            )
        );

        this.initApple(x, y, settings);
    }


    /**
     * melonJS ejecuta este método automáticamente
     * al reciclar la manzana mediante el pool.
     */
    onResetEvent(
        x: number,
        y: number,
        settings: {
            image: string;
            velocidadCaida?: number;
            onRemoved?: (tipo: string) => void;
            onCaught?: (tipo: string) => void;
        }
    ) {
        this.initApple(x, y, settings);
    }


    private initApple(
        x: number,
        y: number,
        settings: {
            image: string;
            velocidadCaida?: number;
            onRemoved?: (tipo: string) => void;
            onCaught?: (tipo: string) => void;
        }
    ) {

        // Reposicionar
        this.pos.set(x, y);

        // Reiniciar estado
        this.atrapada = false;
        this.falling = false;
        this.delay = 500 + Math.random() * 1000;

        // Velocidad calculada por play.ts
        this.velocityY = settings.velocidadCaida ?? 0.25;

        // Callbacks de play.ts
        this.onRemoved = settings.onRemoved;
        this.onCaught = settings.onCaught;

        // Guardar tipo de manzana
        this.tipoManzana = settings.image;
    }


    override update(dt: number) {
        if (this.pausado) {
            return false;
        }

        // =========================
        // MANZANA ATRAPADA
        // =========================

        if (this.atrapada) {

            const parent = this.ancestor as any;

            if (parent && parent.removeChild) {
                parent.removeChild(this);
            }

            return super.update(dt);
        }


        // =========================
        // ESPERA ANTES DE CAER
        // =========================

        if (!this.falling) {

            this.delay -= dt;

            if (this.delay <= 0) {
                this.falling = true;
            }

        } else {

            // =========================
            // CAÍDA
            // =========================

            this.pos.y += this.velocityY * dt;

            // La manzana salió por abajo
            if (this.pos.y > 550) {

                if (this.onRemoved) {

                    // IMPORTANTE:
                    // enviar el tipo de manzana
                    this.onRemoved(this.tipoManzana);

                    // Evitar que se llame más de una vez
                    this.onRemoved = undefined;
                }

                // Sacar del escenario
                const parent = this.ancestor as any;

                if (parent && parent.removeChild) {
                    parent.removeChild(this);
                }
            }
        }

        return super.update(dt);
    }


    atrapar() {

        // Evitar que la misma manzana se atrape varias veces
        if (this.atrapada) {
            return;
        }

        this.atrapada = true;

        console.log("ENTRÓ A ATRAPAR");

        if (this.onCaught) {

            console.log("ANTES DE ONCAUGHT");

            // Enviar el tipo de manzana
            this.onCaught(this.tipoManzana);

            console.log("DESPUÉS DE ONCAUGHT");

            // Evitar que se llame más de una vez
            this.onCaught = undefined;
        }

        console.log("ATRAPAR TERMINÓ");
    }


    override onCollision() {
        return true;
    }
}

export default AppleEntity;
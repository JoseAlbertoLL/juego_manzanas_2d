import {
    type Application,
    Stage,
    ColorLayer,
    BitmapText,
    Sprite,
    UITextButton,
    pool
} from "melonjs";

import PlayerEntity from "../renderables/player";
import AppleEntity from "../renderables/apple";


class PlayScreen extends Stage {

    private app!: Application;

    private appleTimer = 0;
    private appleInterval = 600;
    private ultimaPosicionX = -1;

    private manzanasActivas = 0;
    private maxManzanas = 6;

    private manzanasRojasCaidas = 0;
    private manzanasVerdesAtrapadas = 0;
    private manzanasRojasAtrapadas = 0;

    private juegoTerminado = false;
    private resultado: "victoria" | "derrota" | null = null;

    private canasta!: PlayerEntity;

    private manzanas: AppleEntity[] = [];

    private contadorIzquierdo!: BitmapText;
    private contadorCentro!: BitmapText;
    private contadorDerecha!: BitmapText;

    // Elementos de la pantalla de resultado
    private fondoResultado?: ColorLayer;
    private tituloResultado?: BitmapText;
    private mensajeResultado?: BitmapText;
    private botonReintentar?: UITextButton;


    // =====================================================
    // PANTALLA DE RESULTADO
    // =====================================================

    private mostrarResultado(
        resultado: "victoria" | "derrota"
    ) {

        // Fondo oscuro
        this.fondoResultado = new ColorLayer(
            "pantallaResultado",
            "#000000"
        );

        this.app.world.addChild(
            this.fondoResultado,
            100
        );


        // Texto dependiendo del resultado
        const tituloTexto =
            resultado === "victoria"
                ? "VICTORIA"
                : "DERROTA";

        const mensajeTexto =
            resultado === "victoria"
                ? "¡LO LOGRASTE!"
                : "¡HAS PERDIDO!";


        // =================================================
        // TÍTULO
        // =================================================

        this.tituloResultado = new BitmapText(
            250,
            180,
            {
                font: "PressStart2P",
                text: tituloTexto,
                size: 2,
                textAlign: "center",
            }
        );

        this.app.world.addChild(
            this.tituloResultado,
            101
        );


        // =================================================
        // MENSAJE
        // =================================================

        this.mensajeResultado = new BitmapText(
            250,
            250,
            {
                font: "PressStart2P",
                text: mensajeTexto,
                size: 1,
                textAlign: "center",
            }
        );

        this.app.world.addChild(
            this.mensajeResultado,
            101
        );


        // =================================================
        // BOTÓN
        // =================================================

        this.botonReintentar = new UITextButton(
            250,
            350,
            {
                text: "VOLVER A JUGAR",
                font: "PressStart2P",
                size: 1,
            }
        );

        this.botonReintentar.anchorPoint.set(
            0.5,
            0.5
        );


        this.botonReintentar.onClick = () => {

            console.log("VOLVER A JUGAR");

            this.reiniciarJuego();

            return true;
        };


        this.app.world.addChild(
            this.botonReintentar,
            101
        );
    }


    // =====================================================
    // REINICIAR JUEGO
    // =====================================================

    private reiniciarJuego() {

        console.log("REINICIANDO JUEGO");


        // =================================================
        // QUITAR PANTALLA DE RESULTADO
        // =================================================

        if (this.fondoResultado) {
            this.app.world.removeChild(
                this.fondoResultado
            );
        }

        if (this.tituloResultado) {
            this.app.world.removeChild(
                this.tituloResultado
            );
        }

        if (this.mensajeResultado) {
            this.app.world.removeChild(
                this.mensajeResultado
            );
        }

        if (this.botonReintentar) {
            this.app.world.removeChild(
                this.botonReintentar
            );
        }


        // Limpiar referencias
        this.fondoResultado = undefined;
        this.tituloResultado = undefined;
        this.mensajeResultado = undefined;
        this.botonReintentar = undefined;


        // =================================================
        // QUITAR MANZANAS
        // =================================================

        for (const manzana of this.manzanas) {

            this.app.world.removeChild(
                manzana
            );
        }

        this.manzanas = [];


        // =================================================
        // QUITAR CANASTA
        // =================================================

        if (this.canasta) {

            this.app.world.removeChild(
                this.canasta
            );
        }


        // =================================================
        // REINICIAR VARIABLES
        // =================================================

        this.appleTimer = 0;

        this.ultimaPosicionX = -1;

        this.manzanasActivas = 0;

        this.manzanasRojasCaidas = 0;

        this.manzanasVerdesAtrapadas = 0;

        this.manzanasRojasAtrapadas = 0;

        this.juegoTerminado = false;

        this.resultado = null;


        // =================================================
        // CREAR NUEVAMENTE LA PARTIDA
        // =================================================

        this.onResetEvent(this.app);


        console.log("JUEGO REINICIADO");
    }


    // =====================================================
    // TERMINAR JUEGO
    // =====================================================

    private terminarJuego(
        resultado: "victoria" | "derrota"
    ) {

        if (this.juegoTerminado) {
            return;
        }


        this.juegoTerminado = true;

        this.resultado = resultado;


        // Pausar jugador
        this.canasta.pausado = true;


        // Pausar todas las manzanas
        for (const manzana of this.manzanas) {
            manzana.pausado = true;
        }


        console.log(
            resultado === "victoria"
                ? "¡VICTORIA!"
                : "¡DERROTA!"
        );


        this.mostrarResultado(
            resultado
        );
    }


    // =====================================================
    // CREAR / REINICIAR ESCENA
    // =====================================================

    onResetEvent(app: Application) {

        this.app = app;


        // =================================================
        // REINICIAR VARIABLES
        // =================================================

        this.appleTimer = 0;

        this.manzanasActivas = 0;

        this.ultimaPosicionX = -1;

        this.juegoTerminado = false;

        this.resultado = null;

        this.manzanas = [];

        this.manzanasRojasCaidas = 0;

        this.manzanasVerdesAtrapadas = 0;

        this.manzanasRojasAtrapadas = 0;


        // =================================================
        // FONDO
        // =================================================

        app.world.addChild(
            new ColorLayer(
                "background",
                "#202020"
            )
        );


        // =================================================
        // IMAGEN DE FONDO
        // =================================================

        const fondo = new Sprite(
            250,
            300,
            {
                image: "fondo",
            }
        );

        fondo.scale(2);

        app.world.addChild(
            fondo
        );


        // =================================================
        // ÁRBOL
        // =================================================

        const arbol = new Sprite(
            222,
            320,
            {
                image: "arbol",
            }
        );

        arbol.scale(
            8.45,
            4.5
        );

        app.world.addChild(
            arbol
        );


        // =================================================
        // CANASTA
        // =================================================

        this.canasta = pool.pull(
            "mainPlayer",
            225,
            500,
            {
                image: "player",
            }
        ) as PlayerEntity;

        this.canasta.scale(3);

        this.canasta.pausado = false;

        app.world.addChild(
            this.canasta
        );


        // =================================================
        // INTERFAZ
        // =================================================


        // -------------------------
        // CONTADOR ROJAS ATRAPADAS
        // -------------------------

        this.contadorIzquierdo =
            new BitmapText(
                15,
                20,
                {
                    font: "PressStart2P",
                    text: "00/50",
                    size: 1,
                }
            );

        app.world.addChild(
            this.contadorIzquierdo
        );


        const manzanaRojaIzquierda =
            new Sprite(
                140,
                30,
                {
                    image: "manzana_roja",
                }
            );

        manzanaRojaIzquierda.scale(
            1.5
        );

        app.world.addChild(
            manzanaRojaIzquierda
        );


        // -------------------------
        // CONTADOR ROJAS CAÍDAS
        // -------------------------

        this.contadorCentro =
            new BitmapText(
                195,
                20,
                {
                    font: "PressStart2P",
                    text: "00/03",
                    size: 1,
                }
            );

        app.world.addChild(
            this.contadorCentro
        );


        const manzanaRojaCentro =
            new Sprite(
                320,
                30,
                {
                    image: "manzana_roja",
                }
            );

        manzanaRojaCentro.scale(
            1.5
        );

        app.world.addChild(
            manzanaRojaCentro
        );


        // -------------------------
        // CONTADOR VERDES ATRAPADAS
        // -------------------------

        this.contadorDerecha =
            new BitmapText(
                365,
                20,
                {
                    font: "PressStart2P",
                    text: "00/03",
                    size: 1,
                }
            );

        app.world.addChild(
            this.contadorDerecha
        );


        const manzanaVerde =
            new Sprite(
                489,
                30,
                {
                    image: "manzana_verde",
                }
            );

        manzanaVerde.scale(
            1.5
        );

        app.world.addChild(
            manzanaVerde
        );
    }

    // UPDATE
    update(dt: number) {

        if (!this.juegoTerminado) {

            this.appleTimer += dt;

            // CREAR MANZANA
            if (
                this.appleTimer >=
                this.appleInterval &&
                this.manzanasActivas <
                this.maxManzanas
            ) {

                this.appleTimer = 0;


                let x: number;


                do {

                    x =
                        100 +
                        Math.random() *
                        300;

                } while (
                    Math.abs(
                        x -
                        this.ultimaPosicionX
                    ) < 70
                );

                // VELOCIDAD SEGÚN DISTANCIA

                const distancia =
                    Math.abs(
                        x -
                        this.ultimaPosicionX
                    );


                const velocidadCaida = 0.35 - (distancia / 300) * 0.20;


                this.ultimaPosicionX = x;


                // TIPO DE MANZANA
                const tipoManzana =
                    Math.random() < 0.40
                        ? "manzana_verde"
                        : "manzana_roja";


                // CREAR MANZANA
                const manzana =
                    pool.pull(
                        "apple",
                        x,
                        250,
                        {

                            image:
                                tipoManzana,

                            velocidadCaida:
                                velocidadCaida,


                            // MANZANA CAYENDO

                            onRemoved:
                                (tipo: string) => {

                                this.manzanasActivas--;


                                this.manzanas =
                                    this.manzanas.filter(
                                        m =>
                                            m !==
                                            manzana
                                    );


                                if (
                                    tipo ===
                                    "manzana_roja"
                                ) {

                                    this.manzanasRojasCaidas++;


                                    this.contadorCentro
                                        .setText(
                                            `${this.manzanasRojasCaidas
                                                .toString()
                                                .padStart(
                                                    2,
                                                    "0"
                                                )}/03`
                                        );


                                    console.log(
                                        "ROJAS CAÍDAS:",
                                        this.manzanasRojasCaidas
                                    );


                                    // 3 rojas caídas
                                    // = DERROTA

                                    if (
                                        this.manzanasRojasCaidas >=
                                        3
                                    ) {

                                        this.terminarJuego(
                                            "derrota"
                                        );
                                    }
                                }
                            },


                            // MANZANA ATRAPADA

                            onCaught:
                                (tipo: string) => {

                                this.manzanasActivas--;


                                this.manzanas =
                                    this.manzanas.filter(
                                        m =>
                                            m !==
                                            manzana
                                    );


                                // ROJA

                                if (
                                    tipo ===
                                    "manzana_roja"
                                ) {

                                    this.manzanasRojasAtrapadas++;


                                    this.contadorIzquierdo
                                        .setText(
                                            `${this.manzanasRojasAtrapadas
                                                .toString()
                                                .padStart(
                                                    2,
                                                    "0"
                                                )}/50`
                                        );


                                    console.log(
                                        "ROJAS ATRAPADAS:",
                                        this.manzanasRojasAtrapadas
                                    );


                                    // 50 rojas
                                    // = VICTORIA

                                    if (
                                        this.manzanasRojasAtrapadas >=
                                        50
                                    ) {

                                        this.terminarJuego(
                                            "victoria"
                                        );
                                    }
                                }

                                // VERDE

                                if (
                                    tipo ===
                                    "manzana_verde"
                                ) {

                                    this.manzanasVerdesAtrapadas++;


                                    this.contadorDerecha
                                        .setText(
                                            `${this.manzanasVerdesAtrapadas
                                                .toString()
                                                .padStart(
                                                    2,
                                                    "0"
                                                )}/03`
                                        );


                                    // 3 verdes
                                    // = DERROTA

                                    if (
                                        this.manzanasVerdesAtrapadas >=
                                        3
                                    ) {

                                        this.terminarJuego(
                                            "derrota"
                                        );
                                    }
                                }
                            },
                        }
                    ) as AppleEntity;


                // ACTIVAR MANZANA

                manzana.pausado = false;

                this.manzanas.push(
                    manzana
                );

                this.app.world.addChild(
                    manzana
                );

                this.manzanasActivas++;
            }
        }


        return super.update(dt);
    }
}


export default PlayScreen;
"use client";

import { useEffect, useRef } from 'react';
import { Application, Assets, Container, Sprite, Graphics } from 'pixi.js';

export default function CanvasComponent({ selectedTraits, categories }) {
    const canvasRef = useRef(null);
    const pixiAppRef = useRef(null);

    const assembleImage = () => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        // Définir la taille de l’image finale
        canvas.width = 500;  // ou la taille souhaitée
        canvas.height = 500;

        Object.entries(selectedTraits).forEach(([category, trait]) => {
            const image = new Image();
            image.src = `/layers/${category}/${trait}.png`;  // chemin vers chaque trait
            image.onload = () => {
                context.drawImage(image, 0, 0, canvas.width, canvas.height);
                // Capture après chargement complet
                if (onCapture) {
                    const imageUrl = canvas.toDataURL("image/png");
                    onCapture(imageUrl);
                }
            };
        });
    };

    useEffect(() => {
        // Vérifier si l'application Pixi existe déjà pour éviter les duplications
        if (!pixiAppRef.current) {
            const app = new Application

            // Initialiser Pixi
            app.init({ backgroundAlpha: 0 }).then(() => {
                pixiAppRef.current = app;
                canvasRef.current.appendChild(app.canvas);  // Ajouter le canvas une seule fois

                const loadTextures = async () => {
                    const container = new Container();
                    app.stage.addChild(container);

                    for (const category of categories) {
                        const trait = selectedTraits[category];
                        if (trait) {
                            const texturePath = `/layers/${category}/${trait}.png`;
                            const texture = await Assets.load(texturePath);
                            const sprite = new Sprite(texture);

                            // Crée un rectangle arrondi comme masque
                            const mask = new Graphics();
                            mask.beginFill(0xffffff);
                            mask.drawRoundedRect(-250, -250, 500, 500, 20); // Dernier paramètre = rayon des coins
                            mask.endFill();

                            // Positionne le masque au centre de l'image
                            mask.x = app.screen.width / 2;
                            mask.y = app.screen.height / 2;

                            // Applique le masque au sprite
                            sprite.mask = mask;

                            // Centrer les sprites dans le canvas
                            sprite.anchor.set(0.5);
                            sprite.x = app.screen.width / 2;
                            sprite.y = app.screen.height / 2;

                            // Ajustement de la taille pour correspondre au canvas
                            sprite.width = 500;
                            sprite.height = 500;

                            container.addChild(mask); // Ajoute le masque au container
                            container.addChild(sprite);
                        }
                    }
                };

                loadTextures();
            });
        }

        // Cleanup pour détruire Pixi et supprimer le canvas quand le composant est démonté
        return () => {
            if (pixiAppRef.current) {
                pixiAppRef.current.destroy(true, { children: true });
                pixiAppRef.current = null;
            }
        };
    }, [selectedTraits, categories]);

    return <div ref={canvasRef} className="w-full h-full" />;
}
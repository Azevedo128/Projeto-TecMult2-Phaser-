import { Scene } from 'phaser';

export function createDinoAnimations(scene: Scene)
{
    if (!scene.anims.exists('dino-idle'))
    {
        scene.anims.create({
            key: 'dino-idle',
            frames: Array.from({ length: 10 }, (_, i) => ({
                key: `dino-idle-${i + 1}`
            })),
            frameRate: 8,
            repeat: -1
        });
    }

    if (!scene.anims.exists('dino-run'))
    {
        scene.anims.create({
            key: 'dino-run',
            frames: Array.from({ length: 8 }, (_, i) => ({
                key: `dino-run-${i + 1}`
            })),
            frameRate: 12,
            repeat: -1
        });
    }

    if (!scene.anims.exists('dino-jump'))
    {
        scene.anims.create({
            key: 'dino-jump',
            frames: Array.from({ length: 10 }, (_, i) => ({
                key: `dino-jump-${i + 1}`
            })),
            frameRate: 35,
            repeat: 0
        });
    }
}
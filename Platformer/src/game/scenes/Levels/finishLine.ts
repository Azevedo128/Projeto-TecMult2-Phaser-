import { Scene } from 'phaser';

const FINISH_DEPTH = 4;

type FinishLineOptions = {
    height?: number;
    width?: number;
    triggerWidth?: number;
    checkerSize?: number;
    postColor?: number;
    accentColor?: number;
    markerTexture?: string;
    markerScale?: number;
    markerOffsetX?: number;
    markerFlipX?: boolean;
};

export function createFinishLine(
    scene: Scene,
    finish: Phaser.Physics.Arcade.StaticGroup,
    x: number,
    floorY: number,
    triggerTexture: string,
    options: FinishLineOptions = {}
)
{
    const height = options.height ?? 300;
    const width = options.width ?? 96;
    const checkerSize = options.checkerSize ?? 24;
    const triggerWidth = options.triggerWidth ?? width + 34;
    const postColor = options.postColor ?? 0x2f241a;
    const accentColor = options.accentColor ?? 0xf3cf62;
    const topY = floorY - height;
    const centerY = floorY - height / 2;
    const leftPostX = x - width / 2;
    const rightPostX = x + width / 2;

    scene.add.rectangle(leftPostX, centerY, 12, height, postColor)
        .setDepth(FINISH_DEPTH);

    scene.add.rectangle(rightPostX, centerY, 12, height, postColor)
        .setDepth(FINISH_DEPTH);

    scene.add.rectangle(x, topY, width + 34, 14, accentColor)
        .setDepth(FINISH_DEPTH + 1);

    createCheckeredLine(scene, x, floorY, height, checkerSize);
    createFinishMarker(scene, x, floorY, options);

    const trigger = scene.physics.add.staticImage(x, centerY, triggerTexture);

    trigger.setVisible(false);
    trigger.setDisplaySize(triggerWidth, height);
    trigger.refreshBody();

    finish.add(trigger);
}

function createCheckeredLine(
    scene: Scene,
    x: number,
    floorY: number,
    height: number,
    checkerSize: number
)
{
    const rows = Math.floor(height / checkerSize);
    const columns = 2;
    const startX = x - checkerSize / 2;

    for (let row = 0; row < rows; row++)
    {
        for (let column = 0; column < columns; column++)
        {
            const color = (row + column) % 2 === 0 ? 0xffffff : 0x111111;

            scene.add.rectangle(
                startX + column * checkerSize,
                floorY - checkerSize / 2 - row * checkerSize,
                checkerSize,
                checkerSize,
                color
            ).setDepth(FINISH_DEPTH + 2);
        }
    }
}

function createFinishMarker(scene: Scene, x: number, floorY: number, options: FinishLineOptions)
{
    if (!options.markerTexture)
    {
        return;
    }

    const marker = scene.add.image(
        x + (options.markerOffsetX ?? -115),
        floorY,
        options.markerTexture
    )
        .setOrigin(0.5, 1)
        .setScale(options.markerScale ?? 1)
        .setDepth(FINISH_DEPTH + 1);

    if (options.markerFlipX)
    {
        marker.setFlipX(true);
    }
}

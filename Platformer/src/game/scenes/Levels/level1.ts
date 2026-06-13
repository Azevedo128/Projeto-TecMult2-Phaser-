import { Scene } from 'phaser';

export function createLevel1(scene: Scene)
{
    const width = scene.scale.width;
    const height = scene.scale.height;
    const worldWidth = 4000;
    const worldHeight = height * 2;

    scene.physics.world.setBounds(0, 0, worldWidth, worldHeight);
    scene.cameras.main.setBounds(0, 0, worldWidth, worldHeight);

    for (let x = width / 2; x < worldWidth; x += width)
    {
        scene.add.image(x, worldHeight / 2, 'map-bg')
            .setDisplaySize(width, worldHeight)
            .setAlpha(1);
    }

    const platforms = scene.physics.add.staticGroup();

    createTilePlatform(scene, platforms, 0, worldHeight - 80, 10);

    return {
        platforms,
        worldWidth,
        worldHeight,
        spawnX: 150,
        spawnY: worldHeight - 380
    };
}

function createTilePlatform(
    scene: Scene,
    platforms: Phaser.Physics.Arcade.StaticGroup,
    startX: number,
    y: number,
    tileCount: number
)
{
    const tileSize = 256;

    for (let i = 0; i < tileCount; i++)
    {
        let texture = 'ground-middle';

        if (i === 0)
        {
            texture = 'ground-left';
        }
        else if (i === tileCount - 1)
        {
            texture = 'ground-right';
        }

        const tile = scene.physics.add.staticImage(
            startX + i * tileSize,
            y,
            texture
        );

        tile.setDisplaySize(tileSize, tileSize);
        tile.refreshBody();

        platforms.add(tile);
    }
}
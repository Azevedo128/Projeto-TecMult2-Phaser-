import { Scene } from 'phaser';

export function createLevel1(scene: Scene)
{
    const width = scene.scale.width;
    const height = scene.scale.height;
    const worldWidth = 4000;
    const worldHeight = height * 2;

    scene.physics.world.setBounds(0, 0, worldWidth, worldHeight);
    //scene.cameras.main.setBounds(0, 0, worldWidth, worldHeight);

    for (let x = width / 2; x < worldWidth; x += width)
    {
        scene.add.image(x, worldHeight / 2, 'map-bg')
            .setDisplaySize(width, worldHeight)
            .setAlpha(1);
    }

    const platforms = scene.physics.add.staticGroup();

    createPlatform(scene, platforms, 0, worldHeight - 40, 200000, 80);
    //createPlatform(scene, platforms, 1600, worldHeight - 300, 500, 80);
    //createPlatform(scene, platforms, 2600, worldHeight - 500, 500, 80);

    return {
        platforms,
        worldWidth,
        worldHeight,
        spawnX: 150,
        spawnY: worldHeight - 180
    };
}

function createPlatform(
    scene: Scene,
    platforms: Phaser.Physics.Arcade.StaticGroup,
    x: number,
    y: number,
    width: number,
    height: number
)
{
    const platform = scene.add.rectangle(x, y, width, height, 0x654321);
    scene.physics.add.existing(platform, true);
    platforms.add(platform);
}
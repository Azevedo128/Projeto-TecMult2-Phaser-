import { Scene } from 'phaser';
import { createFinishLine } from './finishLine';

const TILE_SIZE = 128;
const BACKGROUND_DEPTH = -30;
const WATER_DEPTH = -25;
const DECORATION_DEPTH = -10;
const PLATFORM_DEPTH = 0;
const CRATE_SCALE = 0.85;
const CRATE_STACK_OFFSET = 65;

type PlatformSpec = {
    kind: 'ground' | 'floating';
    x: number;
    y: number;
    tiles: number;
};

type DecorationSpec = {
    x: number;
    y: number;
    texture: string;
    scale: number;
    flipX?: boolean;
};

export function createLevel1(scene: Scene)
{
    const width = scene.scale.width;
    const height = scene.scale.height;
    const worldWidth = 15000;
    const worldHeight = height * 2;
    const groundY = worldHeight - 208;

    scene.physics.world.setBounds(0, 0, worldWidth, worldHeight);
    scene.cameras.main.setBounds(0, 0, worldWidth, worldHeight);

    createBackground(scene, width, worldWidth, worldHeight);
    createWater(scene, worldWidth, groundY);

    const platforms = scene.physics.add.staticGroup();
    const finish = scene.physics.add.staticGroup();

    createPlatforms(scene, platforms, worldHeight, groundY);
    createDecorations(scene, groundY);
    createFinishLine(scene, finish, 13632, surfaceY(groundY), 'sign-2', {
        postColor: 0x6b3f1f,
        accentColor: 0x8fce33
    });

    return {
        platforms,
        finish,
        worldWidth,
        worldHeight,
        spawnX: 180,
        spawnY: groundY - 300
    };
}

function createBackground(
    scene: Scene,
    screenWidth: number,
    worldWidth: number,
    worldHeight: number
)
{
    for (let x = screenWidth / 2; x < worldWidth; x += screenWidth)
    {
        scene.add.image(x, worldHeight / 2, 'map-bg')
            .setDisplaySize(screenWidth, worldHeight)
            .setAlpha(1)
            .setDepth(BACKGROUND_DEPTH);
    }
}

function createWater(scene: Scene, worldWidth: number, groundY: number)
{
    const waterTop = groundY + 210;

    scene.add.rectangle(worldWidth / 2, waterTop + 110, worldWidth, 220, 0x2fa8ff)
        .setDepth(WATER_DEPTH)
        .setAlpha(0.9);

    for (let x = 64; x < worldWidth; x += 128)
    {
        scene.add.ellipse(x, waterTop, 120, 34, 0x79d8ff)
            .setDepth(WATER_DEPTH + 1)
            .setAlpha(0.55);
    }
}

function createPlatforms(
    scene: Scene,
    platforms: Phaser.Physics.Arcade.StaticGroup,
    worldHeight: number,
    groundY: number
)
{
    const platformLayout: PlatformSpec[] = [
        { kind: 'ground', x: 64, y: groundY, tiles: 12 },
        { kind: 'ground', x: 1984, y: groundY, tiles: 5 },

        { kind: 'floating', x: 2880, y: groundY - 180, tiles: 2 },
        { kind: 'floating', x: 3328, y: groundY - 310, tiles: 2 },
        { kind: 'ground', x: 3840, y: groundY - 128, tiles: 7 },

        { kind: 'floating', x: 4864, y: groundY - 360, tiles: 2 },
        { kind: 'ground', x: 5248, y: groundY, tiles: 7 },

        { kind: 'floating', x: 6464, y: groundY - 190, tiles: 2 },
        { kind: 'floating', x: 6976, y: groundY - 300, tiles: 2 },
        { kind: 'ground', x: 7424, y: groundY - 128, tiles: 6 },

        { kind: 'ground', x: 8512, y: groundY, tiles: 5 },
        { kind: 'floating', x: 9408, y: groundY - 210, tiles: 3 },
        { kind: 'floating', x: 10048, y: groundY - 330, tiles: 2 },
        { kind: 'floating', x: 10560, y: groundY - 190, tiles: 2 },

        { kind: 'ground', x: 11136, y: groundY - 128, tiles: 7 },
        { kind: 'ground', x: 12480, y: groundY, tiles: 3 },
        { kind: 'ground', x: 13504, y: groundY, tiles: 5 }
    ];

    for (const platform of platformLayout)
    {
        if (platform.kind === 'ground')
        {
            createGroundPlatform(scene, platforms, platform.x, platform.y, platform.tiles, worldHeight);
        }
        else
        {
            createFloatingPlatform(scene, platforms, platform.x, platform.y, platform.tiles);
        }
    }
}

function createGroundPlatform(
    scene: Scene,
    platforms: Phaser.Physics.Arcade.StaticGroup,
    startX: number,
    y: number,
    tileCount: number,
    worldHeight: number
)
{
    createTilePlatform(scene, platforms, startX, y, tileCount, 'ground');

    const dirtRows = Math.ceil((worldHeight - y) / TILE_SIZE) + 2;

    for (let row = 0; row < dirtRows; row++)
    {
        createTilePlatform(
            scene,
            platforms,
            startX,
            y + (row + 1) * TILE_SIZE,
            tileCount,
            'dirt'
        );
    }
}

function createFloatingPlatform(
    scene: Scene,
    platforms: Phaser.Physics.Arcade.StaticGroup,
    startX: number,
    y: number,
    tileCount: number
)
{
    createTilePlatform(scene, platforms, startX, y, tileCount, 'floating-ground');
}

function createTilePlatform(
    scene: Scene,
    platforms: Phaser.Physics.Arcade.StaticGroup,
    startX: number,
    y: number,
    tileCount: number,
    tileType: 'ground' | 'floating-ground' | 'dirt'
)
{
    for (let i = 0; i < tileCount; i++)
    {
        let texture = `${tileType}-middle`;

        if (i === 0)
        {
            texture = `${tileType}-left`;
        }
        else if (i === tileCount - 1)
        {
            texture = `${tileType}-right`;
        }

        const tile = scene.physics.add.staticImage(
            startX + i * TILE_SIZE,
            y,
            texture
        );

        tile.setDisplaySize(TILE_SIZE, TILE_SIZE);
        tile.setDepth(PLATFORM_DEPTH);
        tile.refreshBody();

        platforms.add(tile);
    }
}

function createDecorations(scene: Scene, groundY: number)
{
    const floorY = surfaceY(groundY);
    const highFloorY = surfaceY(groundY - 128);
    const floatingLowY = surfaceY(groundY - 190);
    const floatingHighY = surfaceY(groundY - 330);

    const decorations: DecorationSpec[] = [
        { x: 340, y: floorY, texture: 'sign-1', scale: 0.95 },
        { x: 620, y: floorY, texture: 'tree-1', scale: 1.45 },
        { x: 820, y: floorY, texture: 'tree-2', scale: 1.2, flipX: true },
        { x: 1120, y: floorY, texture: 'bush-1', scale: 1.35 },
        { x: 1310, y: floorY, texture: 'mushroom-1', scale: 1 },

        { x: 2050, y: floorY, texture: 'stone', scale: 1.1 },
        { x: 2240, y: floorY, texture: 'bush-2', scale: 1.25 },

        { x: 2870, y: surfaceY(groundY - 180), texture: 'mushroom-2', scale: 0.85 },
        { x: 3430, y: surfaceY(groundY - 310), texture: 'crate', scale: 0.8 },

        { x: 3890, y: highFloorY, texture: 'tree-2', scale: 1.35 },
        { x: 4140, y: highFloorY, texture: 'tree-3', scale: 1.15, flipX: true },
        { x: 4380, y: highFloorY, texture: 'bush-3', scale: 1.3 },
        { x: 4550, y: highFloorY, texture: 'mushroom-1', scale: 0.95 },

        { x: 5280, y: floorY, texture: 'bush-4', scale: 1.35 },
        { x: 5520, y: floorY, texture: 'tree-1', scale: 1.35, flipX: true },
        { x: 5900, y: floorY, texture: 'stone', scale: 1 },

        { x: 6470, y: floatingLowY, texture: 'mushroom-1', scale: 0.9 },
        { x: 7040, y: surfaceY(groundY - 300), texture: 'crate', scale: 0.75 },

        { x: 7520, y: highFloorY, texture: 'tree-3', scale: 1.25 },
        { x: 7760, y: highFloorY, texture: 'bush-1', scale: 1.3 },
        { x: 7980, y: highFloorY, texture: 'mushroom-2', scale: 0.9 },

        { x: 8580, y: floorY, texture: 'sign-2', scale: 0.95 },
        { x: 8800, y: floorY, texture: 'tree-2', scale: 1.35 },
        { x: 8990, y: floorY, texture: 'bush-2', scale: 1.2 },

        { x: 9450, y: surfaceY(groundY - 210), texture: 'crate', scale: 0.75 },
        { x: 10070, y: floatingHighY, texture: 'mushroom-1', scale: 0.8 },
        { x: 10610, y: floatingLowY, texture: 'stone', scale: 0.85 },

        { x: 11280, y: highFloorY, texture: 'tree-1', scale: 1.4 },
        { x: 11520, y: highFloorY, texture: 'tree-2', scale: 1.15, flipX: true },
        { x: 11830, y: highFloorY, texture: 'bush-4', scale: 1.25 }
    ];

    for (const decoration of decorations)
    {
        addDecoration(scene, decoration);
    }

    addCrateStack(scene, 5700, floorY);
}

function surfaceY(platformY: number)
{
    return platformY - TILE_SIZE / 2;
}

function addDecoration(scene: Scene, decoration: DecorationSpec)
{
    const image = scene.add.image(decoration.x, decoration.y, decoration.texture)
        .setOrigin(0.5, 1)
        .setScale(decoration.scale)
        .setDepth(DECORATION_DEPTH);

    if (decoration.flipX)
    {
        image.setFlipX(true);
    }
}

function addCrateStack(scene: Scene, x: number, y: number)
{
    addDecoration(scene, { x, y, texture: 'crate', scale: CRATE_SCALE });
    addDecoration(scene, { x: x + CRATE_STACK_OFFSET, y, texture: 'crate', scale: CRATE_SCALE });
    addDecoration(scene, {
        x: x + CRATE_STACK_OFFSET / 2,
        y: y - CRATE_STACK_OFFSET,
        texture: 'crate',
        scale: CRATE_SCALE
    });
}

import { Scene } from 'phaser';

const TILE_SIZE = 128;
const BACKGROUND_DEPTH = -35;
const DECORATION_DEPTH = -8;
const PLATFORM_DEPTH = 0;
const ACID_DEPTH = PLATFORM_DEPTH - 1;
const HAZARD_DEPTH = 2;
const ACID_SURFACE_Y_OFFSET = 72;

type HitboxConfig = {
    width: number;
    height: number;
    offsetX: number;
    offsetY: number;
};

type PlatformSpec = {
    kind: 'ground' | 'floating';
    x: number;
    y: number;
    tiles: number;
};

type HazardSpec = {
    kind: 'spike';
    x: number;
    y: number;
};

const FLOATING_PLATFORM_HITBOX: HitboxConfig = {
    width: 120,
    height: 62,
    offsetX: 4,
    offsetY: 0
};

const ACID_HITBOX: HitboxConfig = {
    width: 116,
    height: 56,
    offsetX: 6,
    offsetY: 64
};

const SPIKE_HITBOX: HitboxConfig = {
    width: 80,
    height: 76,
    offsetX: 4,
    offsetY: 12
};

export function createLevel2(scene: Scene)
{
    const width = scene.scale.width;
    const height = scene.scale.height;
    const worldWidth = 14500;
    const worldHeight = height * 2;
    const groundY = worldHeight - 208;

    scene.physics.world.setBounds(0, 0, worldWidth, worldHeight);
    scene.cameras.main.setBounds(0, 0, worldWidth, worldHeight);

    createBackground(scene, worldWidth, worldHeight);

    const platforms = scene.physics.add.staticGroup();
    const hazards = scene.physics.add.staticGroup();

    createPlatforms(scene, platforms, worldHeight, groundY);
    createHazards(scene, hazards, groundY, worldWidth, worldHeight);
    createDecorations(scene, groundY);

    return {
        platforms,
        hazards,
        worldWidth,
        worldHeight,
        spawnX: 180,
        spawnY: groundY - 300
    };
}

function createBackground(scene: Scene, worldWidth: number, worldHeight: number)
{
    scene.cameras.main.setBackgroundColor(0x11131b);

    for (let x = TILE_SIZE / 2; x < worldWidth; x += TILE_SIZE)
    {
        for (let y = TILE_SIZE / 2; y < worldHeight; y += TILE_SIZE)
        {
            const column = Math.floor(x / TILE_SIZE);
            const row = Math.floor(y / TILE_SIZE);
            let texture = getWallPanelTexture(column, row);

            if (row === 0)
            {
                texture = column % 5 === 0 ? 'level2-bg-1' : 'level2-bg-2';
            }
            else if (y > worldHeight - TILE_SIZE)
            {
                texture = 'level2-bg-7';
            }

            scene.add.image(x, y, texture)
                .setDisplaySize(TILE_SIZE, TILE_SIZE)
                .setDepth(BACKGROUND_DEPTH);
        }
    }

    createBackgroundBeams(scene, worldWidth, worldHeight);
    createBackgroundLights(scene, worldWidth);
}

function getWallPanelTexture(column: number, row: number)
{
    const pattern = (column + row) % 4;

    if (pattern === 0)
    {
        return 'level2-bg-3';
    }

    if (pattern === 1)
    {
        return 'level2-bg-4';
    }

    if (pattern === 2)
    {
        return 'level2-bg-5';
    }

    return 'level2-bg-6';
}

function createBackgroundBeams(scene: Scene, worldWidth: number, worldHeight: number)
{
    for (let x = TILE_SIZE * 2; x < worldWidth; x += TILE_SIZE * 4)
    {
        scene.add.rectangle(x, worldHeight / 2, 24, worldHeight, 0x0b0d13, 0.28)
            .setDepth(BACKGROUND_DEPTH + 1);
    }

    for (let y = TILE_SIZE * 2; y < worldHeight; y += TILE_SIZE * 3)
    {
        scene.add.rectangle(worldWidth / 2, y, worldWidth, 18, 0x0b0d13, 0.22)
            .setDepth(BACKGROUND_DEPTH + 1);
    }
}

function createBackgroundLights(scene: Scene, worldWidth: number)
{
    for (let x = TILE_SIZE / 2; x < worldWidth; x += TILE_SIZE * 5)
    {
        scene.add.rectangle(x - 18, 58, 28, 10, 0xfff04a, 1)
            .setDepth(BACKGROUND_DEPTH + 2);

        scene.add.rectangle(x + 18, 58, 28, 10, 0xffd500, 1)
            .setDepth(BACKGROUND_DEPTH + 2);

        scene.add.rectangle(x, 58, 76, 18, 0x08090d, 0.65)
            .setDepth(BACKGROUND_DEPTH + 1);
    }
}

function createPlatforms(
    scene: Scene,
    platforms: Phaser.Physics.Arcade.StaticGroup,
    worldHeight: number,
    groundY: number
)
{
    const layout: PlatformSpec[] = [
        { kind: 'ground', x: 64, y: groundY, tiles: 9 },
        { kind: 'ground', x: 1664, y: groundY, tiles: 4 },

        { kind: 'floating', x: 2560, y: groundY - 190, tiles: 2 },
        { kind: 'floating', x: 3072, y: groundY - 320, tiles: 2 },
        { kind: 'ground', x: 3712, y: groundY - 128, tiles: 6 },

        { kind: 'floating', x: 4864, y: groundY - 300, tiles: 3 },
        { kind: 'ground', x: 5632, y: groundY, tiles: 7 },

        { kind: 'floating', x: 6848, y: groundY - 210, tiles: 2 },
        { kind: 'floating', x: 7360, y: groundY - 340, tiles: 2 },
        { kind: 'floating', x: 7872, y: groundY - 230, tiles: 2 },

        { kind: 'ground', x: 8512, y: groundY - 128, tiles: 7 },
        { kind: 'ground', x: 9792, y: groundY, tiles: 5 },

        { kind: 'floating', x: 10816, y: groundY - 180, tiles: 2 },
        { kind: 'floating', x: 11328, y: groundY - 320, tiles: 2 },
        { kind: 'ground', x: 11968, y: groundY - 128, tiles: 5 },

        { kind: 'ground', x: 12992, y: groundY, tiles: 9 }
    ];

    for (const platform of layout)
    {
        if (platform.kind === 'ground')
        {
            createMetalGround(scene, platforms, platform.x, platform.y, platform.tiles, worldHeight);
        }
        else
        {
            createFloatingPlatform(scene, platforms, platform.x, platform.y, platform.tiles);
        }
    }
}

function createMetalGround(
    scene: Scene,
    platforms: Phaser.Physics.Arcade.StaticGroup,
    startX: number,
    y: number,
    tileCount: number,
    worldHeight: number
)
{
    createTileRow(scene, platforms, startX, y, tileCount, 'level2-tile-1', 'level2-tile-2', 'level2-tile-3');

    const bodyRows = Math.ceil((worldHeight - y) / TILE_SIZE) + 2;

    for (let row = 0; row < bodyRows; row++)
    {
        createTileRow(
            scene,
            platforms,
            startX,
            y + (row + 1) * TILE_SIZE,
            tileCount,
            'level2-tile-4',
            'level2-tile-5',
            'level2-tile-6'
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
    if (tileCount === 1)
    {
        createStaticTile(scene, platforms, startX, y, 'level2-tile-15', FLOATING_PLATFORM_HITBOX);
        return;
    }

    createTileRow(
        scene,
        platforms,
        startX,
        y,
        tileCount,
        'level2-tile-12',
        'level2-tile-13',
        'level2-tile-14',
        FLOATING_PLATFORM_HITBOX
    );
}

function createTileRow(
    scene: Scene,
    platforms: Phaser.Physics.Arcade.StaticGroup,
    startX: number,
    y: number,
    tileCount: number,
    leftTexture: string,
    middleTexture: string,
    rightTexture: string,
    hitbox?: HitboxConfig
)
{
    for (let i = 0; i < tileCount; i++)
    {
        let texture = middleTexture;

        if (i === 0)
        {
            texture = leftTexture;
        }
        else if (i === tileCount - 1)
        {
            texture = rightTexture;
        }

        createStaticTile(scene, platforms, startX + i * TILE_SIZE, y, texture, hitbox);
    }
}

function createStaticTile(
    scene: Scene,
    platforms: Phaser.Physics.Arcade.StaticGroup,
    x: number,
    y: number,
    texture: string,
    hitbox?: HitboxConfig
)
{
    const tile = scene.physics.add.staticImage(x, y, texture);

    tile.setDisplaySize(TILE_SIZE, TILE_SIZE);
    tile.setDepth(PLATFORM_DEPTH);
    tile.refreshBody();

    if (hitbox)
    {
        setStaticHitbox(tile, hitbox);
    }

    platforms.add(tile);
}

function createHazards(
    scene: Scene,
    hazards: Phaser.Physics.Arcade.StaticGroup,
    groundY: number,
    worldWidth: number,
    worldHeight: number
)
{
    createAcidLake(scene, hazards, groundY + ACID_SURFACE_Y_OFFSET, worldWidth, worldHeight);

    const hazardsLayout: HazardSpec[] = [
        { kind: 'spike', x: 1856, y: groundY },
        { kind: 'spike', x: 6016, y: groundY },
        { kind: 'spike', x: 6272, y: groundY },
        { kind: 'spike', x: 8896, y: groundY - 128 },
        { kind: 'spike', x: 9152, y: groundY - 128 },
        { kind: 'spike', x: 12224, y: groundY - 128 },
        { kind: 'spike', x: 13440, y: groundY }
    ];

    for (const hazard of hazardsLayout)
    {
        createSpike(scene, hazards, hazard.x, surfaceY(hazard.y));
    }
}

function createAcidLake(
    scene: Scene,
    hazards: Phaser.Physics.Arcade.StaticGroup,
    y: number,
    worldWidth: number,
    worldHeight: number
)
{
    const bodyRows = Math.ceil((worldHeight - y) / TILE_SIZE) + 1;

    for (let x = TILE_SIZE / 2; x < worldWidth; x += TILE_SIZE)
    {
        for (let row = 0; row < bodyRows; row++)
        {
            scene.add.image(x, y + (row + 1) * TILE_SIZE, 'level2-acid-body')
                .setDisplaySize(TILE_SIZE, TILE_SIZE)
                .setDepth(ACID_DEPTH - 1);
        }

        const acid = scene.physics.add.staticImage(x, y, 'level2-acid-top');

        acid.setDisplaySize(TILE_SIZE, TILE_SIZE);
        acid.setDepth(ACID_DEPTH);
        acid.refreshBody();
        setStaticHitbox(acid, ACID_HITBOX);

        hazards.add(acid);
    }
}

function createSpike(
    scene: Scene,
    hazards: Phaser.Physics.Arcade.StaticGroup,
    x: number,
    floorY: number
)
{
    const spike = scene.physics.add.staticImage(x, floorY, 'level2-spike');

    spike.setOrigin(0.5, 1);
    spike.setDisplaySize(88, 88);
    spike.setDepth(HAZARD_DEPTH);
    spike.refreshBody();
    setStaticHitbox(spike, SPIKE_HITBOX);

    hazards.add(spike);
}

function setStaticHitbox(object: Phaser.Physics.Arcade.Image, hitbox: HitboxConfig)
{
    const body = object.body as Phaser.Physics.Arcade.StaticBody;

    body.setSize(hitbox.width, hitbox.height, false);
    body.setOffset(hitbox.offsetX, hitbox.offsetY);
}

function createDecorations(scene: Scene, groundY: number)
{
    const floorY = surfaceY(groundY);
    const highFloorY = surfaceY(groundY - 128);

    createFence(scene, 160, floorY, 6);
    createFence(scene, 3860, highFloorY, 4);
    createFence(scene, 5700, floorY, 5);
    createFence(scene, 8610, highFloorY, 5);
    createFence(scene, 13090, floorY, 6);

    addWallPanel(scene, 2624, surfaceY(groundY - 190), 'level2-bg-1');
    addWallPanel(scene, 4928, surfaceY(groundY - 300), 'level2-bg-6');
    addWallPanel(scene, 7424, surfaceY(groundY - 340), 'level2-bg-5');
    addWallPanel(scene, 10880, surfaceY(groundY - 180), 'level2-bg-3');
}

function createFence(scene: Scene, startX: number, floorY: number, parts: number)
{
    for (let i = 0; i < parts; i++)
    {
        const texture = i === 0 ? 'level2-fence-left' : i === parts - 1 ? 'level2-fence-right' : 'level2-fence-middle';

        scene.add.image(startX + i * TILE_SIZE, floorY, texture)
            .setOrigin(0.5, 1)
            .setDisplaySize(TILE_SIZE, TILE_SIZE)
            .setDepth(DECORATION_DEPTH)
            .setAlpha(0.9);
    }
}

function addWallPanel(scene: Scene, x: number, y: number, texture: string)
{
    scene.add.image(x, y, texture)
        .setOrigin(0.5, 1)
        .setDisplaySize(TILE_SIZE, TILE_SIZE)
        .setDepth(DECORATION_DEPTH);
}

function surfaceY(platformY: number)
{
    return platformY - TILE_SIZE / 2;
}

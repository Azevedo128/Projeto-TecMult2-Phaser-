import { Scene } from 'phaser';

const TILE_SIZE = 128;
const BACKGROUND_DEPTH = -35;
const FOG_DEPTH = -20;
const DECORATION_DEPTH = -10;
const PLATFORM_DEPTH = 0;
const HAZARD_DEPTH = 2;

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

type ZombieKind = 'male' | 'female';

type ZombieSpec = {
    kind: ZombieKind;
    x: number;
    y: number;
    leftBound: number;
    rightBound: number;
    speed: number;
    direction?: -1 | 1;
};

type DecorationSpec = {
    x: number;
    y: number;
    texture: string;
    scale: number;
    flipX?: boolean;
    alpha?: number;
};

const FLOATING_PLATFORM_HITBOX: HitboxConfig = {
    width: 116,
    height: 62,
    offsetX: 6,
    offsetY: 0
};

const ZOMBIE_CONFIG: Record<ZombieKind, {
    scale: number;
    bodyWidth: number;
    bodyHeight: number;
    bottomPadding: number;
}> = {
    male: {
        scale: 0.29,
        bodyWidth: 150,
        bodyHeight: 310,
        bottomPadding: 8
    },
    female: {
        scale: 0.265,
        bodyWidth: 165,
        bodyHeight: 325,
        bottomPadding: 12
    }
};

export function createLevel3(scene: Scene)
{
    const height = scene.scale.height;
    const worldWidth = 16000;
    const worldHeight = height * 2;
    const groundY = worldHeight - 208;

    scene.physics.world.setBounds(0, 0, worldWidth, worldHeight);
    scene.cameras.main.setBounds(0, 0, worldWidth, worldHeight);

    createBackground(scene, worldWidth, worldHeight);
    createFog(scene, worldWidth, groundY);

    const platforms = scene.physics.add.staticGroup();
    const hazards = scene.physics.add.group();

    createPlatforms(scene, platforms, worldHeight, groundY);
    createHazards(scene, hazards, platforms, groundY);
    createDecorations(scene, groundY);

    return {
        platforms,
        hazards,
        worldWidth,
        worldHeight,
        spawnX: 180,
        spawnY: groundY - 300,
        update: () => updateZombies(hazards)
    };
}

function createBackground(scene: Scene, worldWidth: number, worldHeight: number)
{
    scene.cameras.main.setBackgroundColor(0x071014);

    const backgroundTexture = scene.textures.get('level3-bg').getSourceImage() as HTMLImageElement;
    const backgroundScale = worldHeight / backgroundTexture.height;
    const backgroundWidth = backgroundTexture.width * backgroundScale;

    for (let x = backgroundWidth / 2; x < worldWidth + backgroundWidth; x += backgroundWidth)
    {
        scene.add.image(x, worldHeight / 2, 'level3-bg')
            .setDisplaySize(backgroundWidth, worldHeight)
            .setDepth(BACKGROUND_DEPTH);
    }

    scene.add.rectangle(worldWidth / 2, worldHeight - 180, worldWidth, 360, 0x020506, 0.28)
        .setDepth(BACKGROUND_DEPTH + 1);
}

function createFog(scene: Scene, worldWidth: number, groundY: number)
{
    for (let x = 280; x < worldWidth; x += 760)
    {
        scene.add.ellipse(x, groundY - 96, 520, 72, 0xb6d2d6, 0.08)
            .setDepth(FOG_DEPTH);

        scene.add.ellipse(x + 290, groundY - 178, 360, 54, 0xd6eef2, 0.05)
            .setDepth(FOG_DEPTH);
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
        { kind: 'ground', x: 64, y: groundY, tiles: 10 },
        { kind: 'floating', x: 1536, y: groundY - 190, tiles: 2 },
        { kind: 'ground', x: 2048, y: groundY - 128, tiles: 6 },

        { kind: 'floating', x: 3072, y: groundY - 300, tiles: 2 },
        { kind: 'floating', x: 3584, y: groundY - 430, tiles: 2 },
        { kind: 'ground', x: 4224, y: groundY - 256, tiles: 5 },

        { kind: 'ground', x: 5248, y: groundY, tiles: 5 },
        { kind: 'floating', x: 6144, y: groundY - 200, tiles: 2 },
        { kind: 'floating', x: 6656, y: groundY - 330, tiles: 2 },
        { kind: 'ground', x: 7168, y: groundY - 128, tiles: 7 },

        { kind: 'ground', x: 8448, y: groundY, tiles: 4 },
        { kind: 'floating', x: 9216, y: groundY - 220, tiles: 3 },
        { kind: 'floating', x: 9984, y: groundY - 360, tiles: 2 },
        { kind: 'floating', x: 10624, y: groundY - 250, tiles: 2 },

        { kind: 'ground', x: 11264, y: groundY - 128, tiles: 6 },
        { kind: 'floating', x: 12416, y: groundY - 300, tiles: 2 },
        { kind: 'ground', x: 12928, y: groundY, tiles: 5 },
        { kind: 'floating', x: 13824, y: groundY - 180, tiles: 2 },
        { kind: 'ground', x: 14336, y: groundY - 128, tiles: 11 }
    ];

    for (const platform of layout)
    {
        if (platform.kind === 'ground')
        {
            createGround(scene, platforms, platform.x, platform.y, platform.tiles, worldHeight);
        }
        else
        {
            createFloatingPlatform(scene, platforms, platform.x, platform.y, platform.tiles);
        }
    }
}

function createGround(
    scene: Scene,
    platforms: Phaser.Physics.Arcade.StaticGroup,
    startX: number,
    y: number,
    tileCount: number,
    worldHeight: number
)
{
    createTileRow(scene, platforms, startX, y, tileCount, 'level3-tile-1', 'level3-tile-2', 'level3-tile-3');

    const bodyRows = Math.ceil((worldHeight - y) / TILE_SIZE) + 2;

    for (let row = 0; row < bodyRows; row++)
    {
        for (let tile = 0; tile < tileCount; tile++)
        {
            const texture = getDirtTexture(tile, tileCount, row);

            createStaticTile(scene, platforms, startX + tile * TILE_SIZE, y + (row + 1) * TILE_SIZE, texture);
        }
    }
}

function getDirtTexture(tile: number, tileCount: number, row: number)
{
    if (tile === 0)
    {
        return row % 2 === 0 ? 'level3-tile-4' : 'level3-tile-12';
    }

    if (tile === tileCount - 1)
    {
        return row % 2 === 0 ? 'level3-tile-6' : 'level3-tile-13';
    }

    return (tile + row) % 4 === 0 ? 'level3-tile-10' : 'level3-tile-5';
}

function createFloatingPlatform(
    scene: Scene,
    platforms: Phaser.Physics.Arcade.StaticGroup,
    startX: number,
    y: number,
    tileCount: number
)
{
    createTileRow(
        scene,
        platforms,
        startX,
        y,
        tileCount,
        'level3-tile-14',
        'level3-tile-15',
        'level3-tile-16',
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
    hazards: Phaser.Physics.Arcade.Group,
    platforms: Phaser.Physics.Arcade.StaticGroup,
    groundY: number
)
{
    createZombieAnimations(scene);

    const floorY = surfaceY(groundY);
    const highFloorY = surfaceY(groundY - 128);
    const higherFloorY = surfaceY(groundY - 256);

    const zombies: ZombieSpec[] = [
        { kind: 'male', x: 760, y: floorY, leftBound: 300, rightBound: 1140, speed: 58, direction: 1 },
        { kind: 'female', x: 2350, y: highFloorY, leftBound: 2120, rightBound: 2620, speed: 62, direction: -1 },
        { kind: 'male', x: 4480, y: higherFloorY, leftBound: 4300, rightBound: 4720, speed: 54, direction: 1 },
        { kind: 'female', x: 5520, y: floorY, leftBound: 5320, rightBound: 5720, speed: 60, direction: -1 },
        { kind: 'male', x: 7580, y: highFloorY, leftBound: 7280, rightBound: 7860, speed: 58, direction: 1 },
        { kind: 'female', x: 8580, y: floorY, leftBound: 8500, rightBound: 8800, speed: 52, direction: -1 },
        { kind: 'male', x: 11540, y: highFloorY, leftBound: 11320, rightBound: 11840, speed: 58, direction: 1 },
        { kind: 'female', x: 13220, y: floorY, leftBound: 13060, rightBound: 13460, speed: 60, direction: -1 },
        { kind: 'male', x: 14900, y: highFloorY, leftBound: 14540, rightBound: 15560, speed: 64, direction: 1 }
    ];

    for (const zombie of zombies)
    {
        createZombie(scene, hazards, zombie);
    }

    scene.physics.add.collider(hazards, platforms);
}

function createZombieAnimations(scene: Scene)
{
    for (const kind of ['male', 'female'] as ZombieKind[])
    {
        const key = getZombieAnimationKey(kind);

        if (scene.anims.exists(key))
        {
            continue;
        }

        scene.anims.create({
            key,
            frames: Array.from({ length: 10 }, (_, i) => ({
                key: getZombieFrameKey(kind, i + 1)
            })),
            frameRate: 10,
            repeat: -1
        });
    }
}

function createZombie(
    scene: Scene,
    hazards: Phaser.Physics.Arcade.Group,
    spec: ZombieSpec
)
{
    const zombie = scene.physics.add.sprite(spec.x, spec.y, getZombieFrameKey(spec.kind, 1));
    const direction = spec.direction ?? -1;

    zombie.setOrigin(0.5, 1);
    zombie.setScale(ZOMBIE_CONFIG[spec.kind].scale);
    zombie.setDepth(HAZARD_DEPTH);
    zombie.setCollideWorldBounds(false);
    zombie.setData('leftBound', spec.leftBound);
    zombie.setData('rightBound', spec.rightBound);
    zombie.setData('speed', spec.speed);
    zombie.setData('direction', direction);
    zombie.play(getZombieAnimationKey(spec.kind));
    zombie.setFlipX(direction < 0);
    zombie.setVelocityX(spec.speed * direction);
    applyZombieBody(zombie, spec.kind);

    const body = zombie.body as Phaser.Physics.Arcade.Body;

    body.setAllowGravity(true);
    body.setImmovable(true);

    hazards.add(zombie);
}

function updateZombies(hazards: Phaser.Physics.Arcade.Group)
{
    for (const child of hazards.getChildren())
    {
        const zombie = child as Phaser.Physics.Arcade.Sprite;
        const body = zombie.body as Phaser.Physics.Arcade.Body | null;

        if (!body)
        {
            continue;
        }

        const leftBound = zombie.getData('leftBound') as number;
        const rightBound = zombie.getData('rightBound') as number;
        const speed = zombie.getData('speed') as number;
        let direction = zombie.getData('direction') as -1 | 1;

        if (zombie.x <= leftBound)
        {
            zombie.setX(leftBound);
            direction = 1;
        }
        else if (zombie.x >= rightBound)
        {
            zombie.setX(rightBound);
            direction = -1;
        }

        zombie.setData('direction', direction);
        zombie.setVelocityX(speed * direction);
        zombie.setFlipX(direction < 0);
    }
}

function applyZombieBody(zombie: Phaser.Physics.Arcade.Sprite, kind: ZombieKind)
{
    const config = ZOMBIE_CONFIG[kind];
    const frame = zombie.frame;

    zombie.setSize(config.bodyWidth, config.bodyHeight);
    zombie.setOffset(
        Math.max(0, (frame.width - config.bodyWidth) / 2),
        Math.max(0, frame.height - config.bodyHeight - config.bottomPadding)
    );
}

function getZombieAnimationKey(kind: ZombieKind)
{
    return `zombie-${kind}-walk`;
}

function getZombieFrameKey(kind: ZombieKind, frame: number)
{
    return `zombie-${kind}-walk-${frame}`;
}

function createDecorations(scene: Scene, groundY: number)
{
    const floorY = surfaceY(groundY);
    const highFloorY = surfaceY(groundY - 128);
    const higherFloorY = surfaceY(groundY - 256);
    const floatingLowY = surfaceY(groundY - 190);
    const floatingMidY = surfaceY(groundY - 220);
    const floatingHighY = surfaceY(groundY - 360);

    const decorations: DecorationSpec[] = [
        { x: 310, y: floorY, texture: 'level3-arrow-sign', scale: 1.05 },
        { x: 540, y: floorY, texture: 'level3-tree', scale: 1.05 },
        { x: 800, y: floorY, texture: 'level3-tombstone-1', scale: 1.2 },
        { x: 900, y: floorY, texture: 'level3-bone-3', scale: 0.5, alpha: 0.78 },
        { x: 1030, y: floorY, texture: 'level3-bush-1', scale: 1.15 },

        { x: 1570, y: floatingLowY, texture: 'level3-crate', scale: 0.72 },
        { x: 2140, y: highFloorY, texture: 'level3-tombstone-2', scale: 1.1 },
        { x: 2220, y: highFloorY, texture: 'level3-bone-1', scale: 0.46, alpha: 0.75 },
        { x: 2300, y: highFloorY, texture: 'level3-dead-bush', scale: 1 },
        { x: 2660, y: highFloorY, texture: 'level3-sign', scale: 1.05 },

        { x: 3610, y: surfaceY(groundY - 430), texture: 'level3-tombstone-1', scale: 1 },
        { x: 4250, y: higherFloorY, texture: 'level3-tree', scale: 1, flipX: true },
        { x: 4470, y: higherFloorY, texture: 'level3-skeleton', scale: 1.1 },
        { x: 4630, y: higherFloorY, texture: 'level3-bone-4', scale: 0.46, alpha: 0.75 },
        { x: 4750, y: higherFloorY, texture: 'level3-bush-2', scale: 1.15 },

        { x: 5330, y: floorY, texture: 'level3-tombstone-2', scale: 1.1 },
        { x: 5520, y: floorY, texture: 'level3-bone-2', scale: 0.48, alpha: 0.76 },
        { x: 5740, y: floorY, texture: 'level3-dead-bush', scale: 1.05 },
        { x: 6170, y: surfaceY(groundY - 200), texture: 'level3-crate', scale: 0.7 },
        { x: 6720, y: surfaceY(groundY - 330), texture: 'level3-tombstone-1', scale: 0.95 },

        { x: 7240, y: highFloorY, texture: 'level3-tree', scale: 1.05 },
        { x: 7480, y: highFloorY, texture: 'level3-sign', scale: 1 },
        { x: 7650, y: highFloorY, texture: 'level3-bone-3', scale: 0.46, alpha: 0.76 },
        { x: 7890, y: highFloorY, texture: 'level3-bush-1', scale: 1.1 },

        { x: 8520, y: floorY, texture: 'level3-dead-bush', scale: 1 },
        { x: 8610, y: floorY, texture: 'level3-bone-1', scale: 0.48, alpha: 0.72 },
        { x: 8760, y: floorY, texture: 'level3-tombstone-1', scale: 1.15 },
        { x: 9240, y: floatingMidY, texture: 'level3-skeleton', scale: 1 },
        { x: 10020, y: floatingHighY, texture: 'level3-tombstone-2', scale: 0.95 },

        { x: 10680, y: surfaceY(groundY - 250), texture: 'level3-crate', scale: 0.7 },
        { x: 11320, y: highFloorY, texture: 'level3-tree', scale: 1 },
        { x: 11490, y: highFloorY, texture: 'level3-bone-4', scale: 0.46, alpha: 0.74 },
        { x: 11610, y: highFloorY, texture: 'level3-bush-2', scale: 1.05 },
        { x: 11900, y: highFloorY, texture: 'level3-tombstone-1', scale: 1.1 },

        { x: 12450, y: surfaceY(groundY - 300), texture: 'level3-crate', scale: 0.7 },
        { x: 13020, y: floorY, texture: 'level3-arrow-sign', scale: 0.95, flipX: true },
        { x: 13190, y: floorY, texture: 'level3-bone-2', scale: 0.48, alpha: 0.75 },
        { x: 13420, y: floorY, texture: 'level3-bush-1', scale: 1.15 },
        { x: 13880, y: surfaceY(groundY - 180), texture: 'level3-tombstone-2', scale: 0.95 },

        { x: 14430, y: highFloorY, texture: 'level3-tree', scale: 1.05, flipX: true },
        { x: 14700, y: highFloorY, texture: 'level3-skeleton', scale: 1.05 },
        { x: 14840, y: highFloorY, texture: 'level3-bone-1', scale: 0.48, alpha: 0.75 },
        { x: 15120, y: highFloorY, texture: 'level3-sign', scale: 1.05 },
        { x: 15500, y: highFloorY, texture: 'level3-bush-2', scale: 1.1 }
    ];

    for (const decoration of decorations)
    {
        addDecoration(scene, decoration);
    }

    addCrateStack(scene, 2330, highFloorY);
    addCrateStack(scene, 7780, highFloorY);
    addCrateStack(scene, 13280, floorY);
}

function addDecoration(scene: Scene, decoration: DecorationSpec)
{
    const image = scene.add.image(decoration.x, decoration.y, decoration.texture)
        .setOrigin(0.5, 1)
        .setScale(decoration.scale)
        .setDepth(DECORATION_DEPTH)
        .setAlpha(decoration.alpha ?? 1);

    if (decoration.flipX)
    {
        image.setFlipX(true);
    }
}

function addCrateStack(scene: Scene, x: number, y: number)
{
    addDecoration(scene, { x, y, texture: 'level3-crate', scale: 0.72 });
    addDecoration(scene, { x: x + 72, y, texture: 'level3-crate', scale: 0.72 });
    addDecoration(scene, { x: x + 36, y: y - 70, texture: 'level3-crate', scale: 0.72 });
}

function setStaticHitbox(object: Phaser.Physics.Arcade.Image, hitbox: HitboxConfig)
{
    const body = object.body as Phaser.Physics.Arcade.StaticBody;

    body.setSize(hitbox.width, hitbox.height, false);
    body.setOffset(hitbox.offsetX, hitbox.offsetY);
}

function surfaceY(platformY: number)
{
    return platformY - TILE_SIZE / 2;
}

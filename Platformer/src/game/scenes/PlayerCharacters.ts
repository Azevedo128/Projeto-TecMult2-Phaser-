export type PlayerCharacterId = 'dino' | 'ninja-girl' | 'robot' | 'santa';
export type PlayerAnimationName = 'idle' | 'run' | 'jump' | 'death';

type AnimationConfig = {
    folder: string;
    filePrefix: string;
    frames: number;
    animationStartFrame?: number;
    animationEndFrame?: number;
    frameRate: number;
    repeat: number;
};

export type PlayerCharacterConfig = {
    id: PlayerCharacterId;
    labelKey: string;
    assetFolder: string;
    scale: number;
    menuScale: number;
    menuOffsetX?: number;
    menuOffsetY?: number;
    body: {
        width: number;
        height: number;
        offsetY: number;
        rightOffsetX: number;
        leftOffsetX: number;
        bottomPadding?: number;
        bottomPaddingByAnimation?: Partial<Record<PlayerAnimationName, number>>;
        centerX?: boolean;
    };
    animations: Record<PlayerAnimationName, AnimationConfig>;
};

export const DEFAULT_CHARACTER_ID: PlayerCharacterId = 'dino';

export const PLAYER_CHARACTERS: PlayerCharacterConfig[] = [
    {
        id: 'dino',
        labelKey: 'characters.dino',
        assetFolder: 'player/dino',
        scale: 0.3,
        menuScale: 0.34,
        menuOffsetX: 52,
        body: {
            width: 180,
            height: 325,
            offsetY: 90,
            rightOffsetX: 200,
            leftOffsetX: 300
        },
        animations: {
            idle: { folder: 'idle', filePrefix: 'Idle', frames: 10, frameRate: 8, repeat: -1 },
            run: { folder: 'run', filePrefix: 'Run', frames: 8, frameRate: 12, repeat: -1 },
            jump: { folder: 'jump', filePrefix: 'Jump', frames: 10, frameRate: 35, repeat: 0 },
            death: { folder: 'death', filePrefix: 'Dead', frames: 8, frameRate: 12, repeat: 0 }
        }
    },
    {
        id: 'ninja-girl',
        labelKey: 'characters.ninjaGirl',
        assetFolder: 'player/ninja-girl',
        scale: 0.283,
        menuScale: 0.34,
        body: {
            width: 191,
            height: 345,
            offsetY: 115,
            rightOffsetX: 48,
            leftOffsetX: 48,
            bottomPadding: 11,
            bottomPaddingByAnimation: {
                idle: 11,
                run: 25,
                jump: 32,
                death: 32
            },
            centerX: true
        },
        animations: {
            idle: { folder: 'idle', filePrefix: 'Idle', frames: 10, frameRate: 8, repeat: -1 },
            run: { folder: 'run', filePrefix: 'Run', frames: 10, frameRate: 12, repeat: -1 },
            jump: { folder: 'jump', filePrefix: 'Jump', frames: 10, frameRate: 28, repeat: 0 },
            death: { folder: 'death', filePrefix: 'Dead', frames: 10, frameRate: 12, repeat: 0 }
        }
    },
    {
        id: 'robot',
        labelKey: 'characters.robot',
        assetFolder: 'player/robot',
        scale: 0.255,
        menuScale: 0.29,
        body: {
            width: 212,
            height: 382,
            offsetY: 120,
            rightOffsetX: 178,
            leftOffsetX: 178,
            bottomPadding: 28,
            centerX: true
        },
        animations: {
            idle: { folder: 'idle', filePrefix: 'Idle', frames: 10, frameRate: 8, repeat: -1 },
            run: { folder: 'run', filePrefix: 'Run', frames: 8, frameRate: 12, repeat: -1 },
            jump: { folder: 'jump', filePrefix: 'Jump', frames: 10, frameRate: 28, repeat: 0 },
            death: { folder: 'death', filePrefix: 'Dead', frames: 10, frameRate: 12, repeat: 0 }
        }
    },
    {
        id: 'santa',
        labelKey: 'characters.santa',
        assetFolder: 'player/santa',
        scale: 0.221,
        menuScale: 0.25,
        menuOffsetX: 26,
        menuOffsetY: 18,
        body: {
            width: 244,
            height: 441,
            offsetY: 123,
            rightOffsetX: 243,
            leftOffsetX: 447,
            bottomPadding: 77,
            bottomPaddingByAnimation: {
                idle: 77,
                run: 74,
                jump: 75,
                death: 75
            }
        },
        animations: {
            idle: { folder: 'idle', filePrefix: 'Idle', frames: 16, frameRate: 8, repeat: -1 },
            run: { folder: 'run', filePrefix: 'Run', frames: 11, frameRate: 12, repeat: -1 },
            jump: {
                folder: 'jump',
                filePrefix: 'Jump',
                frames: 16,
                animationStartFrame: 5,
                animationEndFrame: 13,
                frameRate: 14,
                repeat: 0
            },
            death: { folder: 'death', filePrefix: 'Dead', frames: 17, frameRate: 14, repeat: 0 }
        }
    }
];

export function getPlayerCharacter(id: unknown)
{
    return PLAYER_CHARACTERS.find((character) => character.id === id) ?? PLAYER_CHARACTERS[0];
}

export function getAnimationKey(characterId: PlayerCharacterId, animation: PlayerAnimationName)
{
    return `${characterId}-${animation}`;
}

export function getFrameKey(
    characterId: PlayerCharacterId,
    animation: PlayerAnimationName,
    frame: number
)
{
    return `${characterId}-${animation}-${frame}`;
}

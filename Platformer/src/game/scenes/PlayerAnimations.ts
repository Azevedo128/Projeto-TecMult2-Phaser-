import { Scene } from 'phaser';
import {
    getAnimationKey,
    getFrameKey,
    PLAYER_CHARACTERS,
    type PlayerAnimationName
} from './PlayerCharacters';

export function createPlayerAnimations(scene: Scene)
{
    for (const character of PLAYER_CHARACTERS)
    {
        for (const animationName of Object.keys(character.animations) as PlayerAnimationName[])
        {
            const animation = character.animations[animationName];
            const animationKey = getAnimationKey(character.id, animationName);

            if (scene.anims.exists(animationKey))
            {
                continue;
            }

            const startFrame = animation.animationStartFrame ?? 1;
            const endFrame = animation.animationEndFrame ?? animation.frames;
            const frameCount = endFrame - startFrame + 1;

            scene.anims.create({
                key: animationKey,
                frames: Array.from({ length: frameCount }, (_, i) => ({
                    key: getFrameKey(character.id, animationName, startFrame + i)
                })),
                frameRate: animation.frameRate,
                repeat: animation.repeat
            });
        }
    }
}

export function createDinoAnimations(scene: Scene)
{
    createPlayerAnimations(scene);
}

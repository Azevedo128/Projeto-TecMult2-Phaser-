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

            scene.anims.create({
                key: animationKey,
                frames: Array.from({ length: animation.frames }, (_, i) => ({
                    key: getFrameKey(character.id, animationName, i + 1)
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

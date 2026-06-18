import { Scene } from 'phaser';

export const LAST_LEVEL = 3;

const HIGHEST_UNLOCKED_LEVEL_KEY = 'highestUnlockedLevel';
const UNLOCK_ALL_LEVELS_KEY = 'unlockAllLevels';

export function isLevelUnlocked(scene: Scene, level: number)
{
    return getUnlockAllLevels(scene) || level <= getHighestUnlockedLevel(scene);
}

export function unlockNextLevel(scene: Scene, completedLevel: number)
{
    setHighestUnlockedLevel(scene, Math.min(LAST_LEVEL, completedLevel + 1));
}

export function getUnlockAllLevels(scene: Scene)
{
    const registryValue = scene.registry.get(UNLOCK_ALL_LEVELS_KEY);

    return typeof registryValue === 'boolean' ? registryValue : false;
}

export function setUnlockAllLevels(scene: Scene, enabled: boolean)
{
    scene.registry.set(UNLOCK_ALL_LEVELS_KEY, enabled);
}

function getHighestUnlockedLevel(scene: Scene)
{
    const registryValue = scene.registry.get(HIGHEST_UNLOCKED_LEVEL_KEY);

    if (typeof registryValue === 'number')
    {
        return clampLevel(registryValue);
    }

    scene.registry.set(HIGHEST_UNLOCKED_LEVEL_KEY, 1);

    return 1;
}

function setHighestUnlockedLevel(scene: Scene, level: number)
{
    const highestUnlockedLevel = Math.max(getHighestUnlockedLevel(scene), clampLevel(level));

    scene.registry.set(HIGHEST_UNLOCKED_LEVEL_KEY, highestUnlockedLevel);
}

function clampLevel(level: number)
{
    return Phaser.Math.Clamp(Math.floor(level), 1, LAST_LEVEL);
}

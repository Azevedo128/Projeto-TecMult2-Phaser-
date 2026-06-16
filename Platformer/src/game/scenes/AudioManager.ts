import { Scene } from 'phaser';

export const LEVEL_MUSIC_KEY = 'level-music';
export const DEFAULT_VOLUME = 70;

function clamp(value: number, min: number, max: number)
{
    return Math.min(Math.max(value, min), max);
}

export function getSavedVolume(scene: Scene)
{
    const volume = scene.registry.get('soundVolume');

    if (typeof volume === 'number')
    {
        return clamp(volume, 0, 100);
    }

    scene.registry.set('soundVolume', DEFAULT_VOLUME);

    return DEFAULT_VOLUME;
}

export function applySavedVolume(scene: Scene)
{
    scene.sound.setVolume(getSavedVolume(scene) / 100);
}

export function setSavedVolume(scene: Scene, volume: number)
{
    const clampedVolume = clamp(volume, 0, 100);

    scene.registry.set('soundVolume', clampedVolume);
    scene.sound.setVolume(clampedVolume / 100);
}

export function playLevelMusic(scene: Scene)
{
    applySavedVolume(scene);

    let music = scene.sound.get(LEVEL_MUSIC_KEY);

    if (!music)
    {
        music = scene.sound.add(LEVEL_MUSIC_KEY, {
            loop: true
        });
    }

    if (!music.isPlaying)
    {
        music.play();
    }
}

export function stopLevelMusic(scene: Scene)
{
    const music = scene.sound.get(LEVEL_MUSIC_KEY);

    if (music?.isPlaying)
    {
        music.stop();
    }
}

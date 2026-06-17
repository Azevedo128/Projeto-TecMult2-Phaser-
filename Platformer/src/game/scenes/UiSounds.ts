import { Scene } from 'phaser';

export const UI_CLICK_KEY = 'ui-click';
export const UI_HOVER_KEY = 'ui-hover';

let currentHoverId = '';

export function playUiClick(scene: Scene)
{
    playUiSound(scene, UI_CLICK_KEY, 0.75);
}

export function playUiHover(scene: Scene, hoverId: string)
{
    if (currentHoverId === hoverId)
    {
        return;
    }

    currentHoverId = hoverId;
    playUiSound(scene, UI_HOVER_KEY, 0.45);
}

function playUiSound(scene: Scene, key: string, volume: number)
{
    if (!scene.cache.audio.exists(key))
    {
        return;
    }

    scene.sound.play(key, { volume });
}

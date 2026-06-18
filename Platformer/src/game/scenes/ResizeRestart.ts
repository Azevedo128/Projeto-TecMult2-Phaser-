import { Scene } from 'phaser';

export function restartSceneOnResize(scene: Scene, getData?: () => object | undefined)
{
    let restartTimer: Phaser.Time.TimerEvent | undefined;

    const restart = () => {
        restartTimer?.remove(false);
        restartTimer = scene.time.delayedCall(80, () => {
            scene.scene.restart(getData?.());
        });
    };

    scene.scale.on('resize', restart);
    scene.scale.on('enterfullscreen', restart);
    scene.scale.on('leavefullscreen', restart);

    scene.events.once('shutdown', () => {
        restartTimer?.remove(false);
        scene.scale.off('resize', restart);
        scene.scale.off('enterfullscreen', restart);
        scene.scale.off('leavefullscreen', restart);
    });
}

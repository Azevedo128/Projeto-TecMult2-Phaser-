import { Scene } from 'phaser';
import { getFrameKey, PLAYER_CHARACTERS, type PlayerAnimationName } from './PlayerCharacters';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(512, 384, 'background');

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);


        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512-230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress: number) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    preload ()
    {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');

        this.load.image('heart-full', 'ui/hearts/heart-full-single.png');
        this.load.image('heart-half', 'ui/hearts/half/h1.png');
        this.load.image('heart-empty', 'ui/hearts/heart-empty-single.png');

        this.load.image('ground-tile', 'tilesets/freetileset/Tiles/1.png');
        this.load.image('ground-tile-2', 'tilesets/freetileset/Tiles/2.png');
        this.load.image('crate', 'tilesets/freetileset/Object/Crate.png');
        this.load.image('tree-1', 'tilesets/freetileset/Object/Tree_1.png');
        this.load.image('tree-2', 'tilesets/freetileset/Object/Tree_2.png');
        this.load.image('tree-3', 'tilesets/freetileset/Object/Tree_3.png');
        this.load.image('bush-1', 'tilesets/freetileset/Object/Bush (1).png');
        this.load.image('bush-2', 'tilesets/freetileset/Object/Bush (2).png');
        this.load.image('bush-3', 'tilesets/freetileset/Object/Bush (3).png');
        this.load.image('bush-4', 'tilesets/freetileset/Object/Bush (4).png');
        this.load.image('mushroom-1', 'tilesets/freetileset/Object/Mushroom_1.png');
        this.load.image('mushroom-2', 'tilesets/freetileset/Object/Mushroom_2.png');
        this.load.image('sign-1', 'tilesets/freetileset/Object/Sign_1.png');
        this.load.image('sign-2', 'tilesets/freetileset/Object/Sign_2.png');
        this.load.image('stone', 'tilesets/freetileset/Object/Stone.png');

        this.load.image('ground-left', 'tilesets/freetileset/Tiles/1.png');
        this.load.image('ground-middle', 'tilesets/freetileset/Tiles/2.png');
        this.load.image('ground-right', 'tilesets/freetileset/Tiles/3.png');
        this.load.image('dirt-left', 'tilesets/freetileset/Tiles/4.png');
        this.load.image('dirt-middle', 'tilesets/freetileset/Tiles/5.png');
        this.load.image('dirt-right', 'tilesets/freetileset/Tiles/6.png');
        this.load.image('dirt-bottom-left', 'tilesets/freetileset/Tiles/8.png');
        this.load.image('dirt-bottom-middle', 'tilesets/freetileset/Tiles/9.png');
        this.load.image('dirt-bottom-right', 'tilesets/freetileset/Tiles/10.png');
        this.load.image('floating-ground-left', 'tilesets/freetileset/Tiles/13.png');
        this.load.image('floating-ground-middle', 'tilesets/freetileset/Tiles/14.png');
        this.load.image('floating-ground-right', 'tilesets/freetileset/Tiles/15.png');

        this.load.image('map-bg', 'tilesets/freetileset/BG/BG.png');
        this.load.image('menu-play', 'ui/buttons/play.png');
        this.load.image('menu-play-hover', 'ui/buttons/play-hover.png');
        this.load.image('menu-settings', 'ui/buttons/settings.png');
        this.load.image('menu-settings-hover', 'ui/buttons/settings-hover.png');
        this.load.image('menu-exit', 'ui/buttons/exit.png');
        this.load.image('menu-exit-hover', 'ui/buttons/exit-hover.png');
        this.load.image('menu-locked', 'ui/buttons/locked.png');


        for (const character of PLAYER_CHARACTERS)
        {
            for (const animationName of Object.keys(character.animations) as PlayerAnimationName[])
            {
                const animation = character.animations[animationName];

                for (let frame = 1; frame <= animation.frames; frame++)
                {
                    this.load.image(
                        getFrameKey(character.id, animationName, frame),
                        `${character.assetFolder}/${animation.folder}/${animation.filePrefix} (${frame}).png`
                    );
                }
            }
        }

        this.load.image('logo', 'logo.png');
    }

    create ()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('MainMenu');
    }
}

import { Scene, Textures } from 'phaser';

export class GameUI
{
    private scene: Scene;
    private camera: Phaser.Cameras.Scene2D.Camera;
    private heartIcons: Phaser.GameObjects.Image[] = [];
    private menuButton?: Phaser.GameObjects.Image;
    private maxLives: number;
    private onOpenMenu?: () => void;

    constructor(scene: Scene, camera: Phaser.Cameras.Scene2D.Camera, maxLives: number, onOpenMenu?: () => void)
    {
        this.scene = scene;
        this.camera = camera;
        this.maxLives = maxLives;
        this.onOpenMenu = onOpenMenu;

        this.createHearts();
        this.createMenuButton();
    }

    update()
    {
        this.positionHearts();
        this.positionMenuButton();
    }

    setLives(lives: number)
    {
        for (let i = 0; i < this.heartIcons.length; i++)
        {
            const texture = i < lives ? 'heart-full' : 'heart-empty';
            this.heartIcons[i].setTexture(texture);
        }
    }

    private createHearts()
    {
        this.scene.textures.get('heart-full').setFilter(Textures.FilterMode.NEAREST);
        this.scene.textures.get('heart-empty').setFilter(Textures.FilterMode.NEAREST);

        this.heartIcons = [];

        for (let i = 0; i < this.maxLives; i++)
        {
            const heart = this.scene.add.image(0, 0, 'heart-full');

            heart.setOrigin(1, 0);
            heart.setDepth(1000);

            this.heartIcons.push(heart);
        }

        this.positionHearts();
    }

    private createMenuButton()
    {
        if (!this.onOpenMenu)
        {
            return;
        }

        this.menuButton = this.scene.add.image(0, 0, 'menu-settings')
            .setOrigin(0, 0)
            .setDepth(1000)
            .setInteractive({ useHandCursor: true });

        this.menuButton.on('pointerover', () => {
            this.menuButton?.setTexture('menu-settings-hover');
        });

        this.menuButton.on('pointerout', () => {
            this.menuButton?.setTexture('menu-settings');
        });

        this.menuButton.on('pointerdown', () => {
            this.onOpenMenu?.();
        });

        this.positionMenuButton();
    }

    private positionHearts()
    {
        const margin = 28;
        const heartScale = 3;
        const spacing = 58;
        const zoom = this.camera.zoom;

        for (let i = 0; i < this.heartIcons.length; i++)
        {
            const screenX = this.camera.width - margin - (i * spacing);
            const screenY = margin;
            const worldPoint = this.camera.getWorldPoint(screenX, screenY);
            const heart = this.heartIcons[i];

            heart.setPosition(worldPoint.x, worldPoint.y);
            heart.setScale(heartScale / zoom);
        }
    }

    private positionMenuButton()
    {
        if (!this.menuButton)
        {
            return;
        }

        const margin = 26;
        const buttonScale = 0.34;
        const zoom = this.camera.zoom;
        const worldPoint = this.camera.getWorldPoint(margin, margin);

        this.menuButton.setPosition(worldPoint.x, worldPoint.y);
        this.menuButton.setScale(buttonScale / zoom);
    }
}

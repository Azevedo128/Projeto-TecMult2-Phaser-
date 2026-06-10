import { Scene, Input } from 'phaser';

export class Game extends Scene
{
    camera!: Phaser.Cameras.Scene2D.Camera;
    background!: Phaser.GameObjects.Image;
    player!: Phaser.Physics.Arcade.Sprite;
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    platforms!: Phaser.Physics.Arcade.StaticGroup;
    jumpCount: number = 0;
    maxJumps: number = 2;
    jumpForce: number = -500;

    wasd!: {
        W: Phaser.Input.Keyboard.Key;
        A: Phaser.Input.Keyboard.Key;
        S: Phaser.Input.Keyboard.Key;
        D: Phaser.Input.Keyboard.Key;
    };

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        const width = this.scale.width;
        const height = this.scale.height;
        const worldWidth = 4000;
        const worldheight = height * 2;

        this.camera = this.cameras.main;
        this.camera.setZoom(0.8);
        this.camera.setBackgroundColor(0x00ff00);

        this.physics.world.setBounds(0, 0, worldWidth, worldWidth);
        this.cameras.main.setBounds(0, 0, worldWidth, worldheight);

        for (let x = width / 2; x < worldWidth; x += width)
        {
            for (let y = height / 2; y < worldheight; y += height)
            {
                this.add.image(x, y, 'background')
                    .setDisplaySize(width, height)
                .setAlpha(0.5);
            }
        }

        this.platforms = this.physics.add.staticGroup();

        this.createPlatform(width /2, worldheight - 40, width, 80);
        this.createPlatform(2000, worldheight - 400, 500, 80);
        /*this.createPlatform(1800, height - 180, 220, 40);
        this.createPlatform(2400, height - 40, 600, 80);
        this.createPlatform(3100, height - 220, 260, 40);*/

        this.createDinoAnimations();

        this.player = this.physics.add.sprite(150, worldheight - 180, 'dino-idle-1');
        this.player.setScale(0.3);
        this.player.setSize(180, 325);
        this.player.setOffset(100, 90);
        this.player.setCollideWorldBounds(true);
        this.player.play('dino-idle');

        this.cursors = this.input.keyboard!.createCursorKeys();

        this.wasd = this.input.keyboard!.addKeys('W,A,S,D') as {
            W: Phaser.Input.Keyboard.Key;
            A: Phaser.Input.Keyboard.Key;
            S: Phaser.Input.Keyboard.Key;
            D: Phaser.Input.Keyboard.Key;
        };

        this.physics.add.collider(this.player, this.platforms);

        this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    }

    createPlatform(x: number, y: number, width: number, height: number)
    {
        const platform = this.add.rectangle(x, y, width, height, 0x654321);
        this.physics.add.existing(platform, true);
        this.platforms.add(platform);
    }

    createDinoAnimations()
    {
        if (!this.anims.exists('dino-idle'))
        {
            this.anims.create({
                key: 'dino-idle',
                frames: Array.from({ length: 10 }, (_, i) => ({
                    key: `dino-idle-${i + 1}`
                })),
                frameRate: 8,
                repeat: -1
            });
        }

        if (!this.anims.exists('dino-run'))
        {
            this.anims.create({
                key: 'dino-run',
                frames: Array.from({ length: 10 }, (_, i) => ({
                    key: `dino-run-${i + 1}`
                })),
                frameRate: 12,
                repeat: -1
            });
        }

        if (!this.anims.exists('dino-jump'))
        {
            this.anims.create({
                key: 'dino-jump',
                frames: Array.from({ length: 10 }, (_, i) => ({
                    key: `dino-jump-${i + 1}`
                })),
                frameRate: 35,
                repeat: 0
            });
        }
    }

    setPlayerDirection(direction: 'left' | 'right')
    {
        if (direction === 'left')
        {
            this.player.setFlipX(true);
            this.player.setOffset(300, 90);
        }
        else
        {
            this.player.setFlipX(false);
            this.player.setOffset(200, 90);
        }
    }

    update ()
    {
        const body = this.player.body as Phaser.Physics.Arcade.Body;

        const left = this.cursors.left.isDown || this.wasd.A.isDown;
        const right = this.cursors.right.isDown || this.wasd.D.isDown;
        const jumpPressed = Input.Keyboard.JustDown(this.cursors.space) || Input.Keyboard.JustDown(this.cursors.up) || Input.Keyboard.JustDown(this.wasd.W);
        const isOnGround = body.blocked.down || body.touching.down;
        if (left)
        {
            this.player.setVelocityX(-200);
            this.setPlayerDirection('left');

            if (body.blocked.down)
            {
                this.player.play('dino-run', true);
            }
        }
        else if (right)
        {
            this.player.setVelocityX(200);
            this.setPlayerDirection('right');

            if (body.blocked.down)
            {
                this.player.play('dino-run', true);
            }
        }
        else
        {
            this.player.setVelocityX(0);

            if (body.blocked.down)
            {
                this.player.play('dino-idle', true);
            }
        }

        if(isOnGround){
            this.jumpCount = 0;
        }else if(this.jumpCount === 0){
            this.jumpCount = 1;
        }

        if (jumpPressed && this.jumpCount < this.maxJumps)
        {
            this.player.setVelocityY(this.jumpForce);
            this.player.play('dino-jump');
            this.jumpCount++;
        }
    }
}

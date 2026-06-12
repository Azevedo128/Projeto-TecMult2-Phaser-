import { Input, Scene } from 'phaser';

export class PlayerController
{
    sprite: Phaser.Physics.Arcade.Sprite;

    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private jumpCount = 0;
    private maxJumps = 2;
    private jumpForce = -500;

    private wasd: {
        W: Phaser.Input.Keyboard.Key;
        A: Phaser.Input.Keyboard.Key;
        S: Phaser.Input.Keyboard.Key;
        D: Phaser.Input.Keyboard.Key;
    };

    constructor(scene: Scene, x: number, y: number)
    {
        this.sprite = scene.physics.add.sprite(x, y, 'dino-idle-1');

        this.sprite.setScale(0.3);
        this.sprite.setSize(180, 325);
        this.sprite.setOffset(100, 90);
        this.sprite.setCollideWorldBounds(false);
        this.sprite.play('dino-idle');

        this.cursors = scene.input.keyboard!.createCursorKeys();

        this.wasd = scene.input.keyboard!.addKeys('W,A,S,D') as {
            W: Phaser.Input.Keyboard.Key;
            A: Phaser.Input.Keyboard.Key;
            S: Phaser.Input.Keyboard.Key;
            D: Phaser.Input.Keyboard.Key;
        };
    }

    update()
    {
        const body = this.sprite.body as Phaser.Physics.Arcade.Body;

        const left = this.cursors.left.isDown || this.wasd.A.isDown;
        const right = this.cursors.right.isDown || this.wasd.D.isDown;
        const jumpPressed =
            Input.Keyboard.JustDown(this.cursors.space) ||
            Input.Keyboard.JustDown(this.cursors.up) ||
            Input.Keyboard.JustDown(this.wasd.W);

        if (left)
        {
            this.sprite.setVelocityX(-200);
            this.setDirection('left');

            if (body.blocked.down)
            {
                this.sprite.play('dino-run', true);
            }
        }
        else if (right)
        {
            this.sprite.setVelocityX(200);
            this.setDirection('right');

            if (body.blocked.down)
            {
                this.sprite.play('dino-run', true);
            }
        }
        else
        {
            this.sprite.setVelocityX(0);

            if (body.blocked.down)
            {
                this.sprite.play('dino-idle', true);
            }
        }

        const isOnGround = body.blocked.down || body.touching.down;

        if (isOnGround)
        {
            this.jumpCount = 0;
        }
        else if (this.jumpCount === 0)
        {
            this.jumpCount = 1;
        }

        if (jumpPressed && this.jumpCount < this.maxJumps)
        {
            this.sprite.setVelocityY(this.jumpForce);
            this.sprite.play('dino-jump');
            this.jumpCount++;
        }
    }

    private setDirection(direction: 'left' | 'right')
    {
        if (direction === 'left')
        {
            this.sprite.setFlipX(true);
            this.sprite.setOffset(300, 90);
        }
        else
        {
            this.sprite.setFlipX(false);
            this.sprite.setOffset(200, 90);
        }
    }
}
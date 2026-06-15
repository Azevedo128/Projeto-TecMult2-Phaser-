import { Input, Scene } from 'phaser';
import {
    DEFAULT_CHARACTER_ID,
    getAnimationKey,
    getFrameKey,
    getPlayerCharacter,
    type PlayerCharacterConfig,
    type PlayerCharacterId,
    type PlayerAnimationName
} from './PlayerCharacters';

export class PlayerController
{
    sprite: Phaser.Physics.Arcade.Sprite;

    private character: PlayerCharacterConfig;
    private direction: 'left' | 'right' = 'right';
    private currentAnimation: PlayerAnimationName = 'idle';
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private jumpCount = 0;
    private maxJumps = 2;
    private jumpForce = -500;
    private moveSpeed = 250;

    private wasd: {
        W: Phaser.Input.Keyboard.Key;
        A: Phaser.Input.Keyboard.Key;
        S: Phaser.Input.Keyboard.Key;
        D: Phaser.Input.Keyboard.Key;
    };

    constructor(scene: Scene, x: number, y: number, characterId: PlayerCharacterId = DEFAULT_CHARACTER_ID)
    {
        this.character = getPlayerCharacter(characterId);
        this.sprite = scene.physics.add.sprite(x, y, getFrameKey(this.character.id, 'idle', 1));

        this.sprite.setScale(this.character.scale);
        this.sprite.setSize(this.character.body.width, this.character.body.height);
        this.setDirection('right');
        this.sprite.setDepth(10);
        this.sprite.setCollideWorldBounds(false);
        this.playAnimation('idle');

        this.cursors = scene.input.keyboard!.createCursorKeys();

        this.wasd = scene.input.keyboard!.addKeys('W,A,S,D') as {
            W: Phaser.Input.Keyboard.Key;
            A: Phaser.Input.Keyboard.Key;
            S: Phaser.Input.Keyboard.Key;
            D: Phaser.Input.Keyboard.Key;
        };
    }

    respawn(x: number, y: number)
    {
        this.jumpCount = 0;
        this.sprite.setPosition(x, y);
        this.sprite.setVelocity(0, 0);
        this.sprite.setFlipX(false);
        this.sprite.setDepth(10);
        this.setDirection('right');
        this.playAnimation('idle', true);
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
            this.sprite.setVelocityX(-this.moveSpeed);
            this.setDirection('left');

            if (body.blocked.down)
            {
                this.playAnimation('run', true);
            }
        }
        else if (right)
        {
            this.sprite.setVelocityX(this.moveSpeed);
            this.setDirection('right');

            if (body.blocked.down)
            {
                this.playAnimation('run', true);
            }
        }
        else
        {
            this.sprite.setVelocityX(0);

            if (body.blocked.down)
            {
                this.playAnimation('idle', true);
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
            this.playAnimation('jump');
            this.jumpCount++;
        }

        this.applyBody();
    }

    private setDirection(direction: 'left' | 'right')
    {
        this.direction = direction;

        if (direction === 'left')
        {
            this.sprite.setFlipX(true);
        }
        else
        {
            this.sprite.setFlipX(false);
        }

        this.applyBody();
    }

    private playAnimation(animation: PlayerAnimationName, ignoreIfPlaying = false)
    {
        this.currentAnimation = animation;
        this.sprite.play(getAnimationKey(this.character.id, animation), ignoreIfPlaying);
        this.applyBody();
    }

    private applyBody()
    {
        const body = this.character.body;
        const frame = this.sprite.frame;

        const offsetX = body.centerX
            ? Math.max(0, (frame.width - body.width) / 2)
            : this.direction === 'left'
                ? body.leftOffsetX
                : body.rightOffsetX;

        const bottomPadding = body.bottomPaddingByAnimation?.[this.currentAnimation] ?? body.bottomPadding;

        const offsetY = bottomPadding === undefined
            ? body.offsetY
            : Math.max(0, frame.height - body.height - bottomPadding);

        this.sprite.setSize(body.width, body.height);
        this.sprite.setOffset(offsetX, offsetY);
    }
}

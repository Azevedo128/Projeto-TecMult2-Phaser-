import { Scene, GameObjects } from 'phaser';
import { getSavedVolume, setSavedVolume } from './AudioManager';

const LANGUAGE_OPTIONS = ['Portugues', 'Ingles', 'Espanhol', 'Alemao', 'Chines'];

function clamp(value: number, min: number, max: number)
{
    return Math.min(Math.max(value, min), max);
}

export class OptionsOverlay extends Scene
{
    returnScene = 'PauseMenu';
    fullscreenLabel!: GameObjects.Text;
    hitboxesLabel!: GameObjects.Text;
    deathAnimationLabel!: GameObjects.Text;
    volumeLabel!: GameObjects.Text;
    volumeFill!: GameObjects.Rectangle;
    volumeHandle!: GameObjects.Rectangle;
    languageLabel!: GameObjects.Text;
    languageBar!: GameObjects.Rectangle;
    languageArrow!: GameObjects.Text;
    languageOptions: GameObjects.GameObject[] = [];
    languageMenuOpen = false;
    isDraggingVolume = false;

    constructor ()
    {
        super('OptionsOverlay');
    }

    create (data: { returnScene?: string } = {})
    {
        this.returnScene = data.returnScene ?? 'PauseMenu';

        const width = this.scale.width;
        const height = this.scale.height;

        this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.58)
            .setInteractive();

        this.add.rectangle(width / 2, height / 2, 780, 640, 0x10131b, 0.92)
            .setStrokeStyle(5, 0xffffff, 0.85);

        this.add.text(width / 2, height / 2 - 260, 'Opcoes', {
            fontFamily: 'Arial Black',
            fontSize: 48,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        const optionY = height / 2 - 145;
        const spacing = 220;

        this.fullscreenLabel = this.createIconButton(
            width / 2 - spacing,
            optionY,
            this.getFullscreenText(),
            () => this.toggleFullscreen()
        );

        this.deathAnimationLabel = this.createIconButton(
            width / 2,
            optionY,
            this.getDeathAnimationText(),
            () => this.toggleDeathAnimation()
        );

        this.hitboxesLabel = this.createIconButton(
            width / 2 + spacing,
            optionY,
            this.getHitboxesText(),
            () => this.toggleHitboxes()
        );

        this.createVolumeSlider(width / 2, height / 2 + 10, 560);
        this.createLanguageSelector(width / 2, height / 2 + 125, 560);

        this.createTextButton(width / 2, height / 2 + 255, 'Voltar', () => {
            this.closeOverlay();
        });

        this.input.keyboard?.once('keydown-ESC', () => {
            this.closeOverlay();
        });
    }

    private createIconButton(x: number, y: number, label: string, onClick: () => void)
    {
        const button = this.add.image(x, y, 'menu-settings')
            .setScale(0.43)
            .setInteractive({ useHandCursor: true });

        const labelText = this.add.text(x, y + 74, label, {
            fontFamily: 'Arial Black',
            fontSize: 20,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 5,
            align: 'center'
        }).setOrigin(0.5);

        button.on('pointerover', () => {
            button.setTexture('menu-settings-hover');
        });

        button.on('pointerout', () => {
            button.setTexture('menu-settings');
        });

        button.on('pointerdown', onClick);

        return labelText;
    }

    private createTextButton(x: number, y: number, label: string, onClick: () => void)
    {
        const button = this.add.rectangle(x, y, 260, 54, 0x1b1d26, 0.95)
            .setStrokeStyle(4, 0xffffff, 0.8)
            .setInteractive({ useHandCursor: true });

        const text = this.add.text(x, y, label, {
            fontFamily: 'Arial Black',
            fontSize: 24,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 5,
            align: 'center'
        }).setOrigin(0.5);

        const setHover = (active: boolean) => {
            button.setFillStyle(active ? 0x2f8fdd : 0x1b1d26, 0.95);
            button.setStrokeStyle(4, active ? 0xfff176 : 0xffffff, active ? 1 : 0.8);
        };

        button.on('pointerover', () => setHover(true));
        button.on('pointerout', () => setHover(false));
        button.on('pointerdown', onClick);

        text.setInteractive({ useHandCursor: true });
        text.on('pointerover', () => setHover(true));
        text.on('pointerout', () => setHover(false));
        text.on('pointerdown', onClick);
    }

    private createVolumeSlider(x: number, y: number, width: number)
    {
        const trackHeight = 18;

        this.volumeLabel = this.add.text(x, y - 42, this.getVolumeText(), {
            fontFamily: 'Arial Black',
            fontSize: 24,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 5,
            align: 'center'
        }).setOrigin(0.5);

        const track = this.add.rectangle(x, y, width, trackHeight, 0x1b1d26, 0.96)
            .setStrokeStyle(4, 0xffffff, 0.85)
            .setInteractive({ useHandCursor: true });

        this.volumeFill = this.add.rectangle(x - width / 2, y, 1, trackHeight, 0x2f8fdd, 1)
            .setOrigin(0, 0.5);

        this.volumeHandle = this.add.rectangle(x, y, 28, 38, 0xfff176, 1)
            .setStrokeStyle(4, 0x000000, 0.65)
            .setInteractive({ useHandCursor: true });

        const hitArea = this.add.rectangle(x, y, width + 34, 64, 0x000000, 0.01)
            .setInteractive({ useHandCursor: true });

        const setVolumeFromX = (pointerX: number) => {
            const minX = x - width / 2;
            const maxX = x + width / 2;
            const clampedX = clamp(pointerX, minX, maxX);
            const volume = Math.round(((clampedX - minX) / width) * 100);

            setSavedVolume(this, volume);
            this.updateVolumeSlider(x, y, width);
        };

        const isInsideSlider = (pointer: Phaser.Input.Pointer) => {
            return pointer.x >= x - width / 2 - 28 &&
                pointer.x <= x + width / 2 + 28 &&
                pointer.y >= y - 36 &&
                pointer.y <= y + 36;
        };

        const startDrag = (pointer: Phaser.Input.Pointer) => {
            this.isDraggingVolume = true;
            setVolumeFromX(pointer.x);
        };

        track.on('pointerdown', startDrag);
        hitArea.on('pointerdown', startDrag);
        this.volumeHandle.on('pointerdown', startDrag);

        hitArea.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            if (this.isDraggingVolume)
            {
                setVolumeFromX(pointer.x);
            }
        });

        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (isInsideSlider(pointer))
            {
                this.isDraggingVolume = true;
                setVolumeFromX(pointer.x);
            }
        });

        this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            if (this.isDraggingVolume && pointer.isDown)
            {
                setVolumeFromX(pointer.x);
            }
        });

        this.input.on('pointerup', () => {
            this.isDraggingVolume = false;
        });

        this.createVolumeStepButton(x - width / 2 - 56, y, '-', () => {
            this.changeVolume(-10, x, y, width);
        });

        this.createVolumeStepButton(x + width / 2 + 56, y, '+', () => {
            this.changeVolume(10, x, y, width);
        });

        this.updateVolumeSlider(x, y, width);
    }

    private createVolumeStepButton(x: number, y: number, label: string, onClick: () => void)
    {
        const button = this.add.rectangle(x, y, 46, 46, 0x1b1d26, 0.95)
            .setStrokeStyle(4, 0xffffff, 0.85)
            .setInteractive({ useHandCursor: true });

        const text = this.add.text(x, y - 2, label, {
            fontFamily: 'Arial Black',
            fontSize: 30,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 5,
            align: 'center'
        }).setOrigin(0.5);

        const setHover = (active: boolean) => {
            button.setFillStyle(active ? 0x2f8fdd : 0x1b1d26, 0.95);
            button.setStrokeStyle(4, active ? 0xfff176 : 0xffffff, active ? 1 : 0.85);
        };

        button.on('pointerover', () => setHover(true));
        button.on('pointerout', () => setHover(false));
        button.on('pointerdown', onClick);

        text.setInteractive({ useHandCursor: true });
        text.on('pointerover', () => setHover(true));
        text.on('pointerout', () => setHover(false));
        text.on('pointerdown', onClick);
    }

    private changeVolume(amount: number, sliderX: number, sliderY: number, sliderWidth: number)
    {
        setSavedVolume(this, getSavedVolume(this) + amount);
        this.updateVolumeSlider(sliderX, sliderY, sliderWidth);
    }

    private updateVolumeSlider(x: number, y: number, width: number)
    {
        const volume = getSavedVolume(this);
        const fillWidth = (volume / 100) * width;

        this.volumeLabel.setText(this.getVolumeText());
        this.volumeFill.setDisplaySize(Math.max(1, fillWidth), this.volumeFill.height);
        this.volumeHandle.setPosition(x - width / 2 + fillWidth, y);
    }

    private createLanguageSelector(x: number, y: number, width: number)
    {
        const barHeight = 56;

        this.languageBar = this.add.rectangle(x, y, width, barHeight, 0x1b1d26, 0.95)
            .setStrokeStyle(4, 0xffffff, 0.85)
            .setInteractive({ useHandCursor: true });

        this.languageLabel = this.add.text(x, y, this.getLanguageText(), {
            fontFamily: 'Arial Black',
            fontSize: 24,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 5,
            align: 'center'
        }).setOrigin(0.5);

        this.languageArrow = this.add.text(x + width / 2 - 34, y, 'v', {
            fontFamily: 'Arial Black',
            fontSize: 28,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 5,
            align: 'center'
        }).setOrigin(0.5);

        const toggle = () => {
            this.toggleLanguageMenu(x, y + 66, width);
        };

        this.languageBar.on('pointerover', () => {
            this.languageBar.setStrokeStyle(4, 0xfff176, 1);
        });

        this.languageBar.on('pointerout', () => {
            this.languageBar.setStrokeStyle(4, 0xffffff, 0.85);
        });

        this.languageBar.on('pointerdown', toggle);
        this.languageLabel.setInteractive({ useHandCursor: true });
        this.languageLabel.on('pointerdown', toggle);
        this.languageArrow.setInteractive({ useHandCursor: true });
        this.languageArrow.on('pointerdown', toggle);
    }

    private toggleLanguageMenu(x: number, y: number, width: number)
    {
        if (this.languageMenuOpen)
        {
            this.closeLanguageMenu();
            return;
        }

        this.openLanguageMenu(x, y, width);
    }

    private openLanguageMenu(x: number, y: number, width: number)
    {
        this.closeLanguageMenu();

        const optionWidth = width / LANGUAGE_OPTIONS.length;
        const optionHeight = 46;
        const startX = x - width / 2 + optionWidth / 2;

        LANGUAGE_OPTIONS.forEach((language, index) => {
            const optionX = startX + index * optionWidth;
            const isSelected = language === this.getSelectedLanguage();

            const background = this.add.rectangle(
                optionX,
                y,
                optionWidth - 4,
                optionHeight,
                isSelected ? 0x2f8fdd : 0x1b1d26,
                0.96
            )
                .setStrokeStyle(3, isSelected ? 0xfff176 : 0xffffff, isSelected ? 1 : 0.75)
                .setInteractive({ useHandCursor: true });

            const label = this.add.text(optionX, y, language, {
                fontFamily: 'Arial Black',
                fontSize: 18,
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 4,
                align: 'center'
            }).setOrigin(0.5);

            const chooseLanguage = () => {
                this.registry.set('selectedLanguage', language);
                this.languageLabel.setText(this.getLanguageText());
                this.closeLanguageMenu();
            };

            background.on('pointerover', () => {
                background.setFillStyle(0x2f8fdd, 1);
                background.setStrokeStyle(3, 0xfff176, 1);
            });

            background.on('pointerout', () => {
                background.setFillStyle(isSelected ? 0x2f8fdd : 0x1b1d26, 0.96);
                background.setStrokeStyle(3, isSelected ? 0xfff176 : 0xffffff, isSelected ? 1 : 0.75);
            });

            background.on('pointerdown', chooseLanguage);
            label.setInteractive({ useHandCursor: true });
            label.on('pointerdown', chooseLanguage);

            this.languageOptions.push(background, label);
        });

        this.languageMenuOpen = true;
        this.languageArrow.setText('^');
    }

    private closeLanguageMenu()
    {
        for (const option of this.languageOptions)
        {
            option.destroy();
        }

        this.languageOptions = [];
        this.languageMenuOpen = false;
        this.languageArrow?.setText('v');
    }

    private toggleFullscreen()
    {
        this.scale.toggleFullscreen();
        this.fullscreenLabel.setText(this.getFullscreenText());

        this.scale.once('enterfullscreen', () => {
            this.fullscreenLabel.setText(this.getFullscreenText());
        });

        this.scale.once('leavefullscreen', () => {
            this.fullscreenLabel.setText(this.getFullscreenText());
        });
    }

    private toggleHitboxes()
    {
        const enabled = this.getHitboxesEnabled();

        this.registry.set('showHitboxes', !enabled);
        this.applyHitboxSetting();
        this.hitboxesLabel.setText(this.getHitboxesText());
    }

    private toggleDeathAnimation()
    {
        const enabled = this.getDeathAnimationEnabled();

        this.registry.set('deathAnimationEnabled', !enabled);
        this.deathAnimationLabel.setText(this.getDeathAnimationText());
    }

    private applyHitboxSetting()
    {
        const gameScene = this.scene.get('Game') as Scene & { physics?: Phaser.Physics.Arcade.ArcadePhysics };
        const world = gameScene.physics?.world;

        if (!world)
        {
            return;
        }

        world.drawDebug = this.getHitboxesEnabled();

        if (world.debugGraphic)
        {
            world.debugGraphic.clear();
        }
    }

    private closeOverlay()
    {
        if (this.scene.isPaused(this.returnScene))
        {
            this.scene.resume(this.returnScene);
        }

        this.scene.stop();
    }

    private getFullscreenText()
    {
        return `Ecra Inteiro\n${this.scale.isFullscreen ? 'Ligado' : 'Desligado'}`;
    }

    private getHitboxesText()
    {
        return `Hitboxes\n${this.getHitboxesEnabled() ? 'Ligadas' : 'Desligadas'}`;
    }

    private getDeathAnimationText()
    {
        return `Animacao Morte\n${this.getDeathAnimationEnabled() ? 'Ligada' : 'Desligada'}`;
    }

    private getVolumeText()
    {
        return `Volume: ${getSavedVolume(this)}%`;
    }

    private getLanguageText()
    {
        return `Lingua: ${this.getSelectedLanguage()}`;
    }

    private getHitboxesEnabled()
    {
        return Boolean(this.registry.get('showHitboxes'));
    }

    private getDeathAnimationEnabled()
    {
        const value = this.registry.get('deathAnimationEnabled');

        return typeof value === 'boolean' ? value : true;
    }

    private getSelectedLanguage()
    {
        const selectedLanguage = this.registry.get('selectedLanguage');

        if (typeof selectedLanguage === 'string' && LANGUAGE_OPTIONS.includes(selectedLanguage))
        {
            return selectedLanguage;
        }

        return LANGUAGE_OPTIONS[0];
    }
}

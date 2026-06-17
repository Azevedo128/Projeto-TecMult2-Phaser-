import { Scene, GameObjects } from 'phaser';
import { getSavedVolume, setSavedVolume } from './AudioManager';
import {
    getCurrentLanguage,
    getLanguageName,
    LANGUAGE_OPTIONS,
    setCurrentLanguage,
    translate as t,
    type LanguageOption
} from '../i18n';
import { playUiClick, playUiHover } from './UiSounds';

function clamp(value: number, min: number, max: number)
{
    return Math.min(Math.max(value, min), max);
}

export class OptionsOverlay extends Scene
{
    returnScene = 'PauseMenu';
    titleText!: GameObjects.Text;
    fullscreenLabel!: GameObjects.Text;
    fullscreenCheck!: GameObjects.Text;
    hitboxesLabel!: GameObjects.Text;
    hitboxesCheck!: GameObjects.Text;
    deathAnimationLabel!: GameObjects.Text;
    deathAnimationCheck!: GameObjects.Text;
    volumeLabel!: GameObjects.Text;
    volumeFill!: GameObjects.Rectangle;
    volumeHandle!: GameObjects.Rectangle;
    languageLabel!: GameObjects.Text;
    languageBar!: GameObjects.Rectangle;
    languageArrow!: GameObjects.Text;
    backButtonLabel!: GameObjects.Text;
    languageOptions: GameObjects.GameObject[] = [];
    languageMenuOpen = false;
    isDraggingVolume = false;
    languageChanged = false;

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

        this.titleText = this.add.text(width / 2, height / 2 - 260, t(this, 'options.title'), {
            fontFamily: 'Arial Black',
            fontSize: 48,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        const optionY = height / 2 - 145;
        const spacing = 220;

        const fullscreenOption = this.createCheckboxOption(
            width / 2 - spacing,
            optionY,
            this.getFullscreenText(),
            this.scale.isFullscreen,
            () => this.toggleFullscreen()
        );
        this.fullscreenLabel = fullscreenOption.label;
        this.fullscreenCheck = fullscreenOption.check;

        const deathAnimationOption = this.createCheckboxOption(
            width / 2,
            optionY,
            this.getDeathAnimationText(),
            this.getDeathAnimationEnabled(),
            () => this.toggleDeathAnimation()
        );
        this.deathAnimationLabel = deathAnimationOption.label;
        this.deathAnimationCheck = deathAnimationOption.check;

        const hitboxesOption = this.createCheckboxOption(
            width / 2 + spacing,
            optionY,
            this.getHitboxesText(),
            this.getHitboxesEnabled(),
            () => this.toggleHitboxes()
        );
        this.hitboxesLabel = hitboxesOption.label;
        this.hitboxesCheck = hitboxesOption.check;

        this.createVolumeSlider(width / 2, height / 2 + 10, 560);
        this.createLanguageSelector(width / 2, height / 2 + 125, 560);

        this.backButtonLabel = this.createTextButton(width / 2, height / 2 + 255, t(this, 'common.back'), () => {
            this.closeOverlay();
        });

        this.input.keyboard?.once('keydown-ESC', () => {
            this.closeOverlay();
        });
    }

    private createCheckboxOption(x: number, y: number, label: string, checked: boolean, onClick: () => void)
    {
        const box = this.add.rectangle(x, y, 62, 62, 0xffffff, 0.06)
            .setStrokeStyle(5, 0xffffff, 0.9)
            .setInteractive({ useHandCursor: true });

        const check = this.add.text(x, y - 2, checked ? 'X' : '', {
            fontFamily: 'Arial Black',
            fontSize: 40,
            color: '#fff176',
            stroke: '#000000',
            strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5);

        const labelText = this.add.text(x, y + 76, label, {
            fontFamily: 'Arial Black',
            fontSize: 20,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 5,
            align: 'center'
        }).setOrigin(0.5);

        const setHover = (active: boolean) => {
            if (active)
            {
                playUiHover(this, `checkbox-${label}`);
            }

            box.setFillStyle(active ? 0x2f8fdd : 0xffffff, active ? 0.25 : 0.06);
            box.setStrokeStyle(5, active ? 0xfff176 : 0xffffff, active ? 1 : 0.9);
        };

        const click = () => {
            playUiClick(this);
            onClick();
        };

        box.on('pointerover', () => setHover(true));
        box.on('pointerout', () => setHover(false));
        box.on('pointerdown', click);

        labelText.setInteractive({ useHandCursor: true });
        labelText.on('pointerover', () => setHover(true));
        labelText.on('pointerout', () => setHover(false));
        labelText.on('pointerdown', click);

        return {
            label: labelText,
            check
        };
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
            if (active)
            {
                playUiHover(this, `text-button-${label}`);
            }

            button.setFillStyle(active ? 0x2f8fdd : 0x1b1d26, 0.95);
            button.setStrokeStyle(4, active ? 0xfff176 : 0xffffff, active ? 1 : 0.8);
        };

        button.on('pointerover', () => setHover(true));
        button.on('pointerout', () => setHover(false));
        button.on('pointerdown', () => {
            playUiClick(this);
            onClick();
        });

        text.setInteractive({ useHandCursor: true });
        text.on('pointerover', () => setHover(true));
        text.on('pointerout', () => setHover(false));
        text.on('pointerdown', () => {
            playUiClick(this);
            onClick();
        });

        return text;
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
            if (active)
            {
                playUiHover(this, `volume-step-${label}`);
            }

            button.setFillStyle(active ? 0x2f8fdd : 0x1b1d26, 0.95);
            button.setStrokeStyle(4, active ? 0xfff176 : 0xffffff, active ? 1 : 0.85);
        };

        button.on('pointerover', () => setHover(true));
        button.on('pointerout', () => setHover(false));
        button.on('pointerdown', () => {
            playUiClick(this);
            onClick();
        });

        text.setInteractive({ useHandCursor: true });
        text.on('pointerover', () => setHover(true));
        text.on('pointerout', () => setHover(false));
        text.on('pointerdown', () => {
            playUiClick(this);
            onClick();
        });
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

    private updateTranslatedText()
    {
        this.titleText.setText(t(this, 'options.title'));
        this.fullscreenLabel.setText(this.getFullscreenText());
        this.hitboxesLabel.setText(this.getHitboxesText());
        this.deathAnimationLabel.setText(this.getDeathAnimationText());
        this.volumeLabel.setText(this.getVolumeText());
        this.languageLabel.setText(this.getLanguageText());
        this.backButtonLabel.setText(t(this, 'common.back'));
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
            this.toggleLanguageMenu();
        };

        this.languageBar.on('pointerover', () => {
            playUiHover(this, 'language-selector');
            this.languageBar.setStrokeStyle(4, 0xfff176, 1);
        });

        this.languageBar.on('pointerout', () => {
            this.languageBar.setStrokeStyle(4, 0xffffff, 0.85);
        });

        this.languageBar.on('pointerdown', () => {
            playUiClick(this);
            toggle();
        });
        this.languageLabel.setInteractive({ useHandCursor: true });
        this.languageLabel.on('pointerdown', () => {
            playUiClick(this);
            toggle();
        });
        this.languageArrow.setInteractive({ useHandCursor: true });
        this.languageArrow.on('pointerdown', () => {
            playUiClick(this);
            toggle();
        });
    }

    private toggleLanguageMenu()
    {
        if (this.languageMenuOpen)
        {
            this.closeLanguageMenu();
            return;
        }

        this.openLanguageMenu();
    }

    private openLanguageMenu()
    {
        this.closeLanguageMenu();

        const width = this.scale.width;
        const height = this.scale.height;
        const centerX = width / 2;
        const centerY = height / 2 + 16;
        const panelWidth = 760;
        const panelHeight = 500;
        const headerY = centerY - panelHeight / 2 + 64;

        const blocker = this.add.rectangle(centerX, centerY, panelWidth + 50, panelHeight + 50, 0x000000, 0.18)
            .setInteractive();

        const panel = this.add.rectangle(centerX, centerY, panelWidth, panelHeight, 0x171514, 0.98)
            .setStrokeStyle(5, 0x050505, 1);

        const header = this.add.rectangle(centerX, headerY, panelWidth - 34, 102, 0x211f1d, 1)
            .setStrokeStyle(3, 0x090909, 1);

        const title = this.add.text(centerX - panelWidth / 2 + 52, headerY - 22, t(this, 'options.languageTitle'), {
            fontFamily: 'Arial Black',
            fontSize: 24,
            color: '#ffd451',
            stroke: '#000000',
            strokeThickness: 5,
            align: 'left'
        }).setOrigin(0, 0.5);

        const subtitle = this.add.text(centerX - panelWidth / 2 + 52, headerY + 18, t(this, 'options.languageSubtitle'), {
            fontFamily: 'Arial',
            fontSize: 18,
            color: '#ffffff',
            align: 'left'
        }).setOrigin(0, 0.5);

        this.languageOptions.push(blocker, panel, header, title, subtitle);

        LANGUAGE_OPTIONS.forEach((language, index) => {
            const columns = index < 3 ? 3 : 2;
            const column = index < 3 ? index : index - 3;
            const row = index < 3 ? 0 : 1;
            const optionSpacingX = 205;
            const optionSpacingY = 145;
            const optionX = centerX - ((columns - 1) * optionSpacingX) / 2 + column * optionSpacingX;
            const optionY = centerY - 42 + row * optionSpacingY;

            this.createLanguageChoice(language, optionX, optionY);
        });

        this.createLanguageCancelButton(centerX, centerY + panelHeight / 2 - 42);

        this.languageMenuOpen = true;
        this.languageArrow.setText('^');
    }

    private createLanguageChoice(language: LanguageOption, x: number, y: number)
    {
        const isSelected = language.id === this.getSelectedLanguage();
        const hitArea = this.add.rectangle(x, y, 166, 128, isSelected ? 0x2f8fdd : 0x000000, isSelected ? 0.16 : 0.01)
            .setStrokeStyle(isSelected ? 3 : 0, isSelected ? 0xffd451 : 0x000000, isSelected ? 1 : 0)
            .setInteractive({ useHandCursor: true });

        const flag = this.add.image(x, y - 18, language.flagKey)
            .setDisplaySize(96, 72);

        const label = this.add.text(x, y + 44, getLanguageName(this, language.id).toUpperCase(), {
            fontFamily: 'Arial Black',
            fontSize: 18,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 5,
            align: 'center'
        }).setOrigin(0.5);

        const chooseLanguage = () => {
            playUiClick(this);
            setCurrentLanguage(this, language.id);
            this.languageChanged = true;
            this.updateTranslatedText();
            this.closeLanguageMenu();
        };

        const setHover = (active: boolean) => {
            if (active)
            {
                playUiHover(this, `language-${language.id}`);
            }

            hitArea.setFillStyle(active || isSelected ? 0x2f8fdd : 0x000000, active ? 0.24 : isSelected ? 0.16 : 0.01);
            hitArea.setStrokeStyle(active || isSelected ? 3 : 0, active ? 0xffffff : 0xffd451, active || isSelected ? 1 : 0);
        };

        hitArea.on('pointerover', () => setHover(true));
        hitArea.on('pointerout', () => setHover(false));
        hitArea.on('pointerdown', chooseLanguage);

        flag.setInteractive({ useHandCursor: true });
        flag.on('pointerover', () => setHover(true));
        flag.on('pointerout', () => setHover(false));
        flag.on('pointerdown', chooseLanguage);

        label.setInteractive({ useHandCursor: true });
        label.on('pointerover', () => setHover(true));
        label.on('pointerout', () => setHover(false));
        label.on('pointerdown', chooseLanguage);

        this.languageOptions.push(hitArea, flag, label);
    }

    private createLanguageCancelButton(x: number, y: number)
    {
        const button = this.add.rectangle(x, y, 170, 54, 0x2b2a28, 1)
            .setStrokeStyle(4, 0x050505, 1)
            .setInteractive({ useHandCursor: true });

        const label = this.add.text(x, y, t(this, 'common.cancel').toUpperCase(), {
            fontFamily: 'Arial Black',
            fontSize: 20,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 5,
            align: 'center'
        }).setOrigin(0.5);

        const setHover = (active: boolean) => {
            if (active)
            {
                playUiHover(this, 'language-cancel');
            }

            button.setFillStyle(active ? 0x3a3937 : 0x2b2a28, 1);
            button.setStrokeStyle(4, active ? 0xffd451 : 0x050505, 1);
        };

        button.on('pointerover', () => setHover(true));
        button.on('pointerout', () => setHover(false));
        button.on('pointerdown', () => {
            playUiClick(this);
            this.closeLanguageMenu();
        });

        label.setInteractive({ useHandCursor: true });
        label.on('pointerover', () => setHover(true));
        label.on('pointerout', () => setHover(false));
        label.on('pointerdown', () => {
            playUiClick(this);
            this.closeLanguageMenu();
        });

        this.languageOptions.push(button, label);
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
        this.updateFullscreenOption();

        this.scale.once('enterfullscreen', () => {
            this.updateFullscreenOption();
        });

        this.scale.once('leavefullscreen', () => {
            this.updateFullscreenOption();
        });
    }

    private toggleHitboxes()
    {
        const enabled = this.getHitboxesEnabled();

        this.registry.set('showHitboxes', !enabled);
        this.applyHitboxSetting();
        this.updateHitboxesOption();
    }

    private toggleDeathAnimation()
    {
        const enabled = this.getDeathAnimationEnabled();

        this.registry.set('deathAnimationEnabled', !enabled);
        this.updateDeathAnimationOption();
    }

    private updateFullscreenOption()
    {
        this.fullscreenLabel.setText(this.getFullscreenText());
        this.setCheckboxValue(this.fullscreenCheck, this.scale.isFullscreen);
    }

    private updateHitboxesOption()
    {
        this.hitboxesLabel.setText(this.getHitboxesText());
        this.setCheckboxValue(this.hitboxesCheck, this.getHitboxesEnabled());
    }

    private updateDeathAnimationOption()
    {
        this.deathAnimationLabel.setText(this.getDeathAnimationText());
        this.setCheckboxValue(this.deathAnimationCheck, this.getDeathAnimationEnabled());
    }

    private setCheckboxValue(check: GameObjects.Text, checked: boolean)
    {
        check.setText(checked ? 'X' : '');
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
        const returnScene = this.scene.get(this.returnScene);

        if (this.scene.isPaused(this.returnScene))
        {
            this.scene.resume(this.returnScene);
        }

        this.scene.stop();

        if (this.languageChanged)
        {
            returnScene.events.emit('language-changed');
        }
    }

    private getFullscreenText()
    {
        return t(this, 'options.fullscreen');
    }

    private getHitboxesText()
    {
        return t(this, 'options.hitboxes');
    }

    private getDeathAnimationText()
    {
        return t(this, 'options.deathAnimation');
    }

    private getVolumeText()
    {
        return t(this, 'options.volume', { volume: getSavedVolume(this) });
    }

    private getLanguageText()
    {
        return t(this, 'options.languageBar', {
            language: getLanguageName(this, this.getSelectedLanguage())
        });
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
        return this.getSelectedLanguageOption().id;
    }

    private getSelectedLanguageOption()
    {
        const selectedLanguage = getCurrentLanguage(this);

        return LANGUAGE_OPTIONS.find((option) => option.id === selectedLanguage) ?? LANGUAGE_OPTIONS[0];
    }
}

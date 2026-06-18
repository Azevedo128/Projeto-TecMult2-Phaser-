import { Scene } from 'phaser';
import { stopLevelMusic } from './AudioManager';
import { createLevel1 } from './Levels/level1';
import { createLevel2 } from './Levels/level2';
import { createLevel3 } from './Levels/level3';
import { restartSceneOnResize } from './ResizeRestart';
import { translate as t } from '../i18n';
import { playUiClick, playUiHover } from './UiSounds';

const MAP_VIEW_PADDING_X = 90;
const MAP_VIEW_PADDING_Y = 160;
const MAP_WORLD_EDGE_PADDING = 700;
const MIN_MAP_ZOOM = 0.05;
const MAX_MAP_ZOOM = 1.45;
const ZOOM_STEP = 1.12;

type MapViewerData = {
    levelNumber?: number;
};

type LevelPreview = {
    worldWidth: number;
    worldHeight: number;
    update?: () => void;
};

export class MapViewer extends Scene
{
    levelNumber = 1;
    previewUpdate?: () => void;
    mapZoom = 1;
    worldWidth = 0;
    worldHeight = 0;
    isDraggingMap = false;
    lastPointerX = 0;
    lastPointerY = 0;
    mapObjects: Phaser.GameObjects.GameObject[] = [];
    uiObjects: Phaser.GameObjects.GameObject[] = [];

    constructor ()
    {
        super('MapViewer');
    }

    create (data: MapViewerData = {})
    {
        this.levelNumber = data.levelNumber ?? Number(this.registry.get('selectedLevel') ?? 1);

        restartSceneOnResize(this, () => ({ levelNumber: this.levelNumber }));
        stopLevelMusic(this);
        this.disablePhysicsDebug();

        const level = this.createSelectedLevel();

        this.mapObjects = [...this.children.list];
        this.worldWidth = level.worldWidth + MAP_WORLD_EDGE_PADDING;
        this.worldHeight = level.worldHeight;
        this.previewUpdate = level.update;
        this.fitCameraToMap(this.worldWidth, this.worldHeight);
        this.createUi();
        this.createUiCamera();
        this.createMapDrag();
        this.createMapZoom();

        this.input.keyboard?.once('keydown-ESC', () => {
            this.scene.start('LevelMenu');
        });
    }

    update ()
    {
        this.previewUpdate?.();
    }

    private createSelectedLevel(): LevelPreview
    {
        if (this.levelNumber === 3)
        {
            return createLevel3(this);
        }

        if (this.levelNumber === 2)
        {
            return createLevel2(this);
        }

        this.levelNumber = 1;

        return createLevel1(this);
    }

    private disablePhysicsDebug()
    {
        this.physics.world.drawDebug = false;

        if (this.physics.world.debugGraphic)
        {
            this.physics.world.debugGraphic.clear();
        }
    }

    private fitCameraToMap(worldWidth: number, worldHeight: number)
    {
        const camera = this.cameras.main;

        const zoomX = (this.scale.width - MAP_VIEW_PADDING_X * 2) / worldWidth;
        const zoomY = (this.scale.height - MAP_VIEW_PADDING_Y * 2) / worldHeight;

        this.mapZoom = Phaser.Math.Clamp(Math.min(zoomX, zoomY), MIN_MAP_ZOOM, MAX_MAP_ZOOM);

        camera.setBounds(0, 0, worldWidth, worldHeight);
        camera.setZoom(this.mapZoom);
        camera.centerOn(worldWidth / 2, worldHeight / 2);
    }

    private createUi()
    {
        const width = this.scale.width;
        const height = this.scale.height;
        const centerX = width / 2;
        const titleY = 62;
        const bottomY = height - 62;
        const levelLabel = t(this, `levels.level${this.levelNumber}`);

        this.addUiRectangle(centerX, titleY, width - 80, 72, 0x000000, 0.5);

        this.addUiText(centerX, titleY, t(this, 'mapViewer.title', { level: levelLabel }), {
            fontFamily: 'Arial Black',
            fontSize: 30,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6,
            align: 'center'
        });

        this.addUiRectangle(centerX, bottomY, width - 100, 76, 0x000000, 0.45);

        const spacing = Math.min(190, width * 0.17);
        const buttonWidth = Math.min(150, Math.max(112, spacing - 14));
        const buttonY = bottomY;

        this.createTextButton(centerX - spacing * 1.5, buttonY, buttonWidth, t(this, 'levels.level1'), () => {
            this.openLevel(1);
        });

        this.createTextButton(centerX - spacing * 0.5, buttonY, buttonWidth, t(this, 'levels.level2'), () => {
            this.openLevel(2);
        });

        this.createTextButton(centerX + spacing * 0.5, buttonY, buttonWidth, t(this, 'levels.level3'), () => {
            this.openLevel(3);
        });

        this.createTextButton(centerX + spacing * 1.5, buttonY, buttonWidth, t(this, 'common.back'), () => {
            this.scene.start('LevelMenu');
        });
    }

    private createTextButton(x: number, y: number, width: number, label: string, onClick: () => void)
    {
        const button = this.addUiRectangle(x, y, width, 46, 0x1b1d26, 0.96)
            .setStrokeStyle(4, 0xffffff, 0.85)
            .setInteractive({ useHandCursor: true });

        const text = this.addUiText(x, y, label, {
            fontFamily: 'Arial Black',
            fontSize: 18,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 5,
            align: 'center'
        });

        const setHover = (active: boolean) => {
            if (active)
            {
                playUiHover(this, `map-viewer-${label}`);
            }

            button.setFillStyle(active ? 0x2f8fdd : 0x1b1d26, 0.96);
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

    private addUiRectangle(
        x: number,
        y: number,
        width: number,
        height: number,
        color: number,
        alpha: number
    )
    {
        const rectangle = this.add.rectangle(x, y, width, height, color, alpha)
            .setDepth(2000);

        this.uiObjects.push(rectangle);

        return rectangle;
    }

    private addUiText(x: number, y: number, label: string, style: Phaser.Types.GameObjects.Text.TextStyle)
    {
        const text = this.add.text(x, y, label, style)
            .setOrigin(0.5)
            .setDepth(2001);

        this.uiObjects.push(text);

        return text;
    }

    private createUiCamera()
    {
        const uiCamera = this.cameras.add(0, 0, this.scale.width, this.scale.height);

        uiCamera.setScroll(0, 0);
        uiCamera.setZoom(1);
        uiCamera.ignore(this.mapObjects);
        this.cameras.main.ignore(this.uiObjects);
    }

    private createMapDrag()
    {
        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (this.isPointerOverUi(pointer))
            {
                return;
            }

            this.isDraggingMap = true;
            this.lastPointerX = pointer.x;
            this.lastPointerY = pointer.y;
        });

        this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            if (!this.isDraggingMap || !pointer.isDown)
            {
                return;
            }

            const deltaX = pointer.x - this.lastPointerX;
            const deltaY = pointer.y - this.lastPointerY;

            this.lastPointerX = pointer.x;
            this.lastPointerY = pointer.y;
            this.panCamera(deltaX, deltaY);
        });

        this.input.on('pointerup', () => {
            this.isDraggingMap = false;
        });
    }

    private createMapZoom()
    {
        this.input.on(
            'wheel',
            (
                pointer: Phaser.Input.Pointer,
                _gameObjects: Phaser.GameObjects.GameObject[],
                _deltaX: number,
                deltaY: number
            ) => {
                if (this.isPointerOverUi(pointer) || deltaY === 0)
                {
                    return;
                }

                const zoomFactor = deltaY > 0 ? 1 / ZOOM_STEP : ZOOM_STEP;
                const nextZoom = Phaser.Math.Clamp(this.mapZoom * zoomFactor, MIN_MAP_ZOOM, MAX_MAP_ZOOM);

                this.zoomCameraAtPointer(pointer, nextZoom);
            }
        );
    }

    private zoomCameraAtPointer(pointer: Phaser.Input.Pointer, nextZoom: number)
    {
        if (nextZoom === this.mapZoom)
        {
            return;
        }

        const camera = this.cameras.main;
        const worldBeforeZoom = camera.getWorldPoint(pointer.x, pointer.y);

        this.mapZoom = nextZoom;
        camera.setZoom(this.mapZoom);

        const worldAfterZoom = camera.getWorldPoint(pointer.x, pointer.y);
        const nextScrollX = Phaser.Math.Clamp(
            camera.scrollX + worldBeforeZoom.x - worldAfterZoom.x,
            0,
            this.getMaxScrollX()
        );
        const nextScrollY = Phaser.Math.Clamp(
            camera.scrollY + worldBeforeZoom.y - worldAfterZoom.y,
            0,
            this.getMaxScrollY()
        );

        camera.setScroll(nextScrollX, nextScrollY);
    }

    private panCamera(deltaX: number, deltaY: number)
    {
        const camera = this.cameras.main;
        const nextScrollX = Phaser.Math.Clamp(
            camera.scrollX - deltaX / this.mapZoom,
            0,
            this.getMaxScrollX()
        );
        const nextScrollY = Phaser.Math.Clamp(
            camera.scrollY - deltaY / this.mapZoom,
            0,
            this.getMaxScrollY()
        );

        camera.setScroll(nextScrollX, nextScrollY);
    }

    private getMaxScrollX()
    {
        return Math.max(0, this.worldWidth - this.scale.width / this.mapZoom);
    }

    private getMaxScrollY()
    {
        return Math.max(0, this.worldHeight - this.scale.height / this.mapZoom);
    }

    private isPointerOverUi(pointer: Phaser.Input.Pointer)
    {
        return this.uiObjects.some((object) => {
            const bounds = object.getBounds();

            return bounds.contains(pointer.x, pointer.y);
        });
    }

    private openLevel(levelNumber: number)
    {
        this.scene.restart({ levelNumber });
    }
}

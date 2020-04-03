import {Injectable} from '@angular/core';
import {fabric} from 'fabric';
import {CanvasService} from '../../canvas/canvas.service';
import {IText, ITextOptions} from 'fabric/fabric-impl';
import {ActiveObjectService} from '../../canvas/active-object/active-object.service';
import {ObjectListService} from '../../objects/object-list.service';
import {FontItem} from '../../../image-editor-ui/toolbar-controls/widgets/google-fonts-panel/font-item';
import {ObjectNames} from '../../objects/object-names.enum';
import {normalizeObjectProps, PixieObjOptions} from '../../utils/normalize-object-props';
import {FontsPaginatorService} from '../../../image-editor-ui/toolbar-controls/widgets/google-fonts-panel/fonts-paginator.service';
import {Settings} from '@common/core/config/settings.service';
import { CanvasStateService } from 'app/image-editor/canvas/canvas-state.service';

@Injectable()
export class TextToolService {
    private readonly minWidth: number = 250;

    constructor(
        private canvas: CanvasService,
        private state:CanvasStateService,
        private activeObject: ActiveObjectService,
        private objects: ObjectListService,
        private config: Settings,
        private fontsPaginator: FontsPaginatorService,
    ) {}

    public add(text = null, providedConfig: ITextOptions = {}) {
        text = text || this.config.get('pixie.tools.text.defaultText');

        const options = normalizeObjectProps({
            ...this.activeObject.form.value,
            ...this.config.get('pixie.objectDefaults.text'),
            ...providedConfig,
            name: ObjectNames.text.name,
        });

        const itext = new fabric.IText(text, options);
        this.canvas.fabric().add(itext);
        this.autoPositionText(itext);

        this.canvas.fabric().setActiveObject(itext);
        this.canvas.render();

        itext.enterEditing();
        itext.selectAll();

        this.canvas.addObjectToTracked(itext.data.id);
        
        // this.canvas.addObjectToTracked(itext.data.id);
    }

    public addPartText(quadrant) {
        quadrant.data.map( (text, index) => {
            const options = normalizeObjectProps({
                ...this.config.get('pixie.objectDefaults.text'),
                name: quadrant.name + " - " + index,
            });

            const itext = new fabric.IText(text, options);
            itext.top = quadrant.positionY;
            itext.left = quadrant.positionX;

            if ((itext.width >= quadrant.width || itext.height >= quadrant.height)) {
                // calc new image dimensions (main image height - 10% and width - 10%)
                const newWidth  = quadrant.width,
                    newHeight = quadrant.height,
                    scale     = 1 / (Math.min(newHeight / itext.getScaledHeight(), newWidth / itext.getScaledWidth()));

                // scale newly uploaded image to the above dimensions
                itext.scaleX = itext.scaleX * (1 / scale);
                itext.scaleY = itext.scaleY * (1 / scale);
            }
            this.canvas.fabric().add(itext);
            // this.autoPositionText(itext);

            this.canvas.fabric().setActiveObject(itext);
            this.canvas.render();
            this.canvas.addObjectToTracked(itext.data.id);
        });
        
    }

    private autoPositionText(text: IText) {
        const canvasWidth = this.canvas.fabric().getWidth(),
              canvasHeight = this.canvas.fabric().getHeight();

        // make sure min width is not larger then canvas width
        const minWidth = Math.min(this.canvas.fabric().getWidth(), this.minWidth);

        text.scaleToWidth(Math.max(canvasWidth / 3, minWidth));

        // make sure text is not scaled outside canvas
        // if (text.getScaledHeight() > canvasHeight) {
        //     text.scaleToHeight(canvasHeight - text.getScaledHeight() - 20);
        // }

        text.viewportCenter();

        // // push text down, if it intersects with another text object
        // this.canvas.fabric().getObjects('i-text').forEach(obj => {
        //     if (obj === text) return;
        //     if (obj.intersectsWithObject(text)) {
        //         const offset = (obj.top - text.top) + obj.getScaledHeight();
        //         let newTop = text.top + offset;

        //         // if pushing object down would push it outside canvas, position text at top of canvas
        //         if (newTop > this.canvas.state.original.height - obj.getScaledHeight()) {
        //             newTop = 0;
        //         }

        //         text.set('top', newTop);
        //         text.setCoords();
        //     }
        // });
    }

    /**
     * Get all custom fonts used on canvas.
     */
    public getUsedFonts(): FontItem[] {
        return this.objects.getAll()
            .filter(obj => obj.type === 'i-text')
            .map((obj: PixieObjOptions) => {
                return obj.activeFont ||
                    this.fontsPaginator.original.find(f => f.family === obj.fontFamily);
            }).filter(font => {
                return font && font.type !== 'basic';
            });
    }
}

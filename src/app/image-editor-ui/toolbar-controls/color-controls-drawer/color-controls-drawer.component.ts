import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from '@angular/core';
import {ActiveObjectService} from '../../../image-editor/canvas/active-object/active-object.service';
import { CanvasStateService } from 'app/image-editor/canvas/canvas-state.service';
import { EditorControlsService } from '../editor-controls.service';
import { ImageEditorService } from 'app/image-editor/image-editor.service';
import { ObjectListService } from 'app/image-editor/objects/object-list.service';

@Component({
    selector: 'color-controls-drawer',
    templateUrl: './color-controls-drawer.component.html',
    styleUrls: ['./color-controls-drawer.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class ColorControlsDrawerComponent {
    @Input() controlName: 'fill'|'backgroundColor';
    public currentObjectInfo: any; 
    constructor(
        public activeObject: ActiveObjectService,
        public state: CanvasStateService,
        public editor: EditorControlsService,
        public imageEditor: ImageEditorService,
        public objects: ObjectListService
        ) {
            this.state.canvasObjects.map(object => {
                if(object.id == this.activeObject.getId()) {
                    this.currentObjectInfo = object;
                }
            });
            console.log(this.objects.getById(this.activeObject.getId()));
        }

        public removeEffect() {
            // if ()
            this.activeObject.setValues({
                backgroundColor:'rgba(0,0,0,0)'
            });
            this.state.action = 'removing';
            this.imageEditor.applyChanges();
            this.editor.closeCurrentPanel();
        }
}

import {ChangeDetectionStrategy, Component, ViewEncapsulation, OnInit} from '@angular/core';
import {Settings} from 'common/core/config/settings.service';
import {Select, Store} from '@ngxs/store';
import {ProjectsState} from '../../../state/projects/projects.state';
import {Observable} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ImportToolService } from 'app/image-editor/tools/import/import-tool.service';
import { CanvasStateService } from '../../../../image-editor/canvas/canvas-state.service';
import { ImageEditorService } from '../../../../image-editor/image-editor.service';



@Component({
    selector: 'pages-drawer',
    templateUrl: './pages-drawer-component.html',
    styleUrls: ['./pages-drawer-component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {'class': 'controls-drawer'},
})
export class PagesDrawerComponent {
    public pages = [];
    public currentPage = this.state.canvasId;
    constructor(
        private http:HttpClient,
        private state:CanvasStateService,
        private imageEditor:ImageEditorService,
    ) {
        this.state.pages.map (page => {
            this.pages.push(page);
        });
        // this.pages = [... this.pages];
    }


    //might need to move this into state so I can also dynamically upload the view?

    switchPage (projectId) {
        console.log(projectId);
        let state = null;
        let id = null;
        this.pages.map(page => {
            if (page.RowID == projectId) {
                id = page.RowID;
                state = page.ProjectState
            }
        });

        console.log(id);
        console.log(projectId);
        console.log(state);


        this.imageEditor.loadState(state, id, this.state.userId );
    }
}
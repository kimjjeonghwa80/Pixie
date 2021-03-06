import {Action, Actions, NgxsOnInit, Selector, State, StateContext, Store} from '@ngxs/store';
import {HistoryToolService} from '../../../image-editor/history/history-tool.service';
import {CloseForePanel, OpenPanel} from '../../../image-editor/state/editor-state-actions';
import {HistoryNames} from '../../../image-editor/history/history-names.enum';
import {ShapesToolService} from '../../../image-editor/tools/shapes/shapes-tool.service';
import {AddShape} from './shapes.actions';
import {BaseToolState} from '../base-tool.state';
import {DrawerName} from '../../toolbar-controls/drawers/drawer-name.enum';

interface ShapesStateModel {
    dirty: boolean;
}

@State<ShapesStateModel>({
    name: 'shapes',
    defaults: {
        dirty: false,
    }
})
export class ShapesState extends BaseToolState<ShapesStateModel> implements NgxsOnInit {
    protected toolName = DrawerName.SHAPES;

    @Selector()
    static dirty(state: ShapesStateModel) {
        return state.dirty;
    }

    constructor(
        protected store: Store,
        protected shapesTool: ShapesToolService,
        protected history: HistoryToolService,
        protected actions$: Actions,
    ) {
        super();
    }

    applyChanges(ctx: StateContext<ShapesStateModel>) {
        this.store.dispatch(new OpenPanel(DrawerName.OBJECT_SETTINGS));
        if (ctx.getState().dirty) {
            this.history.add(HistoryNames.SHAPES);
        }
        ctx.patchState({dirty: false});
    }

   cancelChanges(ctx: StateContext<ShapesStateModel>) {
       this.store.dispatch(new CloseForePanel());
       if (ctx.getState().dirty) {
           this.history.reload();
       }
       ctx.patchState({dirty: false});
   }

    resetState(ctx: StateContext<ShapesStateModel>) {
        ctx.setState({dirty: false});
    }

   @Action(AddShape)
   addShape(ctx: StateContext<ShapesStateModel>, action: AddShape) {
       ctx.patchState({dirty: true});
       this.shapesTool.addBasicShape(action.shape);
   }
}

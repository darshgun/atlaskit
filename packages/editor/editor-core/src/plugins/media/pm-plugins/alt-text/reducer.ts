import { MediaAltTextState } from './types';
import { MediaAltTextAction } from './actions';

export default (
  state: MediaAltTextState,
  action: MediaAltTextAction,
): MediaAltTextState => {
  switch (action.type) {
    case 'updateAltText': {
      return {
        ...state,
        isAltTextEditorOpen: false,
      };
    }
    case 'openMediaAltTextMenu': {
      return {
        ...state,
        isAltTextEditorOpen: true,
      };
    }
    case 'closeMediaAltTextMenu': {
      return {
        ...state,
        isAltTextEditorOpen: false,
      };
    }
    default:
      return state;
  }
};

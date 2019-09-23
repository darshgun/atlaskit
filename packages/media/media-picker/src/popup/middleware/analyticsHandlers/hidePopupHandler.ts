import { Action, MiddlewareAPI } from 'redux';
import { State } from '../../domain';
import { isHidePopupAction } from '../../actions/hidePopup';
import { buttonClickPayload, HandlerResult } from '.';

export default (action: Action, store: MiddlewareAPI<State>): HandlerResult => {
  if (isHidePopupAction(action)) {
    const { selectedItems = [] } = store.getState();
    const actionSubjectId =
      selectedItems.length > 0 ? 'insertFilesButton' : 'cancelButton';

    const files =
      actionSubjectId === 'insertFilesButton'
        ? selectedItems.map(item => ({
            fileId: item.id,
            fileMimetype: item.mimeType,
            fileName: item.name,
            fileSize: item.size,
            accountId: item.accountId,
            provider: item.serviceName || 'unknown',
          }))
        : [];

    return [
      {
        ...buttonClickPayload,
        actionSubjectId,
        attributes: {
          ...(selectedItems.length > 0
            ? {
                provider:
                  (selectedItems[0] && selectedItems[0].serviceName) ||
                  'unknown',
              }
            : {}),
          fileCount: selectedItems.length,
          ...(actionSubjectId === 'insertFilesButton' ? { files } : {}),
        },
      },
    ];
  }
};

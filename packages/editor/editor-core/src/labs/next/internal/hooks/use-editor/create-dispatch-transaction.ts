import { EditorView } from 'prosemirror-view';
import { Transaction } from 'prosemirror-state';
import { Node as PMNode, Node } from 'prosemirror-model';
import { Transformer } from '@atlaskit/editor-common';
import {
  analyticsEventKey,
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
  analyticsPluginKey,
  AnalyticsEventPayloadWithChannel,
} from '../../../../../plugins/analytics';
import {
  findChangedNodesFromTransaction,
  validateNodes,
} from '../../../../../utils/nodes';
import { compose, toJSON } from '../../../../../utils';
import { sanitizeNode } from '../../../../../utils/filter/node-filter';
import { EditorSharedConfig } from '../../context/shared-config';
import { getDocStructure } from '../../../../../utils/document-logger';

export function createDispatchTransaction(
  editorSharedConfig: EditorSharedConfig,
) {
  return function dispatchTransaction(transaction: Transaction) {
    const { editorView, onChange, transformer, dispatch } = editorSharedConfig;
    if (!editorView) {
      return;
    }

    const nodes: PMNode[] = findChangedNodesFromTransaction(transaction);
    if (validateNodes(nodes)) {
      // go ahead and update the state now we know the transaction is good
      const editorState = editorView.state.apply(transaction);
      editorView.updateState(editorState);

      if (onChange && transaction.docChanged) {
        onChange(getEditorValue(editorView, transformer));
      }
    } else {
      // If invalid document, send analytics event with its sructure before and after transaction
      if (dispatch) {
        const documents = {
          new: getDocStructure(transaction.doc),
          prev: getDocStructure(transaction.docs[0]),
        };

        dispatch(analyticsEventKey, {
          payload: {
            action: ACTION.DISPATCHED_INVALID_TRANSACTION,
            actionSubject: ACTION_SUBJECT.EDITOR,
            eventType: EVENT_TYPE.OPERATIONAL,
            attributes: {
              analyticsEventPayloads: transaction.getMeta(
                analyticsPluginKey,
              ) as AnalyticsEventPayloadWithChannel[],
              documents,
            },
          },
        });
      }
    }
  };
}

export function getEditorValue(
  editorView: EditorView,
  transformer?: Transformer<any>,
) {
  return compose(
    doc =>
      transformer && transformer.encode
        ? transformer.encode(Node.fromJSON(editorView.state.schema, doc))
        : doc,
    sanitizeNode,
    toJSON,
  )(editorView.state.doc);
}

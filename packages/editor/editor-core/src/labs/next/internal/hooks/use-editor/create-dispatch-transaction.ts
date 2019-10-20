import { Transaction } from 'prosemirror-state';
import { Node as PMNode } from 'prosemirror-model';
import { EditorSharedConfig } from '../../context/shared-config';
import {
  findChangedNodesFromTransaction,
  validateNodes,
} from '../../../../../utils/nodes';

export function createDispatchTransaction(
  editorSharedConfig: EditorSharedConfig,
) {
  return function dispatchTransaction(transaction: Transaction) {
    const { editorView } = editorSharedConfig;
    if (!editorView) {
      return;
    }

    const nodes: PMNode[] = findChangedNodesFromTransaction(transaction);
    if (validateNodes(nodes)) {
      // go ahead and update the state now we know the transaction is good

      const editorState = editorView.state.apply(transaction);
      editorView.updateState(editorState);
      // const onChange = editorSharedConfig.onChange;
      // if (onChange && transaction.docChanged && editorActions) {
      //   // TODO we should re-visit this, this should NOT be async. Waiting for media pending tasks
      //   // should happen in teardown, not when getting the editors value.
      //   editorActions.getValue().then(value => {
      //     onChange(value);
      //   });
      // }
    } else {
      // TODO pipe analytics
    }
  };
}

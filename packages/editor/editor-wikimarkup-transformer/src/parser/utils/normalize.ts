import { Node as PMNode, Schema } from 'prosemirror-model';
import {
  createParagraphNodeFromInlineNodes,
  createEmptyParagraphNode,
} from '../nodes/paragraph';

export function normalizePMNodes(nodes: PMNode[], schema: Schema): PMNode[] {
  const output: PMNode[] = [];
  let inlineNodeBuffer: PMNode[] = [];
  for (const node of nodes) {
    if (!node.isBlock) {
      inlineNodeBuffer.push(node);
      continue;
    }
    const trimedInlineNodes = trimInlineNodes(inlineNodeBuffer);
    if (trimedInlineNodes.length > 0) {
      output.push(
        ...createParagraphNodeFromInlineNodes(trimedInlineNodes, schema),
      );
    }
    inlineNodeBuffer = []; // clear buffer
    output.push(node);
  }
  const trimedInlineNodes = trimInlineNodes(inlineNodeBuffer);
  if (trimedInlineNodes.length > 0) {
    output.push(
      ...createParagraphNodeFromInlineNodes(trimedInlineNodes, schema),
    );
  }
  if (output.length === 0) {
    return [createEmptyParagraphNode(schema)];
  }
  return output;
}

/**
 * Normalize the list of the given nodes for media groups.
 * The rule is: if there are consecutive media group nodes separated by
 * space(s) or a single newline, then merge them into one media group with multiple media content.
 * @param nodes list of nodes to normalize. Must not be null
 * @param schema
 */
export function normalizeMediaGroups(
  nodes: PMNode[],
  schema: Schema,
): PMNode[] {
  const output: PMNode[] = [];
  let mediaGroupBuffer: PMNode[] = [];
  let separatorBuffer: PMNode[] = [];
  for (const n of nodes) {
    if (n.type.name === 'mediaGroup') {
      mediaGroupBuffer.push(n);
      continue;
    }
    if (mediaGroupBuffer.length > 0) {
      if (isSignificantSeparatorNode(n, separatorBuffer)) {
        output.push(createMergedMediaGroup(mediaGroupBuffer, schema));
        mediaGroupBuffer = [];
        separatorBuffer = [];
        output.push(n);
      } else {
        separatorBuffer.push(n);
      }
      continue;
    }
    output.push(n);
  }
  if (mediaGroupBuffer.length > 0) {
    output.push(createMergedMediaGroup(mediaGroupBuffer, schema));
  }
  return output;
}

function createMergedMediaGroup(
  mediaGroupNodes: PMNode[],
  schema: Schema,
): PMNode {
  const { mediaGroup } = schema.nodes;
  const mediaNodes: PMNode[] = mediaGroupNodes.map(v => v.child(0));
  return mediaGroup.createChecked({}, mediaNodes);
}

function isSignificantSeparatorNode(n: PMNode, separatorBuffer: PMNode[]) {
  return isHardBreak(n, separatorBuffer) || !isEmptyParagraph(n);
}

/**
 * If the current node is a hard break, AND there's already at least
 * one hard break in the separator buffer, then we want to return true.
 * @param n the current node to examine
 * @param separatorBuffer the existing separator buffer.
 */
function isHardBreak(n: PMNode, separatorBuffer: PMNode[]) {
  return (
    n.type.name === 'hardBreak' &&
    separatorBuffer.map(v => v.type.name).includes('hardBreak')
  );
}

function isEmptyParagraph(n: PMNode) {
  let isBlank: boolean = true;
  if (n.type.name === 'paragraph') {
    n.forEach(child => {
      isBlank =
        isBlank &&
        child.type.name === 'text' &&
        !!child.text &&
        child.text.trim().length === 0;
    });
  } else if (n.type.name === 'text') {
    isBlank = !!n.text && n.text.trim().length === 0;
  }
  return isBlank;
}

/**
 * Remove leading and trailing hardBreak
 */
function trimInlineNodes(nodes: PMNode[]) {
  let leadingNode = nodes.shift();
  while (leadingNode) {
    if (leadingNode.type.name !== 'hardBreak') {
      nodes.unshift(leadingNode);
      break;
    }
    leadingNode = nodes.shift();
  }

  let trailingNode = nodes.pop();
  while (trailingNode) {
    if (trailingNode.type.name !== 'hardBreak') {
      nodes.push(trailingNode);
      break;
    }
    trailingNode = nodes.pop();
  }

  return nodes;
}

export function isNextLineEmpty(input: string) {
  // Line with only spaces is considered an empty line
  return input.trim().length === 0;
}

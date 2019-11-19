import { createSchema, SchemaConfig } from './create-schema';
import { Schema } from 'prosemirror-model';
import { mediaWithAltText } from './nodes';

export const getSchemaBasedOnStage = (stage = 'final') => {
  const config: SchemaConfig = {
    nodes: [
      'doc',
      'paragraph',
      'text',
      'bulletList',
      'orderedList',
      'listItem',
      'heading',
      'blockquote',
      'codeBlock',
      'panel',
      'rule',
      'image',
      'mention',
      'media',
      'mediaGroup',
      'mediaSingle',
      'confluenceUnsupportedBlock',
      'confluenceUnsupportedInline',
      'confluenceJiraIssue',
      'expand',
      'nestedExpand',
      'extension',
      'inlineExtension',
      'bodiedExtension',
      'hardBreak',
      'emoji',
      'table',
      'tableCell',
      'tableHeader',
      'tableRow',
      'decisionList',
      'decisionItem',
      'taskList',
      'taskItem',
      'unknownBlock',
      'date',
      'status',
      'placeholder',
      'layoutSection',
      'layoutColumn',
      'inlineCard',
      'blockCard',
      'unsupportedBlock',
      'unsupportedInline',
    ],
    marks: [
      'link',
      'em',
      'strong',
      'strike',
      'subsup',
      'underline',
      'code',
      'textColor',
      'confluenceInlineComment',
      'breakout',
      'alignment',
      'indentation',
      'annotation',
    ],
  };

  if (stage === 'stage0') {
    config.customNodeSpecs = {
      media: mediaWithAltText,
    };
  }

  return createSchema(config);
};

export const defaultSchema: Schema = getSchemaBasedOnStage();

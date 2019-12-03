import { expandClassNames } from '../../../plugins/expand/ui/class-names';

const expand = `.${expandClassNames.type('expand')}`;
const nestedExpand = `.${expandClassNames.type('nestedExpand')}`;

export const selectors = {
  expand,
  nestedExpand,
  expandToggle: `${expand} .${expandClassNames.icon} button`,
  nestedExpandToggle: `${nestedExpand} .${expandClassNames.icon} button`,
  expandTitleInput: `${expand} .${expandClassNames.titleInput}`,
  nestedExpandTitleInput: `${nestedExpand} .${expandClassNames.titleInput}`,
};

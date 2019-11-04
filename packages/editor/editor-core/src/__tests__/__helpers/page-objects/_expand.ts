import { expandClassNames } from '../../../plugins/expand/ui/class-names';

const expand = `.${expandClassNames.type('expand')}`;
const nestedExpand = `.${expandClassNames.type('nestedExpand')}`;

export const selectors = {
  expand,
  nestedExpand,
  expandToggle: `${expand} .${expandClassNames.icon} [role="button"]`,
  nestedExpandToggle: `${nestedExpand} .${
    expandClassNames.icon
  } [role="button"]`,
  expandTitleInput: `${expand} .${expandClassNames.titleInput}`,
  nestedExpandTitleInput: `${nestedExpand} .${expandClassNames.titleInput}`,
};

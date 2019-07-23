// @noflow

import React from 'react';
import { code, Example, md } from '@atlaskit/docs';

export default md`
This documentation attempts to provide further detail on the various properties
and components that combine to make the refinement bar.

<!-- NOTE: the field description should probably be in "Concepts" and linked to from "Reference" below -->

## Props

### \`fieldConfig\`

The configuration object for each field that may be rendered in the refinement
bar. A simple config may look something like:

${code`
import { SearchFilter, TextFilter } from '@atlaskit/refinement-bar';

export const fieldConfig = {
  search: {
    label: 'Search',
    type: SearchFilter
  },
  browser: {
    label: 'Browser',
    type: TextFilter,
    note: 'The browser(s), if any, in which this issue is reproducible.',
  },
}
`}

### \`irremovableKeys\`

The array of keys representing which fields may not be removed from the
refinement bar by the user. Fields in this list will be rendered before (to the
left of) any other fields. They will not appear in the "+ more" dropdown menu
and they will not be hidden if the user collapses the filters via the "Show
Less" button.

### \`onChange\`

The function that's called when a change happens in the refinement bar. A call
to \`onChange\` will happen when one of the following takes place:

- A field is **added** to the refinement bar
- A field is **removed** from the refinement bar
- A field is **updated** in the refinement bar
- A field is **cleared** in the refinement bar

This function takes two arguments \`value\` and \`meta\`, where value is an
updated value object for the refinement bar and meta is some information about
the type of change.

${code`
type Value = {
  [FieldKey]: any,
}

type Meta = {
  type: 'add' | 'remove' | 'update' | 'clear',
  key: FieldKey,
  data?: any,
}

type OnChange = (Value, Meta) => void
`}

Go to the ["change meta"](/packages/jira/refinement-bar/example/change-meta)
example to see this in action.

### \`value\`

The object representing the value of fields.

For a field to be rendered in the refinement bar its key must be present in
either \`irremovableKeys\` or in the \`value\` object.

## Fields

Field definitions expect a minimum of \`label\` and \`type\`. You can optionally
pass in \`validate\` for custom validation, and a \`note\` to be rendered
beneath the filter UI.

${code`
type Validate = ({ type?: string, value: any }) => string | null

type DefaultConfig = {
  label: string,
  note?: string,
  type: React.ComponentType<*>,
  validate?: Validate,
}
`}

### Select

The select filter renders a searchable list of options. Each option expects a
\`label\` and \`value\`, but can contain any other data required.

By providing a function to \`options\` you can access the current value of each
field in the refinement bar. The function must return an array of options.

Once the user has selected one or more options, the selected options will be
pinned to the top of the options list. The pinned section has a special "Clear
selected items" option appended.

${code`
type Option = { value: any, label: string }
type Options = Array<Option>

type SelectConfig = DefaultConfig & {
  onMenuScrollToBottom?: (event: WheelEvent) => void,
  onMenuScrollToTop?: (event: WheelEvent) => void,
  options: Options | (refinementBarValue: Object) => Options,
  placeholder?: string, // Default "Search..."
}
`}

${(
  <Example
    Component={require('../examples/90-select-filter-config-reference').default}
    packageName="@atlaskit/refinement-bar"
    source={require('!!raw-loader!../examples/90-select-filter-config-reference')}
    title="Select filter config reference"
  />
)}

### AvatarSelect

The \`AvatarSelect\` filter extends the \`Select\` filter. The only difference
being how options are rendered, which requires the shape of \`Option\` to
include \`avatar\`, a URL string:

${code`
type Option = { value: any, label: string, avatar: string }
`}

${(
  <Example
    Component={
      require('../examples/91-avatar-select-filter-config-reference').default
    }
    packageName="@atlaskit/refinement-bar"
    source={require('!!raw-loader!../examples/91-avatar-select-filter-config-reference')}
    title="AvatarSelect filter config reference"
  />
)}

### IssueSelect

The \`IssueSelect\` filter extends the \`Select\` filter. The only difference
being how options are rendered, which requires the shape of \`Option\` to
include \`type\`, an enumerable:

${code`
type IssueType = 'blog' | 'branch' | 'bug' | 'calendar' | 'changes' | 'code' | 'commit' | 'epic' | 'improvement' | 'incident' | 'issue' | 'page' | 'problem' | 'question' | 'story' | 'subtask' | 'task' | 'new-feature' | 'pull-request'
type Option = { value: any, label: string, type: IssueType }
`}

${(
  <Example
    Component={
      require('../examples/92-issue-select-filter-config-reference').default
    }
    packageName="@atlaskit/refinement-bar"
    source={require('!!raw-loader!../examples/92-issue-select-filter-config-reference')}
    title="IssueSelect filter config reference"
  />
)}

### AsyncSelect

The \`AsyncSelect\` filter extends the \`Select\` filter, so any config available
for the select filter is also available on the async variant.

Whilst not required, it's recommended to provide static \`defaultOptions\` so
that your users don't see a "No matches found" message before they start typing.

If \`cacheOptions\` is truthy, then the loaded data will be cached. The cache
will remain until \`cacheOptions\` changes value.

The \`loadOptions\` function returns a promise, which is the set of options to
be used once the promise resolves.

${code`
type AsyncSelectConfig = SelectConfig & {
  cacheOptions?: any,
  defaultOptions?: Options,
  defaultOptionsLabel?: string,
  inputValue?: string,
  loadOptions: (inputValue: string) => Options,
  onInputChange?: Function,
}
`}

${(
  <Example
    Component={
      require('../examples/93-async-select-filter-config-reference').default
    }
    packageName="@atlaskit/refinement-bar"
    source={require('!!raw-loader!../examples/93-async-select-filter-config-reference')}
    title="AsyncSelect filter config reference"
  />
)}

### AvatarAsyncSelect

The \`AvatarAsyncSelect\` filter extends the \`AsyncSelect\` filter. The only
difference being how options are rendered, which requires the shape of
\`Option\` to include \`avatar\`, a URL string:

${code`
type Option = { value: any, label: string, avatar: string }
`}

${(
  <Example
    Component={
      require('../examples/94-avatar-async-select-filter-config-reference')
        .default
    }
    packageName="@atlaskit/refinement-bar"
    source={require('!!raw-loader!../examples/94-avatar-async-select-filter-config-reference')}
    title="AvatarAsyncSelect filter config reference"
  />
)}

### IssueAsyncSelect

The \`IssueAsyncSelect\` filter extends the \`AsyncSelect\` filter. The only difference
being how options are rendered, which requires the shape of \`Option\` to
include \`type\`, an enumerable:

${code`
type IssueType = 'blog' | 'branch' | 'bug' | 'calendar' | 'changes' | 'code' | 'commit' | 'epic' | 'improvement' | 'incident' | 'issue' | 'page' | 'problem' | 'question' | 'story' | 'subtask' | 'task' | 'new-feature' | 'pull-request'
type Option = { value: any, label: string, type: IssueType }
`}

${(
  <Example
    Component={
      require('../examples/95-issue-async-select-filter-config-reference')
        .default
    }
    packageName="@atlaskit/refinement-bar"
    source={require('!!raw-loader!../examples/95-issue-async-select-filter-config-reference')}
    title="IssueAsyncSelect filter config reference"
  />
)}

### Number

### Search

### Text
`;

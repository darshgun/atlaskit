import * as React from 'react';
import { ObjectResult } from '@atlaskit/quick-search';
import * as colors from '@atlaskit/theme/colors';
import DocumentFilledIcon from '@atlaskit/icon/glyph/document-filled';

import { ArticleItem } from '../../model/Article';
import { SearchResultsList } from './styled';

export interface Props {
  searchResult?: ArticleItem[];
}

export const SearchResults = (props: Props) => {
  const { searchResult = [] } = props;

  return (
    <SearchResultsList>
      {searchResult.map(searchResultItem => {
        const { id, title = '', description = '' } = searchResultItem;
        return (
          <ObjectResult
            resultId={id}
            name={title}
            key={id}
            containerName={description}
            avatar={
              <DocumentFilledIcon
                primaryColor={colors.P500}
                size="medium"
                label={title}
              />
            }
          />
        );
      })}
    </SearchResultsList>
  );
};

export default SearchResults;

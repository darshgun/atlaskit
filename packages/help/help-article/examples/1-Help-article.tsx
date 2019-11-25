import * as React from 'react';
import Button from '@atlaskit/button';

import HelpArticle from '../src';

interface Props {}

interface State {
  // Article Content
  body?: string;
}
export default class extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      body:
        '<p>Quisque eros orci, sagittis <a href="http://www.google.com" target="_blank">google</a>, ultrices varius dolor. Nunc mi leo, accumsan id massa nec, commodo placerat libero. Phasellus ullamcorper ligula facilisis massa tempor auctor. Praesent malesuada, eros sit amet posuere rutrum, justo ex tempor dui, at suscipit metus lacus non dui. Phasellus vehicula urna eu rhoncus sagittis. Integer at risus molestie, rutrum nibh nec, vehicula lacus. Nulla mollis dictum felis vitae facilisis. Nam faucibus non orci eget gravida.</p>',
    };
  }

  changeContent() {
    this.setState({
      body:
        '<p>before image</p> <img src="https://loremflickr.com/640/360" class="page-list__image" alt="LoremFlickr placeholder image"/> <p>after image</p>',
    });
  }

  render() {
    return (
      <div>
        <HelpArticle title="Article Title" body={this.state.body} />
        <Button type="button" onClick={() => this.changeContent()}>
          Change content
        </Button>
      </div>
    );
  }
}

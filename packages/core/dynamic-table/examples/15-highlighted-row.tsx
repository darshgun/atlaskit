import React from 'react';
import Button, { ButtonGroup } from '@atlaskit/button';
import { DynamicTableStateless } from '../src';
import { head, rows } from './content/sample-data';

interface State {
  highlightedRow: number;
}

export default class extends React.Component<{}, State> {
  state = {
    highlightedRow: 3,
  };

  setHighlightedRow = (rowNumber: number) =>
    this.setState({
      highlightedRow: rowNumber,
    });

  render() {
    return (
      <>
        <div> Click on the buttons to highlight the corresponding row</div>
        <ButtonGroup>
          {[0, 2, 5, 6, 8, 9].map(nos => (
            <Button onClick={() => this.setHighlightedRow(nos)} key={nos}>
              {nos}
            </Button>
          ))}
        </ButtonGroup>

        <DynamicTableStateless
          head={head}
          highlightedRowIndex={this.state.highlightedRow}
          rows={rows}
          rowsPerPage={40}
          page={1}
        />
      </>
    );
  }
}

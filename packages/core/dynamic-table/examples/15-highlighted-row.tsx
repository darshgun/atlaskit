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

  render() {
    const setHighlightedRow = (rowNumber: number) =>
      this.setState({
        highlightedRow: rowNumber,
      });
    return (
      <>
        <div> Click on the buttons to highlight the corresponding row</div>
        <ButtonGroup>
          <Button onClick={() => setHighlightedRow(0)}>0</Button>
          <Button onClick={() => setHighlightedRow(2)}>2</Button>
          <Button onClick={() => setHighlightedRow(5)}>5</Button>
          <Button onClick={() => setHighlightedRow(6)}>6</Button>
          <Button onClick={() => setHighlightedRow(8)}>8</Button>
          <Button onClick={() => setHighlightedRow(9)}>9</Button>
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

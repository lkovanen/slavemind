import * as React from 'react';
import Rows from '../Rows';
import InputRow from '../InputRow';
import './styles.css';
import { Button, Glyphicon } from 'react-bootstrap';
import * as _ from 'lodash';

interface GameState {
  correctRow: Array<number>;
  rows: Array<Array<number>>;
  newRow: Array<number>;
}

const isValidRow = (row: Array<number>) => {
  return row.every((pinId: number) => pinId !== 0);
};

const getRandomRow = () => {
  return _.times(4, () => _.random(1, 8));
};

const arrayEqual = (a: Array<number>, b: Array<number>) => {
  return _.zip(a, b).every((values: [number, number]) => values[0] === values[1]);
};

class Game extends React.Component {
  state: GameState = {
    correctRow: getRandomRow(),
    rows: [],
    newRow: [0, 0, 0, 0]
  };

  addRow(newRow: Array<number>) {
    this.setState((state: GameState) => {
      return {
        rows: [newRow].concat(state.rows),
        newRow: [0, 0, 0, 0]
      };
    });
  }

  isSolved() {
    return (
      this.state.rows.length > 0 &&
      arrayEqual(this.state.correctRow, this.state.rows[0])
    );
  }

  render() {
    return (
      <div className="game">
        {!this.isSolved() &&
          <div className="input">
            <InputRow
              value={this.state.newRow}
              onChange={(newRow: Array<number>) => this.setState({newRow})}
            />
            <div>
              <Button
                className="ok-button"
                disabled={!isValidRow(this.state.newRow)}
                onClick={() => this.addRow(this.state.newRow)}
              >
                <Glyphicon glyph="ok" />
              </Button>
            </div>
          </div>
        }
        <Rows
          rows={this.state.rows}
          correctRow={this.state.correctRow}
        />
      </div>
    );
  }
}

export default Game;

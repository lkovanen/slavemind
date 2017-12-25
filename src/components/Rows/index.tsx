import * as React from 'react';
import './styles.css';
import Row from '../Row';
import Hint from '../Hint';

type rowType = Array<number>;

interface Props {
    correctRow: rowType;
    rows: Array<rowType>;
}

function Rows({correctRow, rows}: Props) {
    return (
        <div className="rows">
            {rows.map(
                (pins: rowType, index: number) => {
                    return (
                        <div key={index} className="hint-row">
                            <Row pins={pins} />
                            <Hint pins={pins} correctPins={correctRow} />
                        </div>
                    );
                }
            )}
        </div>
    );
}

export default Rows;
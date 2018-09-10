import * as React from 'react';
import './styles.css';
import * as _ from 'lodash';

interface Props {
    pins: Array<number>;
    correctPins: Array<number>;
}

const getCorrectLocations = (pins: Array<number>, correctPins: Array<number>): Array<boolean> => {
    return _.map(
        _.zip(pins, correctPins),
        (values: [number, number]) => values[0] === values[1]
    );
};

const whereFalse = (arr: Array<number>, where: Array<boolean>) => {
    return _.filter(
        arr,
        (val: number, index: number) => !where[index]
    );
};

const getHint = (pins: Array<number>, correctPins: Array<number>) => {
    let correctLocations = getCorrectLocations(pins, correctPins);

    let remainingPins = whereFalse(pins, correctLocations);
    let remainingCorrectPins = whereFalse(correctPins, correctLocations);

    let correctPinCount = 0;
    remainingPins.forEach((pinId: number) => {
        let correctIndex = _.indexOf(remainingCorrectPins, pinId);
        if (correctIndex >= 0) {
            remainingCorrectPins.splice(correctIndex, 1);
            correctPinCount += 1;
        }
    });

    return [_.sum(correctLocations), correctPinCount];
};

function Hint({pins, correctPins}: Props) {
    let hint = getHint(pins, correctPins);
    return (
        <div className="hints">
            {_.range(0, hint[0]).map((val: number, index: number) => {
                return <div key={index} className="hint correct" />;
            })}
            {_.range(0, hint[1]).map((val: number, index: number) => {
                return <div key={index} className="hint exists" />;
            })}
        </div>
    );
}

export default Hint;
import * as React from 'react';
import './styles.css';
import Pin from '../Pin';

interface Props {
    pins: Array<number>;
}

function Row({pins}: Props) {
    return (
        <div className="row">
            {pins.map(
                (pinId: number, index: number) => <Pin key={index} pin_id={pinId} />
            )}
        </div>
    );
}

export default Row;
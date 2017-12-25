import * as React from 'react';
import './styles.css';
import Pin from '../Pin';
import { Popover, OverlayTrigger } from 'react-bootstrap';
import * as _ from 'lodash';

const popoverInput = (onChange: (value: number) => void) => {
    return (
        <Popover
            id="popover-basic"
            placement="top"
            positionLeft={0}
            positionTop={10}
        >
            <div className="inputs">
                {_.range(1, 9).map((pinId: number, index: number) => {
                    return (
                        <div key={index} onClick={() => onChange(pinId)}>
                            <Pin pin_id={pinId} />
                        </div>
                    );
                })}
                <div onClick={() => onChange(_.random(1, 8))}>
                    <Pin pin_id={99} />
                </div>
            </div>
        </Popover>
    );
};

interface InputPinProps {
    value: number;
    onChange: (value: number) => void;
}

function InputPin({value, onChange}: InputPinProps) {
    return (
        <OverlayTrigger
            trigger="click"
            placement="top"
            overlay={popoverInput(onChange)}
            rootClose={true}
        >
            <div>
                <Pin pin_id={value} />
            </div>
        </OverlayTrigger>
    );
}

interface Props {
    value: Array<number>;
    onChange: (value: Array<number>) => void;
}

function InputRow({value, onChange}: Props) {
    return (
        <div className="row">
            {value.map(
                (pinId: number, index: number) => {
                    return (
                        <InputPin
                            key={index}
                            value={pinId}
                            onChange={(newValue: number) => {
                                let newRow = value.slice();
                                newRow[index] = newValue;
                                onChange(newRow);
                            }}
                        />
                    );
                }
            )}
        </div>
    );
}

export default InputRow;
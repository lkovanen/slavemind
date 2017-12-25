import * as React from 'react';
import './styles.css';

interface Props {
    pin_id: number;
}

function Pin({pin_id}: Props) {
    let classNames = `pin pin-${pin_id}`;
    return (
        <div className={classNames} />
    );
}

export default Pin;
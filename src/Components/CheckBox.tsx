import React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles } from '@material-ui/core/styles';

const useStyle = makeStyles({
    style: {
        marginBottom: '1rem',
    }
})

type props = {
    label: string;
    checked: boolean;
    onChangeCheck: (e: boolean) => void;
}

function CheckBoxHm({ label, checked, onChangeCheck }: props) {
    const classes = useStyle();

    return (
            <FormControlLabel className={classes.style}
                control={
                    <Checkbox
                        color="primary"
                        value={checked}
                        onChange={e => onChangeCheck(e.target.checked)}
                    />
                }
                label={label}
            />
    );
}

export default CheckBoxHm
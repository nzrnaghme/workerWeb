import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';

interface ISelectItem {
    id: any;
    name: string;
}

type props = {
    label: string;
    value: number[];
    setValue: (selected: any) => void;
    options: ISelectItem[];
    required?: boolean;
    className?:string
}

function MultiSelectFieldHm({ className, label, value, setValue, options, required}: props) {
    return (
        <TextField
            select
            SelectProps={{
                multiple: true,
                value: value,
                onChange: setValue,
            }}
            label={label}
            required={required}
            className={className}
            size="small"
            variant="outlined"
        >
             {
                options.map(option => (
                    <MenuItem value={option.name} key={option.id}>
                        {option.name}
                    </MenuItem>
                ))
            }
        </TextField>
    );
}

export default MultiSelectFieldHm




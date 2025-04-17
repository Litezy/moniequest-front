import React from 'react'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const SelectComp = ({ title, options, style, name, value, handleChange, width = 120, size = true, fullWidth = false }) => {

  return (
    <div>
      <FormControl variant='filled'
        sx={{ m: 1,  minWidth: fullWidth ? '100%' : width, bgcolor: style?.bg, borderRadius: style?.rounded }}
        size={size ? 'small' : 'medium'}
      >
        <InputLabel>{title}</InputLabel>
        <Select
          name={name}
          value={options.includes(value) ? value : ""}
          onChange={handleChange}
          sx={{ color: style?.color, fontSize: style?.font }}
          hiddenLabel={title ? false : true}
          MenuProps={{
            disablePortal: true,
            disableScrollLock: true,
          }}
        >
          {options.map((ele, i) => (
            <MenuItem value={ele} key={i}>{ele}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </div >
  )
}

export default SelectComp
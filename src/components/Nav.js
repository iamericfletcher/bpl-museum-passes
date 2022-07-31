import React, {Component} from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import {styled} from "@mui/material/styles";
import {Paper} from "@mui/material";

const foo = styled(Paper)(({theme}) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : 'pink',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

class Nav extends Component {
    render() {
        return (
                <foo>Navigation Top</foo>
        );
    }
}

export default Nav;
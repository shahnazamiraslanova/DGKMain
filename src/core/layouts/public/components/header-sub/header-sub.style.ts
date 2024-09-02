import colors from 'assets/styles/abstracts/color';
import {createUseStyles} from 'react-jss';

const styles = {
    sub: {
        background: colors.light,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0px 20px 20px rgb(126 142 177 / 12%)',
    },
    subItem: {
        display: 'flex',
        cursor: 'pointer'
    },
    bars: {fontSize: '18px'}
};

export const useHeaderSubStyles = createUseStyles(styles);

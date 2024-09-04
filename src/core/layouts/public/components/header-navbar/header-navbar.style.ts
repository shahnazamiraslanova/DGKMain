import colors from 'assets/styles/abstracts/color';
import {rem} from 'assets/styles/abstracts/functions';
import {createUseStyles} from 'react-jss';

const styles = {
    navbar: {
        backgroundColor: "#394e75",
    },
    left: {
        display: 'flex',
        alignItems: 'center',
        '& img': {
            display: 'block',
            width: "60px",
        }
    },
};

export const useHeaderNavbarStyles = createUseStyles(styles);

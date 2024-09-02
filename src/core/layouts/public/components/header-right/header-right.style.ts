import {createUseStyles} from 'react-jss';
import {rem} from 'assets/styles/abstracts/functions';

const styles = {
    items: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    avatar: {
        marginRight: '15px',
        '& img': {
            width: rem(28),
            height: rem(28),
            objectFit: 'cover',
            borderRadius: '5px',
        },
    },
    logout: {
        cursor: 'pointer',
    },
};

export const useHeaderRightStyles = createUseStyles(styles);

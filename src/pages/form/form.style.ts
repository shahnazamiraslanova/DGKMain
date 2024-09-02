import {createUseStyles} from 'react-jss';
import {rem} from 'assets/styles/abstracts/functions';
import colors from 'assets/styles/abstracts/color';
import {breakpoint} from 'assets/styles/abstracts/mixins';

const styles = {
    testDiv: {
        color: 'cyan',
        backgroundColor: 'blue',
        fontSize: rem(12),
        [breakpoint(1200)] : {
            backgroundColor: colors.headerNavBg,
        },
    },
    testText: {
        color: colors.mainGreen,
    },
};

export const useFormStyles = createUseStyles(styles);

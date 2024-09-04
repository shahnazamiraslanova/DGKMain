import {createUseStyles} from 'react-jss';
import {rem} from 'assets/styles/abstracts/functions';
import {transition} from 'assets/styles/abstracts/mixins';
import sizes from 'assets/styles/abstracts/sizes';

const styles = {
    public: {},
    content: {
        marginLeft: rem(sizes.leftMenu),
        minHeight: 'calc(100vh - 50px) !important',
        
        transition: transition(),
    },
    active: {marginLeft: 0,},

};


export const usePublicLayoutStyles = createUseStyles(styles);

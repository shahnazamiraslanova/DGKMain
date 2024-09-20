import colors from 'assets/styles/abstracts/color';
// import { rem } from 'assets/styles/abstracts/functions';
// import { breakpoint } from 'assets/styles/abstracts/mixins';

import { createUseStyles } from 'react-jss';

const styles = {
    homeMain:{
        margin:'150px 40px 0 40px ',
        display:'flex',
        // width:'100%'
        
    },
    adminInfo:{

    }
    
};

export const useHomeStyle = createUseStyles(styles);

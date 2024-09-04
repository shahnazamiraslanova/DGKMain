import colors from 'assets/styles/abstracts/color';
import { createUseStyles } from 'react-jss';

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
        cursor: 'pointer',
        color:'#394e75'
    },
    headerSubSelect: {
        border:"none",
        backgroundColor:'#5a73a0',
        color:'white',
        borderRadius:'10px',
        padding:'5px 10px',
        outline:'none'

    },
    bars: { fontSize: '18px' }
};

export const useHeaderSubStyles = createUseStyles(styles);

import colors from 'assets/styles/abstracts/color';
import { rem } from 'assets/styles/abstracts/functions';
import { breakpoint } from 'assets/styles/abstracts/mixins';

import { createUseStyles } from 'react-jss';

const styles = {
    inputContainer: {
        marginBottom: 20,
        position: "relative"
    },
    loginMain: {
        backgroundColor: '#394e75',
        height: '100svh',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '200px',
        [breakpoint(1500)]: {
            gap: '100px',

        },
        [breakpoint(768)]: {
            flexDirection: 'column',
            gap: '50px',

        },

    },
    loginTitle: {
        textAlign: 'center',
        marginBottom: '10px',
        fontSize: '30px',
        color: 'white',
        fontWeight: 'bold'
    },
    page: {
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    wrapper: {
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    title: {
        fontSize: rem(32),
        fontWeight: 500,
    },
    subtitle: {
        fontSize: rem(16),
    },
    logoImg: {
        width: '25%',
        [breakpoint(1500)]: {
            width: '30%',

        },
    },
    panel: {
        width: '20%',
        [breakpoint(1500)]: {
            width: '30%',

        },
        [breakpoint(768)]: {
            width: '70%',


        },
        backgroundColor: 'transparent'
    },
    input: {
        backgroundColor: "#5A73A0",
        color: 'white',
        width: '100%',
        padding: '12px',
        borderRadius: 8,
        border: 'none',
        fontSize: 14,
        '&::placeholder': {
            color: '#BBCEE8'

        },
        '&:focus': {
            borderColor: '#40a9ff',
            outline: 'none',
        },
    },
    button: {
        width: '100%',
        backgroundColor: '#fdfe65',
        color: '#516385',
        fontWeight: 'bold',
        margin:'0'
    },
    sendAgain: {
        backgroundColor: 'transparent',
        border: 'none',
        fontSize:'16px',
        fontWeight:'bold',
        color:'#fdfe65',
        cursor:'pointer'
    },
    showPasswordButton: {
        position: 'absolute',
        right: '12px',
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'transparent',
        border: 'none',
        color: '#BBCEE8',
        cursor: 'pointer',
    },
    sendAgainText:{
        marginTop:'15px',
        fontSize:'16px',
        color:'white'

    },
    or: { color: colors.authSubtitleText, },
    invalidField: { border: '1px solid ' + colors.validationErrorColor, },
};

export const useLoginStyles = createUseStyles(styles);

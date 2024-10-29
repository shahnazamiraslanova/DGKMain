import { createUseStyles } from "react-jss";

const styles = {
    homeMain: {
      margin: '150px 40px 0 40px',
      display: 'flex',
      justifyContent: 'space-between',
      gap: '30px',
    },
    guidesMain: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '30%'
    },
    adminText:{
      fontSize: '30px',
        fontWeight: 'bold',
        color: '#394E75',
        marginBottom: '20px',
    },
    adminInfo: {
      width: '60%',
    },
    guides: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      width: '80%',
      alignItems: 'center',
    },
    eachGuide: {
      width: '100%',
      borderRadius: '8px',
      padding: '20px 0',
      border: 'none',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px',
      backgroundColor: '#394E75',
      color: 'white',
      fontSize: '20px',
    },
  
    adminDetailBox: {
      display: 'flex',
      flexDirection:'column',
      gap: '15px',
      backgroundColor: '#f9f9f9',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      marginTop: '20px',
    },
    adminDetailItem: {
      backgroundColor: '#e9ecef',
      padding: '15px',
      borderRadius: '5px',
      color: '#394E75',
      fontSize: '16px',
      fontWeight: '500',
    },
    adminLabel: {
      fontWeight: 'bold',
      color: '#394E75',
      fontSize: '16px',
      marginBottom: '5px',
    },
    profilPhoto:{
      borderRadius:'50%',
      width:'220px',
      height:'220px'
    },
    infoHeader:{
      // maxHeight:'250px',
      display:'flex',
      justifyContent:'space-between',
      alignItems:'center',


      '@media (min-width: 1200px)': {
        maxHeight:'250px',
      },
    },


    adminHeaderLeft:{
      width:'65%',
      display:'flex',
      flexDirection:'column',
      gap:'20px',
      '@media (max-width: 1200px)': {
        marginTop:'20px',
        width:'100%',
      },
    }
  };
  
  export const useHomeStyle = createUseStyles(styles);
  
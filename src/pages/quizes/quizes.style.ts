import { Styles } from 'react-jss';

const mainColor = '#394e75';

const styles: Styles = {
  mainBtns:{

    padding:'150px 40px 0 40px',
    display:'flex',
    justifyContent:'space-between',
    '& button':{
      backgroundColor:mainColor,
      border:'none',
      color:'white',
      padding:'15px 25px',
      borderRadius:'10px'
    }

  },
  quizContainer:{},
  quizsList:{
    display:'flex',
    flexDirection:'column',
    
  }

};

export default styles;

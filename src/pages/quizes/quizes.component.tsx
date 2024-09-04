import { createUseStyles } from 'react-jss';
import styles from './quizes.style';

const QuizsComponent = () => {
  const useStyles = createUseStyles(styles);

  const classes = useStyles();

  return (
    <div className={classes.quizContainer}>
      <div className={classes.mainBtns}>
        <button>Quiz Yarat</button>
        <button> Quiz qrupu yarat</button>
        <button>Mövcud qruplaarı idarə et</button>
      </div>

      <div ></div>
    </div>
  );
};

export default QuizsComponent;

import { createUseStyles } from 'react-jss';

const mainColor = '#394e75';
const lightColor = '#eef1f6';
const accentColor = '#5a7cb6';
const successColor = '#4caf50';
const dangerColor = '#f44336';

const styles = {

  mainBtns: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '2rem',
    '& button': {
      backgroundColor: mainColor,
      color: lightColor,
      border: 'none',
      padding: '0.75rem 1.5rem',
      borderRadius: '4px',
      transition: 'all 0.3s ease',
      '&:hover': {
        backgroundColor: accentColor,
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  
    quizContainer: {
      backgroundColor: '#f0f2f5',
      padding: '150px 40px 0 40px',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    },

    
    btn: {
      backgroundColor: '#394e75',
      color: 'white',
      border: 'none',
      padding: '0.75rem 1.5rem',
      borderRadius: '8px',
      transition: 'all 0.3s ease',
      '&:hover': {
        backgroundColor: '#5a7cb6',
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      },
    },
    collapse: {
      '& .ant-collapse-item': {
        marginBottom: '1rem',
        border: '1px solid #d9d9d9',
        borderRadius: '8px',
        overflow: 'hidden',
      },
      '& .ant-collapse-header': {
        backgroundColor: '#ffffff',
        padding: '1rem',
      },
      '& .ant-collapse-content': {
        backgroundColor: '#ffffff',
      },
    },
    quizHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
    },
    quizTitle: {
      flex: 1,
      marginRight: '1rem',
      fontSize: '1.1rem',
      color: '#394e75',
    },
    actionBtn: {
      marginLeft: '0.5rem',
    },
    addQuestionBtn: {
      marginBottom: '1rem',
    },
    questionForm: {
      backgroundColor: '#f9f9f9',
      padding: '1rem',
      borderRadius: '8px',
      marginBottom: '1rem',
    },
    questionList: {
      marginTop: '1rem',
    },
    question: {
      backgroundColor: '#f0f2f5',
      padding: '1rem',
      borderRadius: '8px',
      marginBottom: '1rem',
    },
    modal: {
      '& .ant-modal-content': {
        borderRadius: '12px',
      },
      '& .ant-modal-header': {
        borderRadius: '12px 12px 0 0',
      },
    },
    optionItem: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '0.5rem',
    },
    optionContent: {
      flex: 1,
      marginRight: '1rem',
    },
};

export const useQuizStyles = createUseStyles(styles);

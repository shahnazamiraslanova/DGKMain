import { accentColor, lightColor, mainColor } from 'pages/quizes/quizes.style';
import { createUseStyles } from 'react-jss';

const styles = {
  legislationContainer: {
    // width:"100%",
    padding: '150px 40px 0 40px',
  },
  legislationButtons: {
    display: 'flex',
    gap:'20px',
    marginBottom: '2rem',
  },
  actionButton: {
    backgroundColor: mainColor,
    color: 'white',
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
  createSectionModal: {
    '& .ant-modal-body': {
      justifyContent:'end'
    },
  },
  submitButton: {
    marginRight: 10,
  },
  loadingSpinner: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
  },
  sectionsContainer: {
    borderRadius: 8,
  },
  collapse: {
marginTop:'20px',
    background: 'white',
    borderRadius: 10,

  },
  panel: {
    marginBottom: 8,
    border: '1px solid #d9d9d9',
    borderRadius: 10,
  },
  panelHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  editButton: {
    marginLeft: 8,
  },
  deleteButton: {
    marginLeft: 8,
  },
  collapseContent: {
    backgroundColor: '#fafafa',
  },
  collapseContentBox: {
    padding: 16,
  }
 
};

export const useLegisStyle = createUseStyles(styles);
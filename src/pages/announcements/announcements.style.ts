import { Styles } from 'react-jss';

const mainColor = '#394e75';

const styles: Styles = {
  '@global': {
    '@import': 'url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap")',
  },
  container: {
   
    margin: '110px auto',
    padding: '40px 20px',
    fontFamily: '"Roboto", sans-serif',
    backgroundColor: '#f8f9fa',
    borderRadius: '6px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  searchContainer: {
    marginBottom: '30px',
    position: 'relative',
  },
  searchInput: {
    width: '100%',
    padding: '15px 20px',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: 'white',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    '&:focus': {
      outline: 'none',
      boxShadow: '0 4px 10px rgba(57, 78, 117, 0.3)',
    },
  },
  formContainer: {
    marginBottom: '40px',
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '6px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  input: {
    width: '100%',
    padding: '12px 15px',
    fontSize: '1rem',
    marginBottom: '15px',
    border: '1px solid #e0e0e0',
    borderRadius: '6px',
    transition: 'border-color 0.3s ease',
    '&:focus': {
      outline: 'none',
      borderColor: mainColor,
    },
  },
  textarea: {
    width: '100%',
    padding: '12px 15px',
    fontSize: '1rem',
    marginBottom: '20px',
    border: '1px solid #e0e0e0',
    borderRadius: '6px',
    minHeight: '120px',
    resize: 'vertical',
    transition: 'border-color 0.3s ease',
    '&:focus': {
      outline: 'none',
      borderColor: mainColor,
    },
  },
  button: {
    backgroundColor: mainColor,
    color: 'white',
    border: 'none',
    padding: '12px 25px',
    fontSize: '1rem',
    fontWeight: 500,
    cursor: 'pointer',
    borderRadius: '6px',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    '&:hover': {
      backgroundColor: '#2c3e5c',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
  },
  listContainer: {
    marginTop: '30px',
  },
  announcementItem: {
    backgroundColor: 'white',
    borderRadius: '6px',
    padding: '25px',
    marginBottom: '20px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
    },
  },
  announcementTitle: {
    color: mainColor,
    fontSize: '1.4rem',
    fontWeight: 500,
    marginBottom: '10px',
  },
  announcementBody: {
    color: '#333',
    fontSize: '1rem',
    lineHeight: '1.6',
    marginBottom: '20px',
  },
  actionButtons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  actionButton: {
    padding: '8px 15px',
    fontSize: '0.9rem',
    fontWeight: 500,
    cursor: 'pointer',
    borderRadius: '6px',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    border: 'none',
    marginLeft: '10px',
  },
  editButton: {
    extend: 'actionButton',
    backgroundColor: '#4a6491', // Lighter tone of main color
    color: 'white',
    '&:hover': {
      backgroundColor: '#5a749f',
      transform: 'translateY(-2px)',
    },
  },
  deleteButton: {
    extend: 'actionButton',
    backgroundColor: '#283756', // Darker tone of main color
    color: 'white',
    '&:hover': {
      backgroundColor: '#1e2a42',
      transform: 'translateY(-2px)',
    },
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '30px',
  },
  paginationButton: {
    backgroundColor: '#ffffff',
    border: `1px solid ${mainColor}`,
    color: mainColor,
    padding: '8px 12px',
    margin: '0 5px',
    cursor: 'pointer',
    borderRadius: '6px',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#e6e9f0',
    },
  },
  activePage: {
    backgroundColor: mainColor,
    color: 'white',
    '&:hover': {
      backgroundColor: '#2c3e5c',
    },
  },
  controlsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  sortControls: {
    display: 'flex',
    gap: '10px',
  },
  sortButton: {
    backgroundColor: '#ffffff',
    border: `1px solid ${mainColor}`,
    color: mainColor,
    padding: '8px 12px',
    cursor: 'pointer',
    borderRadius: '6px',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#e6e9f0',
    },
  },
  perPageControl: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  perPageSelect: {
    padding: '5px',
    borderRadius: '6px',
    border: `1px solid ${mainColor}`,
  },
  announcementDate: {
    fontSize: '0.9rem',
    color: '#666',
    marginBottom: '10px',
  },
  confirmDeleteButton: {
    extend: 'deleteButton',
    backgroundColor: '#ff4136',
    '&:hover': {
      backgroundColor: '#ff1a1a',
    },
  },
  cancelDeleteButton: {
    extend: 'actionButton',
    backgroundColor: '#aaa',
    color: 'white',
    '&:hover': {
      backgroundColor: '#999',
    },
  },
  '@media (max-width: 768px)': {
    container: {
      padding: '20px 15px',
    },
    formContainer: {
      padding: '20px',
    },
    announcementItem: {
      padding: '20px',
    },
    pagination: {
      flexWrap: 'wrap',
    },
    paginationButton: {
      margin: '5px',
    },
  },
};

export default styles;

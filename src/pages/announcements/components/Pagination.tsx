import React from 'react';
import { createUseStyles } from 'react-jss';
import styles from '../announcements.style';

const useStyles = createUseStyles(styles);

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const classes = useStyles();

  return (
    <div className={classes.pagination}>
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i + 1}
          onClick={() => onPageChange(i + 1)}
          className={`${classes.paginationButton} ${currentPage === i + 1 ? classes.activePage : ''}`}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
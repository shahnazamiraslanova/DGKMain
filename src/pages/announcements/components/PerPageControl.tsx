import React from 'react';
import { createUseStyles } from 'react-jss';
import styles from '../announcements.style';

const useStyles = createUseStyles(styles);

interface PerPageControlProps {
  announcementsPerPage: number;
  setAnnouncementsPerPage: (value: number) => void;
  setCurrentPage: (value: number) => void;
}

const PerPageControl: React.FC<PerPageControlProps> = ({ announcementsPerPage, setAnnouncementsPerPage, setCurrentPage }) => {
  const classes = useStyles();

  return (
    <div className={classes.perPageControl}>
      <label htmlFor="perPage">Bir səhifə üçün elan sayı:</label>
      <select
        id="perPage"
        value={announcementsPerPage}
        onChange={(e) => {
          setAnnouncementsPerPage(Number(e.target.value));
          setCurrentPage(1);
        }}
        className={classes.perPageSelect}
      >
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="20">20</option>
      </select>
    </div>
  );
};

export default PerPageControl;
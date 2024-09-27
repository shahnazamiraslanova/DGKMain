import React from 'react';
import { createUseStyles } from 'react-jss';
import styles from '../announcements.style';

const useStyles = createUseStyles(styles);

interface SortControlsProps {
  sortKey: 'date' | 'title';
  sortOrder: 'asc' | 'desc';
  onSort: (key: 'date' | 'title') => void;
}

const SortControls: React.FC<SortControlsProps> = ({ sortKey, sortOrder, onSort }) => {
  const classes = useStyles();

  return (
    <div className={classes.sortControls}>
      <button onClick={() => onSort('date')} className={classes.sortButton}>
        Tarixə görə sırala {sortKey === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
      </button>
      <button onClick={() => onSort('title')} className={classes.sortButton}>
        Başlığa görə sırala {sortKey === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
      </button>
    </div>
  );
};

export default SortControls;
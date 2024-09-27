import React from 'react';
import { createUseStyles } from 'react-jss';
import styles from '../announcements.style';

const useStyles = createUseStyles(styles);

interface SearchBarProps {
  onSearch: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const classes = useStyles();

  return (
    <div className={classes.searchContainer}>
      <input
        type="text"
        placeholder="Elan axtar..."
        onChange={(e) => onSearch(e.target.value)}
        className={classes.searchInput}
      />
    </div>
  );
};

export default SearchBar;
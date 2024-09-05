import React, { useState, useEffect } from 'react';
import { createUseStyles } from 'react-jss';
import styles from './announcements.style';

interface Announcement {
  id: number;
  title: string;
  body: string;
  date: Date;
}

const useStyles = createUseStyles(styles);

const AnnouncementManagement: React.FC = () => {
  const classes = useStyles();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', body: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [announcementsPerPage, setAnnouncementsPerPage] = useState(5);
  const [sortKey, setSortKey] = useState<'date' | 'title'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  useEffect(() => {
    // Load fake data
    const fakeData: Announcement[] = Array.from({ length: 50 }, (_, index) => ({
      id: index + 1,
      title: `Announcement ${index + 1}`,
      body: `This is the body of announcement ${index + 1}. It contains important information for all users.`,
      date: new Date(Date.now() - Math.floor(Math.random() * 10000000000))
    }));
    setAnnouncements(fakeData);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (key: 'date' | 'title') => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const filteredAndSortedAnnouncements = announcements
    .filter((announcement) =>
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.body.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortKey === 'date') {
        return sortOrder === 'asc' ? a.date.getTime() - b.date.getTime() : b.date.getTime() - a.date.getTime();
      } else {
        return sortOrder === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
      }
    });

  const handleAddAnnouncement = () => {
    if (newAnnouncement.title && newAnnouncement.body) {
      setAnnouncements([
        { ...newAnnouncement, id: Date.now(), date: new Date() },
        ...announcements,
      ]);
      setNewAnnouncement({ title: '', body: '' });
      setCurrentPage(1);
    }
  };

  const handleEdit = (id: number) => {
    setEditingId(id);
    const announcementToEdit = announcements.find((a) => a.id === id);
    if (announcementToEdit) {
      setNewAnnouncement({ title: announcementToEdit.title, body: announcementToEdit.body });
    }
  };

  const handleUpdate = () => {
    if (editingId !== null) {
      setAnnouncements(
        announcements.map((a) =>
          a.id === editingId ? { ...a, ...newAnnouncement, date: new Date() } : a
        )
      );
      setEditingId(null);
      setNewAnnouncement({ title: '', body: '' });
    }
  };

  const handleDelete = (id: number) => {
    setAnnouncements(announcements.filter((a) => a.id !== id));
    setDeleteConfirmId(null);
    const newTotalPages = Math.ceil((filteredAndSortedAnnouncements.length - 1) / announcementsPerPage);
    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages);
    }
  };

  // Pagination logic
  const indexOfLastAnnouncement = currentPage * announcementsPerPage;
  const indexOfFirstAnnouncement = indexOfLastAnnouncement - announcementsPerPage;
  const currentAnnouncements = filteredAndSortedAnnouncements.slice(indexOfFirstAnnouncement, indexOfLastAnnouncement);

  const totalPages = Math.ceil(filteredAndSortedAnnouncements.length / announcementsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className={classes.container}>
      <div className={classes.searchContainer}>
        <input
          type="text"
          placeholder="Elan axtar..."
          value={searchTerm}
          onChange={handleSearch}
          className={classes.searchInput}
        />
      </div>
      <div className={classes.formContainer}>
        <input
          type="text"
          placeholder="Elan başlığı"
          value={newAnnouncement.title}
          onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
          className={classes.input}
        />
        <textarea
          placeholder="Elan kontenti..."
          value={newAnnouncement.body}
          onChange={(e) => setNewAnnouncement({ ...newAnnouncement, body: e.target.value })}
          className={classes.textarea}
        />
        {editingId === null ? (
          <button onClick={handleAddAnnouncement} className={classes.button}>
           Elan əlavə et
          </button>
        ) : (
          <button onClick={handleUpdate} className={classes.button}>
           Elanı yebilə
          </button>
        )}
      </div>
      <div className={classes.controlsContainer}>
        <div className={classes.sortControls}>
          <button onClick={() => handleSort('date')} className={classes.sortButton}>
            Tarixə görə sırala {sortKey === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button onClick={() => handleSort('title')} className={classes.sortButton}>
            Başlığa görə sırala{sortKey === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
        </div>
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
      </div>
      <div className={classes.listContainer}>
        {currentAnnouncements.map((announcement) => (
          <div key={announcement.id} className={classes.announcementItem}>
            <h3 className={classes.announcementTitle}>{announcement.title}</h3>
            <p className={classes.announcementBody}>{announcement.body}</p>
            <p className={classes.announcementDate}>
              {announcement.date.toLocaleString()}
            </p>
            <div className={classes.actionButtons}>
              <button onClick={() => handleEdit(announcement.id)} className={classes.editButton}>
                Düzəliş et
              </button>
              {deleteConfirmId === announcement.id ? (
                <>
                  <button onClick={() => handleDelete(announcement.id)} className={classes.confirmDeleteButton}>
                   Təsdiqlə
                  </button>
                  <button onClick={() => setDeleteConfirmId(null)} className={classes.cancelDeleteButton}>
                    Ləğv et
                  </button>
                </>
              ) : (
                <button onClick={() => setDeleteConfirmId(announcement.id)} className={classes.deleteButton}>
                  Sil
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className={classes.pagination}>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => paginate(i + 1)}
            className={`${classes.paginationButton} ${currentPage === i + 1 ? classes.activePage : ''}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementManagement;
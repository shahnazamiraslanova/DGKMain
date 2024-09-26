import React, { useState, useEffect } from 'react';
import { createUseStyles } from 'react-jss';
import styles from './announcements.style';
import axios from 'axios';
import { message } from 'antd';

interface Announcement {
  id: number;
  title: string;
  content: string;
  createdDate: Date;
  files: [number]
}

const useStyles = createUseStyles(styles);

const AnnouncementManagement: React.FC = () => {
  const classes = useStyles();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    image: null as File | null,
  });  
  const [currentPage, setCurrentPage] = useState(1);
  const [announcementsPerPage, setAnnouncementsPerPage] = useState(5);
  const [sortKey, setSortKey] = useState<'date' | 'title'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  const token = localStorage.getItem('token');

  const getHeaders = () => ({
    accept: "application/json",
    "api-key": token || "",
  });

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get(
        'https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/v1/Accouncements/GetAnnouncemets',
        { headers: getHeaders() }
      );
      setAnnouncements(response.data.data);
      console.log(response.data);
    } catch (error) {
      console.error("Failed to fetch announcements:", error);
      message.error("Elanları əldə etmək mümkün olmadı");
    }
  };

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
      announcement.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortKey === 'date') {
        return sortOrder === 'asc' ? new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime() : new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
      } else {
        return sortOrder === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
      }
    });

  const handleAddAnnouncement = async () => {
    const formData = new FormData();
    formData.append('title', newAnnouncement.title);
    formData.append('content', newAnnouncement.content);
    
    if (newAnnouncement.image) {
      formData.append('files', newAnnouncement.image);
    }

    try {
      const response = await axios.post(
        'https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/v1/Accouncements/CreateAnnouncement',
        formData,
        { 
          headers: { 
            ...getHeaders(), 
            'Content-Type': 'multipart/form-data' 
          } 
        }
      );

      if (response.status === 200) {
        message.success('Elan uğurla əlavə edildi');
        setNewAnnouncement({ title: '', content: '', image: null });
        fetchAnnouncements();
      }
    } catch (error) {
      console.error('Error adding announcement:', error);
      message.error('Elan əlavə etmək mümkün olmadı');
    }
  };

 const handleUpdate = async () => {
    if (editingId === null) return;

    const formData = new FormData();
    formData.append('title', newAnnouncement.title);
    formData.append('content', newAnnouncement.content);
    // formData.append('files', newAnnouncement.image);

    if (newAnnouncement.image) {
      formData.append('files', newAnnouncement.image);
    }

    try {
      console.log(editingId);
      
      const response = await axios.put(
        `https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/v1/Accouncements/EditAnnoucement?id=${editingId}`,
        formData,
        {
          headers: {
            ...getHeaders(),
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200) {
        message.success('Elan uğurla yeniləndi');
        setNewAnnouncement({ title: '', content: '', image: null });
        setEditingId(null);
        fetchAnnouncements();
      }
    } catch (error) {
      console.error('Error updating announcement:', error);
      message.error('Elanı yeniləmək mümkün olmadı');
    }
  };


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewAnnouncement({ ...newAnnouncement, image: file });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await axios.delete(
        `https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/v1/Accouncements/DeleteAnnouncement?id=${id}`,
        { headers: getHeaders() }
      );

      if (response.status === 200) {
        message.success('Elan uğurla silindi');
        setAnnouncements(announcements.filter((a) => a.id !== id));
        setDeleteConfirmId(null);
        const newTotalPages = Math.ceil((filteredAndSortedAnnouncements.length - 1) / announcementsPerPage);
        if (currentPage > newTotalPages) {
          setCurrentPage(newTotalPages);
        }
      }
    } catch (error) {
      console.error('Error deleting announcement:', error);
      message.error('Elanı silmək mümkün olmadı');
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // Pagination logic
  const indexOfLastAnnouncement = currentPage * announcementsPerPage;
  const indexOfFirstAnnouncement = indexOfLastAnnouncement - announcementsPerPage;
  const currentAnnouncements = filteredAndSortedAnnouncements.slice(indexOfFirstAnnouncement, indexOfLastAnnouncement);

  const totalPages = Math.ceil(filteredAndSortedAnnouncements.length / announcementsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const imagePreviewUrl = newAnnouncement.image ? URL.createObjectURL(newAnnouncement.image) : '';

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
          value={newAnnouncement.content}
          onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
          className={classes.textarea}
        />
        
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className={classes.input}
        />
        
        {imagePreviewUrl && (
          <img src={imagePreviewUrl} alt="Image Preview" className={classes.imagePreview} />
        )}
        
        {editingId === null ? (
          <button onClick={handleAddAnnouncement} className={classes.button}>
            Elan əlavə et
          </button>
        ) : (
          <button onClick={handleUpdate} className={classes.button}>
            Elanı yenilə
          </button>
        )}
      </div>
      <div className={classes.controlsContainer}>
        <div className={classes.sortControls}>
          <button onClick={() => handleSort('date')} className={classes.sortButton}>
            Tarixə görə sırala {sortKey === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button onClick={() => handleSort('title')} className={classes.sortButton}>
            Başlığa görə sırala {sortKey === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
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
            <p className={classes.announcementBody}>{announcement.content}</p>
            <p className={classes.announcementDate}>
            <img 
                src={(`data:image/jpeg;base64,${announcement.files[0]}`)} 
                alt="Announcement" 
                className={classes.announcementImage}
              />
              {new Date(announcement.createdDate).toLocaleString()}
            </p>
            <div className={classes.actionButtons}>
              <button onClick={() => {
                setEditingId(announcement.id);
                setNewAnnouncement({
                  title: announcement.title,
                  content: announcement.content,
                  image: null
                });
              }} className={classes.editButton}>
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
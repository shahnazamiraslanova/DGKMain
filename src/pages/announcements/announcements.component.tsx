import React, { useState, useEffect } from 'react';
import { createUseStyles } from 'react-jss';
import styles from './announcements.style';
import axios from 'axios';
import { message } from 'antd';
// import AnnouncementList from './AnnouncementList';


import AnnouncementList from './components/AnnouncementList';
import AnnouncementForm from './components/AnnouncementForm';
import SearchBar from './components/SearchBar';
import SortControls from './components/SortControls';
import PerPageControl from './components/PerPageControl';
import Pagination from './components/Pagination';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [announcementsPerPage, setAnnouncementsPerPage] = useState(5);
  const [sortKey, setSortKey] = useState<'date' | 'title'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
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
    } catch (error) {
      console.error("Failed to fetch announcements:", error);
      message.error("Elanları əldə etmək mümkün olmadı");
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
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

  const indexOfLastAnnouncement = currentPage * announcementsPerPage;
  const indexOfFirstAnnouncement = indexOfLastAnnouncement - announcementsPerPage;
  const currentAnnouncements = filteredAndSortedAnnouncements.slice(indexOfFirstAnnouncement, indexOfLastAnnouncement);

  const totalPages = Math.ceil(filteredAndSortedAnnouncements.length / announcementsPerPage);

  return (
    <div className={classes.container}>
     
      <AnnouncementForm
        editingId={editingId}
        setEditingId={setEditingId}
        fetchAnnouncements={fetchAnnouncements}
        getHeaders={getHeaders}
      />
       <SearchBar onSearch={handleSearch} />
      <div className={classes.controlsContainer}>
        <SortControls
          sortKey={sortKey}
          sortOrder={sortOrder}
          onSort={handleSort}
        />
        <PerPageControl
          announcementsPerPage={announcementsPerPage}
          setAnnouncementsPerPage={setAnnouncementsPerPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
     
      <AnnouncementList
        announcements={currentAnnouncements}
        setEditingId={setEditingId}
        fetchAnnouncements={fetchAnnouncements}
        getHeaders={getHeaders}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
      {/* <PollModal
        isOpen={isPollModalOpen}
        onClose={() => setIsPollModalOpen(false)}
        getHeaders={getHeaders}
      /> */}
    </div>
  );
};

export default AnnouncementManagement;
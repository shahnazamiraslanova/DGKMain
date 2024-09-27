import React, { useState } from "react";
import { createUseStyles } from "react-jss";
import { Carousel, Modal, Input, Button, message, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { RcFile, UploadProps } from 'antd/es/upload/interface';
import styles from "../announcements.style";
import axios from "axios";

const useStyles = createUseStyles(styles);

interface Announcement {
  id: number;
  title: string;
  content: string;
  createdDate: Date;
  files: string[];
}

interface AnnouncementListProps {
  announcements: Announcement[];
  fetchAnnouncements: () => void;
  getHeaders: () => { accept: string; "api-key": string };
}

const CustomPrevArrow = (props: any) => (
  <div {...props} style={{ ...props.style, display: 'block', background: 'black', borderRadius: '50%' }}>
    <span style={{ color: 'white', padding: '10px' }}>&lt;</span>
  </div>
);

const CustomNextArrow = (props: any) => (
  <div {...props} style={{ ...props.style, display: 'block', background: 'black', borderRadius: '50%' }}>
    <span style={{ color: 'white', padding: '10px' }}>&gt;</span>
  </div>
);

const AnnouncementList: React.FC<AnnouncementListProps> = ({
  announcements,
  fetchAnnouncements,
  getHeaders,
}) => {
  const classes = useStyles();
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingImages, setEditingImages] = useState<string[]>([]);

  const handleDelete = async (id: number) => {
    try {
      const response = await axios.delete(
        `https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/v1/Accouncements/DeleteAnnouncement?id=${id}`,
        { headers: getHeaders() }
      );

      if (response.status === 200) {
        message.success("Elan uğurla silindi");
        setDeleteConfirmId(null);
        fetchAnnouncements();
      }
    } catch (error) {
      console.error("Error deleting announcement:", error);
      message.error("Elanı silmək mümkün olmadı");
    }
  };

  const handleEdit = async () => {
    if (editingAnnouncement) {
      const hasChanges =
        title !== editingAnnouncement.title ||
        content !== editingAnnouncement.content;

      const updatedData = {
        id: editingAnnouncement.id,
        title: hasChanges ? title : editingAnnouncement.title,
        content: hasChanges ? content : editingAnnouncement.content,
      };

      // Construct the URL with query parameters
      const query = new URLSearchParams(updatedData).toString();
      const url = `https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/v1/Accouncements/EditAnnouncement?${query}`;

      try {
        const response = await axios.put(url, null, { headers: getHeaders() });

        if (response.status === 200) {
          message.success("Elan uğurla yeniləndi");
          setEditingAnnouncement(null);
          fetchAnnouncements();
        }
      } catch (error) {
        console.error("Error updating announcement:", error);
        message.error("Elanı yeniləmək mümkün olmadı");
      }
    }
  };

  const openEditModal = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setTitle(announcement.title);
    setContent(announcement.content);
    setEditingImages(announcement.files);
  };

  const closeEditModal = () => {
    setEditingAnnouncement(null);
    setTitle("");
    setContent("");
    setEditingImages([]);
  };

  const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });

  const handleImageUpload: UploadProps['onChange'] = async (info) => {
    const { file } = info;
    if (file.status === 'uploading') {
      console.log('Uploading:', file, info);
    }
    if (file instanceof File) {
      try {
        const base64 = await getBase64(file as RcFile);
        const base64WithoutPrefix = base64.split(',')[1];
        setEditingImages(prevImages => [...prevImages, base64WithoutPrefix]);
        message.success(`${file.name} şəkil əlavə edildi`);
      } catch (error) {
        console.error('Error converting file to base64:', error);
        message.error(`${file.name} şəkil əlavə etmək mümkün olmadı.`);
      }
    }
  };

  const removeImage = (index: number) => {
    setEditingImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={classes.listContainer}>
      {announcements.map((announcement) => (
        <div key={announcement.id} className={classes.announcementItem}>
          <h3 className={classes.announcementTitle}>{announcement.title}</h3>
          <p className={classes.announcementBody}>{announcement.content}</p>
          <p className={classes.announcementDate}>
            <div style={{ width: '200px', overflow: 'hidden' }}>
              <Carousel
                autoplay
                dots
                arrows
                prevArrow={<CustomPrevArrow />}
                nextArrow={<CustomNextArrow />}
              >
                {announcement.files.map((item, index) => (
                  <div key={index}>
                    <img
                      src={`data:image/jpeg;base64,${item}`}
                      alt={`Announcement ${index + 1}`}
                      className={classes.announcementImage}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                ))}
              </Carousel>
            </div>
            <span>{new Date(announcement.createdDate).toLocaleString()}</span>
          </p>
          <div className={classes.actionButtons}>
            <button
              onClick={() => openEditModal(announcement)}
              className={classes.editButton}
            >
              Düzəliş et
            </button>
            {deleteConfirmId === announcement.id ? (
              <>
                <button
                  onClick={() => handleDelete(announcement.id)}
                  className={classes.confirmDeleteButton}
                >
                  Təsdiqlə
                </button>
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className={classes.cancelDeleteButton}
                >
                  Ləğv et
                </button>
              </>
            ) : (
              <button
                onClick={() => setDeleteConfirmId(announcement.id)}
                className={classes.deleteButton}
              >
                Sil
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Editing Modal */}
      <Modal
        title="Düzəliş et"
        visible={!!editingAnnouncement}
        onCancel={closeEditModal}
        footer={[
          <Button key="cancel" onClick={closeEditModal}>
            Ləğv et
          </Button>,
          <Button key="submit" type="primary" onClick={handleEdit}>
            Təsdiqlə
          </Button>,
        ]}
      >
        <Input
          placeholder="Başlıq"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ marginBottom: 10 }}
        />
        <Input.TextArea
          placeholder="Məzmun"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          style={{ marginBottom: 10 }}
        />
        <div>
          <Upload
            accept="image/*"
            showUploadList={false}
            beforeUpload={() => false}
            onChange={handleImageUpload}
          >
            <Button icon={<UploadOutlined />}>Şəkil əlavə et</Button>
          </Upload>
        </div>
        <div style={{ marginTop: 10 }}>
          {editingImages.map((image, index) => (
            <div key={index} style={{ display: 'inline-block', margin: '5px' }}>
              <img
                src={`data:image/jpeg;base64,${image}`}
                alt={`Editing ${index}`}
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              />
              <Button onClick={() => removeImage(index)} size="small" danger>
                Sil
              </Button>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default AnnouncementList;

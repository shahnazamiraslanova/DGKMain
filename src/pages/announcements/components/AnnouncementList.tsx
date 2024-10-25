import React, { useState } from "react";
import { createUseStyles } from "react-jss";
import { Carousel, Modal, Input, Button, message, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import styles from "../announcements.style";
import axios from "axios";
import { BASE_URL } from "baseInfos";

const useStyles = createUseStyles(styles);

interface Announcement {
  id: number;
  title: string;
  content: string;
  createdDate: Date;
  files: [string]
}

interface AnnouncementListProps {
  announcements: Announcement[];
  fetchAnnouncements: () => void;
  getHeaders: () => { accept: string; "api-key": string };
  setEditingId: (id: number | null) => void;
}

const AnnouncementList: React.FC<AnnouncementListProps> = ({
  announcements,
  fetchAnnouncements,
  getHeaders,
}) => {
  const classes = useStyles();
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingImages, setEditingImages] = useState<UploadFile[]>([]);

  const handleDelete = async (id: number) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/api/v1/Announcements/DeleteAnnouncement?id=${id}`,
        { headers: getHeaders() }
      );

      if (response.status === 200) {
        message.success("Elan uğurla silindi");
        fetchAnnouncements();
      }
    } catch (error) {
      console.error("Error deleting announcement:", error);
      message.error("Elanı silmək mümkün olmadı");
    }
  };

  const confirmDelete = (id: number) => {
    Modal.confirm({
      title: "Elanı silmək istədiyinizdən əminsiniz?",
      content: "Bu əməliyyatı ləğv edə bilməzsiniz.",
      okText: "Bəli",
      okType: "danger",
      cancelText: "Xeyr",
      onOk: () => handleDelete(id),
    });
  };

  const handleEdit = async () => {
    if (editingAnnouncement) {
      const formData = new FormData();
      formData.append('id', editingAnnouncement.id.toString());
      formData.append('title', title || editingAnnouncement.title);
      formData.append('content', content || editingAnnouncement.content);

      // Check if there are any new file uploads
      const newImages = editingImages.filter(file => file.originFileObj);
      
      if (newImages.length > 0) {
        // If there are new images, append them
        newImages.forEach(file => {
          if (file.originFileObj) {
            formData.append('Files', file.originFileObj);
          }
        });
      } else {
        // If no new images, append the existing files
        editingAnnouncement.files.forEach(file => {
          // Create a file blob from base64
          const byteCharacters = atob(file);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'image/jpeg' });
          
          // Create a File object from the blob
          const fileFromBlob = new File([blob], 'image.jpg', { type: 'image/jpeg' });
          formData.append('Files', fileFromBlob);
        });
      }

      try {
        const response = await axios.put(
          `${BASE_URL}/api/v1/Announcements/EditAnnouncement`,
          formData,
          { headers: { ...getHeaders(), 'Content-Type': 'multipart/form-data' } }
        );

        if (response.status === 200) {
          message.success("Elan uğurla yeniləndi");
          setEditingAnnouncement(null);
          fetchAnnouncements();
          closeEditModal();
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
    
    setEditingImages(announcement.files.map((file, index) => ({
      uid: `existing-${index}`,
      name: `Existing Image ${index + 1}`,
      status: 'done',
      url: `data:image/jpeg;base64,${file}`,
    })));
  };

  const closeEditModal = () => {
    setEditingAnnouncement(null);
    setTitle("");
    setContent("");
    setEditingImages([]);
  };

  const handleImageUpload: UploadProps['onChange'] = (info) => {
    let fileList = [...info.fileList];
    
    // Preserve existing images
    fileList = editingImages.filter(file => file.url).concat(fileList);
    
    setEditingImages(fileList);
    message.success(`${fileList.length} şəkil əlavə edildi`);
  };

  const removeImage = (uid: string) => {
    setEditingImages((prev) => prev.filter((file) => file.uid !== uid));
  };

  return (
    <div className={classes.listContainer}>
      {announcements.map((announcement) => (
        <div key={announcement.id} className={classes.announcementItem}>
          <h3 className={classes.announcementTitle}>{announcement.title}</h3>
          <p className={classes.announcementBody}>{announcement.content}</p>
          <p className={classes.announcementDate}>
            <Carousel autoplay dots>
              {announcement.files.map((item, index) => (
                <div key={index}>
                  <img
                    src={`data:image/jpeg;base64,${item}`}
                    alt={`Announcement ${index + 1}`}
                    className={classes.announcementImage}
                    style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                  />
                </div>
              ))}
            </Carousel>
            <span>{new Date(announcement.createdDate).toLocaleString()}</span>
          </p>
          <div className={classes.actionButtons}>
            <button onClick={() => openEditModal(announcement)} className={classes.editButton}>
              Düzəliş et
            </button>
            <button onClick={() => confirmDelete(announcement.id)} className={classes.deleteButton}>
              Sil
            </button>
          </div>
        </div>
      ))}

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
            multiple
            fileList={editingImages}
            onChange={handleImageUpload}
            beforeUpload={() => false}
          >
            <Button icon={<UploadOutlined />}>Şəkil əlavə et</Button>
          </Upload>
        </div>
        <div style={{ marginTop: 10 }}>
          {editingImages.map((image) => (
            <div key={image.uid} style={{ display: 'inline-block', margin: '5px' }}>
              <img
                src={image.url || (image.originFileObj && URL.createObjectURL(image.originFileObj))}
                alt={`Editing ${image.name}`}
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              />
              <Button onClick={() => removeImage(image.uid)} size="small" danger>
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
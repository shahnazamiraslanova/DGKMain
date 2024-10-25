import React, { useState, useEffect } from 'react';
import { createUseStyles } from 'react-jss';
import styles from '../announcements.style';
import axios from 'axios';
import { message, Modal, Button, Upload, Form } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { BASE_URL } from 'baseInfos';

const useStyles = createUseStyles(styles);

interface AnnouncementFormProps {
  fetchAnnouncements: () => void;
  getHeaders: () => { accept: string; "api-key": string };
  editingId:any;
   setEditingId: (id: any) => void;
}

const AnnouncementForm: React.FC<AnnouncementFormProps> = ({ fetchAnnouncements, getHeaders }) => {
  const classes = useStyles();
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    images: [] as File[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewAnnouncement(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (fileList: File[]) => {
    setNewAnnouncement(prev => ({ ...prev, images: [...prev.images, ...fileList] }));
    return false; 
  };

  const handleImageDelete = (index: number) => {
    setNewAnnouncement(prev => {
      const updatedImages = [...prev.images];
      updatedImages.splice(index, 1);
      return { ...prev, images: updatedImages };
    });
  };

  const handleSubmit = async (values: { title: string; content: string; }) => {
    if (newAnnouncement.images.length === 0) {
      message.error('Şəkil seçilməlidir!'); 
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('content', values.content);
    newAnnouncement.images.forEach(image => {
      formData.append('files', image);
    });

    try {
      await axios.post(
        `${BASE_URL}/api/v1/Announcements/CreateAnnouncement`,
        formData,
        { headers: { ...getHeaders(), 'Content-Type': 'multipart/form-data' } }
      );
      message.success('Elan uğurla əlavə edildi');
      setNewAnnouncement({ title: '', content: '', images: [] }); 
      fetchAnnouncements();
      setIsModalVisible(false); 
    } catch (error) {
      console.error('Error submitting announcement:', error);
      message.error('Elanı göndərmək mümkün olmadı');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  return (
    <>
      <Button className={classes.createButton} onClick={openModal}>
        Elan yarat
      </Button>

      <Modal
        title="Yeni Elan Yarat"
        visible={isModalVisible}
        onCancel={closeModal}
        footer={null}
      >
        <Form
          onFinish={handleSubmit}
          layout="vertical"
          initialValues={newAnnouncement}
        >
          <Form.Item
            label="Elan başlığı"
            name="title"
            rules={[{ required: true, message: 'Elan başlığı tələb olunur!' }]}
          >
            <input
              type="text"
              name="title"
              onChange={handleInputChange}
              className={classes.input}
            />
          </Form.Item>

          <Form.Item
            label="Elan kontenti"
            name="content"
            rules={[{ required: true, message: 'Elan kontenti tələb olunur!' }]}
          >
            <textarea
              name="content"
              onChange={handleInputChange}
              className={classes.textarea}
            />
          </Form.Item>

          <Upload
            beforeUpload={(file) => { handleImageChange([file]); return false; }} 
            showUploadList={false} 
            multiple 
          >
            <Button icon={<UploadOutlined />}>Şəkil seç</Button>
          </Upload>

          {newAnnouncement.images.map((image, index) => (
            <div key={index} className={classes.imagePreviewContainer}>
              <img 
                src={URL.createObjectURL(image)} 
                alt={`Image Preview ${index + 1}`} 
                className={classes.imagePreview} 
              />
              <Button 
                type="link" 
                onClick={() => handleImageDelete(index)}
                style={{ marginLeft: '10px', color: 'red' }}
              >
                Sil
              </Button>
            </div>
          ))}

          <Form.Item>
            <Button style={{ marginTop: '20px' }} type="primary" htmlType="submit" className={classes.button} disabled={isSubmitting}>
              Elan əlavə et
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AnnouncementForm;

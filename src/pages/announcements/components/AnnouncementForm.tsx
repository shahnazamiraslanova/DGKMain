import React, { useState, useEffect } from 'react';
import { createUseStyles } from 'react-jss';
import styles from '../announcements.style';
import axios from 'axios';
import { message, Modal, Button, Upload, Form } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const useStyles = createUseStyles(styles);

interface AnnouncementFormProps {
  editingId: number | null;
  setEditingId: (id: number | null) => void;
  fetchAnnouncements: () => void;
  getHeaders: () => { accept: string; "api-key": string };
}

const AnnouncementForm: React.FC<AnnouncementFormProps> = ({ editingId, setEditingId, fetchAnnouncements, getHeaders }) => {
  const classes = useStyles();
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    images: [] as File[], // Changed to handle multiple images
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (editingId !== null) {
      const fetchAnnouncementForEdit = async () => {
        try {
          const response = await axios.get(
            `https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/v1/Accouncements/GetAnnouncementById?id=${editingId}`,
            { headers: getHeaders() }
          );
          const { title, content } = response.data.data;
          setNewAnnouncement({ title, content, images: [] }); // Reset images on edit
        } catch (error) {
          console.error('Error fetching announcement for edit:', error);
          message.error('Elanı yükləmək mümkün olmadı');
        }
      };
      fetchAnnouncementForEdit();
    }
  }, [editingId, getHeaders]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewAnnouncement(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (fileList: File[]) => {
    setNewAnnouncement(prev => ({ ...prev, images: [...prev.images, ...fileList] }));
    return false; // Prevent the automatic upload
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
      message.error('Şəkil seçilməlidir!'); // Validation message
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
      if (editingId === null) {
        await axios.post(
          'https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/v1/Accouncements/CreateAnnouncement',
          formData,
          { headers: { ...getHeaders(), 'Content-Type': 'multipart/form-data' } }
        );
        message.success('Elan uğurla əlavə edildi');
      } else {
        await axios.put(
          `https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/v1/Accouncements/EditAnnoucement?id=${editingId}`,
          formData,
          { headers: { ...getHeaders(), 'Content-Type': 'multipart/form-data' } }
        );
        message.success('Elan uğurla yeniləndi');
        setEditingId(null);
      }
      setNewAnnouncement({ title: '', content: '', images: [] }); // Reset state after submission
      fetchAnnouncements();
      setIsModalVisible(false); // Close the modal after submit
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
        title={editingId === null ? 'Yeni Elan Yarat' : 'Elanı Yenilə'}
        visible={isModalVisible}
        onCancel={closeModal}
        footer={null} // We'll handle the submit button inside the form
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
            beforeUpload={(file) => { handleImageChange([file]); return false; }} // Allow multiple uploads
            showUploadList={false} // Do not show the file list automatically
            multiple // Allow multiple uploads
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
              {editingId === null ? 'Elan əlavə et' : 'Elanı yenilə'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AnnouncementForm;

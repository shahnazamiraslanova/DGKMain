import { useEffect, useState } from 'react';
import { Modal, Button, Input, Form, Radio, Collapse } from 'antd';
import { createUseStyles } from 'react-jss';
import styles from './quizes.style';
import axios from 'axios';
import { Quiz } from './quizes';
import { EditOutlined, SaveOutlined, CloseOutlined, DeleteOutlined } from '@ant-design/icons';

const { Panel } = Collapse;


const QuizsComponent = () => {
  const useStyles = createUseStyles(styles);
  const classes = useStyles();

  const [isQuizModalVisible, setIsQuizModalVisible] = useState<boolean>(false);
  const [isGroupModalVisible, setIsGroupModalVisible] = useState<boolean>(false);
  const [isManageGroupModalVisible, setIsManageGroupModalVisible] = useState<boolean>(false);
  const [isQuestionFormVisible, setIsQuestionFormVisible] = useState<boolean>(false);
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);  
  const [quizTitle, setQuizTitle] = useState<string>('');
  const [form] = Form.useForm();

  const token = localStorage.getItem('token');

  const getQuizzes = async () => {
    try {
      const response = await axios.get('https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/Quiz/GetAllQuiz', {
        headers: {
          'accept': 'application/json',
          'api-key': token || '',
        },
      });
      setQuizzes(response.data.data);  
      console.log(response.data);
    } catch (error) {
      console.error('Failed to fetch quizzes:', error);
    }
  };

  const handleOk = async () => {
    console.log(quizTitle);
    try {
      const token = localStorage.getItem('token') || '';
      const response = await axios.post(
        'https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/Quiz/CreateQuiz',
        { title: quizTitle }, 
        {
          headers: {
            'accept': 'application/json',
            'api-key': token,
          },
        }
      );
     
        
        console.log('Updated Quizzes:', response.data.data);
      console.log(response.data);
      console.log(quizzes);
      // getQuizzes();
      
     
    } catch (error) {
      console.error('Failed to fetch quizzes:', error);
    }
  };
  

  useEffect(() => {
    getQuizzes();
  }, [token]);  

  const handleCancel = () => {
    setIsQuizModalVisible(false);
    setIsGroupModalVisible(false);
    setIsManageGroupModalVisible(false);
  };

  const showQuizModal = () => {
    setIsQuizModalVisible(true);
  };

  const showGroupModal = () => {
    setIsGroupModalVisible(true);
  };

  const showManageGroupModal = () => {
    setIsManageGroupModalVisible(true);
  };

  const handleAddQuestionClick = () => {
    setIsQuestionFormVisible(true);
  };

  const handleCorrectAnswerChange = (e: any) => {
    setCorrectAnswer(e.target.value);
  };
  const [editingQuizId, setEditingQuizId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState<string>('');

  const handleEditClick = (id: number, title: string) => {
    setEditingQuizId(id);
    setEditTitle(title);
  };

  const handleSaveClick = async (id: number) => {
    const updatedTitle = editTitle; 
    try {
      const token = localStorage.getItem('token') || '';
      const response = await axios.put(
        `https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/Quiz/UpdateQuizTitle`, 
        { id, title: updatedTitle }, 
        {
          headers: {
            'accept': 'application/json',
            'api-key': token,
          },
        }
      );
  
      console.log('Update successful:', response.data);
  
      
      setQuizzes(prevQuizzes =>
        prevQuizzes?.map(quiz =>
          quiz.id === id ? { ...quiz, title: updatedTitle } : quiz
        )
      );
  
      
      setEditingQuizId(null);
      setEditTitle('');
    } catch (error) {
      console.error('Failed to update quiz:', error);
      
    }
  };
  

  const handleCancelClick = () => {
    setEditingQuizId(null);
    setEditTitle('');
  };

  const handleDeleteClick = async (id: number) => {
    try {
      const token = localStorage.getItem('token') || '';
      const response = await axios.delete(
        `https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/Quiz/DeleteQuizById/${id}`,
        {
          headers: {
            'accept': 'application/json',
            'api-key': token,
          },
        }
      );
      console.log('Delete successful:', response.data);
      setQuizzes(prevQuizzes => prevQuizzes.filter(quiz => quiz.id !== id));
    } catch (error) {
      console.error('Failed to delete quiz:', error);
    }
  };
  const handleCloseFormClick = () => {
    setIsQuestionFormVisible(false);
  };


  return (
    <div className={classes.quizContainer}>
      <div className={classes.mainBtns}>
        <Button onClick={showQuizModal}>Quiz Yarat</Button>
        <Button onClick={showGroupModal}>Quiz qrupu yarat</Button>
        <Button onClick={showManageGroupModal}>Mövcud qrupları idarə et</Button>
      </div>

      
      <Collapse accordion>
      { quizzes?.map((quiz: Quiz, index: number) => (
        <Panel
          key={index}
          header={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {editingQuizId === quiz.id ? (
                <>
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    style={{ width: '60%', marginRight: '10px' }}
                  />
                  <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    onClick={() => handleSaveClick(quiz.id)}
                  >
                    Save
                  </Button>
                  <Button
                    type="default"
                    icon={<CloseOutlined />}
                    onClick={handleCancelClick}
                    style={{ marginLeft: '10px' }}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Input
                    value={quiz.title}
                    style={{ width: '60%', marginRight: '10px' }}
                    readOnly
                  />
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => handleEditClick(quiz.id, quiz.title)}
                  >
                    Edit
                  </Button>
                  <Button
                    // type="danger"
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteClick(quiz.id)}
                    style={{ marginLeft: '10px' }}
                  >
                    Delete
                  </Button>
                </>
              )}
            </div>
          }
        >
           <Button type="primary" onClick={handleAddQuestionClick}>Sual əlavə et</Button>

{isQuestionFormVisible && (
  <>
    <Form.Item
      name="questionTitle"
      label="Sual"
      rules={[{ required: true, message: 'Zəhmət olmasa, sualı daxil edin' }]}
    >
      <Input placeholder="Sualı daxil edin..." />
    </Form.Item>

    <Form.Item label="Cavab variantları">
      <Radio.Group  value={correctAnswer}>
        {[1, 2, 3, 4].map((value) => (
          <Radio value={value} key={value}>
            <Form.Item
              name={`option${value}`}
              rules={[{ required: true, message: `Zəhmət olmasa, ${value}-ci variantı daxil edin` }]}
            >
              <Input placeholder={`Variant ${value}`} />
            </Form.Item>
          </Radio>
        ))}
      </Radio.Group>
    </Form.Item>
    <Button type="default" onClick={handleCloseFormClick} style={{ marginRight: '10px' }}>
              Close
            </Button>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
  </>
)}
          {/* Panel content */}
        </Panel>
      ))}
    </Collapse>

      <Modal
        title="Quiz Yarat"
        visible={isQuizModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="quizTitle"
            label="Quiz başlığı"
            rules={[{ required: true, message: 'Zəhmət olmasa, quiz başlığını daxil edin' }]}
          >
            <Input onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuizTitle(e.target.value)} placeholder="Quiz başlığı..." />
          </Form.Item>

         
        </Form>
      </Modal>

      <Modal
        title="Quiz qrupu yarat"
        visible={isGroupModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Button type="primary" onClick={handleAddQuestionClick}>Sual əlavə et</Button>

        {isQuestionFormVisible && (
          <Form style={{ marginTop: '16px' }}>
            <Form.Item label="Sual">
              <Input placeholder="Sualı daxil edin..." />
            </Form.Item>

            <Form.Item label="Cavab variantları">
              <Radio.Group  value={correctAnswer}>
                {[1, 2, 3, 4].map((value) => (
                  <Radio value={value} key={value}>
                    <Input placeholder={`Variant ${value}`} />
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>
          </Form>
        )}
      </Modal>

      <Modal
        title="Mövcud qrupları idarə et"
        visible={isManageGroupModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Here you can manage the existing groups...</p>
      </Modal>
    </div>
  );
};

export default QuizsComponent;

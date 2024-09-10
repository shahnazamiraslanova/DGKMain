import React, { useEffect, useState, useCallback } from 'react';
import { Modal, Button, Input, Form, Radio, Collapse, Spin, message, InputNumber, Select, Table, Switch } from 'antd';
import { createUseStyles } from 'react-jss';
import axios from 'axios';
import { EditOutlined, SaveOutlined, CloseOutlined, DeleteOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import { Option } from 'antd/es/mentions';
import { useQuizStyles } from './quizes.style';

const { Panel } = Collapse;

interface Quiz {
  id: number;
  title: string;
}

interface Question {
  id: number;
  content: string;
}

interface Option {
  id: number;
  content: string;
  isTrue: boolean;
}
interface User {
  id: number,
      name: string,
      surname: string,
      departmentId: number,
      fatherName:string
}
interface Group {
  id: number;
  title: string;
}


const QuizsComponent: React.FC = () => {
  const classes = useQuizStyles();

  const [isQuizModalVisible, setIsQuizModalVisible] = useState(false);
  const [isGroupModalVisible, setIsGroupModalVisible] = useState(false);
  const [isManageGroupModalVisible, setIsManageGroupModalVisible] = useState(false);
  const [isAssignQuizModalVisible, setIsAssignQuizModalVisible] = useState(false);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [quizTitle, setQuizTitle] = useState('');
  const [editingQuizId, setEditingQuizId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [activeKey, setActiveKey] = useState<string | string[]>([]);
  const [questionsByQuiz, setQuestionsByQuiz] = useState<Record<number, Question[]>>({});
  const [optionsByQuestion, setOptionsByQuestion] = useState<Record<number, Option[]>>({});
  const [loadingQuestions, setLoadingQuestions] = useState<Record<number, boolean>>({});
  const [loadingOptions, setLoadingOptions] = useState<Record<number, boolean>>({});
  const [openQuestionForms, setOpenQuestionForms] = useState<Record<number, boolean>>({});
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);
  const [editingOptionId, setEditingOptionId] = useState<number | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<number | null>(null);


  const [form] = Form.useForm();
  const [groupForm] = Form.useForm();
  const [assignQuizForm] = Form.useForm();

  const token = localStorage.getItem('token');

  const getQuizzes = useCallback(async () => {
    try {
      const response = await axios.get('https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/Quiz/GetAllQuiz', {
        headers: {
          'accept': 'application/json',
          'api-key': token || '',
        },
      });
      setQuizzes(response.data.data);
    } catch (error) {
      console.error('Failed to fetch quizzes:', error);
    }
  }, [token]);
  const getUsers = useCallback(async () => {
    try {
      const response = await axios.get('https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/Quiz/GetAllUserByUserId', {
        headers: {
          'accept': 'application/json',
          'api-key': token || '',
        },
      });
      console.log(response.data);

      setUsers(response.data.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  }, [token]);

  const getGroups = useCallback(async () => {
    try {
      const response = await axios.get('https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/Quiz/GetAllGroupByUserId', {
        headers: {
          'accept': 'application/json',
          'api-key': token || '',
        },
      });
      setGroups(response.data.data);
    } catch (error) {
      console.error('Failed to fetch groups:', error);
    }
  }, [token]);
  useEffect(() => {
    getQuizzes();
    getUsers();
    getGroups();
  }, [getQuizzes, getUsers, getGroups]);


  const handleOk = async () => {
    try {
      const response = await axios.post(
        'https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/Quiz/CreateQuiz',
        { title: quizTitle },
        {
          headers: {
            'accept': 'application/json',
            'api-key': token || '',
          },
        }
      );
      console.log(response.data);

      getQuizzes();
      handleCancel();
    } catch (error) {
      console.error('Failed to create quiz:', error);
    }
  };

  const handleCancel = () => {
    setIsQuizModalVisible(false);
    setIsGroupModalVisible(false);
    if(!isAssignQuizModalVisible){
      setIsManageGroupModalVisible(false);
    }
    setIsAssignQuizModalVisible(false);
   
    setQuizTitle('');
  };

  const handleEditClick = (event: React.MouseEvent, id: number, title: string) => {
    event.stopPropagation();
    setEditingQuizId(id);
    setEditTitle(title);
  };

  const handleSaveClick = async (event: React.MouseEvent, id: number) => {
    event.stopPropagation();
    try {
      await axios.put(
        `https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/Quiz/UpdateQuizTitle`,
        { id, title: editTitle },
        {
          headers: {
            'accept': 'application/json',
            'api-key': token || '',
          },
        }
      );

      setQuizzes(prevQuizzes =>
        prevQuizzes?.map(quiz =>
          quiz.id === id ? { ...quiz, title: editTitle } : quiz
        )
      );

      setEditingQuizId(null);
      setEditTitle('');
    } catch (error) {
      console.error('Failed to update quiz:', error);
    }
  };

  const handleCancelClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setEditingQuizId(null);
    setEditTitle('');
  };

  const handleDeleteClick = async (event: React.MouseEvent, id: number) => {
    event.stopPropagation();
    try {
      await axios.delete(
        `https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/Quiz/DeleteQuizById/${id}`,
        {
          headers: {
            'accept': 'application/json',
            'api-key': token || '',
          },
        }
      );
      setQuizzes(prevQuizzes => prevQuizzes.filter(quiz => quiz.id !== id));
    } catch (error) {
      console.error('Failed to delete quiz:', error);
    }
  };

  const getQuestionsByQuizId = async (quizId: number) => {
    setLoadingQuestions(prev => ({ ...prev, [quizId]: true }));
    try {
      const response = await axios.get(`https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/Quiz/GetAllQuestionByQuizId/${quizId}`, {
        headers: {
          'accept': 'application/json',
          'api-key': token || '',
        },
      });
      setQuestionsByQuiz(prev => ({ ...prev, [quizId]: response.data.data }));
    } catch (error) {
      console.error('Failed to fetch questions:', error);
    } finally {
      setLoadingQuestions(prev => ({ ...prev, [quizId]: false }));
    }
  };

  const getOptionsByQuestionId = async (questionId: number) => {
    setLoadingOptions(prev => ({ ...prev, [questionId]: true }));
    try {
      const response = await axios.get(`https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/Quiz/GetAllAnswerByQuestionId/${questionId}`, {
        headers: {
          'accept': 'application/json',
          'api-key': token || '',
        },
      });
      setOptionsByQuestion(prev => ({ ...prev, [questionId]: response.data.data }));
    } catch (error) {
      console.error('Failed to fetch options:', error);
    } finally {
      setLoadingOptions(prev => ({ ...prev, [questionId]: false }));
    }
  };

  const handlePanelChange = (key: string | string[]) => {
    setActiveKey(key);
    if (typeof key === 'string') {
      getQuestionsByQuizId(Number(key));
    } else if (Array.isArray(key)) {
      key.forEach(k => getQuestionsByQuizId(Number(k)));
    }
  };

  const handleQuestionPanelChange = (questionId: number) => {
    getOptionsByQuestionId(questionId);
  };

  const handleAddQuestion = async (quizId: number) => {
    try {
      const values = await form.validateFields();
      const options = [
        { isTrue: values.correctOption === 1, content: values.option1 },
        { isTrue: values.correctOption === 2, content: values.option2 },
        { isTrue: values.correctOption === 3, content: values.option3 },
        { isTrue: values.correctOption === 4, content: values.option4 },
      ];

      await axios.post(
        'https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/Quiz/CreateQuizQuestionAndAnswers',

        {
          quizId: quizId,
          content: values.questionTitle,
          createQuizQuestionAndAnswerDtos: options
        },
        {
          headers: {
            'accept': 'application/json',
            'api-key': token || '',
          },
        }
      );

      message.success('Question added successfully');
      form.resetFields();
      setOpenQuestionForms(prev => ({ ...prev, [quizId]: false }));
      getQuestionsByQuizId(quizId);
    } catch (error) {
      console.error('Failed to add question:', error);
      message.error('Failed to add question');
    }
  };

  const handleEditQuestion = async (questionId: number, quizId: number) => {
    try {
      const values = await form.validateFields();
      const options = [
        { isTrue: values.correctOption === 1, content: values.option1 },
        { isTrue: values.correctOption === 2, content: values.option2 },
        { isTrue: values.correctOption === 3, content: values.option3 },
        { isTrue: values.correctOption === 4, content: values.option4 },
      ];

      await axios.put(
        'https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/Quiz/UpdateQuizQuestion',
        {
          id: questionId,
          content: values.questionTitle,
          updateQuizQuestionAnswerDtos: options
        },
        {
          headers: {
            'accept': 'application/json',
            'api-key': token || '',
          },
        }
      );

      message.success('Question updated successfully');
      form.resetFields();
      setEditingQuestionId(null);
      getQuestionsByQuizId(quizId);
    } catch (error) {
      console.error('Failed to update question:', error);
      message.error('Failed to update question');
    }
  };

  const handleDeleteQuestion = async (questionId: number, quizId: number) => {
    try {
      await axios.delete(
        `https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/Quiz/DeleteQuizQuestionById/${questionId}`,
        {
          headers: {
            'accept': 'application/json',
            'api-key': token || '',
          },
        }
      );
      message.success('Question deleted successfully');
      getQuestionsByQuizId(quizId);
    } catch (error) {
      console.error('Failed to delete question:', error);
      message.error('Failed to delete question');
    }
  };

  const handleEditOption = async (optionId: number, questionId: number, quizId: number) => {
    try {
      const values = await form.validateFields();
      await axios.put(
        'https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/Quiz/UpdateQuizQuestionAnswer',
        {
          id: optionId,
          questionId: questionId,
          content: values.optionContent,
          isTrue: values.isCorrect
        },

        {
          headers: {
            'accept': 'application/json',
            'api-key': token || '',
          },
        }
      );
      message.success('Option updated successfully');
      form.resetFields();
      setEditingOptionId(null);
      getOptionsByQuestionId(questionId);
      getQuestionsByQuizId(quizId);
    } catch (error) {
      console.error('Failed to update option:', error);
      message.error('Failed to update option');
    }
  };
  const handleCreateGroup = async (values: any) => {
    try {
      await axios.post(
        'https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/Quiz/CreateQuizGroup',
        {
          title: values.groupTitle,
          createdByUserId: 0, // You might want to get this from the current user's context
          quizGroupMemberIds: values.members
        },
        {
          headers: {
            'accept': 'application/json',
            'api-key': token || '',
          },
        }
      );
      message.success('Group created successfully');
      getGroups();
      handleCancel();
    } catch (error) {
      console.error('Failed to create group:', error);
      message.error('Failed to create group');
    }
  };

  const handleDeleteGroup = async (groupId: number) => {
    try {
      await axios.delete(
        `https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/Quiz/DeleteGroupById/${groupId}`,
        {
          headers: {
            'accept': 'application/json',
            'api-key': token || '',
          },
        }
      );
      message.success('Group deleted successfully');
      getGroups();
    } catch (error) {
      console.error('Failed to delete group:', error);
      message.error('Failed to delete group');
    }
  };

  const handleAssignQuiz = async (values: any) => {
    try {
      await axios.post(
        'https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/Quiz/GenerateQuiz',
        {
          id: selectedQuiz,
          userId: localStorage.getItem("inspectorId"),
          duration: values.duration,
          isImportant: values.isImportant,
          questionCount: values.questionCount,
          isRejoinable: values.isRejoinable
        },
        {
          headers: {
            'accept': 'application/json',
            'api-key': token || '',
          },
        }
      );

      await axios.post(
        'https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/Quiz/CreateAssignGeneratedQuizToGroup',
        {
          quizId: selectedQuiz,
          userId: 0,
          groupId: selectedGroup
        },
        {
          headers: {
            'accept': 'application/json',
            'api-key': token || '',
          },
        }
      );

      message.success('Quiz assigned to group successfully');
      handleCancel();
    } catch (error) {
      console.error('Failed to assign quiz to group:', error);
      message.error('Failed to assign quiz to group');
    }
  };

  return (
    <div className={classes.quizContainer}>
      <div className={classes.mainBtns}>
        <Button className={classes.btn} onClick={() => setIsQuizModalVisible(true)}>Quiz Yarat</Button>
        <Button className={classes.btn} onClick={() => setIsGroupModalVisible(true)}>Quiz qrupu yarat</Button>
        <Button className={classes.btn} onClick={() => setIsManageGroupModalVisible(true)}>Mövcud qrupları idarə et</Button>
      </div>

      <Collapse activeKey={activeKey} onChange={handlePanelChange} className={classes.collapse}>
        {quizzes?.map((quiz: Quiz) => (
          <Panel
            key={quiz.id.toString()}
            header={
              <div className={classes.quizHeader} onClick={(e) => e.stopPropagation()}>
                {editingQuizId === quiz.id ? (
                  <>
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className={classes.quizTitle}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Button
                      icon={<SaveOutlined />}
                      onClick={(e) => handleSaveClick(e, quiz.id)}
                      className={`${classes.btn} ${classes.actionBtn}`}
                    >
                      Save
                    </Button>
                    <Button
                      icon={<CloseOutlined />}
                      onClick={handleCancelClick}
                      className={`${classes.btn} ${classes.actionBtn}`}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <span className={classes.quizTitle}>{quiz.title}</span>
                    <Button
                      icon={<EditOutlined />}
                      onClick={(e) => handleEditClick(e, quiz.id, quiz.title)}
                      className={`${classes.btn} ${classes.actionBtn}`}
                    >
                      Edit
                    </Button>
                    <Button
                      icon={<DeleteOutlined />}
                      onClick={(e) => handleDeleteClick(e, quiz.id)}
                      className={`${classes.btn} ${classes.actionBtn}`}
                    >
                      Delete
                    </Button>
                  </>
                )}
              </div>
            }
          >
            <Button
              icon={<PlusOutlined />}
              onClick={() => setOpenQuestionForms(prev => ({ ...prev, [quiz.id]: true }))}
              className={`${classes.btn} ${classes.addQuestionBtn}`}
            >
              Add Question
            </Button>

            {openQuestionForms[quiz.id] && (
              <div className={classes.questionForm}>
                <Form form={form} layout="vertical" onFinish={() => handleAddQuestion(quiz.id)}>
                  <Form.Item
                    name="questionTitle"
                    label="Question"
                    rules={[{ required: true, message: 'Please enter the question' }]}
                  >
                    <Input placeholder="Enter the question..." />
                  </Form.Item>

                  <Form.Item
                    name="correctOption"
                    label="Correct Answer"
                    rules={[{ required: true, message: 'Please select the correct answer' }]}
                  >
                    <Radio.Group>
                      {[1, 2, 3, 4].map((value) => (
                        <Radio value={value} key={value}>
                          <Form.Item
                            name={`option${value}`}
                            rules={[{ required: true, message: `Please enter option ${value}` }]}
                          >
                            <Input placeholder={`Option ${value}`} />
                          </Form.Item>
                        </Radio>
                      ))}
                    </Radio.Group>
                  </Form.Item>
                  <Button onClick={() => setOpenQuestionForms(prev => ({ ...prev, [quiz.id]: false }))} style={{ marginRight: '10px' }}>
                    Cancel
                  </Button>
                  <Button type="primary" htmlType="submit">
                    Save
                  </Button>
                </Form>
              </div>
            )}

            <div className={classes.questionList}>
              {loadingQuestions[quiz.id] ? (
                <Spin />
              ) : (
                <Collapse onChange={(key) => handleQuestionPanelChange(Number(key))}>
                  {questionsByQuiz[quiz.id]?.map((question: Question) => (
                    <Panel
                      key={question.id.toString()}
                      header={
                        <div className={classes.quizHeader} onClick={(e) => e.stopPropagation()}>
                          {editingQuestionId === question.id ? (
                            <Form form={form} layout="vertical" onFinish={() => handleEditQuestion(question.id, quiz.id)}>
                              <Form.Item
                                name="questionTitle"
                                style={{ flex: 1, marginBottom: 0 }}
                                rules={[{ required: true, message: 'Please enter the question' }]}
                              >
                                <Input />
                              </Form.Item>
                              <Button
                                icon={<SaveOutlined />}
                                onClick={() => form.submit()}
                                className={`${classes.btn} ${classes.actionBtn}`}
                              >
                                Save
                              </Button>
                              <Button
                                icon={<CloseOutlined />}
                                onClick={() => setEditingQuestionId(null)}
                                className={`${classes.btn} ${classes.actionBtn}`}
                              >
                                Cancel
                              </Button>
                            </Form>
                          ) : (
                            <>
                              <span className={classes.quizTitle}>{question.content}</span>
                              <Button
                                icon={<EditOutlined />}
                                onClick={() => setEditingQuestionId(question.id)}
                                className={`${classes.btn} ${classes.actionBtn}`}
                              >
                                Edit
                              </Button>
                              <Button
                                icon={<DeleteOutlined />}
                                onClick={() => handleDeleteQuestion(question.id, quiz.id)}
                                className={`${classes.btn} ${classes.actionBtn}`}
                              >
                                Delete
                              </Button>
                            </>
                          )}
                        </div>
                      }
                    >
                      {loadingOptions[question.id] ? (
                        <Spin />
                      ) : (
                        <div>
                          {optionsByQuestion[question.id]?.map((option: Option) => (
                            <div key={option.id} className={classes.optionItem}>
                              {editingOptionId === option.id ? (
                                <Form form={form} layout="inline" onFinish={() => handleEditOption(option.id, question.id, quiz.id)}>
                                  <Form.Item
                                    name="optionContent"
                                    style={{ flex: 1, marginBottom: 0 }}
                                    rules={[{ required: true, message: 'Please enter the option' }]}
                                  >
                                    <Input />
                                  </Form.Item>
                                  <Form.Item name="isCorrect" valuePropName="checked">
                                    <Radio>Correct</Radio>
                                  </Form.Item>
                                  <Button
                                    icon={<SaveOutlined />}
                                    onClick={() => form.submit()}
                                    className={`${classes.btn} ${classes.actionBtn}`}
                                  >
                                    Save
                                  </Button>
                                  <Button
                                    icon={<CloseOutlined />}
                                    onClick={() => setEditingOptionId(null)}
                                    className={`${classes.btn} ${classes.actionBtn}`}
                                  >
                                    Cancel
                                  </Button>
                                </Form>
                              ) : (
                                <>
                                  <span className={classes.optionContent}>{option.content}</span>
                                  <Radio checked={option.isTrue} disabled>Correct</Radio>
                                  <Button
                                    icon={<EditOutlined />}
                                    onClick={() => setEditingOptionId(option.id)}
                                    className={`${classes.btn} ${classes.actionBtn}`}
                                  >
                                    Edit
                                  </Button>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </Panel>
                  ))}
                </Collapse>
              )}
            </div>
          </Panel>
        ))}
      </Collapse>

      <Modal
        title="Quiz Yarat"
        visible={isQuizModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        className={classes.modal}
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
        onOk={() => groupForm.submit()}
        onCancel={handleCancel}
        className={classes.modal}
      >
        <Form form={groupForm} layout="vertical" onFinish={handleCreateGroup}>
          <Form.Item
            name="groupTitle"
            label="Qrup başlığı"
            rules={[{ required: true, message: 'Zəhmət olmasa, qrup başlığını daxil edin' }]}
          >
            <Input placeholder="Qrup başlığı..." />
          </Form.Item>
          <Form.Item
            name="members"
            label="Üzvlər"
            rules={[{ required: true, message: 'Zəhmət olmasa, ən azı bir üzv seçin' }]}
          >
            <Select mode="multiple" placeholder="Üzvləri seçin">
              {users.map(user => (
                <Option key={user.id.toString()} value={user.name + " " + user.surname}>
                  {user.name + " " + user.surname}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Mövcud qrupları idarə et"
        visible={isManageGroupModalVisible}
        onOk={handleCancel}
        onCancel={handleCancel}
        className={classes.modal}
        width={800}
      >
        <Table
          dataSource={groups}
          columns={[
            {
              title: 'Qrup adı',
              dataIndex: 'title',
              key: 'title',
            },
            {
              title: 'Əməliyyatlar',
              key: 'actions',
              render: (_, record: Group) => (
                <>
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => {/* Handle edit */ }}
                    className={`${classes.btn} ${classes.actionBtn}`}
                  >
                    Redaktə et
                  </Button>
                  <Button
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteGroup(record.id)}
                    className={`${classes.btn} ${classes.actionBtn}`}
                  >
                    Sil
                  </Button>
                  <Button
                    icon={<UserOutlined />}
                    onClick={() => {
                      setSelectedGroup(record.id);
                      setIsAssignQuizModalVisible(true);
                    }}
                    className={`${classes.btn} ${classes.actionBtn}`}
                  >
                    Quiz təyin et
                  </Button>
                </>
              ),
            },
          ]}
        />
      </Modal>

      <Modal
        title="Quiz təyin et"
        visible={isAssignQuizModalVisible}
        onOk={() => assignQuizForm.submit()}
        onCancel={handleCancel}
        className={classes.modal}
      >
        <Form form={assignQuizForm} layout="vertical" onFinish={handleAssignQuiz}>
          <Form.Item
            name="quizId"
            label="Quiz"
            rules={[{ required: true, message: 'Zəhmət olmasa, bir quiz seçin' }]}
          ><Select placeholder="Quiz seçin" onChange={(value) => setSelectedQuiz(value)}>
              {quizzes.map(quiz => (
                <Option key={quiz.id.toString()} value={quiz.id.toString()}>{quiz.title}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="duration"
            label="Müddət (dəqiqə)"
            rules={[{ required: true, message: 'Zəhmət olmasa, müddəti daxil edin' }]}
          >
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item
            name="questionCount"
            label="Sual sayı"
            rules={[{ required: true, message: 'Zəhmət olmasa, sual sayını daxil edin' }]}
          >
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item
            name="isImportant"
            label="Vacibdir"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name="isRejoinable"
            label="Yenidən qoşulmaq mümkündür"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default QuizsComponent;
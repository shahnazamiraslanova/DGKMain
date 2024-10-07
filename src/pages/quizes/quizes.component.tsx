import React, { useEffect, useState, useCallback } from "react";
import {  EyeOutlined } from '@ant-design/icons';

import {
  Modal,
  Button,
  Input,
  Form,
  Radio,
  Collapse,
  Spin,
  message,
  InputNumber,
  Select,
  Table,
  Switch,
  Checkbox,
} from "antd";
import axios from "axios";
import {
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  DeleteOutlined,
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Option } from "antd/es/mentions";
import { useQuizStyles } from "./quizes.style";
import {
  IGroup,
  IOption,
  IQuestion,
  IQuiz,
  ISelectedUser,
  IUser,
} from "./quizes";

const QuizsComponent: React.FC = () => {
  const classes = useQuizStyles();
  const { Panel } = Collapse;
  const { confirm } = Modal;
  const [quizForm] = Form.useForm();
  const [questionForm] = Form.useForm();
  const [groupForm] = Form.useForm();
  const [assignQuizForm] = Form.useForm();
  const token = localStorage.getItem("token");

  // States

  const [isQuizModalVisible, setIsQuizModalVisible] = useState(false);
  const [isGroupModalVisible, setIsGroupModalVisible] = useState(false);
  const [isManageGroupModalVisible, setIsManageGroupModalVisible] =
    useState(false);
  const [isSeeResultsModalVisible, setIsSeeResultsModalVisible] =
    useState(false);
    const [isSeeResultsModalVisible2, setIsSeeResultsModalVisible2] =
    useState(false);
  const [isAssignQuizModalVisible, setIsAssignQuizModalVisible] =
    useState(false);
  const [isEditGroupModalVisible, setIsEditGroupModalVisible] = useState(false);
  const [quizzes, setQuizzes] = useState<IQuiz[]>([]);
  const [quizTitle, setQuizTitle] = useState("");
  const [editingQuizId, setEditingQuizId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [activeKey, setActiveKey] = useState<string | string[]>([]);
  const [questionsByQuiz, setQuestionsByQuiz] = useState<
    Record<number, IQuestion[]>
  >({});
  const [optionsByQuestion, setOptionsByQuestion] = useState<
    Record<number, IOption[]>
  >({});
  const [loadingQuestions, setLoadingQuestions] = useState<
    Record<number, boolean>
  >({});
  const [loadingOptions, setLoadingOptions] = useState<Record<number, boolean>>(
    {}
  );
  const [openQuestionForms, setOpenQuestionForms] = useState<
    Record<number, boolean>
  >({});
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(
    null
  );
  const [editingOptionId, setEditingOptionId] = useState<number | null>(null);
  const [users, setUsers] = useState<IUser[]>([]);
  const [groups, setGroups] = useState<IGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<number | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<ISelectedUser[]>([]);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [isAddUserModalVisible, setIsAddUserModalVisible] = useState(false);
  const [isManageUsersModalVisible, setIsManageUsersModalVisible] =
    useState(false);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [removedUsers, setRemovedUsers] = useState<number[]>([]);
  const [selectedGroupMembers, setSelectedGroupMembers] = useState([]);
  const [groupMembersToRemove, setGroupMemberstoRemove] = useState<any>([]);
  const [genaratedQuizes, setGenaratedQuizes] = useState([]);
  const [quizResults, setQuizResults] = useState([]);

  // GET REQUESTS






  
  const fetchQuizResults = async (quizId: number) => {
    try {
      const response = await axios.get(
        `https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/Quiz/GetAllUserResultByGeneratedQuizId/${quizId}`,
        {
          headers: {
            accept: "application/json",
            "api-key": token || "",
          },
        }
      );
      setQuizResults(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch quiz results:", error);
      message.error("Nəticələri əldə etmək mümkün olmadı");
    }
  };
  const getQuizzes = useCallback(async () => {
    try {
      const response = await axios.get(
        "https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/Quiz/GetAllQuiz",
        {
          headers: {
            accept: "application/json",
            "api-key": token || "",
          },
        }
      );
      setQuizzes(response.data.data);
    } catch (error) {
      console.error("Failed to fetch quizzes:", error);
    }
  }, [token]);

  const fetchUsersByName = async (userFullName: string) => {
    try {
      const response = await axios.get(
        `https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/Quiz/GetAllUserByUserId/${userFullName}`,
        {
          headers: {
            accept: "application/json",
            "api-key": token,
          },
        }
      );
 

      setUsers(response.data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const getGroups = useCallback(async () => {
    try {
      const response = await axios.get(
        "https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/Quiz/GetAllGroupByUserId",
        {
          headers: {
            accept: "application/json",
            "api-key": token || "",
          },
        }
      );
      setGroups(response.data.data);
    } catch (error) {
      console.error("Failed to fetch groups:", error);
    }
  }, [token]);

  useEffect(() => {
    getQuizzes();
    getGroups();
  }, [getQuizzes, getGroups, newTitle]);

  const getQuestionsByQuizId = async (quizId: number) => {
    setLoadingQuestions((prev) => ({ ...prev, [quizId]: true }));
    try {
      const response = await axios.get(
        `https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/Quiz/GetAllQuestionByQuizId/${quizId}`,
        {
          headers: {
            accept: "application/json",
            "api-key": token || "",
          },
        }
      );
      setQuestionsByQuiz((prev) => ({ ...prev, [quizId]: response.data.data }));
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    } finally {
      setLoadingQuestions((prev) => ({ ...prev, [quizId]: false }));
    }
  };

  const getOptionsByQuestionId = async (questionId: number) => {
    setLoadingOptions((prev) => ({ ...prev, [questionId]: true }));
    try {
      const response = await axios.get(
        `https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/Quiz/GetAllAnswerByQuestionId/${questionId}`,
        {
          headers: {
            accept: "application/json",
            "api-key": token || "",
          },
        }
      );
      setOptionsByQuestion((prev) => ({
        ...prev,
        [questionId]: response.data.data,
      }));
    } catch (error) {
      console.error("Failed to fetch options:", error);
    } finally {
      setLoadingOptions((prev) => ({ ...prev, [questionId]: false }));
    }
  };
  const getMembers = async (groupId: any) => {
    try {
      const response = await axios.get(
        `https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/Quiz/GetAllGroupMemberById/${groupId}`,
        {
          headers: {
            accept: "application/json",
            "api-key": token || "",
          },
        }
      );
      setSelectedGroupMembers(response.data.data);
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    }
  };
  const getAllgeneratedQuizesByGroupId = async (groupId: any) => {
    try {
      const response = await axios.get(
        `https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/Quiz/GetAllGeneratedQuizByGroupId/${groupId}`,
        {
          headers: {
            accept: "application/json",
            "api-key": token || "",
          },
        }
      );

      setGenaratedQuizes(response.data.data);
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    }
  };

  // POST REQUESTS

  const handleOk = async () => {
    try {
      const values = await quizForm.validateFields();

      if (!values.quizTitle || values.quizTitle.trim() === "") {
        console.error("Quiz title cannot be empty");
        return;
      }

      const response = await axios.post(
        "https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/Quiz/CreateQuiz",
        { title: values.quizTitle },
        {
          headers: {
            accept: "application/json",
            "api-key": token || "",
          },
        }
      );

      setQuizzes((prevQuizzes) => [response.data.data, ...prevQuizzes]);
      handleCancel();
      questionForm.resetFields();
    } catch (error) {
      console.error("Failed to create quiz:", error);
    }
  };

  const handleAddQuestion = async (quizId: number) => {
    try {
      const values = await questionForm.validateFields();
      const options = [1, 2, 3, 4].map((value) => ({
        isTrue: values.correctOption === value,
        content: values[`option${value}`],
      }));

      const response = await axios.post(
        "https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/Quiz/CreateQuizQuestionAndAnswers",
        {
          quizId: quizId,
          content: values.questionTitle,
          createQuizQuestionAndAnswerDtos: options,
        },
        {
          headers: {
            accept: "application/json",
            "api-key": token || "",
          },
        }
      );

      await getQuestionsByQuizId(quizId);
      message.success("Sual əlavə olundu");
      questionForm.resetFields();
      setOpenQuestionForms((prev) => ({ ...prev, [quizId]: false }));
    } catch (error) {
      console.error("Error adding question:", error);
      message.error("Sual əlavə oluna bilmədi");
    }
  };

  const handleAssignQuiz = async (values: any) => {
    try {
      await axios.post(
        "https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/Quiz/GenerateQuiz",
        {
          id: selectedQuiz,
          // userId: localStorage.getItem("inspectorId"),
          groupId: selectedGroup,
          duration: values.duration,
          isImportant: values.isImportant,
          questionCount: values.questionCount,
          isRejoinable: values.isRejoinable,
        },
        {
          headers: {
            accept: "application/json",
            "api-key": token || "",
          },
        }
      );

      message.success("Quiz qrupa təyin olundu");
      handleCancel();
      assignQuizForm.resetFields();
    } catch (error) {
      message.error("Quiz qrupa təyin oluna bilmədi");
    }
  };

  const proceedWithGroupCreation = async (values: any) => {
    try {
      const userIds = selectedUsers.map((user) => user?.id);

      const response = await axios.post(
        "https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/Quiz/CreateQuizGroup",
        {
          title: values.groupTitle,
          createdByUserId: localStorage.getItem("inspectorId"),
          quizGroupMemberIds: [...userIds],
        },
        {
          headers: {
            accept: "application/json",
            "api-key": token || "",
          },
        }
      );

      setGroups((prevGroups) => [response.data.data, ...prevGroups]);
      message.success("Qrup yaradıldı");
      handleCancel();
      groupForm.resetFields();
      setUsers([]);
    } catch (error) {
      message.error("Qrup yaradıla bilmədi");
    }
  };

  // PUT REQUESTS
  const handleSaveClick = async (event: React.MouseEvent, id: number) => {
    event.stopPropagation();
    try {
      await axios.put(
        `https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/Quiz/UpdateQuizTitle`,
        { id, title: editTitle },
        {
          headers: {
            accept: "application/json",
            "api-key": token || "",
          },
        }
      );

      setQuizzes((prevQuizzes) =>
        prevQuizzes?.map((quiz) =>
          quiz.id === id ? { ...quiz, title: editTitle } : quiz
        )
      );

      setEditingQuizId(null);
      setEditTitle("");
    } catch (error) {
      console.error("Failed to update quiz:", error);
    }
  };



  const handleEditQuizGroupTitle = async ( id: number | null) => {
   
    
    
    try {
      await axios.put(
        `https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/Quiz/UpdateQuizGroupTitle`,
        { id, title: newTitle },
        {
          headers: {
            accept: "application/json",
            "api-key": token || "",
          },
        }
      );

     
     
    } catch (error) {
      console.error("Failed to update quiz:", error);
    }
  };


  const handleEditQuestion = async (questionId: number, quizId: number) => {
    try {
      const values = await questionForm.validateFields();
      
      const options = [
        { isTrue: values.correctOption === 1, content: values.option1 },
        { isTrue: values.correctOption === 2, content: values.option2 },
        { isTrue: values.correctOption === 3, content: values.option3 },
        { isTrue: values.correctOption === 4, content: values.option4 },
      ];
  
      // Make the API request to update the question
      const response = await axios.put(
        "https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/Quiz/UpdateQuizQuestion",
        {
          id: questionId,
          content: values.questionTitle,
          updateQuizQuestionAnswerDtos: options,
        },
        {
          headers: {
            Accept: "application/json",
            "api-key": token || "",  
          },
        }
      );
  
      if (response.data && response.data.data) {
        setQuestionsByQuiz((prev) => ({
          ...prev,
          [quizId]: prev[quizId].map((q) =>
            q.id === questionId ? { ...q, ...response.data.data } : q
          ),
        }));
  
        message.success("Sual redaktə olundu");
        setEditingQuestionId(null); 
      } else {
        throw new Error("No data returned from the server");
      }
    } catch (error) {
      console.error("Error editing question:", error);  
      message.error("Sual redaktə oluna bilmədi");
    }
  };
  

  const handleEditOption = async (
    optionId: number,
    questionId: number,
    quizId: number
  ) => {
    try {
      const values = await questionForm.validateFields();

      const response = await axios.put(
        "https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/Quiz/UpdateQuizQuestionAnswer",
        {
          id: optionId,
          questionId: questionId,
          content: values.optionContent,
          isTrue: values.isCorrect,
        },
        {
          headers: {
            accept: "application/json",
            "api-key": token || "",
          },
        }
      );

      const updatedOption = response.data.data;

      setOptionsByQuestion((prev) => ({
        ...prev,
        [questionId]: prev[questionId].map((o) =>
          o.id === optionId
            ? {
                ...o,
                content: updatedOption.content,
                isTrue: updatedOption.isTrue,
              }
            : { ...o, isTrue: values.isCorrect ? false : o.isTrue }
        ),
      }));

      message.success("Seçim redaktə olundu");
      setEditingOptionId(null);

      // Refresh the questions for this quiz
      await getQuestionsByQuizId(quizId);
    } catch (error) {
      console.error("Error editing option:", error);
      message.error("Seçim redaktə oluna bilmədi");
    }
  };

  // DELETE REQUESTS
  const handleDeleteClick = async (event: React.MouseEvent, id: number) => {
    event.stopPropagation();
    try {
      await axios.delete(
        `https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/Quiz/DeleteQuizById/${id}`,
        {
          headers: {
            accept: "application/json",
            "api-key": token || "",
          },
        }
      );
      setQuizzes((prevQuizzes) => prevQuizzes.filter((quiz) => quiz.id !== id));
    } catch (error) {
      console.error("Failed to delete quiz:", error);
    }
  };

  const handleDeleteQuestion = async (questionId: number, quizId: number) => {
    try {
      await axios.delete(
        `https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/Quiz/DeleteQuizQuestionById/${questionId}`,
        {
          headers: {
            accept: "application/json",
            "api-key": token || "",
          },
        }
      );
      setQuestionsByQuiz((prev) => ({
        ...prev,
        [quizId]: prev[quizId].filter((q) => q.id !== questionId),
      }));
      message.success("Sual silindi");
    } catch (error) {
      message.error("Sual silinə bilmədi");
    }
  };

  const handleDeleteGroup = async (groupId: number) => {
    try {
      await axios.delete(
        `https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/Quiz/DeleteGroupById/${groupId}`,
        {
          headers: {
            accept: "application/json",
            "api-key": token || "",
          },
        }
      );
      setGroups((prevGroups) =>
        prevGroups.filter((group) => group.id !== groupId)
      );
      message.success("Qrup silindi");
    } catch (error) {
      message.error("Qrup silinə bilmədi");
    }
  };

  const handleRemoveUser = async (groupId: any) => {

    console.log(groupId, groupMembersToRemove);
    
    try {
      await axios.delete(
        `https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/Quiz/DeleteQuizGroupMember`,
        {
          data: {
            // userId:localStorage.getItem('inspectorId'),
            groupId: groupId,
            quizGroupMemberIds: groupMembersToRemove,
          },
          headers: {
            accept: "application/json",
            "api-key": token || "",
          },
        }
      );
      setGroupMemberstoRemove([]);

      // Assuming 'id' refers to the quiz group member ID you want to remove from the state
    } catch (error) {
      console.error("Failed to delete quiz:", error);
    }
  };

  const deleteGenaratedQuiz = async (quizId: any) => {
    try {
      await axios.delete(
        `https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/Quiz/DeleteGeneratedQuizById/${quizId}`,
        {
          headers: {
            accept: "application/json",
            "api-key": token || "",
          },
        }
      );
      const updatedQuizes = genaratedQuizes.filter(
        (quiz: any) => quiz.id !== quizId
      );
      setGenaratedQuizes(updatedQuizes);
      message.success("Sual silindi");
    } catch (error) {
      message.error("Sual silinə bilmədi");
    }
  };

  //HELPER FUNCTIONS



  function findCommonElements(arr1:any, arr2:any) {
    const set1 = new Set(arr1); 
    const commonElements = arr2.filter((item:any) => set1.has(item)); 
  
    return commonElements;
  }
  

  





  const handlePanelChange = (key: string | string[]) => {
    setActiveKey(key);
    if (typeof key === "string") {
      getQuestionsByQuizId(Number(key));
    } else if (Array.isArray(key)) {
      key.forEach((k) => getQuestionsByQuizId(Number(k)));
    }
  };

  const handleQuestionPanelChange = (questionId: number) => {
    getOptionsByQuestionId(questionId);
  };


  

  const handleCancel = () => {
    setIsQuizModalVisible(false);
    setIsGroupModalVisible(false);
    if (!isAssignQuizModalVisible) {
      setIsManageGroupModalVisible(false);
    }
    setIsAssignQuizModalVisible(false);
    setQuizTitle("");
    quizForm.resetFields();
    questionForm.resetFields();
    groupForm.resetFields();
    assignQuizForm.resetFields();
  };

  const handleEditClick = (
    event: React.MouseEvent,
    id: number,
    title: string
  ) => {
    event.stopPropagation();
    setEditingQuizId(id);
    setEditTitle(title);
  };

  const handleCancelClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setEditingQuizId(null);
    setEditTitle("");
  };

  const showConfirmDialog = (content: any, ourFunction:()=>void) => {
    
    
    confirm({
      // title: "Bu adı daşıyan qrup artıq var",
      content: content,
      okText: "Bəli",
      cancelText: "Xeyr",
      onOk() {
        // proceedWithGroupCreation(values);
        ourFunction();
      },
    });
  };

  const handleCreateGroup = async (values: any) => {
    const isThisNameExist = groups.some(
      (item) => item.title === values.groupTitle
    );

    if (isThisNameExist) {
      showConfirmDialog("Bu adda qrup artıq var,yenə də yaratmaq istəyirsiniz?", ()=> proceedWithGroupCreation(values));
    } else {
      proceedWithGroupCreation(values);
    }
  };

  const handleSelectUsers = (selectedIds: string[]) => {
    const selectedUserObjects = selectedIds
      .map((id: string) => users.find((user) => user.id.toString() === id))
      .filter((user): user is IUser => user !== undefined);

    setSelectedUsers(selectedUserObjects);
  };

  const handleSearch = (value: string) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    const newTimeoutId = setTimeout(() => {
      if (value.trim()) {
        fetchUsersByName(value);
      }
    }, 2000);
    setTimeoutId(newTimeoutId);
  };

  const handleAddUser = () => {
    setIsAddUserModalVisible(true);
  };

  const handleManageUsers = () => {
    setIsManageUsersModalVisible(true);
  };
  const handleSaveNewUsers = async (groupId: any) => {
    const quizGroupMemberIds = selectedUsers.map((user: any) => user.id);

    try {
      await axios.put(
        "https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/Quiz/UpdateQuizGroupMember",
        {
          groupId: groupId,
          quizGroupMemberIds: quizGroupMemberIds,
        },
        {
          headers: {
            accept: "application/json",
            "api-key": token || "",
          },
        }
      );
      message.success("New users added successfully");
      setIsAddUserModalVisible(false);
    } catch (error) {
      message.error("Yeni istifadəçilər əlavə oluna bilmədi");
    }
  };





 


  const showResultOfGeneratedQuiz = async (quizId: any) => {
    try {
      const response = await axios.get(`https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/Quiz/GetAllUserResultByGeneratedQuizId/${quizId}`, {
        headers: {
          accept: "application/json",
          "api-key": token || "",
        },
      });
      console.log(response.data);
      
      setQuizResults(response.data); // Use response.data instead of response?.data
    } catch (error) {
      console.error("Error fetching quiz results:", error);
    }
  };
  
  return (
    <div className={classes.quizContainer}>
      <div className={classes.mainBtns}>
        <Button
          className={classes.btn}
          onClick={() => setIsQuizModalVisible(true)}
        >
          Quiz Yarat
        </Button>
        <Button
          className={classes.btn}
          onClick={() => setIsGroupModalVisible(true)}
        >
          Quiz qrupu yarat
        </Button>
        <Button
          className={classes.btn}
          onClick={() => setIsManageGroupModalVisible(true)}
        >
          Mövcud qrupları idarə et
        </Button>
        
     
      </div>

      <Collapse
        activeKey={activeKey}
        onChange={handlePanelChange}
        className={classes.collapse}
      >
        {quizzes?.map((quiz: IQuiz) => (
          <Panel
            key={quiz.id}
            header={
              <div
                className={classes.quizHeader}
                onClick={(e) => e.stopPropagation()}
              >
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
                      Saxla
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
                      Redaktə et
                    </Button>
                    <Button
                      icon={<DeleteOutlined />}
                      onClick={(e) => showConfirmDialog("Silmək istədiyinizə əminsiniz?", () => handleDeleteClick(e, quiz.id))}
                      className={`${classes.btn} ${classes.actionBtn}`}
                    >
                      Sil
                    </Button>
                  </>
                )}
              </div>
            }
          >
            <Button
              icon={<PlusOutlined />}
              onClick={() =>
                setOpenQuestionForms((prev) => ({ ...prev, [quiz.id]: true }))
              }
              className={`${classes.btn} ${classes.addQuestionBtn}`}
            >
              Sual əlavə et
            </Button>

            {openQuestionForms[quiz.id] && (
              <div className={classes.questionForm}>
                <Form
                  form={questionForm}
                  layout="vertical"
                  onFinish={() => handleAddQuestion(quiz.id)}
                >
                  <Form.Item
                    name="questionTitle"
                    label="Sual"
                    rules={[{ required: true, message: "Sual əlavə edin" }]}
                  >
                    <Input placeholder="Enter the question..." />
                  </Form.Item>

                  <Form.Item
                    name="correctOption"
                    label="Düzgün cavab"
                    rules={[
                      { required: true, message: "Düzgün variantı seçin" },
                    ]}
                  >
                    <Radio.Group>
                      {[1, 2, 3, 4].map((value) => (
                        <Radio value={value} key={value}>
                          <Form.Item
                            name={`option${value}`}
                            rules={[
                              {
                                required: true,
                                message: `Seçim daxil edin ${value}`,
                              },
                            ]}
                          >
                            <Input placeholder={`Option ${value}`} />
                          </Form.Item>
                        </Radio>
                      ))}
                    </Radio.Group>
                  </Form.Item>
                  <Button
                    onClick={() => {
                      handleCancel(); // Call the function
                      setOpenQuestionForms((prev) => ({
                        ...prev,
                        [quiz.id]: false,
                      }));
                    }}
                    style={{ marginRight: "10px" }}
                  >
                    Ləğv et
                  </Button>

                  <Button type="primary" htmlType="submit">
                    Saxla
                  </Button>
                </Form>
              </div>
            )}

            <div className={classes.questionList}>
              {loadingQuestions[quiz.id] ? (
                <Spin />
              ) : (
                <Collapse
                  onChange={(key) => handleQuestionPanelChange(Number(key))}
                >
                  {questionsByQuiz[quiz.id]?.map((question: IQuestion) => (
                    <Panel
                      key={question.id}
                      header={
                        <div
                          className={classes.quizHeader}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {editingQuestionId === question.id ? (
                            <Form
                              form={questionForm}
                              layout="vertical"
                              onFinish={() =>
                                handleEditQuestion(question.id, quiz.id)
                              }
                            >
                              <Form.Item
                                name="questionTitle"
                                style={{ flex: 1, marginBottom: 0 }}
                                rules={[
                                  {
                                    required: true,
                                    message: "Suall daxil edin",
                                  },
                                ]}
                                initialValue={question.content}
                              >
                                <Input />
                              </Form.Item>
                              <Button
                                icon={<SaveOutlined />}
                                onClick={() => questionForm.submit()}
                                className={`${classes.btn} ${classes.actionBtn}`}
                              >
                                Saxla
                              </Button>
                              <Button
                                icon={<CloseOutlined />}
                                onClick={() => setEditingQuestionId(null)}
                                className={`${classes.btn} ${classes.actionBtn}`}
                              >
                                Ləğv et
                              </Button>
                            </Form>
                          ) : (
                            <>
                              <span className={classes.quizTitle}>
                                {question.content}
                              </span>
                              <Button
                                icon={<EditOutlined />}
                                onClick={() =>
                                  setEditingQuestionId(question.id)
                                }
                                className={`${classes.btn} ${classes.actionBtn}`}
                              >
                                Redaktə et
                              </Button>
                              <Button
                                icon={<DeleteOutlined />}
                                onClick={() =>
                                  showConfirmDialog("Silmək istədiyinizə əminsiniz?", ()=>handleDeleteQuestion(question.id, quiz.id))
                                  
                                }
                                className={`${classes.btn} ${classes.actionBtn}`}
                              >
                                Sil
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
                          {optionsByQuestion[question.id]?.map(
                            (option: IOption) => (
                              <div
                                key={option.id}
                                className={classes.optionItem}
                              >
                                {editingOptionId === option.id ? (
                                  <Form
                                    form={questionForm}
                                    layout="inline"
                                    onFinish={() =>
                                      handleEditOption(
                                        option.id,
                                        question.id,
                                        quiz.id
                                      )
                                    }
                                  >
                                    <Form.Item
                                      name="optionContent"
                                      style={{ flex: 1, marginBottom: 0 }}
                                      rules={[
                                        {
                                          required: true,
                                          message: "Seçim daxil edin",
                                        },
                                      ]}
                                    >
                                      <Input />
                                    </Form.Item>
                                    <Form.Item
                                      name="isCorrect"
                                      valuePropName="checked"
                                    >
                                      <Checkbox>Düzgünlük</Checkbox>
                                    </Form.Item>
                                    <Button
                                      icon={<SaveOutlined />}
                                      onClick={() => questionForm.submit()}
                                      className={`${classes.btn} ${classes.actionBtn}`}
                                    >
                                      Saxla
                                    </Button>
                                    <Button
                                      icon={<CloseOutlined />}
                                      onClick={() => setEditingOptionId(null)}
                                      className={`${classes.btn} ${classes.actionBtn}`}
                                    >
                                      Ləğv et
                                    </Button>
                                  </Form>
                                ) : (
                                  <>
                                    <span className={classes.optionContent}>
                                      {option.content}
                                    </span>
                                    {/* Make sure Radio reflects the updated state */}
                                    <Radio checked={option.isTrue} disabled>
                                      Düzgünlük
                                    </Radio>
                                    <Button
                                      icon={<EditOutlined />}
                                      onClick={() => {
                                        setEditingOptionId(option.id);
                                        // Set form values when entering edit mode
                                        questionForm.setFieldsValue({
                                          optionContent: option.content,
                                          isCorrect: option.isTrue,
                                        });
                                      }}
                                      className={`${classes.btn} ${classes.actionBtn}`}
                                    >
                                      Redaktə et
                                    </Button>
                                  </>
                                )}
                              </div>
                            )
                          )}
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
        okText="Yarat"
        cancelText="Ləğv et"
      >
        <Form form={quizForm} layout="vertical">
          <Form.Item
            name="quizTitle"
            label="Quiz başlığı"
            rules={[
              {
                required: true,
                message: "Zəhmət olmasa, quiz başlığını daxil edin",
              },
            ]}
          >
            <Input
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setQuizTitle(e.target.value)
              }
              placeholder="Quiz başlığı..."
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Quiz qrupu yarat"
        visible={isGroupModalVisible}
        onOk={() => groupForm.submit()}
        onCancel={handleCancel}
        className={classes.modal}
        okText="Yarat"
        cancelText="Ləğv et"
      >
        <Form form={groupForm} layout="vertical" onFinish={handleCreateGroup}>
          <Form.Item
            name="groupTitle"
            label="Qrup başlığı"
            rules={[
              {
                required: true,
                message: "Zəhmət olmasa, qrup başlığını daxil edin",
              },
            ]}
          >
            <Input placeholder="Qrup başlığı..." />
          </Form.Item>
          <Form.Item
            name="members"
            label="Üzvlər"
            rules={[
              {
                required: true,
                message: "Zəhmət olmasa, ən azı bir üzv seçin",
              },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Üzvləri seçin"
              onChange={handleSelectUsers}
              onSearch={handleSearch}
              filterOption={false}
              showSearch
            >
              {users.map((user) => (
                <Option key={user.id.toString()} value={user.id.toString()}>
                  {user.name + " " + user.surname + " " +user.fatherName }
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Mövcud qrupları idarə et"
        visible={isManageGroupModalVisible}
        onCancel={handleCancel}
        className={classes.modal}
        width={800}
        footer={null}
      >
        <Table
          dataSource={groups}
          columns={[
            {
              title: "Qrup adı",
              dataIndex: "title",
              key: "title",
            },
            {
              title: "Əməliyyatlar",
              key: "actions",
              render: (_, record: IGroup) => (
                <>
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => {
                      getAllgeneratedQuizesByGroupId(record.id);
                      setSelectedGroup(record.id);
                      getMembers(record.id);
                      setIsEditGroupModalVisible(true);
                      setNewTitle(record.title);
                    }}
                    className={`${classes.btn} ${classes.actionBtn}`}
                  >
                    Redaktə et
                  </Button>
                  <Button
                    icon={<DeleteOutlined />}
                    onClick={() => showConfirmDialog("Silmək istədiyinizə əminsiniz?", ()=>handleDeleteGroup(record.id))}
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
                  <Button
          className={classes.btn}
          onClick={() => {setIsSeeResultsModalVisible(true); getAllgeneratedQuizesByGroupId(record.id);}}
        >
<EyeOutlined/>        </Button>                </>
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
        okText="Təyin et"
        cancelText="Ləğv et"
      >
        <Form
          form={assignQuizForm}
          layout="vertical"
          onFinish={handleAssignQuiz}
        >
          <Form.Item
            name="quizId"
            label="Quiz"
            rules={[
              { required: true, message: "Zəhmət olmasa, bir quiz seçin" },
            ]}
          >
            <Select
              placeholder="Quiz seçin"
              onChange={(value) => setSelectedQuiz(value)}
            >
              {quizzes?.map((quiz) => (
                <Option key={quiz.id.toString()} value={quiz.id.toString()}>
                  {quiz?.title}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="duration"
            label="Müddət (dəqiqə)"
            rules={[
              { required: true, message: "Zəhmət olmasa, müddəti daxil edin" },
            ]}
          >
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item
            name="questionCount"
            label="Sual sayı"
            rules={[
              {
                required: true,
                message: "Zəhmət olmasa, sual sayını daxil edin",
              },
            ]}
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
      <Modal
        title="Qrupu redaktə et"
        visible={isEditGroupModalVisible}
        onCancel={() => setIsEditGroupModalVisible(false)}
        footer={[
          <Button
            key="cancel"
            onClick={() =>{setNewTitle(""); 
              setIsEditGroupModalVisible(false);}}
          >
            Ləğv et
          </Button>,
          <Button
            key="save"
            type="primary"
            onClick={() =>{setNewTitle(""); handleEditQuizGroupTitle(selectedGroup); setIsEditGroupModalVisible(false);}}
          >
            Saxla
          </Button>,
        ]}
      >
        <Input
          style={{ marginBottom: "20px" }}
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Qrup başlığı"
        />
        <h2 style={{ marginBottom: "10px", fontWeight: "600" }}>
          İstifadəçiləri idarə et
        </h2>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button style={{ width: "48%" }} onClick={handleAddUser}>
            Yeni istifadəçi əlavə et
          </Button>
          <Button
            style={{ width: "48%" }}
            onClick={() => {
              handleManageUsers();
              getMembers(selectedGroup);
            }}
          >
            Mövcud istifadəçilərə bax və sil
          </Button>
        </div>

        <div style={{ marginTop: "20px" }}>
          <h2 style={{ fontWeight: "600" }}>Təyin olunmuş quizlər</h2>

          {genaratedQuizes.length > 0
            ? genaratedQuizes.map((quiz: any) => (
                <div
                  key={quiz.id}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    marginTop: "10px",
                  }}
                >
                  <h3>{quiz.quizes.title + quiz.id}</h3>
                  <Button
                    onClick={() => {
                      deleteGenaratedQuiz(quiz.id);
                    }}
                  >
                    x
                  </Button>
                </div>
              ))
            : "Boşdur"}
        </div>
      </Modal>

      <Modal
        title="Yeni istifadəçi əlavə et"
        visible={isAddUserModalVisible}
        onCancel={() => setIsAddUserModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsAddUserModalVisible(false)}>
            Ləğv et
          </Button>,
          <Button
            key="save"
            type="primary"
            onClick={() => {
              console.log(selectedGroup, selectedGroupMembers);
              
           
              handleSaveNewUsers(selectedGroup);
             
            }}
          >
            Saxla
          </Button>,
        ]}
      >
        <Select
          style={{ width: "100%" }}
          mode="multiple"
          placeholder="Üzvləri seçin"
          onChange={handleSelectUsers}
          onSearch={handleSearch}
          filterOption={false}
          showSearch
        >
          {users.map((user) => (
            <Option key={user.id.toString()} value={user.id.toString()}>
              {user.name + " " + user.surname}
            </Option>
          ))}
        </Select>
      </Modal>
      <Modal
        title="Mövcud istifadəçiləri idarə et"
        onOk={() => handleRemoveUser(selectedGroup)}
        visible={isManageUsersModalVisible}
        onCancel={() => setIsManageUsersModalVisible(false)}
        footer={[
          <Button
            key="cancel"
            onClick={() => setIsManageUsersModalVisible(false)}
          >
            Ləğv et
          </Button>,
          <Button
            key="save"
            type="primary"
            onClick={() => {
              setIsManageUsersModalVisible(false);
              handleRemoveUser(selectedGroup);
            }}
          >
            Saxla
          </Button>,
        ]}
      >
        {selectedGroupMembers?.map((user: any) => (
          <div
            key={user.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <span>
              {user.name} {user.surname}
            </span>
            <Button
              type="text"
              onClick={() => {
                setGroupMemberstoRemove([...groupMembersToRemove, user.id]);

                setSelectedGroupMembers(
                  selectedGroupMembers.filter(
                    (member: any) => member.id !== user.id
                  )
                );
              }}
              disabled={removedUsers.includes(user.id)}
              style={{ color: removedUsers.includes(user.id) ? "grey" : "red" }}
            >
              {removedUsers.includes(user.id) ? "Removed" : "x"}
            </Button>
          </div>
        ))}
      </Modal>
      <Modal
        title="Nəticələr"
        visible={isSeeResultsModalVisible}
        onCancel={() => setIsSeeResultsModalVisible(false)}
        footer={[
          <Button
            key="cancel"
            onClick={() => {setIsSeeResultsModalVisible(false); getAllgeneratedQuizesByGroupId(selectedGroup);}}
          >
            Bağla
          </Button>,
        ]}
      ></Modal>
      <Modal
        title="Nəticələr"
        visible={isSeeResultsModalVisible}
        onCancel={() => setIsSeeResultsModalVisible(false)}
        footer={[
          <Button
            key="cancel"
            onClick={() => setIsSeeResultsModalVisible(false)}
          >
            Bağla
          </Button>,
        ]}
      >
         {genaratedQuizes.length > 0
            ? genaratedQuizes.map((quiz: any) => (
                <div
                  key={quiz.id}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    marginTop: "10px",
                  }}
                >
                  <h3>{quiz.quizes.title + quiz.id}</h3>
                  <Button
                    onClick={() => {
                      setIsSeeResultsModalVisible2(true);
                      showResultOfGeneratedQuiz(quiz.id);
                    }}
                  >
                    Nəticələr
                  </Button>
                </div>
              ))
            : "Boşdur"}
      
      </Modal>

      <Modal
        title="Nəticələr"
        visible={isSeeResultsModalVisible2}
        onCancel={() => setIsSeeResultsModalVisible2(false)}
        footer={[
          <Button
            key="cancel"
            onClick={() => setIsSeeResultsModalVisible2(false)}
          >
            Bağla
          </Button>,
        ]}
      >
       
       {quizResults.length > 0
            ? genaratedQuizes.map((result: any) => (
                <div
                  key={result.id}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    marginTop: "10px",
                  }}
                >
                  <h3>{result.name + result.surName}</h3>
                  
                </div>
              ))
            : "Boşdur"}
      
      
 
      </Modal>
    </div>
  );
};

export default QuizsComponent;

import { useState, useEffect } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Collapse, Form, Input, message, Modal } from "antd";
import axios from "axios";
import { BASE_URL, getHeaders } from "baseInfos";
import { useLegisStyle } from "./legislation.style";
import { IAllData, IChapter, ICreateSection } from "./legislations";

const MainLegis = () => {
  const {
    legislationContainer,
    actionButton,
    createSectionModal,
    submitButton,
    collapse,
  } = useLegisStyle();

  const { Panel } = Collapse;

  // States
  const [isAddSectionModalVisible, setIsAddSectionModalVisible] =
    useState(false);
  const [isAddChapterModalVisible, setIsAddChapterModalVisible] =
    useState(false);
  const [isAddArticleModalVisible, setIsAddArticleModalVisible] =
    useState(false);
  const [isAddSubArticleModalVisible, setIsAddSubArticleModalVisible] =
    useState(false);
  const [isAddReferenceModalVisible, setIsAddReferenceModalVisible] =
    useState<boolean>(false);
  const [allData, setAllData] = useState<IAllData[]>([]);
  const [currentSection, setCurrentSection] = useState<any>(null);
  const [currentChapter, setCurrentChapter] = useState<any>(null);
  const [currentArticle, setCurrentArticle] = useState<any>(null);
  const [currentSubrticle, setCurrentSubrticle] = useState<any>(null);

  const [sectionForm] = Form.useForm();
  const [chapterForm] = Form.useForm();
  const [articleForm] = Form.useForm();
  const [subArticleForm] = Form.useForm();
  const [isModalOpen, setModalOpen] = useState(false);

  const [isModalOpenChapter, setModalOpenChapter] = useState(false);
  const [isModalOpenArticle, setModalOpenArticle] = useState(false);
  const [isModalOpenSubArticle, setModalOpenSubArticle] = useState(false);
  const [isModalOpenReference, setModalOpenReference] = useState(false);


  const [formData, setFormData] = useState({
    sectionId: "",
    sectionOrderNumber: "",
    sectionTitle: "",
    orderNumberRoman: "",
  });

  const [formDataChapter, setFormDataChapter] = useState({
    chapterId: "",
    chapterOrderNumber: "",
    chapterTitle: "",
  });

  const [formDataArticle, setFormDataArticle] = useState({
    articleId: "",
    articleOrderNumber: "",
    articleTitle: "",
  });

  const [formDataSubArticle, setFormDataSubArticle] = useState({
    subarticleId: "",
    subarticleOrderNumber: "",
    subarticleTitle: "",
  });

  const [formDataReference, setFormDataReference] = useState({
    referenceId: "",
    referenceTitle: "",
    
  });


  const handleEditSection = (section: any) => {
    console.log(section);
    setFormData({
      sectionId: section.sectionId,
      sectionOrderNumber: section.sectionOrderNumber,
      sectionTitle: section.sectionTitle,
      orderNumberRoman: section.orderNumberRoman,
    });
    setModalOpen(true);
  };

  const handleEditChapter = (chapter: any) => {
    setFormDataChapter({
      chapterId: chapter.chapterId,
      chapterOrderNumber: chapter.chapterOrderNumber,
      chapterTitle: chapter.chapterTitle,
    });
    setModalOpenChapter(true);
  };

  const handleEditArticle = (article: any) => {
    setFormDataArticle({
      articleId: article.articleId,
      articleOrderNumber: article.articleOrderNumber,
      articleTitle: article.articleTitle,
    });
    setModalOpenArticle(true);
  };


  const handleEditSubArticle = (subArticle: any) => {
    setFormDataSubArticle({
      subarticleId: subArticle.subarticleId,
      subarticleOrderNumber: subArticle.subarticleOrderNumber,
      subarticleTitle: subArticle.subarticleTitle,
    });
    setModalOpenSubArticle(true);
  };


  const handleEditReference = (reference: any) => {
    setFormDataReference({
      referenceId: reference.referenceId,
      referenceTitle: reference.referenceTitle,
    });
    setModalOpenReference(true);
  };
  const handleSave = async () => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/v1/Legislations/EditSection`,
        {
          Id: formData.sectionId,
          Title: formData.sectionTitle,
          orderNumber: formData.sectionOrderNumber,
          orderNumberRoman: formData.orderNumberRoman,
        },
        {
          headers: getHeaders(),
        }
      );

      fetchAllData();
    } catch (error) {
      console.log(error);
    }

    setModalOpen(false);
  };

  const handleSaveChapter = async () => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/v1/Legislations/EditChapter`,
        {
          id: formDataChapter.chapterId,
          title: formDataChapter.chapterTitle,
          orderNumber: formDataChapter.chapterOrderNumber,
        },
        {
          headers: getHeaders(),
        }
      );

      fetchAllData();
    } catch (error) {
      console.log(error);
    }

    setModalOpenChapter(false);
  };

  const handleSaveArticle = async () => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/v1/Legislations/EditArticle`,
        {
          id: formDataArticle.articleId,
          title: formDataArticle.articleTitle,
          orderNumber: formDataArticle.articleOrderNumber,
        },
        {
          headers: getHeaders(),
        }
      );

      fetchAllData();
    } catch (error) {
      console.log(error);
    }

    setModalOpenArticle(false);
  };

  const handleSaveSubArticle = async () => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/v1/Legislations/EditSubArticle`,
        {
          id: formDataSubArticle.subarticleId,
          title: formDataSubArticle.subarticleTitle,
          orderNumber: formDataSubArticle.subarticleOrderNumber,
        },
        {
          headers: getHeaders(),
        }
      );

      fetchAllData();
    } catch (error) {
      console.log(error);
    }

    setModalOpenSubArticle(false);
  };



  const handleSaveReference = async () => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/v1/Legislations/EditReference`,
        {
          id: formDataReference.referenceId,
          title: formDataReference.referenceTitle,
         
        },
        {
          headers: getHeaders(),
        }
      );

      fetchAllData();
    } catch (error) {
      console.log(error);
    }

    setModalOpenReference(false);
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeChapter = (e: any) => {
    const { name, value } = e.target;
    setFormDataChapter((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeArticle = (e: any) => {
    const { name, value } = e.target;
    setFormDataArticle((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeSubArticle = (e: any) => {
    const { name, value } = e.target;
    setFormDataSubArticle((prev) => ({ ...prev, [name]: value }));
  };


  const handleChangeReference = (e: any) => {
    const { name, value } = e.target;
    setFormDataReference((prev) => ({ ...prev, [name]: value }));
  };
  const fetchAllData = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/v1/Legislations/GetAll`,
        {
          headers: getHeaders(),
        }
      );
      setAllData(response.data.data);
    } catch (error) {
      message.error("Bölmələr yüklənə bilmədi");
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleSectionSubmit = async (values: ICreateSection) => {
    try {
      await axios.post(
        `${BASE_URL}/api/v1/Legislations/CreateSection`,
        {
          title: values.Title,
          OrderNumber: values.OrderNumber,
          OrderNumberRoman: values.OrderNumberRoman,
        },
        { headers: getHeaders() }
      );

      message.success("Bölmə yaradıldı!");
      setIsAddSectionModalVisible(false);
      fetchAllData();
    } catch (error) {
      message.error("Bölmə yaradıla bilmədi");
    }
  };

  const handleDeleteSection = async (sectionId: number) => {
    console.log(sectionId);

    Modal.confirm({
      title: "Sil",
      content: "Bölməni silmək istədiyinizdən əminsiniz?",
      onOk: async () => {
        try {
          await axios.delete(
            `${BASE_URL}/api/v1/Legislations/DeleteSection?id=${sectionId}`,
            {
              headers: getHeaders(),
            }
          );
          message.success("Bölmə silindi!");
          fetchAllData();
        } catch (error) {
          message.error("Bölmə silinə bilmədi");
        }
      },
    });
  };

  const handleAddChapterSubmit = async (values: {
    title: string;
    orderNumber: number;
  }) => {
    if (!currentSection) return;

    const chapterData = {
      title: values.title,
      sectionId: currentSection.sectionId,
      orderNumber: values.orderNumber,
    };

    try {
      await axios.post(
        `${BASE_URL}/api/v1/Legislations/CreateChapter`,
        chapterData,
        {
          headers: getHeaders(),
        }
      );
      message.success("Fəsil yaradıldı!");
      setIsAddChapterModalVisible(false);
      chapterForm.resetFields();
      fetchAllData();
    } catch (error) {
      message.error("Fəsil yaradıla bilmədi");
    }
  };

  const handleAddArticleSubmit = async (values: {
    title: string;
    orderNumber: number;
  }) => {
    if (!currentChapter) return;

    const articleData = {
      Title: values.title,
      ChapterId: currentChapter.chapterId, // Fixed this line
      OrderNumber: values.orderNumber,
    };

    try {
      await axios.post(
        `${BASE_URL}/api/v1/Legislations/CreateArticle`,
        articleData,
        {
          headers: getHeaders(),
        }
      );
      message.success("Maddə yaradıldı!");
      setIsAddArticleModalVisible(false);
      articleForm.resetFields();
      fetchAllData();
    } catch (error) {
      message.error("Maddə yaradıla bilmədi");
    }
  };

  const handleAddSubArticleSubmit = async (values: {
    title: string;
    orderNumber: number;
  }) => {
    if (!currentArticle) return;

    const subArticleData = {
      Title: values.title,
      ArticleId: currentArticle.articleId,
      OrderNumber: values.orderNumber,
    };

    try {
      await axios.post(
        `${BASE_URL}/api/v1/Legislations/CreateSubArticle`,
        subArticleData,
        {
          headers: getHeaders(),
        }
      );
      message.success("Alt maddə yaradıldı!");
      setIsAddSubArticleModalVisible(false);
      subArticleForm.resetFields();
      fetchAllData();
    } catch (error) {
      message.error("Alt maddə yaradıla bilmədi");
    }
  };

  const addReference = async (values: any) => {
    console.log(values, currentSubrticle);

    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/Legislations/CreateReference`,
        {
          title: values.Title,
          subarticleId: currentSubrticle.subarticleId,
        },
        {
          headers: getHeaders(),
        }
      );
      setIsAddReferenceModalVisible(false);
      message.success("Referans yaradıldı!");
      console.log(response.data.data);
    } catch (error) {
      message.error("Referans yaradıla bilmədi");
      console.log(error);
    }
  };

  const handleDeleteChapter = async (chapterId: number) => {
    Modal.confirm({
      title: "Sil",
      content: "Fəsili silmək istədiyinizdən əminsiniz?",
      onOk: async () => {
        try {
          await axios.delete(
            `${BASE_URL}/api/v1/Legislations/DeleteChapter?id=${chapterId}`,
            {
              headers: getHeaders(),
            }
          );
          message.success("Fəsil silindi!");
          fetchAllData();
        } catch (error) {
          message.error("Fəsil silinə bilmədi");
        }
      },
    });
  };

  const handleDeleteArticle = async (articleId: number) => {
    // console.log(sectionId);

    Modal.confirm({
      title: "Sil",
      content: "Maddəni silmək istədiyinizdən əminsiniz?",
      onOk: async () => {
        try {
          await axios.delete(
            `${BASE_URL}/api/v1/Legislations/DeleteArticle?id=${articleId}`,
            {
              headers: getHeaders(),
            }
          );
          message.success("Maddə silindi!");
          fetchAllData();
        } catch (error) {
          message.error("Maddə silinə bilmədi");
        }
      },
    });
  };

  const handleDeleteSubArticle = async (subArticleId: number) => {
    // console.log(sectionId);

    Modal.confirm({
      title: "Sil",
      content: "Alt Maddəni silmək istədiyinizdən əminsiniz?",
      onOk: async () => {
        try {
          await axios.delete(
            `${BASE_URL}/api/v1/Legislations/DeleteSubarticle?id=${subArticleId}`,
            {
              headers: getHeaders(),
            }
          );
          message.success("Alt Maddə silindi!");
          fetchAllData();
        } catch (error) {
          message.error(" Alt Maddə silinə bilmədi");
        }
      },
    });
  };

  const handleDeleteReference = async (referenceId: number) => {
    Modal.confirm({
      title: "Sil",
      content: "Referansı silmək istədiyinizdən əminsiniz?",
      onOk: async () => {
        try {
          await axios.delete(
            `${BASE_URL}/api/v1/Legislations/DeleteReference?id=${referenceId}`,
            {
              headers: getHeaders(),
            }
          );
          message.success("Referans silindi!");
          fetchAllData();
        } catch (error) {
          message.error("Referans silinə bilmədi");
        }
      },
    });
  };

  const renderSectionModal = () => (
    <Modal
      title="Bölmə Yarat"
      visible={isAddSectionModalVisible}
      onCancel={() => setIsAddSectionModalVisible(false)}
      footer={null}
      className={createSectionModal}
    >
      <Form form={sectionForm} onFinish={handleSectionSubmit}>
        <Form.Item
          name="Title"
          label="Bölmə başlığı"
          rules={[
            {
              required: true,
              message: "Zəhmət olmasa, bölmə başlığını daxil edin",
            },
          ]}
        >
          <Input placeholder="Bölmə başlığı..." />
        </Form.Item>
        <Form.Item
          name="OrderNumber"
          label="Bölmə Sıra Nömrəsi"
          rules={[
            {
              required: true,
              message: "Zəhmət olmasa, bölmə sıra nömrəsini daxil edin",
            },
          ]}
        >
          <Input placeholder="Bölmə sıra nömrəsini daxil edin(yalnız ədəd qəbul olunur)..." />
        </Form.Item>
        <Form.Item
          name="OrderNumberRoman"
          label="Bölmə Sıra Nömrəsi rum rəqəmi ilə"
          rules={[
            {
              required: true,
              message:
                "Zəhmət olmasa, bölmə sıra nömrəsini rum rəqmləri ilə daxil edin",
            },
          ]}
        >
          <Input placeholder="Bölmə sıra nömrəsi..." />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className={submitButton}>
            Yarat
          </Button>
          <Button onClick={() => setIsAddSectionModalVisible(false)}>
            Ləğv et
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );

  const renderChapterModal = () => (
    <Modal
      title="Fəsil Yarat"
      visible={isAddChapterModalVisible}
      onCancel={() => setIsAddChapterModalVisible(false)}
      footer={null}
    >
      <Form form={chapterForm} onFinish={handleAddChapterSubmit}>
        <Form.Item
          name="title"
          label="Fəsil başlığı"
          rules={[
            {
              required: true,
              message: "Zəhmət olmasa, fəsil başlığını daxil edin",
            },
          ]}
        >
          <Input placeholder="Fəsil başlığı..." />
        </Form.Item>
        <Form.Item
          name="orderNumber"
          label="Sıra Nömrəsi"
          rules={[
            {
              required: true,
              message: "Zəhmət olmasa, fəsil sıra nömrəsini daxil edin",
            },
          ]}
        >
          <Input type="number" placeholder="Sıra nömrəsi..." />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Yarat
          </Button>
          <Button onClick={() => setIsAddChapterModalVisible(false)}>
            Ləğv et
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );

  const renderArticleModal = () => (
    <Modal
      title="Maddə Yarat"
      visible={isAddArticleModalVisible}
      onCancel={() => setIsAddArticleModalVisible(false)}
      footer={null}
    >
      <Form form={articleForm} onFinish={handleAddArticleSubmit}>
        <Form.Item
          name="title"
          label="Maddə başlığı"
          rules={[
            {
              required: true,
              message: "Zəhmət olmasa, maddə başlığını daxil edin",
            },
          ]}
        >
          <Input placeholder="Maddə başlığı..." />
        </Form.Item>
        <Form.Item
          name="orderNumber"
          label="Sıra Nömrəsi"
          rules={[
            {
              required: true,
              message: "Zəhmət olmasa, maddə sıra nömrəsini daxil edin",
            },
          ]}
        >
          <Input type="number" placeholder="Sıra nömrəsi..." />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Yarat
          </Button>
          <Button onClick={() => setIsAddArticleModalVisible(false)}>
            Ləğv et
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );

  const renderSubArticleModal = () => (
    <Modal
      title="Alt Maddə Yarat"
      visible={isAddSubArticleModalVisible}
      onCancel={() => setIsAddSubArticleModalVisible(false)}
      footer={null}
    >
      <Form form={subArticleForm} onFinish={handleAddSubArticleSubmit}>
        <Form.Item
          name="title"
          label="Alt maddə başlığı"
          rules={[
            {
              required: true,
              message: "Zəhmət olmasa, alt maddə başlığını daxil edin",
            },
          ]}
        >
          <Input placeholder="Alt maddə başlığı..." />
        </Form.Item>
        <Form.Item
          name="orderNumber"
          label="Sıra Nömrəsi"
          rules={[
            {
              required: true,
              message: "Zəhmət olmasa, alt maddə sıra nömrəsini daxil edin",
            },
          ]}
        >
          <Input type="primary" placeholder="Sıra nömrəsi..." />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Yarat
          </Button>
          <Button onClick={() => setIsAddSubArticleModalVisible(false)}>
            Ləğv et
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );

  return (
    <div className={legislationContainer}>
      <Button
        className={actionButton}
        onClick={() => setIsAddSectionModalVisible(true)}
      >
        Bölmə əlavə et
      </Button>
      {renderSectionModal()}
      {renderChapterModal()}
      {renderArticleModal()}
      {renderSubArticleModal()}

      <Modal
        title="Edit Section"
        visible={isModalOpen}
        onOk={handleSave}
        onCancel={() => setModalOpen(false)}
        footer={[
          <Button key="back" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleSave}>
            OK
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <Form.Item label="Section ID">
            <Input
              value={formData.sectionId}
              onChange={handleChange}
              name="sectionId"
              disabled // Optional: Disable if you don't want to allow changes
            />
          </Form.Item>
          <Form.Item label="Order Number">
            <Input
              value={formData.sectionOrderNumber}
              onChange={handleChange}
              name="sectionOrderNumber"
            />
          </Form.Item>
          <Form.Item label="Title">
            <Input
              value={formData.sectionTitle}
              onChange={handleChange}
              name="sectionTitle"
            />
          </Form.Item>

          <Form.Item label="orderNumberRoman">
            <Input
              value={formData.orderNumberRoman}
              onChange={handleChange}
              name="orderNumberRoman"
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Edit Chapter"
        visible={isModalOpenChapter}
        onOk={handleSaveChapter}
        onCancel={() => setModalOpenChapter(false)}
        footer={[
          <Button key="back" onClick={() => setModalOpenChapter(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleSaveChapter}>
            OK
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <Form.Item label="Section ID">
            <Input
              value={formDataChapter.chapterId}
              onChange={handleChangeChapter}
              name="chapterId"
              disabled // Optional: Disable if you don't want to allow changes
            />
          </Form.Item>
          <Form.Item label="Order Number">
            <Input
              value={formDataChapter.chapterOrderNumber}
              onChange={handleChangeChapter}
              name="chapterOrderNumber"
            />
          </Form.Item>
          <Form.Item label="Title">
            <Input
              value={formDataChapter.chapterTitle}
              onChange={handleChangeChapter}
              name="chapterTitle"
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Edit Article"
        visible={isModalOpenArticle}
        onOk={handleSaveArticle}
        onCancel={() => setModalOpenArticle(false)}
        footer={[
          <Button key="back" onClick={() => setModalOpenArticle(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleSaveArticle}>
            OK
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <Form.Item label="Article ID">
            <Input
              value={formDataArticle.articleId}
              onChange={handleChangeArticle}
              name="articleId"
              disabled // Optional: Disable if you don't want to allow changes
            />
          </Form.Item>
          <Form.Item label="Order Number">
            <Input
              value={formDataArticle.articleOrderNumber}
              onChange={handleChangeArticle}
              name="articleOrderNumber"
            />
          </Form.Item>
          <Form.Item label="Title">
            <Input
              value={formDataArticle.articleTitle}
              onChange={handleChangeArticle}
              name="articleTitle"
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Edit SubArticle"
        visible={isModalOpenSubArticle}
        onOk={handleSaveSubArticle}
        onCancel={() => setModalOpenSubArticle(false)}
        footer={[
          <Button key="back" onClick={() => setModalOpenSubArticle(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleSaveSubArticle}>
            OK
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <Form.Item label="Article ID">
            <Input
              value={formDataSubArticle.subarticleId}
              onChange={handleChangeSubArticle}
              name="subarticleId"
              disabled // Optional: Disable if you don't want to allow changes
            />
          </Form.Item>
          <Form.Item label="Order Number">
            <Input
              value={formDataSubArticle.subarticleOrderNumber}
              onChange={handleChangeSubArticle}
              name="subarticleOrderNumber"
            />
          </Form.Item>
          <Form.Item label="Title">
            <Input
              value={formDataSubArticle.subarticleTitle}
              onChange={handleChangeSubArticle}
              name="subarticleTitle"
            />
          </Form.Item>
        </Form>
      </Modal>


      <Modal
        title="Edit Reference"
        visible={isModalOpenReference}
        onOk={handleSaveReference}
        onCancel={() => setModalOpenReference(false)}
        footer={[
          <Button key="back" onClick={() => setModalOpenReference(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleSaveReference}>
            OK
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <Form.Item label="Reference ID">
            <Input
              value={formDataReference.referenceId}
              onChange={handleChangeReference}
              name="referenceId"
              disabled // Optional: Disable if you don't want to allow changes
            />
          </Form.Item>
         
          <Form.Item label="Title">
            <Input
              value={formDataReference.referenceTitle}
              onChange={handleChangeReference}
              name="referenceTitle"
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Qanunda dəyişiklik yarat"
        open={isAddReferenceModalVisible}
        onCancel={() => setIsAddReferenceModalVisible(false)}
        footer={null}
        className={createSectionModal}
      >
        <Form onFinish={addReference}>
          <Form.Item
            name="Title"
            label="Referans başlığı"
            rules={[
              {
                required: true,
                message: "Zəhmət olmasa, Referans başlığını daxil edin",
              },
            ]}
          >
            <Input placeholder="Qanunda dəyişiklik başlığı..." />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className={submitButton}>
              Yarat
            </Button>
            <Button onClick={() => setIsAddReferenceModalVisible(false)}>
              Ləğv et
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Collapse className={collapse}>
        {allData.map((section: any) => (
          <Panel
            style={{ backgroundColor: "white" }}
            header={
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>{`${section.sectionOrderNumber}. ${section.sectionTitle}`}</span>

                <div
                  style={{
                    width: "20%",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    className={actionButton}
                    onClick={(event) => {
                      event.stopPropagation();
                      handleEditSection(section);
                    }}
                    style={{ marginLeft: 8 }}
                  >
                    Redaktə et
                  </Button>

                  <Button
                    className={actionButton}
                    onClick={(event) => {
                      event.stopPropagation();
                      handleDeleteSection(section.sectionId);
                    }}
                    style={{ marginLeft: 8 }}
                  >
                    Sil
                  </Button>
                </div>
              </div>
            }
            key={section.id}
          >
            <div style={{ marginBottom: 16 }}>
              <Button
                icon={<PlusOutlined />}
                className={actionButton}
                onClick={(event) => {
                  event.stopPropagation();
                  setCurrentSection(section);
                  setIsAddChapterModalVisible(true);
                }}
              >
                Fəsil əlavə et
              </Button>
            </div>

            <Collapse>
              {section?.chapters?.map((chapter: any) => (
                <Panel
                  style={{ backgroundColor: "white" }}
                  header={
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span>{`${chapter.chapterOrderNumber}. ${chapter.chapterTitle}`}</span>

                      <div
                        style={{
                          width: "20%",
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Button
                          className={actionButton}
                          onClick={(event) => {
                            event.stopPropagation();
                            handleEditChapter(chapter);
                          }}
                          style={{ marginLeft: 8 }}
                        >
                          Redaktə et
                        </Button>

                        <Button
                          className={actionButton}
                          onClick={(event) => {
                            event.stopPropagation();
                            handleDeleteChapter(chapter.chapterId);
                          }}
                          style={{ marginLeft: 8 }}
                        >
                          Sil
                        </Button>
                      </div>
                    </div>
                  }
                  key={chapter.id}
                >
                  <Button
                    icon={<PlusOutlined />}
                    className={actionButton}
                    onClick={(event) => {
                      event.stopPropagation();
                      setCurrentChapter(chapter);
                      setIsAddArticleModalVisible(true);
                    }}
                  >
                    Maddə əlavə et
                  </Button>

                  <Collapse style={{ marginTop: 16 }}>
                    {chapter?.articles?.map((article: any) => (
                      <Panel
                        header={
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <span>{`${article.articleOrderNumber}. ${article.articleTitle.slice(0, 100)}`}</span>
                            <div
                              style={{
                                width: "20%",
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Button
                                className={actionButton}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleEditArticle(article);
                                }}
                                style={{ marginLeft: 8 }}
                              >
                                Redaktə et
                              </Button>

                              <Button
                                className={actionButton}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleDeleteArticle(article.articleId);
                                }}
                                style={{ marginLeft: 8 }}
                              >
                                Sil
                              </Button>
                            </div>
                          </div>
                        }
                        key={article.id}
                      >
                        <Button
                          icon={<PlusOutlined />}
                          className={actionButton}
                          onClick={(event) => {
                            event.stopPropagation();
                            setCurrentArticle(article);
                            setIsAddSubArticleModalVisible(true);
                          }}
                        >
                          Alt Maddə əlavə et
                        </Button>

                        <Collapse style={{ marginTop: 16 }}>
                          {article?.subarticles?.map((subArticle: any) => (
                            <Panel
                              header={
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
                                  <span>{`${subArticle.subarticleOrderNumber}. ${subArticle.subarticleTitle.slice(0, 100)}`}...</span>

                                  <div
                                    style={{
                                      width: "20%",
                                      display: "flex",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    <Button
                                      className={actionButton}
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        handleEditSubArticle(subArticle);
                                      }}
                                      style={{ marginLeft: 8 }}
                                    >
                                      Redaktə et
                                    </Button>

                                    <Button
                                      className={actionButton}
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        handleDeleteSubArticle(
                                          subArticle.subarticleId
                                        );
                                      }}
                                      style={{ marginLeft: 8 }}
                                    >
                                      Sil
                                    </Button>
                                  </div>
                                </div>
                              }
                              key={subArticle.id}
                            >
                              <Button
                                icon={<PlusOutlined />}
                                className={actionButton}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  setCurrentSubrticle(subArticle);
                                  setIsAddReferenceModalVisible(true);
                                }}
                              >
                                Referans əlavə et
                              </Button>

                              {subArticle.references.map((reference: any) => (
                                <div
                                  key={reference.id}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent:"space-between",
                                    marginBottom: 8,
                                  }}
                                >
                                  <p style={{ margin: 0 }}>
                                    {reference.referenceTitle.slice(0, 100)}...
                                  </p>
                                  <div
                                    style={{
                                      width: "20%",
                                      display: "flex",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                     <Button
                                      className={actionButton}
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        handleEditReference(reference);
                                      }}
                                      style={{ marginLeft: 8 }}
                                    >
                                      Redaktə et
                                    </Button>
                                  <Button
                                    className={actionButton}
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      handleDeleteReference(reference.referenceId); // Assuming you have a function to handle reference deletion
                                    }}
                                    style={{ marginLeft: 8 }}
                                  >
                                    Sil
                                  </Button>
                                  </div>
                                </div>
                              ))}
                            </Panel>
                          ))}
                        </Collapse>
                      </Panel>
                    ))}
                  </Collapse>
                </Panel>
              ))}
            </Collapse>
          </Panel>
        ))}
      </Collapse>
    </div>
  );
};

export default MainLegis;

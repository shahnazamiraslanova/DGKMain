import {
  EditOutlined,
  PlusOutlined,
  DeleteOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, message, Modal, Collapse, Spin } from "antd";
import { useQuizStyles } from "pages/quizes/quizes.style";
import { useLegislationStyles } from "./legislation.style";
import { useState, useEffect } from "react";
import axios from "axios";

const { Panel } = Collapse;

// Types for API response structure
interface Reference {
  referenceId: number;
  referenceName: string | null;
}

interface Subarticle {
  subarticleId: number;
  subarticleContent: string | null;
  references: Reference[];
}

interface Article {
  articleId: number;
  articleContent: string | null;
  subarticles: Subarticle[];
}

interface Chapter {
  chapterId: number;
  chapterTitle: string | null;
  articles: Article[];
}

interface Section {
  sectionId: number;
  sectionTitle: string;
  chapters: Chapter[];
}

interface ApiResponse {
  code: number;
  data: Section[];
}

const LegislationsComponent: React.FC = () => {
  const { btn, actionBtn } = useQuizStyles();
  const { legislationContainer, legisationBtns } = useLegislationStyles();
  const [sectionTitle, setSectionTitle] = useState<string>("");  // Section title as string
  const [form] = Form.useForm();  // Ant Design form instance

  // States
  const [isAddMainModalVisible, setIsAddMainModalVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false); // Loading state for disabling button
  const [sections, setSections] = useState<Section[]>([]); // State to store sections data
  const [isFetching, setIsFetching] = useState<boolean>(false); // State for fetching data

  const token = localStorage.getItem("token");

  // States for editing
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState<string>("");

  // Function to fetch all sections
  const fetchSections = async () => {
    setIsFetching(true); // Start loading spinner
    try {
      const response = await axios.get<ApiResponse>(
        "https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/v1/Legislations/GetAllSections",
        {
          headers: {
            accept: "application/json",
            "api-key": token || "",
          },
        }
      );
      if (response.data.code === 200) {
        setSections(response.data.data); // Set sections data
      } else {
        message.error("Bölmələr yüklənmədi");
      }
    } catch (error) {
      message.error("Bölmələr yüklənmədi");
    } finally {
      setIsFetching(false); // Stop loading spinner
    }
  };


  useEffect(()=>{fetchSections();}, []);
  // Function to create a section
  const createSection = async (title: string) => {
    setLoading(true);
    try {
      await axios.post(
        "https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/v1/Legislations/CreateSection",
        { title },
        {
          headers: {
            accept: "application/json",
            "api-key": token || "",
          },
        }
      );
      message.success("Bölmə əlavə edildi");
      fetchSections();
    } catch (error) {
      message.error("Bölmə əlavə edilə bilmədi");
    } finally {
      setLoading(false);
    }
  };

  // Function to create a chapter
  const createChapter = async (sectionId: number, title: string) => {
    try {
      await axios.post(
        "https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/v1/Legislations/CreateChapter",
        { sectionId, title },
        {
          headers: {
            accept: "application/json",
            "api-key": token || "",
          },
        }
      );
      message.success("Chapter əlavə edildi");
      fetchSections();
    } catch (error) {
      message.error("Chapter əlavə edilə bilmədi");
    }
  };

  // Function to create an article
  const createArticle = async (chapterId: number, content: string) => {
    try {
      await axios.post(
        "https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/v1/Legislations/CreateArticle",
        { chapterId, content },
        {
          headers: {
            accept: "application/json",
            "api-key": token || "",
          },
        }
      );
      message.success("Article əlavə edildi");
      fetchSections();
    } catch (error) {
      message.error("Article əlavə edilə bilmədi");
    }
  };

  // Function to create a subarticle
  const createSubarticle = async (articleId: number, content: string) => {
    try {
      await axios.post(
        "https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/v1/Legislations/CreateSubarticle",
        { articleId, content },
        {
          headers: {
            accept: "application/json",
            "api-key": token || "",
          },
        }
      );
      message.success("Subarticle əlavə edildi");
      fetchSections();
    } catch (error) {
      message.error("Subarticle əlavə edilə bilmədi");
    }
  };

  // Function to delete an item
  const deleteItem = async (id: number, type: string) => {
    try {
      await axios.delete(
        `https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/v1/Legislations/Delete${type}/${id}`,
        {
          headers: {
            "api-key": token || "",
          },
        }
      );
      message.success(`${type} silindi`);
      fetchSections(); // Refetch after deletion
    } catch (error) {
      message.error(`${type} silinmədi`);
    }
  };

  // Function to start editing
  const startEditing = (id: number, currentContent: string) => {
    setEditingId(id);
    setEditingContent(currentContent);
  };

  // Function to save edited content
  const saveEditing = async (id: number, type: string) => {
    try {
      await axios.put(
        `https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/v1/Legislations/Edit${type}`,
        {
          id,
          content: editingContent,
        },
        {
          headers: {
            "api-key": token || "",
          },
        }
      );
      message.success(`${type} yeniləndi`);
      setEditingId(null);
      setEditingContent("");
      fetchSections(); // Refetch after update
    } catch (error) {
      message.error(`${type} yenilənmədi`);
    }
  };

  // Reset input field when closing modal
  const handleCancel = () => {
    setIsAddMainModalVisible(false);
    form.resetFields(); // Clear the form input when modal closes
    setSectionTitle(""); // Clear the input state when modal closes
  };

  // Render function for articles and subarticles
  const renderSubarticles = (subarticles: Subarticle[]) => {
    return subarticles.map((sub) => (
      <Collapse key={sub.subarticleId}>
        <Panel
          header={
            <>
              {editingId === sub.subarticleId ? (
                <Input
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                />
              ) : (
                sub.subarticleContent || "No content"
              )}
              <Button
                icon={editingId === sub.subarticleId ? <SaveOutlined /> : <EditOutlined />}
                onClick={() =>
                  editingId === sub.subarticleId
                    ? saveEditing(sub.subarticleId, "Subarticle")
                    : startEditing(sub.subarticleId, sub.subarticleContent || "")
                }
              />
              <Button
                icon={<DeleteOutlined />}
                onClick={() => deleteItem(sub.subarticleId, "Subarticle")}
                danger
              />
            </>
          }
        >
          <p>References:</p>
          {sub.references.map((ref) => (
            <p key={ref.referenceId}>Reference: {ref.referenceName || "No reference name"}</p>
          ))}
        </Panel>
      </Collapse>
    ));
  };

  const renderArticles = (articles: Article[]) => {
    return articles.map((article) => (
      <Collapse key={article.articleId}>
        <Panel
          header={
            <>
              {editingId === article.articleId ? (
                <Input
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                />
              ) : (
                article.articleContent || "No content"
              )}
              <Button
                icon={editingId === article.articleId ? <SaveOutlined /> : <EditOutlined />}
                onClick={() =>
                  editingId === article.articleId
                    ? saveEditing(article.articleId, "Article")
                    : startEditing(article.articleId, article.articleContent || "")
                }
              />
              <Button
                icon={<DeleteOutlined />}
                onClick={() => deleteItem(article.articleId, "Article")}
                danger
              />
            </>
          }
        >
          <Collapse>{renderSubarticles(article.subarticles)}</Collapse>
        </Panel>
      </Collapse>
    ));
  };

  const renderChapters = (chapters: Chapter[]) => {
    return chapters.map((chapter) => (
      <Collapse key={chapter.chapterId}>
        <Panel
          header={
            <>
              {editingId === chapter.chapterId ? (
                <Input
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                />
              ) : (
                chapter.chapterTitle || "No title"
              )}
              <Button
                icon={editingId === chapter.chapterId ? <SaveOutlined /> : <EditOutlined />}
                onClick={() =>
                  editingId === chapter.chapterId
                    ? saveEditing(chapter.chapterId, "Chapter")
                    : startEditing(chapter.chapterId, chapter.chapterTitle || "")
                }
              />
              <Button
                icon={<DeleteOutlined />}
                onClick={() => deleteItem(chapter.chapterId, "Chapter")}
                danger
              />
            </>
          }
        >
          <Collapse>{renderArticles(chapter.articles)}</Collapse>
        </Panel>
      </Collapse>
    ));
  };

  return (
    <div className={legislationContainer}>
      <div className={legisationBtns}>
        <Button
          icon={<PlusOutlined />}
          onClick={() => setIsAddMainModalVisible(true)}
          className={`${btn} ${actionBtn}`}
        >
          Bölmə əlavə et
        </Button>
        <Button icon={<PlusOutlined />} className={`${btn} ${actionBtn}`}>
          Qanunda dəyişiklik əlavə et
        </Button>
        <Button icon={<EditOutlined />} className={`${btn} ${actionBtn}`}>
          Əsas qanunun adına bax və ya dəyiş
        </Button>
      </div>

      <div className="legisModals">
        <Modal
          title="Bölmə Yarat"
          open={isAddMainModalVisible}
          onCancel={handleCancel}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={() => createSection(sectionTitle)}>
            <Form.Item
              name="sectionTitle"
              label="Bölmə başlığı"
              rules={[
                { required: true, message: "Zəhmət olmasa, bölmə başlığını daxil edin" },
                { min: 3, message: "Bölmə başlığı ən azı 3 simvoldan ibarət olmalıdır" },
                {
                  pattern: /^[a-zA-Z0-9 ]*$/,
                  message: "Bölmə başlığında yalnız hərflər və rəqəmlər ola bilər",
                },
              ]}
            >
              <Input
                value={sectionTitle}
                onChange={(e) => setSectionTitle(e.target.value)}
                placeholder="Bölmə başlığı..."
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className={actionBtn}
                disabled={loading}
                loading={loading}
              >
                Yarat
              </Button>
              <Button onClick={handleCancel} style={{ marginLeft: "10px" }}>
                Ləğv et
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>

      {/* Section to render the list as an accordion */}
      <div>
        {isFetching ? (
          <Spin />
        ) : (
          <Collapse accordion>
            {sections.map((section) => (
              <Panel
                header={
                  <>
                    {editingId === section.sectionId ? (
                      <Input
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                      />
                    ) : (
                      section.sectionTitle
                    )}
                    <Button
                      icon={editingId === section.sectionId ? <SaveOutlined /> : <EditOutlined />}
                      onClick={() =>
                        editingId === section.sectionId
                          ? saveEditing(section.sectionId, "Section")
                          : startEditing(section.sectionId, section.sectionTitle)
                      }
                    />
                    <Button
                      icon={<DeleteOutlined />}
                      onClick={() => deleteItem(section.sectionId, "Section")}
                      danger
                    />
                  </>
                }
                key={section.sectionId}
              >
                <Collapse>{renderChapters(section.chapters)}</Collapse>
              </Panel>
            ))}
          </Collapse>
        )}
      </div>
    </div>
  );
};

export default LegislationsComponent;

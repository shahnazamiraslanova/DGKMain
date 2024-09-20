import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Popconfirm, Spin, Select } from 'antd';
import { PlusOutlined, MinusCircleOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import axios from 'axios';
import { usePollsStyle } from './polls.style';

interface Option {
  id: number;
  optionContent: string;
}

interface Poll {
  pollId: number;
  pollTitle: string;
  userId: number;
  options: Option[];
  firmIds: number[];
}

interface Firm {
  id: string;
  name: string;
}

interface Vote {
  optionId: number;
  count: number;
}

const { Option } = Select;

const PollsPage: React.FC = () => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [firms, setFirms] = useState<Firm[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewVotesModalVisible, setViewVotesModalVisible] = useState(false);
  const [editingPoll, setEditingPoll] = useState<Poll | null>(null);
  const [voteDetails, setVoteDetails] = useState<Vote[]>([]);
  const [form] = Form.useForm();
  const token = localStorage.getItem("token");

  const { pollsMain } = usePollsStyle();

  useEffect(() => {
    fetchPolls();
    fetchFirms();
  }, []);

  const fetchPolls = async () => {
    try {
      const response = await axios.get('https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/v1/Polls/Getpolls', {
        headers: {
          accept: "application/json",
          "api-key": token || "",
        },
      });
      setPolls(response.data.data);
      setLoading(false);
      console.log(response.data.data);
      
    } catch (error) {
      console.error('Error fetching polls:', error);
      message.error('Failed to fetch polls');
      setPolls([]);
      setLoading(false);
    }
  };

  const fetchFirms = async () => {
    try {
      const response = await axios.get('https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/Firm/GetAllFirm', {
        headers: {
          accept: "application/json",
          "api-key": token || "",
        },
      });
      setFirms(response.data.data);
    } catch (error) {
      console.error('Error fetching firms:', error);
      message.error('Failed to fetch firms');
    }
  };

  const handleCreate = () => {
    setEditingPoll(null);
    form.resetFields();
    setModalVisible(true);
    console.log("salam");
  };

  const handleEdit = (poll: Poll) => {
    setEditingPoll(poll);
    form.setFieldsValue({
      pollTitle: poll.pollTitle,
      options: poll.options,
      firms: poll.firmIds.map((firmId: number) => firmId.toString())
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/v1/Polls/DeletePoll?id=${id}`, {
        headers: {
          accept: "application/json",
          "api-key": token || "",
        },
      });

      setPolls(prevPolls => prevPolls.filter(poll => poll.pollId !== id));
      message.success('Poll deleted successfully');
    } catch (error) {
      console.error('Error deleting poll:', error);
      message.error('Failed to delete poll');
    }
  };

  const handleModalOk = () => {
    form.validateFields().then(async (values) => {
      try {
        if (editingPoll) {
          // Editing an existing poll
          await axios.put(
            'https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/v1/Polls/EditPoll',
            {
              ...values,
              options: values.options?.map((option: { optionContent: string }) => ({ id: Date.now(), optionContent: option.optionContent })),
              firms: values.firms // Keep as 'firms' for editing
            },
            {
              headers: {
                accept: "application/json",
                "api-key": token || "",
              },
              params: {
                id: editingPoll.pollId,
              },
            }
          );
          message.success('Poll updated successfully');
        } else {
          // Creating a new poll
          // console.log(values);
          
          const newPollData = {
            title:values.pollTitle,
            options: values.options?.map((option: { optionContent: string }) => ({ content: option.optionContent })),
            firmIds: values.firms?.map((firmId: string) => parseInt(firmId, 10)) || [] // Change to 'firmIds' for creating
          };
          
          console.log(newPollData);

        const response=  await axios.post(
            'https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/v1/Polls/CreateNewPoll',
            newPollData,
            {
              headers: {
                accept: "application/json",
                "api-key": token || "",
              },
            }
          );
          // console.log(response);
          
          // console.log(polls);
          
          console.log(response.data.data.createdPoll);
          
          // setPolls([...polls, response.data.data.createdPoll]);
// console.log(polls);

        }
        setModalVisible(false);
        fetchPolls();
      } catch (error) {
        console.error('Error saving poll:', error);
        message.error('Failed to save poll');
      }
    });
  };

  const handleModalCancel = () => {
    setModalVisible(false);
  };

  const handleViewVotes = async (id: number) => {
    try {
      const response = await axios.get(`https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/v1/Polls/GetPollVotesById?id=${id}`, {
        headers: {
          accept: "application/json",
          "api-key": token || "",
        },
      });
      setVoteDetails(response.data.data);
      setViewVotesModalVisible(true);
    } catch (error) {
      console.error('Error fetching poll votes:', error);
      message.error('Failed to fetch poll votes');
    }
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'pollTitle',
      key: 'pollTitle',
    },
    {
      title: 'Options',
      dataIndex: 'options',
      key: 'options',
      render: (options: Option[]) => options?.map(option => option.optionContent).join(', '),
    },
    {
      title: 'Firms',
      dataIndex: 'firmIds',
      key: 'firms',
      render: (firmIds: number[]) => firmIds?.map(id => firms.find(f => f.id === id.toString())?.name).join(', '),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text: string, record: Poll) => (
        <span>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ marginRight: 8 }}
          />
          <Popconfirm
            title="Are you sure you want to delete this poll?"
            onConfirm={() => handleDelete(record.pollId)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} style={{ marginRight: 8 }} />
          </Popconfirm>
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleViewVotes(record.pollId)}
          />
        </span>
      ),
    },
  ];

  return (
    <div className={pollsMain}>
      <Button
        type="primary"
        onClick={handleCreate}
        style={{ marginBottom: 16, backgroundColor: '#394e75', borderColor: '#394e75' }}
      >
        Create New Poll
      </Button>
      {loading ? (
        <Spin size="large" />
      ) : (
        <Table columns={columns} dataSource={polls} rowKey="pollId" />
      )}
      <Modal
        title={editingPoll ? 'Edit Poll' : 'Create New Poll'}
        visible={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={800}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="pollTitle"
            label="Poll Title"
            rules={[{ required: true, message: 'Please input the poll title!' }]}
          >
            <Input />
          </Form.Item>
          <Form.List
            name="options"
            initialValue={editingPoll ? editingPoll.options : []}
            rules={[{
              validator: async (_, options) => {
                if (!options || options.length < 2) {
                  return Promise.reject(new Error('At least 2 options are required'));
                }
              },
            }]}
          >
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields?.map((field, index) => (
                  <Form.Item
                    key={field.key}
                    label={`Option ${index + 1}`}
                    required
                    rules={[{ required: true, message: 'Option text is required' }]}
                  >
                    <Form.Item
                      {...field}
                      name={[field.name, 'optionContent']}
                      noStyle
                    >
                      <Input placeholder="Option text" style={{ width: '80%', marginRight: 8 }} />
                    </Form.Item>
                    {fields.length > 1 ? (
                      <MinusCircleOutlined
                        className="dynamic-delete-button"
                        onClick={() => remove(field.name)}
                      />
                    ) : null}
                  </Form.Item>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                  >
                    Add Option
                  </Button>
                  <Form.ErrorList errors={errors} />
                </Form.Item>
              </>
            )}
          </Form.List>
          <Form.Item
            name="firms"
            label="Firms"
          >
            <Select mode="multiple" placeholder="Select firms">
              {firms.map(firm => (
                <Option key={firm.id} value={firm.id}>
                  {firm.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Poll Votes"
        visible={viewVotesModalVisible}
        onCancel={() => setViewVotesModalVisible(false)}
        footer={null}
      >
        <Table
          dataSource={voteDetails}
          columns={[
            { title: 'Option', dataIndex: 'optionId', key: 'optionId' },
            { title: 'Votes', dataIndex: 'count', key: 'count' },
          ]}
          rowKey="optionId"
        />
      </Modal>
    </div>
  );
};

export default PollsPage;
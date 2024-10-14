import React, { useState, useEffect } from 'react';
import { Button, message, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import { usePollsStyle } from './polls.style';
import PollList from './components/PollList';
import PollForm from './components/PollForm';
import VoteDetailsModal from './components/VoteDetails';
import { Poll, Option, Firm, Vote } from './polls';

const PollsPage: React.FC = () => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [firms, setFirms] = useState<Firm[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [viewVotesModalVisible, setViewVotesModalVisible] = useState<boolean>(false);
  const [editingPoll, setEditingPoll] = useState<Poll | null>(null);
  const [voteDetails, setVoteDetails] = useState<any>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const token = localStorage.getItem("token");

  const { pollsMain } = usePollsStyle();

  useEffect(() => {
    fetchPolls();
    fetchFirms();
  }, []);

  const fetchPolls = async () => {
    try {
      const response = await axios.get('https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/v1/Polls/GetpollsByAdmin', {
        headers: {
          accept: "application/json",
          "api-key": token || "",
        },
      });
      setPolls(response.data.data);
    } catch (error) {
      message.error('Sorğular yüklənə bilmədi');
    } finally {
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
      message.error('Gömrük orqanları yüklənə bilmədi');
    }
  };

  const handleCreate = () => {
    setEditingPoll(null);
    setModalVisible(true);
  };

  const handleEdit = (poll: Poll) => {
    setEditingPoll(poll);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    setIsSubmitting(true);
    try {
      await axios.delete(`https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/v1/Polls/DeletePoll?id=${id}`, {
        headers: {
          accept: "application/json",
          "api-key": token || "",
        },
      });
      setPolls(prevPolls => prevPolls.filter((poll) => poll.pollId !== id));
      message.success('Sorğu silindi');
    } catch (error) {
      message.error('Sorğu silinə bilmədi');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = async (values: { pollTitle: string; options: Option[]; firms: string[] }, isEditing: boolean) => {
    setIsSubmitting(true);
    try {
      const payload = {
        id: isEditing && editingPoll ? editingPoll.pollId : undefined,
        title: values.pollTitle,
        options: values.options.map(option => ({ content: option.optionContent })),
        firmIds: values.firms.map(firmId => parseInt(firmId, 10)),
      };
    
      const url = isEditing
        ? 'https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/v1/Polls/EditPoll'
        : 'https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/v1/Polls/CreateNewPoll';
      
      const method = isEditing ? "put" : "post";
    
      await axios({
        method: method,
        url: url,
        data: payload,
        headers: {
          'Accept': 'application/json',
          'api-key': token || '',
        },
      });
    
      message.success(isEditing ? 'Sorğu redaktə olundu' : 'Sorğu yaradıldı');
      fetchPolls();
      setModalVisible(false);
    } catch (error) {
      message.error('Sorğu saxlanıla bilmədi');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewVotes = async (id: number) => {
    setIsSubmitting(true);
    try {
      const response = await axios.get(`https://tc2c-fvaisoutbusiness.customs.gov.az:3535/api/v1/Polls/GetPollVotesByAdmin?pollId=${id}`, {
        headers: {
          accept: "application/json",
          "api-key": token || "",
        },
      });
      
      setVoteDetails(response.data.data || []);
      setViewVotesModalVisible(true);
     
      
    } catch (error) {
      message.error('Sorğu nəticələri yüklənə bilmədi');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={pollsMain}>
      <Button
        type="primary"
        onClick={handleCreate}
        style={{ marginBottom: 16, backgroundColor: '#394e75', borderColor: '#394e75' }}
        icon={<PlusOutlined />}
        disabled={isSubmitting}
      >
        Sorğu yarat
      </Button>
      {loading ? (
        <Spin size="large" />
      ) : (
        <PollList
          polls={polls}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewVotes={handleViewVotes}
          isSubmitting={isSubmitting}
        />
      )}
      <PollForm
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSubmit={handleFormSubmit}
        editingPoll={editingPoll}
        firms={firms}
        isSubmitting={isSubmitting}
      />
      <VoteDetailsModal
        visible={viewVotesModalVisible}
        onCancel={() => setViewVotesModalVisible(false)}
        voteDetails={voteDetails}
      />
    </div>
  );
};

export default PollsPage;

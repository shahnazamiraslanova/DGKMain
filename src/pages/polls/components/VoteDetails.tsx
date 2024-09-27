import React from 'react';
import { Modal, Table, Typography } from 'antd';
import { Vote } from '../polls';

const { Text } = Typography;

interface VoteDetailsModalProps {
  visible: boolean;
  onCancel: () => void;
  voteDetails: {
    result: any[]; // Adjust to a specific type if possible
    pollVotes: any[];
  };
}

const VoteDetailsModal: React.FC<VoteDetailsModalProps> = ({ visible, onCancel, voteDetails }) => {
  // Ensure that the pollVotes array has the necessary properties for rendering
  const resultColumns = [
    { title: 'Seçim', dataIndex: 'optionId', key: 'optionId' },
    { title: 'Səslər', dataIndex: 'count', key: 'count' }, // Assuming 'count' is the correct field in Vote
  ];

  const voteColumns = [
    { title: 'İstifadəçi', dataIndex: 'userId', key: 'userId' },
    { title: 'Seçim', dataIndex: 'optionId', key: 'optionId' },
    // Uncomment and adjust as needed for vote date
    // { title: 'Vote Date', dataIndex: 'voteDate', key: 'voteDate', 
    //   render: (date: string) => new Date(date).toLocaleString() },
  ];

  return (
    <Modal
      title="Sorğu nəticələri"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <Text strong>Xülasə:</Text>
      <Table
        dataSource={voteDetails.pollVotes}
        columns={resultColumns}
        rowKey="optionId"
        pagination={false}
      />
      <Text strong style={{ marginTop: 16, display: 'block' }}>Səsvermə detalları:</Text>
      <Table
        dataSource={voteDetails.pollVotes} // This may need to be changed if you have a different data source for details
        columns={voteColumns}
        rowKey="id" // Ensure 'id' is a valid field in your Vote type
      />
    </Modal>
  );
};

export default VoteDetailsModal;

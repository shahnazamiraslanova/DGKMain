import React, { useMemo } from 'react';
import { Modal, Table, Typography, Spin } from 'antd';
import { VoteDetailsModalProps } from '../polls';

const { Text } = Typography;

const VoteDetailsModal: React.FC<VoteDetailsModalProps> = ({ visible, onCancel, voteDetails }) => {

  const isLoading = !voteDetails;

  const voteData = useMemo(() => {
    if (!voteDetails || !Array.isArray(voteDetails) || voteDetails.length === 0) return []; 

    // The first object contains user details and their options
    const userDetails = voteDetails[0]; 

    // Extract users and their options
    const users = userDetails?.user || []; 
    const options = userDetails?.option || []; // Corrected from "options" to "option" based on your data structure

    return users.map((user: any) => ({
      key: user.userId, // Use "userId" as the unique key
      name: user.name,
      surname: user.surname,
      options: options.map((option: any) => option.optionContent).join(', ') || '', // Join the options into a single string
    }));
  }, [voteDetails]);

  const voteColumns = [
    { title: 'İstifadəçi', dataIndex: 'name', key: 'name' },
    { title: 'Soyad', dataIndex: 'surname', key: 'surname' },
    { title: 'Seçim', dataIndex: 'options', key: 'options' },
  ];

  return (
    <Modal
      title="Sorğu nəticələri"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
      aria-label="Vote Details Modal"
    >
      {isLoading ? (
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Spin tip="Yüklənir..." />
          <Text>məlumatlar yüklənir. Lütfən gözləyin...</Text>
        </div>
      ) : voteData.length > 0 ? (
        <Table
          dataSource={voteData}
          columns={voteColumns}
          rowKey="key"
        />
      ) : (
        <Text type="secondary">Heç bir səs yoxdur.</Text>
      )}
    </Modal>
  );
};

export default VoteDetailsModal;

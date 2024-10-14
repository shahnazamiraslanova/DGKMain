import React, { useMemo } from 'react';
import { Modal, Table, Typography, Spin } from 'antd';
import { VoteDetailsModalProps } from '../polls';

const { Text } = Typography;

const VoteDetailsModal: React.FC<VoteDetailsModalProps> = ({ visible, onCancel, voteDetails }) => {

  const isLoading = !voteDetails;

  const voteData = useMemo(() => {
    if (!voteDetails || !Array.isArray(voteDetails) || voteDetails.length === 0) return []; 

    const userDetails = voteDetails[0]; 

 
    const users = userDetails?.user || []; 
    const options = userDetails?.option || []; 

    return users.map((user: any) => ({
      key: user.userId, 
      name: user.name,
      surname: user.surname,
      options: options.map((option: any) => option.optionContent).join(', ') || '', 
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

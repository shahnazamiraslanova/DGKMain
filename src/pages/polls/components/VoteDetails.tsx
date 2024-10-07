import React, { useMemo } from 'react';
import { Modal, Table, Typography, Spin } from 'antd';
import { VoteDetailsModalProps } from '../polls';

const { Text } = Typography;

const VoteDetailsModal: React.FC<VoteDetailsModalProps> = ({ visible, onCancel, voteDetails }) => {
  console.log("Vote Details:", voteDetails);

  // Check if voteDetails is loaded
  const isLoading = !voteDetails;

  const voteData = useMemo(() => {
    if (!voteDetails || !Array.isArray(voteDetails) || voteDetails.length === 0) return []; // Ensure voteDetails is a non-empty array

    const userDetails = voteDetails[0]; // Access the first object

    // Extract user and options
    const users = userDetails?.user || []; // User array
    const options = userDetails?.options || []; // Options array

    // Combine user and options in one object
    return users.map((user:any) => ({
      key: user.userId,
      name: user.name,
      surname: user.surname,
      options: options.map((option:any) => option.optionContent).join(', ') || '', // Join all options
    }));
  }, [voteDetails]);

  console.log("Vote Data:", voteData);

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
      {/* <Text strong style={{ marginTop: 16, display: 'block' }}>Səsvermə detalları:</Text> */}
      {isLoading ? (
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Spin tip="Yüklənir..." />
          <Text> məlumatlar yüklənir. Lütfən gözləyin...</Text>
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

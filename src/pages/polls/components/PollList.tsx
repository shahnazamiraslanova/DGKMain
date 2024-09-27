import React from 'react';
import { Table, Button, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';

interface PollListProps {
  polls: any[];
  onEdit: (poll: any) => void;
  onDelete: (id: any) => void;
  onViewVotes: (id: any) => void;
  isSubmitting: boolean;
}

const PollList: React.FC<PollListProps> = ({ polls, onEdit, onDelete, onViewVotes, isSubmitting }) => {
  const columns = [
    {
      title: 'Sorğu',
      dataIndex: 'pollTitle',
      key: 'pollTitle',
    },
    {
      title: 'Seçimlər',
      dataIndex: 'options',
      key: 'options',
      render: (options: any) => options?.map((option: any) => option.optionContent).join(', '),
    },
    {
      title: 'Göndərilən gömrük orqanları',
      dataIndex: 'firms',
      key: 'firms',
      render: (firms: any) => firms?.map((firm: any) => firm.firmName).join(', '),
    },
    {
      title: 'İdarə et',
      key: 'actions',
      render: (text: any, record: any) => (
        <span>
          <Button
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
            style={{ marginRight: 8 }}
            disabled={isSubmitting}
          />
          <Popconfirm
            title="Sorğunu silmək istədiyinizə əminsiniz?"
            onConfirm={() => onDelete(record.pollId)}
            okText="Bəli"
            cancelText="Xeyr"
          >
            <Button icon={<DeleteOutlined />} style={{ marginRight: 8 }} disabled={isSubmitting} />
          </Popconfirm>
          <Button
            icon={<EyeOutlined />}
            onClick={() => onViewVotes(record.pollId)}
            disabled={isSubmitting}
          />
        </span>
      ),
    },
  ];

  return <Table columns={columns} dataSource={polls} rowKey="pollId" />;
};

export default PollList;
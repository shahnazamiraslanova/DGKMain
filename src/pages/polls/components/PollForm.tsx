import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, Select } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

interface PollFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any, isEditing: boolean) => void;
  editingPoll: any;
  firms: any[];
  isSubmitting: boolean;
}

const PollForm: React.FC<PollFormProps> = ({ visible, onCancel, onSubmit, editingPoll, firms, isSubmitting }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && editingPoll) {
      form.setFieldsValue({
        pollTitle: editingPoll.pollTitle,
        options: editingPoll.options.map((option: any) => ({ optionContent: option.optionContent })),
        firms: editingPoll.firms.map((firm: any) => firm.firmId)
      });
    } else {
      form.resetFields();
    }
  }, [visible, editingPoll, form]);

  const handleOk = () => {
    form.validateFields().then(values => {
      onSubmit(values, !!editingPoll);
    });
  };

  return (
    <Modal
      title={editingPoll ? 'Redaktə et' : 'Yeni sorğu yarat'}
      visible={visible}
      onOk={handleOk}
      onCancel={onCancel}
      width={800}
      okText="Saxla"
      cancelText="Ləğv et"
      confirmLoading={isSubmitting}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="pollTitle"
          label="Sorğu"
          rules={[{ required: true, message: 'Zəhmət olmasa başlığı yazın' }]}
        >
          <Input />
        </Form.Item>
        <Form.List
          name="options"
          rules={[{
            validator: async (_, options) => {
              if (!options || options.length < 2) {
                return Promise.reject(new Error('Ən azı iki seçim olmalıdır'));
              }
            },
          }]}
        >
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map((field, index) => (
                <Form.Item
                  key={field.key}
                  label={`Seçim ${index + 1}`}
                  required
                  rules={[{ required: true, message: 'Seçim tələb olunur' }]}
                >
                  <Form.Item
                    {...field}
                    name={[field.name, 'optionContent']}
                    noStyle
                  >
                    <Input placeholder="Seçim..." style={{ width: '80%', marginRight: 8 }} />
                  </Form.Item>
                  {fields.length > 1 && (
                    <MinusCircleOutlined
                      className="dynamic-delete-button"
                      onClick={() => remove(field.name)}
                    />
                  )}
                </Form.Item>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  icon={<PlusOutlined />}
                >
                  Seçim əlavə edin
                </Button>
                <Form.ErrorList errors={errors} />
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.Item
          name="firms"
          label="Gömrük orqanları"
          rules={[{ required: true, message: 'Azı bir seçim edin' }]}
        >
          <Select mode="multiple" placeholder="Seçim">
            {firms.map((firm: any) => (
              <Option key={firm.id} value={firm.id}>
                {firm.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PollForm;
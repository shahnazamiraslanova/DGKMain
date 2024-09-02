import {useAddPost} from './actions/form.mutation';
import React, {useCallback, useMemo} from 'react';
import {Form, Input, Button, Checkbox, DatePicker, TimePicker, Radio, Select} from 'antd';
import useLocalization from 'assets/lang';
import {IFormValues} from './form';

const FormComponent = ()=> {
    const translate = useLocalization();

    const addPost = useAddPost();
    const initialValues: IFormValues = {
        title: 'test',
        body: '',
        fruit: [],
        check: false,
        date: '',
        time: '',
        car: '',
        language: '',
        languages: [],
    };

    const onSubmit = useCallback((values: IFormValues) => {
        console.log(values);
        addPost.mutate(values);
    }, [addPost]);

    const rules = useMemo(() => ({
        title: [
            {
                required: true,
                message: translate('input_required'),
            }
        ],
        body: [
            {
                min: 8,
                message: translate('input_min_length', {
                    min: <span style={{color: 'green',}}>8</span>,
                }),
            }
        ],

    }), [translate]);

    const checkboxOptions = useMemo(() =>
        [
            {label: 'Apple', value: 'Apple',},
            {label: 'Pear', value: 'Pear',},
            {label: 'Orange', value: 'Orange',}
        ], []);

    const radioOptions = useMemo(() =>
        [
            {label: 'Nissan', value: 'Nissan',},
            {label: 'Toyota', value: 'Toyota',},
            {label: 'Honda', value: 'Honda',}
        ], []);

    const selectOptions = useMemo(() =>
        [
            {label: 'JS', value: 'JS',},
            {label: 'C++', value: 'C++',},
            {label: 'Pyhton', value: 'Pyhton',}
        ], []);
    return (
        <div>
            <Form
                name='basic'
                initialValues={initialValues}
                onFinish={onSubmit}
                layout='vertical'
            >
                <div className='row'>
                    <div className='col-lg-6'>
                        <Form.Item
                            rules={rules.title}
                            name='title'
                            label='Title'>
                            <Input/>
                        </Form.Item>
                    </div>
                    <div className='col-lg-6'>
                        <Form.Item
                            rules={rules.body}
                            name='body' label='Body'>
                            <Input/>
                        </Form.Item>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-lg-6'>
                        <Form.Item name='fruit'>
                            <Checkbox.Group options={checkboxOptions}/>
                        </Form.Item>
                    </div>
                    <div className='col-lg-6'>
                        <Form.Item valuePropName='checked' name='check'>
                            <Checkbox>Checkbox</Checkbox>
                        </Form.Item>
                    </div>

                </div>
                <div className='row'>
                    <div className='col-lg-6'>
                        <Form.Item name='car'>
                            <Radio.Group options={radioOptions}/>
                        </Form.Item>
                    </div>

                </div>
                <div className='row'>
                    <div className='col-lg-6'>
                        <Form.Item name='date'>
                            <DatePicker format='DD.MM.YYYY' />
                        </Form.Item>
                    </div>
                    <div className='col-lg-6'>
                        <Form.Item name='time'>
                            <TimePicker format='HH:mm' />
                        </Form.Item>
                    </div>

                </div>
                <div className='row'>
                    <div className='col-lg-6'>
                        <Form.Item name='language'>
                            <Select showSearch options={selectOptions} />
                        </Form.Item>
                    </div>
                    <div className='col-lg-6'>
                        <Form.Item name='languages'>
                            {/*<TimePicker format='HH:mm' />*/}
                            <Select mode='multiple' showSearch options={selectOptions} />

                        </Form.Item>
                    </div>
                </div>
                <div className='row mt-20'>
                    <div className='col-lg-3'>
                        <Button type='primary' htmlType='submit'>
                            Submit
                        </Button>
                    </div>
                </div>
            </Form>
        </div>
    );
};

export default FormComponent;

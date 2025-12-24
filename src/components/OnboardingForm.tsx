import React from 'react';
import { Form, Input, Button } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { NAME_RULES, PHONE_RULES, CORP_NUMBER_RULES } from '../constants/validation';
import './OnboardingForm.scss';
import { useOnboardingForm } from '../hooks/useOnboardingForm';

const createNameRules = (fieldName: string) =>
  NAME_RULES.map((rule) =>
    typeof rule.message === 'string' && rule.message.includes('{0}')
      ? { ...rule, message: rule.message.replace('{0}', fieldName) }
      : rule,
  );

const OnboardingForm: React.FC = () => {
  const [form] = Form.useForm();
  const { loading, validateCorpNumber, onFinish } = useOnboardingForm(form);

  return (
    <div className="container">
      <h1>Onboarding Form</h1>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          phoneNumber: '+1',
        }}
      >
        <div className="name-row">
          <Form.Item
            label="First Name"
            name="firstName"
            validateTrigger="onBlur"
            rules={createNameRules('First name')}
            className="input-field name-item"
          >
            <Input placeholder="First Name" data-testid="firstName" />
          </Form.Item>

          <Form.Item
            label="Last Name"
            name="lastName"
            validateTrigger="onBlur"
            rules={createNameRules('Last name')}
            className="input-field name-item"
          >
            <Input placeholder="Last Name" data-testid="lastName" />
          </Form.Item>
        </div>

        <Form.Item
          label="Phone Number"
          name="phoneNumber"
          validateTrigger="onBlur"
          rules={PHONE_RULES}
          normalize={(value) => value.replace(/[\s\-()]/g, '')}
          className="input-field"
        >
          <Input type="tel" placeholder="+1XXXXXXXXXX" data-testid="phoneNumber" />
        </Form.Item>

        <Form.Item
          label="Corporation Number"
          name="corpNumber"
          validateTrigger="onBlur"
          rules={[...CORP_NUMBER_RULES, { validator: validateCorpNumber }]}
          className="input-field"
        >
          <Input placeholder="9-digit number" data-testid="corpNumber" />
        </Form.Item>

        <Form.Item className="submit-btn">
          <Button type="primary" htmlType="submit" loading={loading} block>
            Submit <ArrowRightOutlined />
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default OnboardingForm;

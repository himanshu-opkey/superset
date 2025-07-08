/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { SupersetClient, styled, t, css } from '@superset-ui/core';
import {
  Button,
  Card,
  Flex,
  Form,
  Input,
  Typography,
  Icons,
} from '@superset-ui/core/components';
import { useState } from 'react';
import './custoemstyle.css';
import { capitalize } from 'lodash/fp';
import getBootstrapData from 'src/utils/getBootstrapData';
import logo from 'src/assets/images/opkeyLogoWhite.png';
import shahidImg from 'src/assets/images/shahid_hussain.jpg';
import {StarFilled , CopyrightOutlined} from '@ant-design/icons'
 

type OAuthProvider = {
  name: string;
  icon: string;
};

type OIDProvider = {
  name: string;
  url: string;
};

type Provider = OAuthProvider | OIDProvider;

interface LoginForm {
  username: string;
  password: string;
}

enum AuthType {
  AuthOID = 0,
  AuthDB = 1,
  AuthLDAP = 2,
  AuthOauth = 4,
}

const StyledCard = styled(Card)`
  ${({ theme }) => css`
    width: 70%;
    background: transparent;
    box-shadow: none;
    border: 1px solid transparent;
    .antd5-form-item-label label {
      color: ${theme.colorPrimary};
    }
  `}
`;


const StyledLabel = styled(Typography.Text)`
  ${({ theme }) => css`
    font-size: ${theme.fontSizeSM}px;
  `}
`;

export default function Login() {
  const [form] = Form.useForm<LoginForm>();
  const [loading, setLoading] = useState(false);

  const bootstrapData = getBootstrapData();

  const authType: AuthType = bootstrapData.common.conf.AUTH_TYPE;
  const providers: Provider[] = bootstrapData.common.conf.AUTH_PROVIDERS;
  const authRegistration: boolean =
    bootstrapData.common.conf.AUTH_USER_REGISTRATION;

  const onFinish = (values: LoginForm) => {
    setLoading(true);
    SupersetClient.postForm('/login/', values, '').finally(() => {
      setLoading(false);
    });
  };

  const getAuthIconElement = (
    providerName: string,
  ): React.JSX.Element | undefined => {
    if (!providerName || typeof providerName !== 'string') {
      return undefined;
    }
    const iconComponentName = `${capitalize(providerName)}Outlined`;
    const IconComponent = (Icons as Record<string, React.ComponentType<any>>)[
      iconComponentName
    ];

    if (IconComponent && typeof IconComponent === 'function') {
      return <IconComponent />;
    }
    return undefined;
  };

  return (

    <Flex
    justify="center"
    align="center"
    className="login-page-body"
    vertical>
    <div className="login-page-left">
      <div className="login-page-logo">
          <img
            src={logo}
            alt="App Logo"/>
      </div>

      <div className='login-left-body'>
        <div className='login-left-body-data'>
          <h4 className="review-text-content">“The level of coverage and speed you can automate is far beyond anything we have seen before.
            Opkey helped us dramatically reduce risk and speed up testing cycles, all at a lower program cost.”</h4>
        
            <div className="profile_img">
              <img   src={shahidImg} alt="App Logo" />
            </div>

          <div className="profile_caption">
              <p className="color-white-text">Bruce Kratz</p>
              <p className="color-white-text">VP R&amp;D- Sparta Systems</p>
          </div>

          <div className="login-star-icon">
            <StarFilled /><StarFilled /><StarFilled /><StarFilled /><StarFilled />
          </div>
        </div>
      </div>

      <div className="login-left-footer">
        <p className="color-white-text ">
          <CopyrightOutlined />
          Opkey 2023
        </p>
      </div>
    </div>
    
    <Flex
      data-test="login-form"
      className="login-form-body"
    >
      <StyledCard title={t('Sign in With Opkey Bi-Studio')} padded
      >
        {authType === AuthType.AuthOID && (
          <Flex justify="center" vertical gap="middle"
          >
            <Form layout="vertical" requiredMark="optional" form={form}>
              {providers.map((provider: OIDProvider) => (
                <Form.Item<LoginForm>>
                  <Button
                    href={`/login/${provider.name}`}
                    block
                    iconPosition="start"
                    icon={getAuthIconElement(provider.name)}
                  >
                    {t('Sign in with')} {capitalize(provider.name)}
                  </Button>
                </Form.Item>
              ))}
            </Form>
          </Flex>
        )}
        {authType === AuthType.AuthOauth && (
          <Flex justify="center" gap={0} vertical
          >
            <Form layout="vertical" requiredMark="optional" form={form}>
              {providers.map((provider: OAuthProvider) => (
                <Form.Item<LoginForm>>
                  <Button
                    href={`/login/${provider.name}`}
                    block
                    iconPosition="start"
                    icon={getAuthIconElement(provider.name)}
                  >
                    {t('Sign in with')} {capitalize(provider.name)}
                  </Button>
                </Form.Item>
              ))}
            </Form>
          </Flex>
        )}

        {(authType === AuthType.AuthDB || authType === AuthType.AuthLDAP) && (
          <Flex justify="center" vertical gap="middle">
            <Typography.Text type="secondary">
              {t('Enter your login and password below:  ')}
            </Typography.Text>
            <Form
              layout="vertical"
              requiredMark="optional"
              form={form}
              onFinish={onFinish}
            >
              <Form.Item<LoginForm>
                label={<StyledLabel>{t('Username:')}</StyledLabel>}
                name="username"
                rules={[
                  { required: true, message: t('Please enter your username') },
                ]}
              >
                <Input
                  prefix={<Icons.UserOutlined iconSize="l" />}
                  data-test="username-input"
                />
              </Form.Item>
              <Form.Item<LoginForm>
                label={<StyledLabel>{t('Password:')}</StyledLabel>}
                name="password"
                rules={[
                  { required: true, message: t('Please enter your password') },
                ]}
              >
                <Input.Password
                  prefix={<Icons.KeyOutlined iconSize="l" />}
                  data-test="password-input"
                />
              </Form.Item>
              <Form.Item label={null}>
                <Flex
                  css={css`
                    width: 100%;
                  `}
                >
                  <Button
                    block
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    data-test="login-button"
                    className="login-button-superset"
                  >
                    {t('Sign in')}
                  </Button>
                  {authRegistration && (
                    <Button
                      block
                      type="default"
                      href="/register/"
                      data-test="register-button"
                    >
                      {t('Register')}
                    </Button>
                  )}
                </Flex>
              </Form.Item>
            </Form>
          </Flex>
        )}
      </StyledCard>
    </Flex>

 </Flex>
  );
}

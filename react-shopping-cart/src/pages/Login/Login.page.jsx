import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import AuthContainer from 'components/@shared/AuthContainer/AuthContainer.component';
import Button from 'components/@shared/Button/Button.component';
import FlexBox from 'components/@shared/FlexBox/FlexBox.component';
import Input from 'components/@shared/Input/Input.component';
import Logo from 'components/@shared/Logo/Logo.component';
import TextBox from 'components/@shared/TextBox/TextBox.component';

import { loginUser } from 'redux/actions/auth.action';
import { setSnackBarMessage } from 'redux/actions/snackbar.action';

import useLogin from 'hooks/api/auth/useLogin';

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { login, error } = useLogin();

  const emailRef = useRef();
  const passwordRef = useRef();

  const handleLogin = async e => {
    e.preventDefault();

    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const { accessToken } = await login({ email, password });

    if (accessToken) {
      dispatch(loginUser(accessToken));
      dispatch(setSnackBarMessage('🎉 환영합니다!'));
      navigate('/');
    }
  };

  return (
    <AuthContainer>
      <FlexBox height="100%" direction="column" justifyContent="flex-end" gap="25px">
        <Link to="/">
          <Logo color="MINT_001" />
        </Link>
        <FlexBox
          as="form"
          onSubmit={handleLogin}
          width="100%"
          direction="column"
          gap="20px"
          alignItems="flex-end"
        >
          <Input ref={emailRef} type="email" placeholder="이메일" />
          <Input ref={passwordRef} type="password" placeholder="비밀번호" />
          {error && '이메일이나 비밀번호를 확인해 주세요.'}
          <SignupLink to="/signup">회원가입</SignupLink>
          <Button width="100%" borderRadius="10px" onClick={handleLogin}>
            <TextBox color="WHITE_001">로그인</TextBox>
          </Button>
        </FlexBox>
        <CopyrightBox>
          <TextBox fontSize="extraSmall">©️ WOOWA Shop Corp.</TextBox>
        </CopyrightBox>
      </FlexBox>
    </AuthContainer>
  );
}

export default Login;

const CopyrightBox = styled(FlexBox).attrs({
  justifyContent: 'center',
})`
  margin: 30px 0;
`;

const SignupLink = styled(Link)`
  color: ${({ theme }) => theme.colors['GRAY_002']};
  font-size: 14px;
  margin: 12px 0;
`;

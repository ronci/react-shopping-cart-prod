import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { SwitchTransition, Transition } from 'react-transition-group';
import styled from 'styled-components';

import AuthContainer from 'components/@shared/AuthContainer/AuthContainer.component';
import FlexBox from 'components/@shared/FlexBox/FlexBox.component';
import Logo from 'components/@shared/Logo/Logo.component';

import LoginInfoContainer from 'components/LoginInfoContaier/LoginInfoContainer.component';
import UserInfoContainer from 'components/UserInfoContainer/UserInfoContainer.component';

import { setSnackBarMessage } from 'redux/actions/snackbar.action';
import { resetUserInfo, setUserInfo } from 'redux/actions/userInfo.action';
import { initialUserInfoState } from 'redux/reducers/userInfo.reducer';

import useLoadUserInfo from 'hooks/api/auth/useLoadUserInfo';
import useModifyUserInfo from 'hooks/api/auth/useModifyUserInfo';

import { processClientData, processServerData } from 'utils';

function ModifyUserInfo() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showLoginInfo, setShowLoginInfo] = useState(false);

  const userInfo = useSelector(state => state.userInfo);
  const putUserInfo = processServerData(userInfo);

  const { loadUserInfo } = useLoadUserInfo();
  const { modifyUserInfo } = useModifyUserInfo();

  useEffect(() => {
    (async () => {
      const currentUserInfo = await loadUserInfo();
      const userInfo = processClientData(currentUserInfo, initialUserInfoState);
      dispatch(setUserInfo(userInfo));
    })();

    return () => {
      dispatch(resetUserInfo());
    };
  }, []);

  const handleShowComponent = () => {
    setShowLoginInfo(prev => !prev);
  };

  const handlePutUserInfo = async () => {
    try {
      await modifyUserInfo(putUserInfo);
      dispatch(setSnackBarMessage('🎉 성공적으로 정보를 수정 했습니다!'));
      navigate('/');
    } catch {
      dispatch(setSnackBarMessage('정보 수정에 실패했습니다...😥'));
    }
  };

  return (
    <AuthContainer>
      <InfoDiv>
        <Link to="/">
          <Logo color="MINT_001" />
        </Link>
        <SwitchTransition>
          <SlideTransition
            key={showLoginInfo ? 'loginInfo' : 'userInfo'}
            timeout={100}
            unmountOnExit
            mountOnEnter
          >
            {showLoginInfo ? (
              <LoginInfoContainer
                onClickPrev={handleShowComponent}
                onSubmit={handlePutUserInfo}
                userInfoButtonText="정보 수정"
              />
            ) : (
              <UserInfoContainer onClickNext={handleShowComponent} />
            )}
          </SlideTransition>
        </SwitchTransition>
      </InfoDiv>
    </AuthContainer>
  );
}

export default ModifyUserInfo;

const InfoDiv = styled(FlexBox).attrs({
  height: '100%',
  direction: 'column',
  justifyContent: 'center',
  gap: '25px',
})`
  overflow-x: hidden;
`;

const SlideDiv = styled.div`
  #userInfo {
    transition: 0.25s;
    transform: ${({ state }) => (state === 'entered' ? 'translateX(0)' : 'translateX(-100%)')};
  }
  #loginInfo {
    transition: 0.25s;
    transform: ${({ state }) => (state === 'entered' ? 'translateX(0)' : 'translateX(100%)')};
  }
`;

const SlideTransition = ({ children, ...rest }) => (
  <Transition {...rest}>{state => <SlideDiv state={state}>{children}</SlideDiv>}</Transition>
);

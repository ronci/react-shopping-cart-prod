import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import BorderBox from 'components/@shared/BorderBox/BorderBox.component';
import CheckBox from 'components/@shared/CheckBox/CheckBox.component';
import FlexBox from 'components/@shared/FlexBox/FlexBox.component';
import PageContainer from 'components/@shared/PageContainer/PageContainer.component';
import TextBox from 'components/@shared/TextBox/TextBox.component';
import TitleBox from 'components/@shared/TitleBox/TitleBox.component';

import Header from 'components/Header/Header.component';
import Loading from 'components/Loading/Loading.component';
import PaymentAmountContainer from 'components/PaymentAmountContainer/PaymentAmountContainer.component';
import ShoppingCartListContainer from 'components/ShoppingCartListContainer/ShoppingCartListContainer.component';

import { addAllItem, deleteAllItem } from 'redux/actions/orderList.action';
import { setSnackBarMessage } from 'redux/actions/snackbar.action';

import useDeleteCart from 'hooks/api/carts/useDeleteCarts';
import useLoadCarts from 'hooks/api/carts/useLoadCarts';

import { calculatePrice } from 'utils';

function ShoppingCartList() {
  const dispatch = useDispatch();

  const { carts, isLoading, loadCarts } = useLoadCarts();
  const { items: orderList } = useSelector(state => state.orderList);
  const { deleteCarts } = useDeleteCart(true);

  const total = calculatePrice(carts, orderList);

  const disabled = carts?.length === 0;
  const checked = carts?.length !== 0 && orderList.length === carts?.length;

  const handleChangeCheckBox = () => {
    if (checked) {
      dispatch(deleteAllItem());
    } else {
      dispatch(addAllItem(carts));
    }
  };

  const handleClickDeleteBox = async () => {
    if (orderList.length === 0) {
      dispatch(setSnackBarMessage('삭제할 상품이 존재하지 않습니다'));
      return;
    }
    if (window.confirm(`${orderList.length}개의 상품을 장바구니에서 삭제하시겠습니까?`)) {
      await deleteCarts({ productIds: orderList });
      dispatch(deleteAllItem());
      await loadCarts();
    }
  };

  return (
    <>
      <Header />
      <FlexBox as="main" justifyContent="center">
        <PageContainer direction="column" alignItems="center">
          <TitleBox as="h1">장바구니</TitleBox>
          {isLoading ? (
            <Loading />
          ) : (
            <FlexBox width="100%" gap="30px" justifyContent="space-between">
              <CartList>
                <h2 hidden>장바구니 상품들 리스트</h2>
                <FlexBox height="80px" justifyContent="space-between" alignItems="center">
                  <FlexBox gap="10px" alignItems="center">
                    <CheckBox
                      disabled={disabled}
                      checked={checked}
                      onChange={() => handleChangeCheckBox()}
                    />
                    <TextBox fontSize="small">{checked ? '선택해제' : '전체선택'}</TextBox>
                  </FlexBox>
                  <SelectedCartDeleteButton
                    height="50px"
                    lineHeight="50px"
                    textAlign="center"
                    cursor="pointer"
                    onClick={() => handleClickDeleteBox()}
                  >
                    상품삭제
                  </SelectedCartDeleteButton>
                </FlexBox>
                <ShoppingCartListContainer carts={carts} loadCarts={loadCarts} />
              </CartList>
              <PaymentAmountContainer count={orderList.length} total={total} />
            </FlexBox>
          )}
        </PageContainer>
      </FlexBox>
    </>
  );
}

export default ShoppingCartList;

const CartList = styled.article`
  width: 60%;
  min-width: 450px;
`;

const SelectedCartDeleteButton = styled(BorderBox).attrs({
  padding: '1rem',
  height: '50px',
  lineHeight: '50px',
  textAlign: 'center',
  cursor: 'pointer',
})`
  display: flex;
  align-items: center;
`;

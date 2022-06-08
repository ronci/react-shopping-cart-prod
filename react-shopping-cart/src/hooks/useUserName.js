import useFetch from './useFetch';
import { useSelector } from 'react-redux';

import { API_URL_PATH } from 'constants/api';

function useUserName() {
  const { accessToken } = useSelector(state => state.auth);
  const headers = accessToken && { Authorization: `Bearer ${accessToken}` };
  const { data } = useFetch({
    url: `${API_URL_PATH.NAME}`,
    headers,
  });

  return { name: data?.name };
}

export default useUserName;

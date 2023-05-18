import styles from './index.less';
import { Button } from 'antd';
import { useDispatch } from 'dva';

export default function IndexPage() {
    const dispatch = useDispatch();
    const handle = () => {
        console.log('11111')
        dispatch({
            type: 'chat/fetchChatInfo',
        })
    }
  return (
    <div>
      <h1 className={styles.title}>Page index</h1>
      <Button type="primary" onClick={handle}>按钮</Button>
    </div>
  );
}

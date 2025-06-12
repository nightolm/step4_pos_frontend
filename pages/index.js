// pages/index.js
import { useState } from 'react';

export default function Home() {
  // ビルド後・ブラウザ実行時に URL が正しく出力されるか確認用
  console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);

  const [code, setCode] = useState('');
  const [item, setItem] = useState(null);
  const [itemMessage, setItemMessage] = useState('');
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);

  // NEXT_PUBLIC_API_URL が undefined ならローカル開発用 localhost を使用
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL;

  // 商品取得
  const fetchProduct = async () => {
    const res = await fetch(`${apiUrl}/products/${code}`);
    if (res.ok) {
      const data = await res.json();
      setItem(data);
      setItemMessage('');
    } else {
      setItem(null);
      setItemMessage('商品マスタが未登録です');
    }
  };

  // リストに追加
  const addItem = () => {
    if (!item) return;
    setList([...list, item]);
    setTotal(total + item.price);
    setItem(null);
    setCode('');
    setItemMessage('');
  };

  // 購入確定
  const purchase = async () => {
    const res = await fetch(`${apiUrl}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        emp_cd: '9999999999',
        store_cd: '30',
        pos_no: '90',
        items: list.map(({ code, name, price }) => ({ code, name, price })),
      }),
    });
    const data = await res.json();
    if (data.success) {
      alert(`購入完了! 合計: ${data.total}円`);
      setList([]);
      setTotal(0);
    } else {
      alert('購入失敗');
    }
  };

  return (
    <main style={{ padding: 20 }}>
      <h1>POS Demo (Lv1)</h1>
      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="商品コード"
      />
      <button onClick={fetchProduct}>商品コード読み込み</button>

      {item && (
        <div>
          <p>名称: {item.name}</p>
          <p>単価: {item.price}円</p>
          <button onClick={addItem}>リストへ追加</button>
        </div>
      )}

      {!item && itemMessage && (
        <div style={{ color: 'red' }}>{itemMessage}</div>
      )}

      <h2>購入リスト</h2>
      <ul>
        {list.map((i, idx) => (
          <li key={idx}>
            {i.name} - {i.price}円
          </li>
        ))}
      </ul>
      <p>合計: {total}円</p>
      <button onClick={purchase} disabled={!list.length}>
        購入
      </button>
    </main>
  );
}

/**
 * 空の getServerSideProps を置くことで、
 * ページが「SSR扱い」になり静的エクスポート(nextExport)が無効化される。
 * これにより NEXT_PUBLIC_API_URL がクライアント側に埋め込まれる。
 */
export async function getServerSideProps() {
  return { props: {} };
}

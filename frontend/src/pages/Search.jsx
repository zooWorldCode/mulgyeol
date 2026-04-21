import { useSearchParams } from 'react-router-dom';

export default function Search() {
  const [params] = useSearchParams();
  const q = params.get('q')?.trim();

  return (
    <div>
      <h1>검색</h1>
      {q ? (
        <p>
          &quot;{q}&quot;에 대한 검색 결과는 추후 연결 예정입니다.
        </p>
      ) : (
        <p>검색어를 입력해 주세요.</p>
      )}
    </div>
  );
}

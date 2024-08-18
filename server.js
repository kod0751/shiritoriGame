const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

// CORS 문제를 방지하기 위해 모든 도메인에 대해 허용 설정
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

// API 요청을 처리하는 엔드포인트 생성
app.get('/api/dictionary', async (req, res) => {
  const { q, key } = req.query; // 클라이언트로부터 검색어와 API 키를 받음
  const apiUrl = `https://stdict.korean.go.kr/api/search.do?certkey_no=6808&key=${key}&type_search=search&req_type=json&q=${q}`;

  try {
    // API에 요청 보내기
    const response = await axios.get(apiUrl);
    // JSON 형식으로 응답 전달
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'API 요청 실패' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

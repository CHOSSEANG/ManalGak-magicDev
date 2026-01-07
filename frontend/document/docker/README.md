# Docker 이미지 빌드 및 실행 문서 (Frontend)

## 1. 프로젝트 빌드
### 프론트엔드 디렉토리로 이동
```bash
cd frontend/
```

### 프로젝트 빌드
```bash
# 의존성 설치
npm install

# 프로덕션 빌드
npm run build
```

## 2. Docker 이미지 빌드
### Docker 이미지 빌드
```bash
docker build -t manalgak-frontend .
```

### 빌드 확인
```bash
docker images | grep manalgak-frontend
```

## 3. .env 파일 생성
- `.env` 파일 생성
```
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_KAKAO_MAP_KEY=your_kakao_map_key
```

## 4. Docker 컨테이너 실행
### .env 파일로 환경변수 주입하여 실행
```bash
docker run --env-file .env -p 3000:3000 --name manalgak-frontend manalgak-frontend
```

### 백그라운드 실행
```bash
docker run -d --env-file .env -p 3000:3000 --name manalgak-frontend manalgak-frontend
```

## 5. 실행 확인
### 컨테이너 상태 확인
```bash
docker ps | grep manalgak-frontend
```

### 로그 확인
```bash
docker logs manalgak-frontend
```

### 애플리케이션 접속
- 브라우저에서 http://localhost:3000 접속

## 6. 컨테이너 관리
### 컨테이너 중지
```bash
docker stop manalgak-frontend
```

### 컨테이너 삭제
```bash
docker rm manalgak-frontend
```

### 이미지 삭제
```bash
docker rmi manalgak-frontend
```


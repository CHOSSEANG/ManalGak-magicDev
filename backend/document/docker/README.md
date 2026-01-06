# Docker 이미지 빌드 및 실행 문서

## 1. 프로젝트 빌드
### 백엔드 디렉토리로 이동
cd backend/
### 프로젝트 빌드
> mac  
./gradlew build

> window  
./gradlew.bat build
## 2. Docker 이미지 빌드
### Docker 이미지 빌드
docker build -t manalgak-backend .
### 빌드 확인
docker images | grep manalgak-backend
## 3. .env 파일 생성
- .env 파일 생성
## 4. Docker 컨테이너 실행
### .env 파일로 환경변수 주입하여 실행
docker run --env-file .env -p 8080:8080 --name manalgak-backend manalgak-backend
### 백그라운드 실행
docker run -d --env-file .env -p 8080:8080 --name manalgak-backend manalgak-backend
## 5. 실행 확인
### 컨테이너 상태 확인
docker ps | grep manalgak-backend
### 로그 확인
docker logs manalgak-backend

## 6. 컨테이너 관리
### 컨테이너 중지
docker stop manalgak-backend
### 컨테이너 삭제
docker rm manalgak-backend
### 이미지 삭제
docker rmi manalgak-backend

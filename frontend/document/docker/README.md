# frontend 디렉토리 이동
> cd frontend/
# Next.js 애플리케이션 빌드
> npm run build
# Docker 이미지 빌드
> docker build -t manalgak-frontend .
# .env 파일을 사용한 컨테이너 실행
> docker run --env-file .env -p 3000:3000 --name manalgak-frontend manalgak-frontend
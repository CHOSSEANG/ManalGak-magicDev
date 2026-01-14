## 기존  프로젝트 빌드
### 백엔드 > 백엔드 폴더로 이동
mac
> ./gradlew build

window
> ./gradlew.bat build
 
### 프론트 > 프론트 폴더로 이동

> npm install

> npm run build 


## 만약 실행중인 컨테이너가 있을 수 있으니 컨테이너 제거
> docker-compose down

## 컨테이너 실행
> docker-compose up --build

## 컨테이너 실행(백그라운드)
> docker-compose up --build -d

## 컨테이너 중지
> docker-compose stop

## 컨테이너 종료
> docker-compose down

## 현재 실행중인 컨테이너 확인
> docker-compose ps
 
## 실시간 로그 확인

> docker-compose logs -f
 
백엔드 로그 확인
> docker-compose logs -f backend

프론트엔드 로그 확인
> docker-compose logs -f backend







# ManalGak Backend API

만날각(ManalGak) 서비스의 백엔드 API 서버입니다.

## 기술 스택

- **Java 17**
- **Spring Boot 3.2.1**
- **Spring Data JPA**
- **Spring Security**
- **MySQL 8.0**
- **Redis**
- **Flyway** (DB Migration)
- **JWT** (인증/인가)
- **Swagger/OpenAPI** (API 문서)

## 프로젝트 구조

```
src/main/java/com/magicdev/manalgak/
├── common/                   # 공통 모듈 (Backend 1)
│   ├── config/              # 설정 클래스
│   ├── dto/                 # 공통 DTO
│   ├── exception/           # 예외 처리
│   ├── filter/              # 필터 (JWT 검증)
│   └── util/                # 유틸리티
│
├── domain/                   # 도메인별 패키지
│   ├── meeting/             # 모임 (Backend 3)
│   ├── participant/         # 참여자 + JWT (Backend 3)
│   ├── algorithm/           # 중점 계산 (Backend 1)
│   ├── external/            # 외부 API (Backend 2)
│   │   ├── kakao/
│   │   ├── odsay/
│   │   └── openai/
│   └── place/               # 장소 캐싱 (Backend 3)
│
└── health/                  # 헬스체크
```

## 환경 설정

### 1. 환경 변수 설정

로컬 개발을 위한 환경 변수를 설정하세요:

```bash
# 데이터베이스
export DB_HOST=localhost
export DB_USERNAME=root
export DB_PASSWORD=password

# Redis
export REDIS_HOST=localhost

# 외부 API 키
export KAKAO_API_KEY=your-kakao-api-key
export ODSAY_API_KEY=your-odsay-api-key
export OPENAI_API_KEY=your-openai-api-key

# JWT 시크릿 (최소 256비트)
export JWT_SECRET=your-jwt-secret-key-min-256-bits-long-for-hs256-algorithm
```

### 2. MySQL 실행 (Docker)

```bash
docker run -d \
  --name manalgak-mysql \
  -e MYSQL_ROOT_PASSWORD=password \
  -e MYSQL_DATABASE=manalgak \
  -p 3306:3306 \
  mysql:8.0
```

### 3. Redis 실행 (Docker)

```bash
docker run -d \
  --name manalgak-redis \
  -p 6379:6379 \
  redis:7-alpine
```

## 실행 방법

### Gradle을 사용한 실행

```bash
# 빌드
./gradlew build

# 로컬 환경으로 실행
./gradlew bootRun --args='--spring.profiles.active=local'

# Dev 환경으로 실행
./gradlew bootRun --args='--spring.profiles.active=dev'
```

### JAR 파일로 실행

```bash
# JAR 빌드
./gradlew bootJar

# 실행
java -jar -Dspring.profiles.active=local build/libs/manalgak-0.0.1-SNAPSHOT.jar
```

## 배포 (AWS EC2 + Docker + Nginx)

운영 환경은 AWS EC2에 Docker로 올리고, Nginx가 `/api` 경로를 백엔드로 프록시합니다.

- **API 엔드포인트**: https://manalgak.com/api
- **DB**: 로컬은 Docker MySQL, 운영은 RDS(MySQL)
- **실행**: `docker/docker-compose.yml` 사용, 프로필은 `prod`

## API 문서

서버 실행 후 아래 URL에서 Swagger UI를 확인할 수 있습니다:

- **Swagger UI**: http://localhost:8080/api/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/api/v3/api-docs

## 테스트

```bash
# 전체 테스트 실행
./gradlew test

# 특정 테스트 실행
./gradlew test --tests MidpointCalculationServiceTest
```

## 데이터베이스 마이그레이션

Flyway를 사용하여 데이터베이스 스키마를 관리합니다.

```
src/main/resources/db/migration/
├── V1__create_tables.sql
├── V2__add_indexes.sql
└── V3__add_constraints.sql
```

마이그레이션은 애플리케이션 시작 시 자동으로 실행됩니다.

## 역할 분담

### Backend 1 - 핵심 알고리즘 & 인프라
- `common/` - 공통 모듈 프레임워크
- `domain/algorithm/` - 중점 계산 알고리즘
- 인프라 구축 및 배포

### Backend 2 - 외부 API 연동
- `domain/external/kakao/` - Kakao API 연동
- `domain/external/odsay/` - ODsay API 연동
- `domain/external/openai/` - OpenAI API 연동

### Backend 3 - DB & 인증
- `domain/meeting/` - 모임 CRUD
- `domain/participant/` - 참여자 CRUD + JWT
- `domain/place/` - 장소 캐싱
- `resources/db/migration/` - Flyway 마이그레이션

## 참고 문서

- [프로젝트 개요](../.Claude/1.%20프로젝트%20개요.md)
- [ERD](../.Claude/2.%20ERD%20(데이터베이스%20설계).md)
- [API 명세서](../.Claude/3.%20API%20명세서.md)
- [역할 분담](../.Claude/4.%20역할%20분담.md)
- [프로젝트 구조](../.Claude/5.%20프로젝트%20구조.md)

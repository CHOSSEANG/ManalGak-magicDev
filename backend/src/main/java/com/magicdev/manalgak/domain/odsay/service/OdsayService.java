package com.magicdev.manalgak.domain.odsay.service;

import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.magicdev.manalgak.domain.algorithm.Model.Coordinate;
import com.magicdev.manalgak.domain.odsay.dto.GetRouteRequest;
import com.magicdev.manalgak.domain.odsay.dto.OdsayRouteResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class OdsayService {

	private final RestTemplate restTemplate;

	@Value("${api.odsay.key}")
	private String apiKey;

	@Value("${api.odsay.url}")
	private String baseUrl;

	public OdsayRouteResponse searchRoute(GetRouteRequest request) {
		try {
			// UriComponentsBuilder 생성
			UriComponentsBuilder builder = UriComponentsBuilder
				.fromHttpUrl(baseUrl + "/searchPubTransPathT")
				// 필수 파라미터
				.queryParam("SX", request.getStartX())
				.queryParam("SY", request.getStartY())
				.queryParam("EX", request.getEndX())
				.queryParam("EY", request.getEndY())
				.queryParam("apiKey", apiKey);

			// 선택적 파라미터 추가 (null이 아닐 때만)
			if (request.getOpt() != null) {
				builder.queryParam("OPT", request.getOpt());
			}

			if (request.getSearchType() != null) {
				builder.queryParam("SearchType", request.getSearchType());
			}

			if (request.getSearchPathType() != null) {
				builder.queryParam("SearchPathType", request.getSearchPathType());
			}

			// URL 생성
			URI url = builder.build(true).toUri();

			log.info("ODsay API 요청 URL: {}", url);
			log.info("baseUrl 값: {}", baseUrl);

			log.info("ODsay API 요청 URL: {}", url);
			log.info("🔑 실제 사용 중인 API Key: [{}]", apiKey);  // ← 추가

			// 헤더 설정
			HttpHeaders headers = new HttpHeaders();
			headers.set("Content-type", "application/json");

			HttpEntity<String> entity = new HttpEntity<>(headers);

			log.info("📌 최종 요청 URL: {}", url);

			// API 호출
			// 파싱
			ResponseEntity<OdsayRouteResponse> response = restTemplate.exchange(
				url,
				HttpMethod.GET,
				entity,
				OdsayRouteResponse.class
			);

			// ===== 응답 확인 (디버깅용) =====
			log.info("=== ODsay API 응답 확인 ===");
			log.info("response: {}", response);
			if (response != null) {
				log.info("response.getResult(): {}", response.getBody().getResult());
			}
			log.info("========================");

			Integer totalTime = null;
			if (response != null && response.getBody().getResult() != null
				&& response.getBody().getResult().getPath() != null
				&& !response.getBody().getResult().getPath().isEmpty()) {
				totalTime = response.getBody().getResult().getPath().get(0).getInfo().getTotalTime();
			}

			System.out.println(totalTime);

			return response.getBody();

		} catch (Exception e) {
			log.error("ODsay API 호출 중 오류 발생", e);
			throw new RuntimeException("대중교통 경로 검색에 실패했습니다.", e);
		}
	}

	/**
	 * 출발지 좌표 -> 도착지 좌표 대중교통 소요시간 조회
	 * @param origin 출발지 좌표
	 * @param destination 도착지 좌표
	 * @return 소요시간(분), 경로를 찾을 수 없으면 null
	 */
	public Integer getTravelTime(Coordinate origin, Coordinate destination) {
		try {
			GetRouteRequest request = GetRouteRequest.builder()
				.startX(origin.getLongitude())
				.startY(origin.getLatitude())
				.endX(destination.getLongitude())
				.endY(destination.getLatitude())
				.build();

			OdsayRouteResponse response = searchRoute(request);

			// 🆕 에러 체크 먼저!
			if (response.getError() != null) {
				log.warn("⚠️ ODsay API 에러 - code: {}, msg: {}",
					response.getError().getCode(),
					response.getError().getMsg());
				return null;
			}

			// 응답 검증
			if (response == null || response.getResult() == null) {
				log.warn("ODsay API 응답이 null입니다.");
				return null;
			}

			if (response.getResult().getPath() == null ||
				response.getResult().getPath().isEmpty()) {
				log.warn("경로를 찾을 수 없습니다. origin: {}, destination: {}",
					origin, destination);
				return null;
			}

			// 첫 번째 경로의 총 소요시간 추출
			Integer totalTime = response.getResult()
				.getPath()
				.get(0)
				.getInfo()
				.getTotalTime();

			log.info("소요시간 조회 성공: {}분 (출발: {}, 도착: {})",
				totalTime, origin, destination);

			return totalTime;

		} catch (Exception e) {
			log.error("소요시간 조회 중 오류 발생. origin: {}, destination: {}",
				origin, destination, e);
			return null;
		}
	}

	/**
	 * 출발지 좌표 -> 도착지 좌표 경로 전체 정보 조회
	 * @param origin 출발지 좌표
	 * @param destination 도착지 좌표
	 * @return 경로 응답 (경로 없으면 null)
	 */
	public OdsayRouteResponse getRouteWithPath(Coordinate origin, Coordinate destination) {
		try {
			GetRouteRequest request = GetRouteRequest.builder()
				.startX(origin.getLongitude())
				.startY(origin.getLatitude())
				.endX(destination.getLongitude())
				.endY(destination.getLatitude())
				.build();

			OdsayRouteResponse response = searchRoute(request);

			// 에러 체크
			if (response.getError() != null) {
				log.warn("⚠️ ODsay API 에러 - code: {}, msg: {}",
					response.getError().getCode(),
					response.getError().getMsg());
				return null;
			}

			// 응답 검증
			if (response == null || response.getResult() == null) {
				log.warn("ODsay API 응답이 null입니다.");
				return null;
			}

			if (response.getResult().getPath() == null ||
				response.getResult().getPath().isEmpty()) {
				log.warn("경로를 찾을 수 없습니다. origin: {}, destination: {}",
					origin, destination);
				return null;
			}

			log.info("경로 조회 성공 (출발: {}, 도착: {})", origin, destination);

			return response;

		} catch (Exception e) {
			log.error("경로 조회 중 오류 발생. origin: {}, destination: {}",
				origin, destination, e);
			return null;
		}
	}
}

package com.magicdev.manalgak.domain.odsay.service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

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

			// API Key 수동 인코딩
			String encodedApiKey = URLEncoder.encode(apiKey, StandardCharsets.UTF_8);

			// UriComponentsBuilder 생성
			UriComponentsBuilder builder = UriComponentsBuilder
				.fromHttpUrl(baseUrl + "/searchPubTransPathT")
				// 필수 파라미터
				.queryParam("SX", request.getStartX())
				.queryParam("SY", request.getStartY())
				.queryParam("EX", request.getEndX())
				.queryParam("EY", request.getEndY())
				.queryParam("apiKey", encodedApiKey);

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
			String url = builder.build().toUriString();

			log.info("ODsay API 요청 URL: {}", url);
			log.info("baseUrl 값: {}", baseUrl);

			log.info("ODsay API 요청 URL: {}", url);
			log.info("🔑 실제 사용 중인 API Key: [{}]", apiKey);  // ← 추가

			// 실제 절대 경로인지 확인
			if (!url.startsWith("http")) {
				log.error("❌ 상대 경로로 요청되고 있습니다!");
			}

			// --------JSON 문자열 파싱
			String jsonResponse = restTemplate.getForObject(url, String.class);
			log.info("ODsay API JSON 응답: {}", jsonResponse);

			// API 호출
			OdsayRouteResponse response = restTemplate.getForObject(url, OdsayRouteResponse.class);  // 🔥 String.class -> OdsayRouteResponse.class

			// ===== 응답 확인 (디버깅용) =====
			log.info("=== ODsay API 응답 확인 ===");
			log.info("response: {}", response);
			if (response != null) {
				log.info("response.getResult(): {}", response.getResult());
			}
			log.info("========================");

			Integer totalTime = null;
			if (response != null && response.getResult() != null
				&& response.getResult().getPath() != null
				&& !response.getResult().getPath().isEmpty()) {
				totalTime = response.getResult().getPath().get(0).getInfo().getTotalTime();
			}

			System.out.println(totalTime);

			return response;

		} catch (Exception e) {
			log.error("ODsay API 호출 중 오류 발생", e);
			throw new RuntimeException("대중교통 경로 검색에 실패했습니다.", e);
		}
	}
}

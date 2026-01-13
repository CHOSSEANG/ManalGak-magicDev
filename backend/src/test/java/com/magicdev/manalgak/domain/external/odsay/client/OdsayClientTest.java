package com.magicdev.manalgak.domain.external.odsay.client;

import com.magicdev.manalgak.common.exception.ExternalApiException;
import com.magicdev.manalgak.domain.external.odsay.dto.OdsayRouteRequest;
import com.magicdev.manalgak.domain.external.odsay.dto.OdsayRouteResponse;
import com.magicdev.manalgak.domain.external.odsay.dto.OdsayTimeTableRequest;
import com.magicdev.manalgak.domain.external.odsay.dto.OdsayTimeTableResponse;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestTemplate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.queryParam;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withStatus;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

class OdsayClientTest {

    private static final String API_KEY = "test-key";
    private static final String API_URL = "https://api.odsay.com";

    @Test
    void searchRoute_buildsRequestAndParsesResponse() {
        RestTemplate restTemplate = new RestTemplate();
        MockRestServiceServer server = MockRestServiceServer.createServer(restTemplate);
        OdsayClient client = new OdsayClient(restTemplate, API_KEY, API_URL);

        OdsayRouteRequest request = OdsayRouteRequest.builder()
                .startX(127.0)
                .startY(37.0)
                .endX(128.0)
                .endY(36.0)
                .opt(0)
                .build();

        String payload = """
                {
                  "result": {
                    "path": [
                      {
                        "info": {
                          "totalTime": 45,
                          "payment": 1400,
                          "busTransitCount": 0,
                          "subwayTransitCount": 2,
                          "trafficDistance": 12500
                        },
                        "subPath": [
                          {
                            "trafficType": 1,
                            "distance": 800,
                            "sectionTime": 10,
                            "startName": "A",
                            "endName": "B",
                            "lane": [
                              {
                                "name": "Line2",
                                "subwayCode": 2
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                }
                """;

        server.expect(requestTo(Matchers.containsString("/v1/api/searchPubTransPathT")))
                .andExpect(method(HttpMethod.GET))
                .andExpect(queryParam("SX", "127.0"))
                .andExpect(queryParam("SY", "37.0"))
                .andExpect(queryParam("EX", "128.0"))
                .andExpect(queryParam("EY", "36.0"))
                .andExpect(queryParam("OPT", "0"))
                .andExpect(queryParam("apiKey", API_KEY))
                .andRespond(withSuccess(payload, MediaType.APPLICATION_JSON));

        OdsayRouteResponse response = client.searchRoute(request);

        assertThat(response).isNotNull();
        assertThat(response.getResult().getPath()).hasSize(1);
        assertThat(response.getResult().getPath().get(0).getInfo().getTotalTime()).isEqualTo(45);

        server.verify();
    }

    @Test
    void getTimeTable_buildsRequestAndParsesResponse() {
        RestTemplate restTemplate = new RestTemplate();
        MockRestServiceServer server = MockRestServiceServer.createServer(restTemplate);
        OdsayClient client = new OdsayClient(restTemplate, API_KEY, API_URL);

        OdsayTimeTableRequest request = OdsayTimeTableRequest.builder()
                .stationID("222")
                .build();

        String payload = """
                {
                  "result": {
                    "OrdList": {
                      "up": {
                        "time": [
                          {
                            "Idx": 23,
                            "list": "34(성수) 52(성수)"
                          },
                          {
                            "Idx": 24,
                            "list": "10(성수) 54(삼성)"
                          }
                        ]
                      }
                    },
                    "laneName": "수도권 2호선",
                    "stationName": "강남",
                    "stationID": 222
                  }
                }
                """;

        server.expect(requestTo(Matchers.containsString("/v1/api/subwayTimeTable")))
                .andExpect(method(HttpMethod.GET))
                .andExpect(queryParam("stationID", "222"))
                .andExpect(queryParam("wayCode", "1"))
                .andExpect(queryParam("showOff", "1"))
                .andExpect(queryParam("apiKey", API_KEY))
                .andRespond(withSuccess(payload, MediaType.APPLICATION_JSON));

        OdsayTimeTableResponse response = client.getTimeTable(request);

        assertThat(response).isNotNull();
        assertThat(response.getResult()).isNotNull();
        assertThat(response.getResult().getStationName()).isEqualTo("강남");
        assertThat(response.getResult().getLaneName()).isEqualTo("수도권 2호선");
        assertThat(response.getResult().getOrdList()).isNotNull();
        assertThat(response.getResult().getOrdList().getUp()).isNotNull();
        assertThat(response.getResult().getOrdList().getUp().getTime()).hasSize(2);
        assertThat(response.getResult().getOrdList().getUp().getTime().get(1).getIdx()).isEqualTo(24);
        assertThat(response.getResult().getOrdList().getUp().getTime().get(1).getList()).contains("54(삼성)");

        server.verify();
    }

    @Test
    void searchRoute_throwsExternalApiExceptionOnServerError() {
        RestTemplate restTemplate = new RestTemplate();
        MockRestServiceServer server = MockRestServiceServer.createServer(restTemplate);
        OdsayClient client = new OdsayClient(restTemplate, API_KEY, API_URL);

        OdsayRouteRequest request = OdsayRouteRequest.builder()
                .startX(127.0)
                .startY(37.0)
                .endX(128.0)
                .endY(36.0)
                .build();

        server.expect(requestTo(Matchers.containsString("/v1/api/searchPubTransPathT")))
                .andExpect(method(HttpMethod.GET))
                .andRespond(withStatus(HttpStatus.INTERNAL_SERVER_ERROR));

        assertThatThrownBy(() -> client.searchRoute(request))
                .isInstanceOf(ExternalApiException.class);

        server.verify();
    }
}

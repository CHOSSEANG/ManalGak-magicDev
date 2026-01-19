package com.magicdev.manalgak.domain.algorithm.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.magicdev.manalgak.domain.algorithm.Model.Coordinate;
import com.magicdev.manalgak.domain.algorithm.service.MidpointCalculationService;

@RestController
@RequestMapping("/midpoint")
public class AlgorithmController {

	private MidpointCalculationService midpointCalculationService;

	@PostMapping
	public Coordinate midpointFind(@RequestBody List<Coordinate> coordinates){
		/**
		 * 가장 기본적인 구현 - 이것만 있어도 충분
		 */
		// 1단계: 기하학적 중심점 계산 (필수)
		Coordinate midpoint = midpointCalculationService.calculateGeometricCenter(coordinates);

		return midpoint;
	}

}

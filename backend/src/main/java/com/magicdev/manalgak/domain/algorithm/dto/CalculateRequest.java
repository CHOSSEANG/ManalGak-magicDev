package com.magicdev.manalgak.domain.algorithm.dto;

import java.util.List;

import com.magicdev.manalgak.domain.algorithm.Model.Coordinate;

import lombok.Data;

@Data
public class CalculateRequest {
	List<Coordinate> coordinates;
}

package com.weblab.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PointRequest {
    @NotNull(message = "X is required")
    @DecimalMin(value = "-2.0", inclusive = true, message = "X must be >= -2")
    @DecimalMax(value = "2.0", inclusive = true, message = "X must be <= 2")
    private Double x;
    
    @NotNull(message = "Y is required")
    @DecimalMin(value = "-5.0", inclusive = true, message = "Y must be >= -5")
    @DecimalMax(value = "3.0", inclusive = true, message = "Y must be <= 3")
    private Double y;
    
    @NotNull(message = "R is required")
    @DecimalMin(value = "0.5", inclusive = true, message = "R must be >= 0.5")
    @DecimalMax(value = "2.0", inclusive = true, message = "R must be <= 2")
    private Double r;
}

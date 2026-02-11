package com.weblab.service;

import org.springframework.stereotype.Service;

@Service
public class AreaCheckService {
    
    public boolean check(Double x, Double y, Double r) {
        if (x == null || y == null || r == null || r <= 0) {
            return false;
        }
        
        if (x >= 0 && y >= 0) {
            return (x * x + y * y) <= (r / 2) * (r / 2);
        }
        
        if (x <= 0 && y >= 0) {
            return y <= (0.5 * x + 0.5 * r);
        }
        
        if (x <= 0 && y <= 0) {
            return (x >= -r / 2) && (y >= -r);
        }
        
        return false;
    }
}

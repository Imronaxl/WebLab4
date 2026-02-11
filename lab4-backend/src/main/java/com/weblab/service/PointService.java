package com.weblab.service;

import com.weblab.entity.PointResult;
import com.weblab.entity.User;
import com.weblab.repository.PointResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PointService {
    
    private final PointResultRepository pointResultRepository;
    private final AreaCheckService areaCheckService;
    
    @Transactional
    public PointResult addPoint(Double x, Double y, Double r, User user) {
        boolean hit = areaCheckService.check(x, y, r);
        PointResult point = new PointResult(x, y, r, hit, user);
        return pointResultRepository.save(point);
    }
    
    public List<PointResult> getUserPoints(User user) {
        return pointResultRepository.findByUserOrderByCheckDateDesc(user);
    }
    
    @Transactional
    public void clearUserPoints(User user) {
        pointResultRepository.deleteByUser(user);
    }
}

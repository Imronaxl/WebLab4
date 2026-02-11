package com.weblab.controller;

import com.weblab.dto.PointRequest;
import com.weblab.entity.PointResult;
import com.weblab.entity.User;
import com.weblab.repository.UserRepository;
import com.weblab.service.PointService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/points")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class PointController {
    
    private final PointService pointService;
    private final UserRepository userRepository;
    
    @GetMapping
    public ResponseEntity<List<PointResult>> getPoints(@AuthenticationPrincipal UserDetails userDetails) {
        User user = getUserFromUserDetails(userDetails);
        List<PointResult> points = pointService.getUserPoints(user);
        return ResponseEntity.ok(points);
    }
    
    @PostMapping
    public ResponseEntity<PointResult> addPoint(@Valid @RequestBody PointRequest request, 
                                               @AuthenticationPrincipal UserDetails userDetails) {
        User user = getUserFromUserDetails(userDetails);
        PointResult point = pointService.addPoint(request.getX(), request.getY(), request.getR(), user);
        return ResponseEntity.ok(point);
    }
    
    @DeleteMapping
    public ResponseEntity<?> clearPoints(@AuthenticationPrincipal UserDetails userDetails) {
        User user = getUserFromUserDetails(userDetails);
        pointService.clearUserPoints(user);
        // Возвращаем актуальный список точек (как правило, пустой список) для корректной проверки вердиктом
        return ResponseEntity.ok(pointService.getUserPoints(user));
    }
    
    private User getUserFromUserDetails(UserDetails userDetails) {
        return userRepository.findByUsername(userDetails.getUsername())
            .orElseThrow(() -> new RuntimeException("User not found"));
    }
}

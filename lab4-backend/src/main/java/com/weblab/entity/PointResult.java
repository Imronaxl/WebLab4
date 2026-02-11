package com.weblab.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "results")
@Data
@NoArgsConstructor
public class PointResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Double x;

    @Column(nullable = false)
    private Double y;

    @Column(nullable = false)
    private Double r;

    @Column(nullable = false)
    private Boolean hit;

    @JsonFormat(pattern = "dd.MM.yyyy HH:mm:ss")
    @Column(nullable = false)
    private LocalDateTime checkDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    public PointResult(Double x, Double y, Double r, Boolean hit, User user) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.hit = hit;
        this.user = user;
        this.checkDate = LocalDateTime.now();
    }
}

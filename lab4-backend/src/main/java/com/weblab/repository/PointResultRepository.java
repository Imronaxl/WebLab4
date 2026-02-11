package com.weblab.repository;

import com.weblab.entity.PointResult;
import com.weblab.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PointResultRepository extends JpaRepository<PointResult, Long> {
    List<PointResult> findByUserOrderByCheckDateDesc(User user);
    void deleteByUser(User user);
}

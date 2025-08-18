package com.HMS.HMS.repository;

import com.HMS.HMS.model.ward.Ward;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WardRepository extends JpaRepository<Ward,Long> {
}

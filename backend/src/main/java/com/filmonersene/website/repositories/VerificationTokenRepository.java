package com.filmonersene.website.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.filmonersene.website.entities.User;
import com.filmonersene.website.entities.VerificationToken;

import jakarta.transaction.Transactional;

@Repository
public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {
	Optional<VerificationToken> findByToken(String token);
	
	@Transactional
	@Modifying
	@Query("DELETE FROM VerificationToken v WHERE v.user = :user")
	void deleteByUser(@Param("user") User user);

}

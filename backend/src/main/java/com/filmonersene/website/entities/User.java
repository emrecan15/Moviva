package com.filmonersene.website.entities;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name="users")
public class User {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(name="username" , nullable = false,unique = true)
	private String username;
	
	@Column(name="password" , nullable = false)
	private String password;
	
	@Column(name="email", nullable = false,unique=true)
	private String email;

	@Column(name="bio")
	private String bio;
	
	@Column(name="name",nullable = false)
	private String name;
	
	@Column(name="surname" ,nullable = false)
	private String surname;
	
	@Column(nullable = false)
	private int points = 0;
	
	@Column(name="enabled")
	private boolean enabled=false;
	
	@ManyToOne
	@JoinColumn(name = "tag_id", nullable = false)
	private Tag tag;
	
	@ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id")
    private Role role;

	@OneToMany(mappedBy = "recommendedBy")
    private List<Movie> recommendedMovies = new ArrayList<>();

	@OneToMany(mappedBy = "user")
	private List<MovieList> movieLists;

	@Column(name = "created_at",updatable = false)
	@CreationTimestamp
	private LocalDateTime createdAt;
	


	
}

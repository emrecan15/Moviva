package com.filmonersene.website.entities;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name="movies")
public class Movie {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true,nullable = false)
    private Integer tmdbId;

    @Column(name="poster_url",columnDefinition = "TEXT")
    private String posterUrl;

    @Column(name="backdrop_url",columnDefinition = "TEXT")
    private String backdropUrl;

    @Column(name="movie_name")
    private String movieName;

    @Column(name="original_title")
    private String originalTitle;

    @Column(name="description", columnDefinition = "TEXT")
    private String description;

    @Column(name="release_date")
    private String releaseDate;

    @Column(name="runtime")
    private String runtime;

    @Column(name="imdb_id")
    private String imdbId;

    @Column(name="vote_average")
    private Double voteAverage;

    @Column(name="original_language")
    private String originalLanguage;

    @Column(name="country")
    private String country;
    
    @Column(name = "popularity")
    private Double popularity;
    
    @Column(name="director")
    private String director;

    @Column(name = "tagline")
    private String tagline;

    @ManyToOne
    @JoinColumn(name = "recommended_by_user_id",nullable = false)
    private User recommendedBy;
    
    @Column(name="user_comment",columnDefinition = "TEXT",nullable = false)
    private String userComment;
    
    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;


    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
        name = "movie_genres",
        joinColumns = @JoinColumn(name = "movie_id"),
        inverseJoinColumns = @JoinColumn(name = "genre_id")
    )
    @OrderBy("name ASC")
    private Set<Genre> genres = new LinkedHashSet<>();

    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL)
    private List<Comment> comments;

    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL)
    private List<MovieLike> likes;
}

package com.filmonersene.website.services.concretes;

import com.filmonersene.website.dtos.recommendation.request.UpdateRecommendationRequest;
import com.filmonersene.website.dtos.recommendation.response.UpdateRecommendationResponse;
import com.filmonersene.website.dtos.request.CreateRecommendationRequest;
import com.filmonersene.website.dtos.response.TmdbCrewResponse;
import com.filmonersene.website.dtos.response.TmdbGenreResponse;
import com.filmonersene.website.dtos.response.TmdbMovieDetailResponse;
import com.filmonersene.website.dtos.response.TmdbProductionCountryResponse;
import com.filmonersene.website.entities.Genre;
import com.filmonersene.website.entities.Movie;
import com.filmonersene.website.entities.User;
import com.filmonersene.website.exceptions.MovieAlreadyExistsException;
import com.filmonersene.website.exceptions.MovieNotFoundException;
import com.filmonersene.website.exceptions.ResourceAccessDeniedException;
import com.filmonersene.website.exceptions.UserNotFoundException;
import com.filmonersene.website.repositories.GenreRepository;
import com.filmonersene.website.repositories.MovieRepository;
import com.filmonersene.website.repositories.UserRepository;
import com.filmonersene.website.services.abstracts.RecommendService;
import com.filmonersene.website.services.abstracts.TmdbService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class RecommendManager implements RecommendService {

    private final MovieRepository movieRepository;
    private final UserRepository userRepository;
    private final TmdbService tmdbService;
    private final GenreRepository genreRepository;

    @Override
    public String recommend(CreateRecommendationRequest request, UserDetails userDetails) {

        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new UserNotFoundException("Kullanıcı bulunamadı."));


        if (movieRepository.existsByTmdbId(request.tmdbId()))
        {
            throw new MovieAlreadyExistsException("Bu film zaten sitede mevcut");
        }

        TmdbMovieDetailResponse tmdbMovie = tmdbService.getMovieById(request.tmdbId());

        Movie movie = new Movie();

        movie.setTmdbId(tmdbMovie.id());
        movie.setMovieName(tmdbMovie.title());
        movie.setOriginalTitle(tmdbMovie.originalTitle());
        movie.setPosterUrl(tmdbMovie.posterPath());
        movie.setBackdropUrl(tmdbMovie.backdropPath());
        movie.setDescription(tmdbMovie.overview());
        movie.setReleaseDate(tmdbMovie.releaseDate());

        if (tmdbMovie.runtime() != null) {
            movie.setRuntime(String.valueOf(tmdbMovie.runtime()));
        }
        movie.setOriginalLanguage(tmdbMovie.originalLanguage());
        movie.setImdbId(tmdbMovie.imdbId());

        String country = tmdbMovie.productionCountries()
                .stream()
                .map(TmdbProductionCountryResponse::name)
                .findFirst()
                .orElse(null);

        movie.setCountry(country);
        movie.setPopularity(tmdbMovie.popularity());
        movie.setVoteAverage(tmdbMovie.voteAverage());
        movie.setTagline(tmdbMovie.tagline());

        String director = tmdbMovie.credits()
                .crew()
                .stream()
                .filter(crew -> "Director".equals(crew.job()))
                .map(TmdbCrewResponse::name)
                .findFirst()
                .orElse(null);

        movie.setDirector(director);

        movie.setRecommendedBy(user);

        movie.setUserComment(request.comment());

        Set<Genre> genres = new HashSet<>();

        for (TmdbGenreResponse genreResponse : tmdbMovie.genres()) {

            Genre genre = genreRepository.findByTmdbId(genreResponse.id())
                    .orElseGet(() -> {
                        Genre newGenre = new Genre();
                        newGenre.setTmdbId(genreResponse.id());
                        newGenre.setName(genreResponse.name());
                        return genreRepository.save(newGenre);
                    });

            genres.add(genre);
        }

        movie.setGenres(genres);

        movieRepository.save(movie);


        return "Film başarıyla önerildi.";
    }

    @Override
    @Transactional
    public UpdateRecommendationResponse updateRecommendation(UserDetails userDetails, UpdateRecommendationRequest updateRecommendationRequest, Long movieId) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow(() -> new UserNotFoundException("Kullanıcı bulunamadı."));
        Movie movie = movieRepository.findById(movieId).orElseThrow(() -> new MovieNotFoundException("Film bulunamadı."));

        if (!user.getId().equals(movie.getRecommendedBy().getId()))
        {
            throw new ResourceAccessDeniedException("Bu öneriyi değiştirme yetkiniz yok.");
        }

        movie.setUserComment(updateRecommendationRequest.recommenderComment());

        movieRepository.save(movie);

        return new UpdateRecommendationResponse(movie.getUserComment());
    }
}

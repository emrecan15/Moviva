package com.filmonersene.website.services.concretes;

import com.filmonersene.website.dtos.movielist.request.CreateMovieListRequest;
import com.filmonersene.website.dtos.movielist.request.UpdateMovieListRequest;
import com.filmonersene.website.dtos.movielist.response.MovieListResponse;
import com.filmonersene.website.entities.MovieList;
import com.filmonersene.website.entities.User;
import com.filmonersene.website.exceptions.ResourceAccessDeniedException;
import com.filmonersene.website.exceptions.ResourceNotFoundException;
import com.filmonersene.website.exceptions.UserNotFoundException;
import com.filmonersene.website.mapper.MovieListMapper;
import com.filmonersene.website.repositories.MovieListItemRepository;
import com.filmonersene.website.repositories.MovieListRepository;
import com.filmonersene.website.repositories.UserRepository;
import com.filmonersene.website.services.abstracts.MovieListService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MovieListManager implements MovieListService {

    private final MovieListRepository movieListRepository;
    private final UserRepository userRepository;
    private final MovieListMapper movieListMapper;
    private final MovieListItemRepository movieListItemRepository;


    @Override
    public Page<MovieListResponse> getMovieLists(UserDetails userDetails, Pageable pageable) {
        User user = getUserFromUserDetails(userDetails);
        Page<MovieList> movieList = movieListRepository.findByUser(user,pageable);
        return movieList.map(movieListMapper::toResponse);
    }

    @Override
    public MovieListResponse getMovieList(UserDetails userDetails, Long listId) {
        User user = getUserFromUserDetails(userDetails);

        MovieList movieList = movieListRepository.findById(listId).orElseThrow(() -> new ResourceNotFoundException("Liste bulunamadı."));

        if (!movieList.getUser().getId().equals(user.getId()))
        {
            throw new ResourceAccessDeniedException("Bu listeyi görüntüleme yetkiniz yok.");
        }

        int totalMovies = movieListItemRepository.countByMovieListId(listId);

        Double avgRating = movieListItemRepository.getAverageRatingByListId(listId);
        Double averageRating = avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0.0;

        List<String> runtimes = movieListItemRepository.findRuntimesByListId(listId);
        String totalRuntime = calculateTotalRuntime(runtimes);

        return new MovieListResponse(
                movieList.getId(),
                movieList.getName(),
                movieList.getDescription(),
                movieList.getCreatedAt(),
                movieList.isPublic(),
                movieList.getUser().getUsername(),
                totalMovies,
                averageRating,
                totalRuntime
        );
    }

    private String calculateTotalRuntime(List<String> runtimes) {
        if (runtimes == null || runtimes.isEmpty()) {
            return "0dk";
        }

        int totalMinutes = runtimes.stream()
                .filter(r -> r != null && !r.isBlank())
                .mapToInt(r -> {
                    String cleaned = r.replaceAll("[^0-9]", "");
                    return cleaned.isEmpty() ? 0 : Integer.parseInt(cleaned);
                })
                .sum();

        int hours = totalMinutes / 60;
        int minutes = totalMinutes % 60;

        if (hours > 0 && minutes > 0) {
            return hours + "s " + minutes + "dk";
        } else if (hours > 0) {
            return hours + "s";
        }
        return minutes + "dk";
    }

    @Override
    public MovieListResponse createMovieList(UserDetails userDetails, CreateMovieListRequest request) {
        User user = getUserFromUserDetails(userDetails);

        MovieList movieList = movieListMapper.toEntity(request);
        movieList.setUser(user);

        MovieList savedMovieList = movieListRepository.save(movieList);

        return movieListMapper.toResponse(savedMovieList);
    }

    @Override
    @Transactional
    public MovieListResponse updateMovieList(UserDetails userDetails, UpdateMovieListRequest request, Long listId) {
        User user = getUserFromUserDetails(userDetails);

        MovieList movieList = movieListRepository.findById(listId)
                .orElseThrow(() -> new ResourceNotFoundException("Liste bulunamadı."));

        if (!movieList.getUser().getId().equals(user.getId()))
        {
            throw new ResourceAccessDeniedException("Bu listeyi güncelleme yetkiniz yok.");
        }
        movieListMapper.updateEntity(request,movieList);
        movieListRepository.save(movieList);

        return movieListMapper.toResponse(movieList);
    }

    @Override
    @Transactional
    public void deleteMovieList(UserDetails userDetails, Long listId) {
        User user = getUserFromUserDetails(userDetails);

        MovieList movieList = movieListRepository.findById(listId).orElseThrow(() -> new ResourceNotFoundException("Liste bulunamadı."));
        if (!movieList.getUser().getId().equals(user.getId()))
        {
            throw new ResourceAccessDeniedException("Bu listeyi silme yetkiniz yok.");
        }
        movieListRepository.deleteById(listId);

    }

    private User getUserFromUserDetails(UserDetails userDetails){
        return userRepository.findByEmail(userDetails.getUsername()).orElseThrow(() -> new UserNotFoundException("Kullanıcı bulunamadı."));
    }
}

package com.filmonersene.website.dtos.movielist.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

public record CreateMovieListRequest(
        @Schema(description = "Listenin başlığı", example = "Favori Bilim Kurgu Filmlerim", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotBlank
        String name,

        @Schema(description = "Listenin herkese açık olup olmadığı", example = "True")
        boolean isPublic
) {
}

package com.filmonersene.website.dtos.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateRecommendationRequest(
        @NotNull
        Integer tmdbId,

        @NotBlank(message = "Öneri yazısı zorunludur.")
        @Size(min = 10, max = 2000, message = "Öneri yazısı 10-2000 karakter arasında olmalıdır.")
        String comment
) {
}

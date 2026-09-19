package com.filmonersene.website.dtos.recommendation.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateRecommendationRequest(
        @NotBlank(message = "Tavsiye yazısı sadece boşluklardan oluşamaz veya boş bırakılamaz.")
        @Size(min = 10, max = 2000, message = "Tavsiye yazısı 10 ile 2000 karakter arasında olmalıdır.")
        String recommenderComment) {
}

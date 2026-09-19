package com.filmonersene.website.dtos.comment.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateCommentRequest(
        @NotBlank(message = "Yorum boş bırakılamaz.")
        @Size(min = 2, max = 500, message = "Yorum 2 ile 500 karakter arasında olmalıdır.")
        String comment
) {
}

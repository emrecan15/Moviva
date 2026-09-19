package com.filmonersene.website.dtos.response;

import java.util.List;

public record TmdbCreditsResponse(List<TmdbCrewResponse> crew) {
}

package com.filmonersene.website.dtos.response;

import com.fasterxml.jackson.annotation.JsonProperty;

public record TmdbProductionCountryResponse(@JsonProperty("iso_3166_1")
                                             String iso31661,
                                            String name) {
}

package com.cineverse.dto;

import java.util.ArrayList;
import java.util.List;

public class RecommendationDto {
    private ContentSummaryDto basedOnContent;
    private ContentSummaryDto nextChronologicalWatch;
    private ContentSummaryDto nextReleaseOrderWatch;
    private List<ContentSummaryDto> relatedStoryContent = new ArrayList<>();
    private List<ContentSummaryDto> sameSagaContent = new ArrayList<>();
    private List<ContentSummaryDto> sameUniverseContent = new ArrayList<>();

    public RecommendationDto() {}

    public ContentSummaryDto getBasedOnContent() { return basedOnContent; }
    public void setBasedOnContent(ContentSummaryDto basedOnContent) { this.basedOnContent = basedOnContent; }

    public ContentSummaryDto getNextChronologicalWatch() { return nextChronologicalWatch; }
    public void setNextChronologicalWatch(ContentSummaryDto nextChronologicalWatch) { this.nextChronologicalWatch = nextChronologicalWatch; }

    public ContentSummaryDto getNextReleaseOrderWatch() { return nextReleaseOrderWatch; }
    public void setNextReleaseOrderWatch(ContentSummaryDto nextReleaseOrderWatch) { this.nextReleaseOrderWatch = nextReleaseOrderWatch; }

    public List<ContentSummaryDto> getRelatedStoryContent() { return relatedStoryContent; }
    public void setRelatedStoryContent(List<ContentSummaryDto> relatedStoryContent) { this.relatedStoryContent = relatedStoryContent; }

    public List<ContentSummaryDto> getSameSagaContent() { return sameSagaContent; }
    public void setSameSagaContent(List<ContentSummaryDto> sameSagaContent) { this.sameSagaContent = sameSagaContent; }

    public List<ContentSummaryDto> getSameUniverseContent() { return sameUniverseContent; }
    public void setSameUniverseContent(List<ContentSummaryDto> sameUniverseContent) { this.sameUniverseContent = sameUniverseContent; }
}

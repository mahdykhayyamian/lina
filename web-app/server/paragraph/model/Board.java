package lina.paragraph.model;
import java.util.Date;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Board {
    int id;
    int roomId;
    int contentTypeId;
    String contentType;
    String commands;
    int nextBoardId;
    int previousBoardId;
    Date created;
    Date updated;

    public String toString() {
        return "(id = " + id + ", roomId = " + roomId + ", contentType = " + contentType + ", previousBoardId = " + previousBoardId + "\n)";
    }
}
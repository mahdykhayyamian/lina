package lina.whiteboard.model;
import java.util.Date;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Board {
    long id;
    long roomId;
    long contentTypeId;
    String contentType;
    String commands;
    Date created;
    Date updated;
}
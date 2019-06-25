package lina.whiteboard.model;
import java.util.Date;

import lombok.Data;

@Data
public class Board {
    long id;
    long roomId;
    long contentTypeId;
    String commands;
    Date created;
    Date updated;
}
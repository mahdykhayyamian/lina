package lina.whiteboard.model;
import java.util.Date;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ContentType {
    long id;
    String type;
    String name;
    Date created;
    Date updated;
}
package lina.paragraph.model;
import java.util.Date;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ChatMessage {
    int id;
    int roomId;
    String linaUserId;
    String textContent;
    Date created;
    Date updated;

    public String toString() {
        return "(id = " + id + ", roomId = " + roomId + ", linaUserId = " + linaUserId + ", textContent = " + textContent + "\n)";
    }
}
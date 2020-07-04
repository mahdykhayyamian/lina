package lina.paragraph.model;
import java.util.Date;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ChatMessage {
    int id;
    int roomId;
    String senderEmail;
    String senderGivenName;
    String textContent;
    Date created;
    Date updated;

    public String toString() {
        return "(id = " + id + ", roomId = " + roomId +  ", senderGivenName = " + senderGivenName + ", senderEmail = " + senderEmail + ", textContent = " + textContent + "\n)";
    }
}
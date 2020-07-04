package lina.paragraph.persistence;
import java.sql.Timestamp;
import java.sql.ResultSet;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.Statement;
import lina.paragraph.model.ChatMessage;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;
import java.util.Stack;


public class ChatRepository {

	public static int createChatMessage(ChatMessage chatMessage) throws Exception {
		System.out.println("Going to create chat message");
		Connection conn = DBManager.getConnection();
		PreparedStatement ps = conn.prepareStatement("INSERT INTO paragraph.chat_message (room_id, text_content, created) VALUES (?, ?, ?)", Statement.RETURN_GENERATED_KEYS);
		ps.setLong(1, chatMessage.getRoomId());
		// ps.setLong(2, chatMessage.getLinaUserId());
		ps.setString(2, chatMessage.getTextContent());
		ps.setTimestamp(3, DBManager.getCurrentTimeStamp());
		ps.executeUpdate();

		int id = 0;
		ResultSet rs = ps.getGeneratedKeys();

		if (rs.next()){
			id = rs.getInt(1);
		}
		ps.close();
		return id;
	}
}


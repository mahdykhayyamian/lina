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
import java.util.Date;


public class ChatRepository {

	public static int createChatMessage(ChatMessage chatMessage) throws Exception {
		System.out.println("Going to create chat message");
		Connection conn = DBManager.getConnection();
		PreparedStatement ps = conn.prepareStatement("INSERT INTO paragraph.chat_message (room_id, sender_email, sender_given_name, text_content, created) VALUES (?, ?, ?, ?, ?)", Statement.RETURN_GENERATED_KEYS);
		ps.setLong(1, chatMessage.getRoomId());
		ps.setString(2, chatMessage.getSenderEmail());
		ps.setString(3, chatMessage.getSenderGivenName());
		ps.setString(4, chatMessage.getTextContent());
		ps.setTimestamp(5, DBManager.getCurrentTimeStamp());
		ps.executeUpdate();

		int id = 0;
		ResultSet rs = ps.getGeneratedKeys();

		if (rs.next()){
			id = rs.getInt(1);
		}
		ps.close();
		return id;
	}

	public static List<ChatMessage> getChatMessages(String roomId) throws Exception {
		
		List<ChatMessage> chats = new ArrayList<>();
		Connection conn = DBManager.getConnection();
		Statement st = conn.createStatement();
		String query = "select lina.paragraph.chat_message.id, lina.paragraph.chat_message.room_id, lina.paragraph.chat_message.sender_email," +
			 "lina.paragraph.chat_message.sender_given_name, lina.paragraph.chat_message.text_content, lina.paragraph.chat_message.created, lina.paragraph.room_users.chat_color " + 
			 "from lina.paragraph.chat_message join lina.paragraph.room_users on lina.paragraph.chat_message.sender_email = lina.paragraph.room_users.username and lina.paragraph.chat_message.room_id = lina.paragraph.room_users.room_id " +
			 "where lina.paragraph.chat_message.room_id = " + roomId + " order by created";

		System.out.println("query = " + query);
		ResultSet rs = st.executeQuery(query);

		while (rs.next()) {
			System.out.println(rs.getString(1));
			chats.add(ChatMessage.builder()
				.id(rs.getInt(1))
				.roomId(rs.getInt(2))
				.senderEmail(rs.getString(3))
				.senderGivenName(rs.getString(4))
				.textContent(rs.getString(5))
				.created(rs.getTimestamp(6))
				.chatColor(rs.getString(7))
			.build());
		}

		rs.close();
		st.close();

		return chats;
	}

}


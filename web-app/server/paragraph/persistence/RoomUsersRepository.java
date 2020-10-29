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

public class RoomUsersRepository {

	public static int addUserToRoom(int roomNumber, String username, String chatColor) throws Exception {
		System.out.println("Going to add user to room");
		Connection conn = DBManager.getConnection();
		PreparedStatement ps = conn.prepareStatement("INSERT INTO paragraph.room_users (room_id, username, chat_color, created) VALUES (?, ?, ?, ?)", Statement.RETURN_GENERATED_KEYS);

		ps.setLong(1, roomNumber);
		ps.setString(2, username);
		ps.setString(3, chatColor);
		ps.setTimestamp(4, DBManager.getCurrentTimeStamp());
		ps.executeUpdate();

		int id = 0;
		ResultSet rs = ps.getGeneratedKeys();
		System.out.println(rs.toString());

		if (rs.next()){
			id = rs.getInt(1);
		}
		ps.close();
		return id;
	}


	public static boolean userJoinedRoom(int roomNumber, String username) throws Exception {
		System.out.println("Going to check if user has joined room");
        Connection conn = DBManager.getConnection();
        Statement st = conn.createStatement();
        ResultSet rs = st.executeQuery("select * from paragraph.room_users where room_id='" + roomNumber + "' and username='" + username + "'");

        while (rs.next()) {
            System.out.print("Column 1 returned ");
            System.out.println(rs.getString(1));
            return true;
        }

        rs.close();
        st.close();

        return false;
	}

	public static String getUserChatColor(int roomNumber, String username) throws Exception {
        Connection conn = DBManager.getConnection();
        Statement st = conn.createStatement();
        ResultSet rs = st.executeQuery("select chat_color from paragraph.room_users where room_id='" + roomNumber + "' and username='" + username + "'");

        while (rs.next()) {
            System.out.print("Column 1 returned ");
            System.out.println(rs.getString(1));
            return rs.getString(1);
        }

        rs.close();
        st.close();

        return null;
	}

}


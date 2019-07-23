package lina.whiteboard.persistence;
import java.sql.Timestamp;
import java.sql.ResultSet;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.Statement;
import lina.whiteboard.model.Board;
import java.util.List;
import java.util.ArrayList;

public class BoardRepository {

	public static int createBoard(Board board) throws Exception {
		System.out.println("Going to create a board");
		Connection conn = DBManager.getConnection();
		PreparedStatement ps = conn.prepareStatement("INSERT INTO whiteboard.board (room_id, content_type_id, commands, created) VALUES (?, ?, ?, ?)", Statement.RETURN_GENERATED_KEYS);
		ps.setLong(1, board.getRoomId());
		ps.setLong(2, board.getContentTypeId());
		ps.setString(3, board.getCommands());
		ps.setTimestamp(4, DBManager.getCurrentTimeStamp());
		ps.executeUpdate();

		int id = 0;
		ResultSet rs = ps.getGeneratedKeys();

		if (rs.next()){
			id = rs.getInt(1);
		}
		ps.close();
		return id;
	}

	public static void updateBoardCommands(int boardId, String commands) throws Exception {
		System.out.println("Going to update board commands");
		Connection conn = DBManager.getConnection();
		PreparedStatement ps = conn.prepareStatement("UPDATE whiteboard.board SET commands=?, updated=? where id = ?");
		ps.setString(1, commands);
		ps.setTimestamp(2, DBManager.getCurrentTimeStamp());
		ps.setLong(3, boardId);
		ps.executeUpdate();
	}

	public static List<Board> getBoardsForRoom(String roomId) throws Exception {

		List<Board> boards = new ArrayList<>();

		Connection conn = DBManager.getConnection();
		Statement st = conn.createStatement();
		ResultSet rs = st.executeQuery(
			"select lina.whiteboard.board.id,  lina.whiteboard.board.room_id,  lina.whiteboard.board.content_type_id, lina.whiteboard.content_type.type, lina.whiteboard.board.commands \n" +
			"from lina.whiteboard.board, lina.whiteboard.content_type where lina.whiteboard.board.content_type_id = lina.whiteboard.content_type.id and room_id = " + roomId);

		while (rs.next()) {
			System.out.print("Column 1 returned ");
			System.out.println(rs.getString(1));
			boards.add(Board.builder()
				.id(rs.getLong(1))
				.roomId(rs.getLong(2))
				.contentTypeId(rs.getLong(3))
				.contentType(rs.getString(4))
				.commands(rs.getString(5))
			.build());
		}

		rs.close();
		st.close();

		return boards;
	}

	public static void removeBoardFromRoom(int boardId, int roomNumber) throws Exception {
		Connection conn = DBManager.getConnection();
		Statement st = conn.createStatement();

		PreparedStatement ps = conn.prepareStatement("delete from lina.whiteboard.board where lina.whiteboard.board.id = ? and lina.whiteboard.board.room_id = ?");
		ps.setLong(1, boardId);
		ps.setLong(2, roomNumber);

		ps.executeUpdate();
		ps.close();
	}

	public static java.sql.Timestamp getCurrentTimeStamp() {
		java.util.Date today = new java.util.Date();
		return new java.sql.Timestamp(today.getTime());
	}
}


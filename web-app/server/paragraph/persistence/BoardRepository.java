package lina.paragraph.persistence;
import java.sql.Timestamp;
import java.sql.ResultSet;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.Statement;
import lina.paragraph.model.Board;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;
import java.util.Stack;
import lina.persistence.DBManager;

public class BoardRepository {

	public static int createBoard(Board board) throws Exception {
		System.out.println("Going to create a board");
		Connection conn = DBManager.getConnection();
		PreparedStatement ps = conn.prepareStatement("INSERT INTO paragraph.board (room_id, content_type_id, commands, previous_board_id, next_board_id, created) VALUES (?, ?, ?, ?, ?, ?)", Statement.RETURN_GENERATED_KEYS);
		ps.setObject(1, board.getRoomId(), java.sql.Types.OTHER);
		ps.setLong(2, board.getContentTypeId());
		ps.setString(3, board.getCommands());
		ps.setInt(4, board.getPreviousBoardId());
		ps.setInt(5, board.getNextBoardId());
		ps.setTimestamp(6, DBManager.getCurrentTimeStamp());
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
		PreparedStatement ps = conn.prepareStatement("UPDATE paragraph.board SET commands=?, updated=? where id = ?");
		ps.setString(1, commands);
		ps.setTimestamp(2, DBManager.getCurrentTimeStamp());
		ps.setLong(3, boardId);
		ps.executeUpdate();
	}

	public static void updateNextBoard(int boardId, int nextBoardId) throws Exception {
		System.out.println("Going to update next board");
		Connection conn = DBManager.getConnection();
		PreparedStatement ps = conn.prepareStatement("UPDATE paragraph.board SET next_board_id=?, updated=? where id = ?");
		ps.setLong(1, nextBoardId);
		ps.setTimestamp(2, DBManager.getCurrentTimeStamp());
		ps.setLong(3, boardId);
		ps.executeUpdate();
	}

	public static void updatePreviousBoard(int boardId, int previousBoardId) throws Exception {
		System.out.println("Going to update previousBoardId");
		Connection conn = DBManager.getConnection();
		PreparedStatement ps = conn.prepareStatement("UPDATE paragraph.board SET previous_board_id=?, updated=? where id = ?");
		ps.setLong(1, previousBoardId);
		ps.setTimestamp(2, DBManager.getCurrentTimeStamp());
		ps.setLong(3, boardId);
		ps.executeUpdate();
	}

	public static List<Board> getBoardsForRoom(String roomId) throws Exception {
		List<Board> boards = new ArrayList<>();
		Connection conn = DBManager.getConnection();
		Statement st = conn.createStatement();
		ResultSet rs = st.executeQuery(
			"select lina.paragraph.board.id,  lina.paragraph.board.room_id,  lina.paragraph.board.content_type_id, lina.paragraph.content_type.type, lina.paragraph.board.commands, lina.paragraph.board.previous_board_id \n" +
			"from lina.paragraph.board, lina.paragraph.content_type where lina.paragraph.board.content_type_id = lina.paragraph.content_type.id and room_id = '" + roomId + "'");

		while (rs.next()) {
			System.out.print("Column 1 returned ");
			System.out.println(rs.getString(1));
			boards.add(Board.builder()
				.id(rs.getInt(1))
				.roomId(rs.getString(2))
				.contentTypeId(rs.getInt(3))
				.contentType(rs.getString(4))
				.commands(rs.getString(5))
				.previousBoardId(rs.getInt(6))
			.build());
		}

		rs.close();
		st.close();

		List<Board> sortedBoards = sortBoards(boards);
		return sortedBoards;
	}

	public static Board getBoard(int boardId) throws Exception {
		Connection conn = DBManager.getConnection();
		Statement st = conn.createStatement();
		ResultSet rs = st.executeQuery("select lina.paragraph.board.id, lina.paragraph.board.previous_board_id, lina.paragraph.board.next_board_id from lina.paragraph.board where id = " + boardId);

		Board board = null;

		if (rs.next()) {
			board = Board.builder()
				.id(rs.getInt(1))
				.previousBoardId(rs.getInt(2))
				.nextBoardId(rs.getInt(3))
			.build();
		}

		rs.close();
		st.close();

		return board;
	}

	public static void removeBoardFromRoom(int boardId, String roomId) throws Exception {
		Connection conn = DBManager.getConnection();
		Statement st = conn.createStatement();

		PreparedStatement ps = conn.prepareStatement("delete from lina.paragraph.board where lina.paragraph.board.id = ? and lina.paragraph.board.room_id = ?");
		ps.setLong(1, boardId);
		ps.setObject(2, roomId, java.sql.Types.OTHER);

		ps.executeUpdate();
		ps.close();
	}

	public static java.sql.Timestamp getCurrentTimeStamp() {
		java.util.Date today = new java.util.Date();
		return new java.sql.Timestamp(today.getTime());
	}

	private static List<Board> sortBoards(List<Board> boards) {

		List<Board> sortedBoards = new ArrayList<Board>();

		Map<Integer, Board> boardsByIdMap = new HashMap<Integer, Board>();

		for (int i=0; i<boards.size(); i++) {
			Board board = boards.get(i);
			boardsByIdMap.put(board.getId(), board);
		}

		while (!boardsByIdMap.isEmpty()) {
			int oneBoardId = boardsByIdMap.keySet().stream().findFirst().get();
			Board currentBoard = boardsByIdMap.get(oneBoardId);

			Stack<Board> currentBatch = new Stack<Board>();
			while (currentBoard != null) {
				currentBatch.push(currentBoard);
				boardsByIdMap.remove(currentBoard.getId());
				currentBoard = boardsByIdMap.get(currentBoard.getPreviousBoardId());
			}

			while (!currentBatch.isEmpty()) {
				sortedBoards.add(currentBatch.pop());
			}
		}

		return sortedBoards;
	}
}


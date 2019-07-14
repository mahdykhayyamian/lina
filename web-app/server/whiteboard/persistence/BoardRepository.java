package lina.whiteboard.persistence;
import java.sql.Timestamp;
import java.sql.ResultSet;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.Statement;
import lina.whiteboard.model.Board;

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

    public static java.sql.Timestamp getCurrentTimeStamp() {
        java.util.Date today = new java.util.Date();
        return new java.sql.Timestamp(today.getTime());
    }
}


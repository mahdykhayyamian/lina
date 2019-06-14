package lina.whiteboard.persistence;
import java.sql.*;
import java.util.Properties;
import java.lang.Class;

public class RoomRepository {

    public static int createRoom() throws Exception {
        System.out.println("Going to create a new room");
        Connection conn = DBManager.getConnection();
        PreparedStatement ps = conn.prepareStatement("INSERT INTO whiteboard.room (created) VALUES (?)", Statement.RETURN_GENERATED_KEYS);
        ps.setTimestamp(1, DBManager.getCurrentTimeStamp());
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

    public static java.sql.Timestamp getCurrentTimeStamp() {
        java.util.Date today = new java.util.Date();
        return new java.sql.Timestamp(today.getTime());
    }
}


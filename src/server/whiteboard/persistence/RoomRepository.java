package lina.whiteboard.persistence;
import java.sql.*;
import java.util.Properties;
import java.lang.Class;

public class RoomRepository {

    public static long createRoom() throws Exception {
        System.out.println("Going to create a new room");
        Connection conn = DBManager.getConnection();
        PreparedStatement ps = conn.prepareStatement("INSERT INTO room (created) VALUES (?)");
        ps.setTimestamp(1, DBManager.getCurrentTimeStamp());
        ps.executeUpdate();
        ps.close();
        return 1;
    }

    public static java.sql.Timestamp getCurrentTimeStamp() {
        java.util.Date today = new java.util.Date();
        return new java.sql.Timestamp(today.getTime());
    }
}


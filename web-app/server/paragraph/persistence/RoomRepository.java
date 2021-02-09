package lina.paragraph.persistence;
import java.sql.Timestamp;
import java.sql.ResultSet;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.Statement;


public class RoomRepository {

    public static String createRoom() throws Exception {
        System.out.println("Going to create a new room");
        Connection conn = DBManager.getConnection();
        PreparedStatement ps = conn.prepareStatement("INSERT INTO paragraph.room (created) VALUES (?)", Statement.RETURN_GENERATED_KEYS);
        ps.setTimestamp(1, DBManager.getCurrentTimeStamp());
        ps.executeUpdate();
        String id = null;
        ResultSet rs = ps.getGeneratedKeys();

        if (rs.next()){
            id = rs.getString(1);
            System.out.println("id = " + id);
        }
        ps.close();
        return id;
    }

    public static boolean roomExist(String roomId) throws Exception {
        System.out.println("Check if room exist");
        Connection conn = DBManager.getConnection();
        Statement st = conn.createStatement();
        ResultSet rs = st.executeQuery("select * from lina.paragraph.room where id = '" + roomId + "'");

        while (rs.next()) {
            System.out.print("Column 1 returned ");
            System.out.println(rs.getString(1));
            return true;
        }

        rs.close();
        st.close();

        return false;
    }

    public static java.sql.Timestamp getCurrentTimeStamp() {
        java.util.Date today = new java.util.Date();
        return new java.sql.Timestamp(today.getTime());
    }
}


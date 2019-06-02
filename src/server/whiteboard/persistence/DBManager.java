package lina.whiteboard.persistence;
import java.sql.*;
import java.util.Properties;
import java.lang.Class;

public class DBManager {

    private static Connection CONN = null;

    public static Connection getConnection() {
        if (CONN != null) {
            return CONN;
        }

        try{
            Class.forName("org.postgresql.Driver");
            String url = "jdbc:postgresql://localhost/lina";
            Properties props = new Properties();
            props.setProperty("user","mahdykhayyamian");
            CONN = DriverManager.getConnection(url, props);
        } catch (Exception e) {
            e.printStackTrace();
        }
        System.out.println(CONN.toString());
        return CONN;
    }

    public static java.sql.Timestamp getCurrentTimeStamp() {
        java.util.Date today = new java.util.Date();
        return new java.sql.Timestamp(today.getTime());
    }

}


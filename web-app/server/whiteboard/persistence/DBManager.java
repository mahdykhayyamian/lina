package lina.whiteboard.persistence;
import java.sql.*;
import java.util.Properties;
import java.lang.Class;

public class DBManager {

    public static String LINA_ENV = "LINA_ENV";

    private static Connection CONN = null;

    public static Connection getConnection() {
        if (CONN != null) {
            return CONN;
        }

        try {

            String linaEnv = getLinaEnv();

            Class.forName("org.postgresql.Driver");
            String url = "jdbc:postgresql://" + getHost(linaEnv) + ":" + getPort(linaEnv) + "/lina";
            Properties props = new Properties();
            props.setProperty("user","lina_app");
            props.setProperty("password", "w00fw00f");

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

    public static String getLinaEnv() {
        System.out.println("Trying to determine lina env");
        String linaEnv = System.getenv(LINA_ENV);
        if (linaEnv == null) {
            System.out.println("LINA_ENV not set, defaulting to prod");
            linaEnv = "PROD";
        } else {
            System.out.println("Lina env set to " + linaEnv);
        }

        return linaEnv;
    }

    public static String getPort(String linaEnv) {
        if (linaEnv.equals("PROD")) {
            return "5432";
        } else if (linaEnv.equals("DEV")) {
            return "1111";
        } else {
            return "";
        }
    }

    public static String getHost(String linaEnv) {
        if (linaEnv.equals("PROD")) {
            return "ec2-34-219-125-174.us-west-2.compute.amazonaws.com";
        } else if (linaEnv.equals("DEV")) {
            return "localhost";
        } else {
            return "";
        }
    }

}


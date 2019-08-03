package lina.paragraph.persistence;
import java.sql.Timestamp;
import java.sql.ResultSet;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.Statement;
import lina.paragraph.model.ContentType;

import java.util.ArrayList;
import java.util.List;


public class ContentTypeRepository {

    public static List<ContentType> getContentTypes() throws Exception {

        List<ContentType> contentTypes = new ArrayList<>();

        Connection conn = DBManager.getConnection();
        Statement st = conn.createStatement();
        ResultSet rs = st.executeQuery("SELECT id, type, name FROM paragraph.content_type");

        while (rs.next()) {
            System.out.print("Column 1 returned ");
            System.out.println(rs.getString(1));
            contentTypes.add(ContentType.builder().id(rs.getLong(1)).type(rs.getString(2)).name(rs.getString(3)).build());
        }
        rs.close();
        st.close();

        return contentTypes;
    }
}
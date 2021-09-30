package lina.climate.persistence;
import lina.paragraph.model.ContentType;
import java.util.ArrayList;
import java.util.List;
import climate.model.DailyMeasure;
import java.util.List;
import lina.persistence.DBManager;
import java.sql.Timestamp;
import java.sql.ResultSet;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.Statement;

public class ClimateRepository {

    public static List<DailyMeasure> getDailMeasures(String stationCode, String month, String day) throws Exception {
        List<DailyMeasure> measures = new ArrayList<>();
        Connection conn = DBManager.getConnection();
        Statement st = conn.createStatement();
        String query = "select daily_measures.id, station_id, date, avg_temp, min_temp, max_temp from climate.daily_measures inner join climate.station on climate.station.id = climate.daily_measures.station_id and climate.station.code = '" + stationCode + "'" +
            "and date_part('month', climate.daily_measures.date) = '" + month + "' " + 
            "and date_part('day', climate.daily_measures.date) = '" + day + "' order by daily_measures.date";

        System.out.println("query = " + query);
        ResultSet rs = st.executeQuery(query);

        while (rs.next()) {
            DailyMeasure dailyMeasure = DailyMeasure.builder()
                .id(rs.getString(1))
                .stationId(rs.getString(2))
                .date(rs.getDate(3))
                .avgTemp(rs.getDouble(4))
                .minTemp(rs.getDouble(5))
                .maxTemp(rs.getDouble(6))
                .build();

            System.out.println(dailyMeasure.toString());
            measures.add(dailyMeasure);
        }

        return measures;
    }
}


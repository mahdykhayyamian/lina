package lina.climate.persistence;
import lina.paragraph.model.ContentType;
import java.util.ArrayList;
import java.util.List;
import climate.model.DailyMeasure;
import climate.model.MonthlyMeasure;
import climate.model.Station;
import java.util.List;
import lina.persistence.DBManager;
import java.sql.Timestamp;
import java.sql.ResultSet;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.Statement;

public class ClimateRepository {

    public static List<DailyMeasure> getDailyMeasures(String stationCode, String month, String day) throws Exception {
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

    public static List<MonthlyMeasure> getMonthlyMeasures(String stationCode, String month) throws Exception {
        List<MonthlyMeasure> measures = new ArrayList<>();
        Connection conn = DBManager.getConnection();
        Statement st = conn.createStatement();

        String query = "select date_part('year', climate.daily_measures.date) as year, date_part('month', climate.daily_measures.date) as month, avg(min_temp) as avg_daily_min_temp, avg(max_temp) as avg_daily_max_temp " 
        + "from climate.daily_measures inner join climate.station on climate.station.id = climate.daily_measures.station_id and climate.station.code = '" + stationCode
        + "'and date_part('month', climate.daily_measures.date) = '" +  month + "' group by year, month";

        System.out.println("query = " + query);
        ResultSet rs = st.executeQuery(query);

        while (rs.next()) {
            MonthlyMeasure monthlyMeasure = MonthlyMeasure.builder()
                .year(rs.getInt(1))
                .month(rs.getInt(2))
                .avgMinDailyTemp(rs.getDouble(3))
                .avgMaxDailyTemp(rs.getDouble(4))
                .build();

            System.out.println(monthlyMeasure.toString());
            measures.add(monthlyMeasure);
        }

        return measures;
    }

    public static List<Station> getStations() throws Exception {
        List<Station> stations = new ArrayList<>();
        Connection conn = DBManager.getConnection();
        Statement st = conn.createStatement();
        String query = "select id, code, name, latitude, longitude, elevation from climate.station";

        System.out.println("query = " + query);
        ResultSet rs = st.executeQuery(query);

        while (rs.next()) {
            Station station = Station.builder()
                .id(rs.getString(1))
                .code(rs.getString(2))
                .name(rs.getString(3))
                .latitude(rs.getDouble(4))
                .longitude(rs.getDouble(5))
                .elevation(rs.getDouble(6))
                .build();

            System.out.println(station.toString());
            stations.add(station);
        }

        return stations;
    }
}


package climate.model;
import java.util.Date;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DailyMeasure {

    String id;
    String stationId;
    java.util.Date date;
    double avgTemp;
    double minTemp;
    double maxTemp;

    public String toString() {
        return "(id = " + id + ", stationId = " + stationId + ", date = " + date + ", avg_temp = " + avgTemp + ", min_temp = " + minTemp + ", max_temp = " + maxTemp + ")";
    }
}
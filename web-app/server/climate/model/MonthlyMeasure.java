package climate.model;
import java.util.Date;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MonthlyMeasure {
    String stationId;
    int year;
    int month;
    double avgMinDailyTemp;
    double avgMaxDailyTemp;

    public String toString() {
        return "(stationId = " + stationId + ", month = " + month + ", avg_min_daily_temp = " + avgMinDailyTemp + ", avg_max_daily_temp = " + avgMaxDailyTemp + ")";
    }
}
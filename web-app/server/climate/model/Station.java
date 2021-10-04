package climate.model;
import java.util.Date;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Station {

    String id;
    String code;
    String name;
    double latitude;
    double longitude;
    double elevation;

    public String toString() {
        return "(id = " + id + ", code = " + code + ", name = " + name + ", latitude = " + latitude + ", longitude = " + longitude + ", elevation = " + elevation + ")";
    }
}
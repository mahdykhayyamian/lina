package lina.board.utils;

import java.io.IOException;
import javax.servlet.http.HttpServletRequest;
import java.io.BufferedReader;


public class ServletUtils {

    public static String getPostBody(HttpServletRequest request) throws IOException {
        StringBuilder buffer = new StringBuilder();
        BufferedReader reader = request.getReader();
        String line;

        while ((line = reader.readLine()) != null) {
            buffer.append(line);
        }
        String data = buffer.toString();
        return data;
    }
}
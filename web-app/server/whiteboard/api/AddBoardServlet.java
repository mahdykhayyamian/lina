package whiteboard.api;

import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import lombok.AllArgsConstructor;

import javax.servlet.ServletException;
import java.io.BufferedReader;
import com.google.gson.Gson;
import lombok.Data;
import lina.whiteboard.model.Board;
import lina.whiteboard.persistence.BoardRepository;


@WebServlet("/api/addBoard")
public class AddBoardServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

    /**
     * @see HttpServlet#HttpServlet()
     */
    public AddBoardServlet() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        try {
            String data = getPostBody(request);
            System.out.println(data);

            Gson gson = new Gson();
            AddBoardPayload payload = gson.fromJson(data, AddBoardPayload.class);
            System.out.println(payload.boardPayload.type);

            Board board = new Board();
            board.setRoomId(Long.parseLong(payload.roomNumber));
            board.setContentTypeId(4);
            board.setCommands(payload.boardPayload.commands);

            BoardRepository.createBoard(board);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private String getPostBody(HttpServletRequest request) throws IOException {
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

@Data
@AllArgsConstructor
class AddBoardPayload {
   String roomNumber;
   BoardPayload boardPayload;
}

@Data
@AllArgsConstructor
class BoardPayload {
    String type;
    String commands;
}
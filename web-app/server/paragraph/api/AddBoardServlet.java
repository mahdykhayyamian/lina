package paragraph.api;

import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import lombok.AllArgsConstructor;

import javax.servlet.ServletException;
import com.google.gson.Gson;
import lombok.Data;
import lina.paragraph.model.Board;
import lina.paragraph.persistence.BoardRepository;
import lina.board.athentication.AuthenticationUtils;
import lina.board.utils.ServletUtils;
import java.io.PrintWriter;


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

		boolean authenticated = false;
		try {
			authenticated = AuthenticationUtils.authenticated(request, response);
		} catch(Exception e) {
			System.out.println(e.getMessage());
		}

        if (!authenticated) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        try {
            String data = ServletUtils.getPostBody(request);
            System.out.println(data);

            Gson gson = new Gson();
            AddBoardPayload payload = gson.fromJson(data, AddBoardPayload.class);
            System.out.println(payload.boardPayload.type);

            Board board = Board.builder()
                .roomId(Long.parseLong(payload.roomNumber))
                .contentTypeId(Long.parseLong(payload.boardPayload.typeId))
                .commands(payload.boardPayload.commands)
            .build();

            int boardId = BoardRepository.createBoard(board);

            PrintWriter out = response.getWriter();
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            out.print(Integer.toString(boardId));
            out.flush();

        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
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
    String typeId;
    String commands;
}
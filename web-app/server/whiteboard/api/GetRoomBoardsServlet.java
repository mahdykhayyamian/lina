package whiteboard.api;

import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import javax.servlet.ServletException;
import java.io.BufferedReader;
import com.google.gson.Gson;
import lombok.Data;
import lina.whiteboard.persistence.ContentTypeRepository;
import java.util.List;
import lina.whiteboard.model.ContentType;
import com.google.gson.Gson;
import java.io.PrintWriter;
import lina.board.athentication.AuthenticationUtils;
import lina.whiteboard.persistence.BoardRepository;
import lombok.AllArgsConstructor;
import lina.whiteboard.model.Board;
import com.google.gson.Gson;


@WebServlet("/api/getRoomBoards")
public class GetRoomBoardsServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

    /**
     * @see HttpServlet#HttpServlet()
     */
    public GetRoomBoardsServlet() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        System.out.println("Inside getting board rooms...");

		boolean authenticated = false;
		try {
			authenticated = AuthenticationUtils.authenticated(request, response);
		} catch(Exception e) {
			System.out.println(e.getMessage());
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
		}

        if (!authenticated) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

		try{
			String roomNumber = request.getParameter("roomNumber");
			System.out.println("Room number is " + roomNumber);

			List<Board> boards = BoardRepository.getBoardsForRoom(roomNumber);

            Gson gson = new Gson();
            String jsonPayload = gson.toJson(boards);
            System.out.println("json payload");
            System.out.println(jsonPayload);

            PrintWriter out = response.getWriter();
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            out.print(jsonPayload);
            out.flush();

		} catch(Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {}
}


@Data
@AllArgsConstructor
class GetRoomBoardsPayload {
   String roomNumber;
}

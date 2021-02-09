package paragraph.api;

import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import javax.servlet.ServletException;
import java.io.BufferedReader;
import com.google.gson.Gson;
import lombok.Data;
import lina.paragraph.persistence.ContentTypeRepository;
import java.util.List;
import lina.paragraph.model.ContentType;
import com.google.gson.Gson;
import java.io.PrintWriter;
import lina.board.athentication.AuthenticationUtils;
import lina.board.athentication.AuthenticationCookies;
import lina.paragraph.persistence.BoardRepository;
import lombok.AllArgsConstructor;
import lina.paragraph.model.Board;
import com.google.gson.Gson;
import lina.board.athentication.AuthInfo;


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

		AuthInfo authInfo = null;
		try {
            AuthenticationCookies authCookies = AuthenticationUtils.getAuthCookies(request);
            authInfo = AuthenticationUtils.authenticate(authCookies);
		} catch(Exception e) {
			System.out.println(e.getMessage());
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
		}

        if (authInfo == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

		try{
			String roomId = request.getParameter("roomId");
			System.out.println("Room number is " + roomId);

			List<Board> boards = BoardRepository.getBoardsForRoom(roomId);

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
   String roomId;
}

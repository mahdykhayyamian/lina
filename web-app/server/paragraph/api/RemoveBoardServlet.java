
package paragraph.api;

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
import lina.paragraph.model.Board;
import lina.paragraph.persistence.BoardRepository;
import lina.board.utils.ServletUtils;
import lina.board.athentication.AuthenticationUtils;
import lina.board.athentication.AuthenticationCookies;
import lina.board.athentication.AuthInfo;

@WebServlet("/api/removeBoard")
public class RemoveBoardServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public RemoveBoardServlet() {
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

		System.out.println("Going to remove board...");

		AuthInfo authInfo = null;
		try {
            AuthenticationCookies authCookies = AuthenticationUtils.getAuthCookies(request);
            authInfo = AuthenticationUtils.authenticate(authCookies);
		} catch(Exception e) {
			System.out.println(e.getMessage());
		}

		if (authInfo == null) {
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			return;
		}

		String data = ServletUtils.getPostBody(request);
		System.out.println(data);

		Gson gson = new Gson();
		RemoveBoardPayload payload = gson.fromJson(data, RemoveBoardPayload.class);

		try {
			// ideally these db changes should happen inside one transaction, but we can live with it for now
			Board board = BoardRepository.getBoard(payload.boardId);
			BoardRepository.removeBoardFromRoom(payload.boardId, payload.roomNumber);
			BoardRepository.updateNextBoard(board.getPreviousBoardId(), board.getNextBoardId());
			BoardRepository.updatePreviousBoard(board.getNextBoardId(), board.getPreviousBoardId());
		} catch (Exception e) {
			e.printStackTrace();
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
		}
	}
}

@Data
@AllArgsConstructor
class RemoveBoardPayload {
   int boardId;
   int roomNumber;
}

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

@WebServlet("/api/updateBoardCommands")
public class UpdateBoardCommandsServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

    /**
     * @see HttpServlet#HttpServlet()
     */
    public UpdateBoardCommandsServlet() {
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
            AuthenticationCookies authCookies = AuthenticationUtils.getAuthCookies(request);
            authenticated = AuthenticationUtils.authenticate(authCookies);
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
            UpdateBoardCommandsPayload payload = gson.fromJson(data, UpdateBoardCommandsPayload.class);

            BoardRepository.updateBoardCommands(payload.boardId, payload.commands);
        } catch (Exception e) {
            e.printStackTrace();
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }
}

@Data
@AllArgsConstructor
class UpdateBoardCommandsPayload {
   int boardId;
   String commands;
}

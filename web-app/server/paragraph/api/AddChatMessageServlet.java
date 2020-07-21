package paragraph.api;

import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import javax.servlet.ServletException;

import lina.board.athentication.AuthenticationUtils;
import lina.board.athentication.AuthenticationCookies;
import java.io.PrintWriter;

import lina.board.utils.ServletUtils;
import lina.paragraph.model.ChatMessage;
import com.google.gson.Gson;

import lina.paragraph.persistence.ChatRepository;

import lombok.AllArgsConstructor;
import lombok.Data;


@WebServlet("/api/addChatMessage")
public class AddChatMessageServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

    /**
     * @see HttpServlet#HttpServlet()
     */
    public AddChatMessageServlet() {
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
            AddChatMessagePayload payload = gson.fromJson(data, AddChatMessagePayload.class);

            ChatMessage chatMessage = ChatMessage.builder()
                .roomId(Integer.parseInt(payload.roomNumber))
                .senderEmail(payload.senderEmail)
                .senderGivenName(payload.senderGivenName)
                .textContent(payload.textContent)
            .build();

            // ideally these three statement should be run inside one transaction, but we can live with it for now.
            int messageId = ChatRepository.createChatMessage(chatMessage);

            PrintWriter out = response.getWriter();
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            out.print(Integer.toString(messageId));
            out.flush();
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }
}

@Data
@AllArgsConstructor
class AddChatMessagePayload {
    String roomNumber;
    String senderEmail;
    String senderGivenName;
    String textContent;
}

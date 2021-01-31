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
import lina.board.athentication.AuthInfo;
import lina.paragraph.persistence.RoomUsersRepository;
import lombok.Data;
import lombok.Builder;


@WebServlet("/api/getUserRoomSettings")
public class GetUserRoomSettingsServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public GetUserRoomSettingsServlet() {
		super();
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		System.out.println("Inside getting current user...");

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

		try {
			String roomNumber = request.getParameter("roomNumber");
			System.out.println("Room number is " + roomNumber);

			String chatColor = RoomUsersRepository.getUserChatColor(roomNumber, authInfo.getEmail());

			UserRoomSettings userRoomSettings = UserRoomSettings.builder().roomNumber(roomNumber).userEmail(authInfo.getEmail()).roomChatColor(chatColor).build();

			Gson gson = new Gson();
			String jsonPayload = gson.toJson(userRoomSettings);
			System.out.println("json payload");
			System.out.println(jsonPayload);

			PrintWriter out = response.getWriter();
			response.setContentType("application/json");
			response.setCharacterEncoding("UTF-8");
			out.print(jsonPayload);
			out.flush();
		} catch (Exception e) {
			e.printStackTrace();
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {}
}


@Data
@Builder
class UserRoomSettings {
   String roomNumber;
   String userEmail;
   String roomChatColor;
}

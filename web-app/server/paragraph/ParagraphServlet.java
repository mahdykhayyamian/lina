package lina.paragraph;

import java.io.IOException;
import java.util.Map;
import java.util.Base64;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lina.board.athentication.AuthenticationUtils;
import lina.board.athentication.AuthenticationCookies;
import lina.paragraph.persistence.RoomRepository;

import javax.servlet.http.Cookie;


/**
 * Servlet implementation class HomeServlet
 */
@WebServlet("/paragraph")
public class ParagraphServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

    /**
     * @see HttpServlet#HttpServlet()
     */
    public ParagraphServlet() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String roomNumberParam = getRoomNumberParam(request);
		boolean authenticated = false;
		try {
            AuthenticationCookies authCookies = AuthenticationUtils.getAuthCookies(request);
            authenticated = AuthenticationUtils.authenticate(authCookies);
		} catch(Exception e) {
			System.out.println(e.getMessage());
		}

		if (!authenticated) {
			if (roomNumberParam != null) {
				String fromUrl = "/paragraph?roomNumber=" + roomNumberParam;
				String encodedFromURL = Base64.getUrlEncoder().encodeToString(fromUrl.getBytes());

				response.sendRedirect("/src/paragraph/login?from=" + encodedFromURL);
			} else {
				response.sendRedirect("/src/paragraph/login");
			}
			return;
		}

		String sessionId = null;

		Cookie givenNameCookie = AuthenticationUtils.getCookie(request, "given-name");

		String givenName = givenNameCookie.getValue();
		request.setAttribute("given-name", givenName);

		String roomNumber = null;

		try {
			if (roomNumberParam != null) {
				boolean roomExist = RoomRepository.roomExist(roomNumberParam);

				if (roomExist) {
					System.out.println("need to load room from roomNumber in param : " + roomNumberParam);
					RequestDispatcher RequetsDispatcherObj = request.getRequestDispatcher("/src/paragraph/app.jsp");
					RequetsDispatcherObj.forward(request, response);
				} else {
					System.out.println("room does not exist");
					RequestDispatcher RequetsDispatcherObj = request.getRequestDispatcher("/src/paragraph/create-room.jsp");
					RequetsDispatcherObj.forward(request, response);
				}
			} else {
				System.out.println("no room Number in param, we need to create a new board");
				int roomNum = RoomRepository.createRoom();
				roomNumber = Integer.toString(roomNum);
				response.sendRedirect("/paragraph?roomNumber=" + roomNumber);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	}

	private String getRoomNumberParam(HttpServletRequest request) {
		Map<String, String[]> parmMap = request.getParameterMap();
		if (parmMap.get("roomNumber") != null && parmMap.get("roomNumber").length > 0) {
			String roomNumber = parmMap.get("roomNumber")[0];
			return roomNumber;
		}
		return null;
	}
}

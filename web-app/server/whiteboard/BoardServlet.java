package lina.whiteboard;

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
import lina.whiteboard.persistence.RoomRepository;

import javax.servlet.http.Cookie;


/**
 * Servlet implementation class HomeServlet
 */
@WebServlet("/whiteboard")
public class BoardServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

    /**
     * @see HttpServlet#HttpServlet()
     */
    public BoardServlet() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		System.out.println("Inside board servelt!");

		String roomNumberParam = getRoomNumberParam(request);

		boolean authenticated = false;
		try {
			authenticated = AuthenticationUtils.authenticated(request, response);
		} catch(Exception e) {
			System.out.println(e.getMessage());
		}

		if (!authenticated) {
			if (roomNumberParam != null) {
				String fromUrl = "/whiteboard?roomNumber=" + roomNumberParam;
				String encodedFromURL = Base64.getUrlEncoder().encodeToString(fromUrl.getBytes());

				response.sendRedirect("/whiteboard/login?from=" + encodedFromURL);
			} else {
				response.sendRedirect("/whiteboard/login");
			}
			return;
		}

		String sessionId = null;

		Cookie userNameCookie = AuthenticationUtils.getCookie(request, "user-name");
		String userName = userNameCookie.getValue();
		request.setAttribute("user-name", userName);

		String roomNumber = null;

		if (roomNumberParam != null) {
			System.out.println("need to load room from roomNumber in param : " + roomNumberParam);
			RequestDispatcher RequetsDispatcherObj = request.getRequestDispatcher("/whiteboard/app.jsp");
			RequetsDispatcherObj.forward(request, response);
		} else {
			try{
				System.out.println("no room Number in param, we need to create a new board");
				int roomNum = RoomRepository.createRoom();
				roomNumber = Integer.toString(roomNum);
				response.sendRedirect("/whiteboard?roomNumber=" + roomNumber);
			} catch(Exception e) {
				e.printStackTrace();
			}
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

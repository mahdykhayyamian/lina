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
import lina.board.athentication.AuthInfo;
import lina.paragraph.persistence.RoomRepository;
import lina.paragraph.persistence.RoomUsersRepository;

import javax.servlet.http.Cookie;
import java.util.Random;


/**
 * Servlet implementation class HomeServlet
 */
@WebServlet("/paragraph")
public class ParagraphServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	private static final String[] CHAT_COLORS = {"red", "blue", "green", "rosybrown", "salmon", "orange", "lightslategrey", "purple"};

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
		String roomIdParam = getroomIdParam(request);
		AuthInfo authInfo = null;
		try {
			AuthenticationCookies authCookies = AuthenticationUtils.getAuthCookies(request);
			authInfo = AuthenticationUtils.authenticate(authCookies);
		} catch(Exception e) {
			System.out.println(e.getMessage());
		}

		if (authInfo == null) {
			if (roomIdParam != null) {
				String fromUrl = "/paragraph?roomId=" + roomIdParam;
				String encodedFromURL = Base64.getUrlEncoder().encodeToString(fromUrl.getBytes());
				response.sendRedirect("/login?from=" + encodedFromURL);
			} else {
				response.sendRedirect("/login");
			}
			return;
		}

		String sessionId = null;

		Cookie givenNameCookie = AuthenticationUtils.getCookie(request, "given-name");

		String givenName = givenNameCookie.getValue();
		request.setAttribute("given-name", givenName);

		try {
			if (roomIdParam != null) {
				boolean roomExist = RoomRepository.roomExist(roomIdParam);

				if (roomExist) {
					System.out.println("need to load room from roomId in param : " + roomIdParam);

					boolean userHasAlreadyJoinedRoom = RoomUsersRepository.userJoinedRoom(roomIdParam, authInfo.getEmail());

					if (!userHasAlreadyJoinedRoom) {
						int rnd = new Random().nextInt(CHAT_COLORS.length);
						String randomChatColor = CHAT_COLORS[rnd];
						RoomUsersRepository.addUserToRoom(roomIdParam, authInfo.getEmail(), randomChatColor);
					}

					RequestDispatcher RequetsDispatcherObj = request.getRequestDispatcher("/src/paragraph/app.jsp");
					RequetsDispatcherObj.forward(request, response);
				} else {
					System.out.println("room does not exist");
					RequestDispatcher RequetsDispatcherObj = request.getRequestDispatcher("/src/paragraph/create-room.jsp");
					RequetsDispatcherObj.forward(request, response);
				}
			} else {
				System.out.println("no room Number in param, we need to create a new board");
				String roomId = RoomRepository.createRoom();
				response.sendRedirect("/paragraph?roomId=" + roomId);
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

	private String getroomIdParam(HttpServletRequest request) {
		Map<String, String[]> parmMap = request.getParameterMap();
		if (parmMap.get("roomId") != null && parmMap.get("roomId").length > 0) {
			String roomId = parmMap.get("roomId")[0];
			return roomId;
		}
		return null;
	}
}

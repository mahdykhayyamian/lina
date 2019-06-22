package lina.board.athentication;

import java.io.IOException;
import java.util.Map;
import java.util.PriorityQueue;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Cookie;

import java.util.stream.Collectors;
import com.google.gson.Gson;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.security.Key;
import lina.board.athentication.AuthenticationUtils;


@WebServlet("/whiteboard/login")
public class LoginServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

    /**
     * @see HttpServlet#HttpServlet()
     */
    public LoginServlet() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		String action = "/whiteboard/authenticate";

		String from = getFrom(request);

		if (from != null) {
			action += "?from=" + from;
		}

		request.setAttribute("action", action);

		RequestDispatcher RequetsDispatcherObj = request.getRequestDispatcher("/whiteboard/authentication/login.jsp");
		RequetsDispatcherObj.forward(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	}

	private String jwtToken(String userName) {
		String jws = Jwts.builder().setSubject(userName).signWith(AuthenticationUtils.KEY).compact();
		return jws;
	}

	private String getFrom(HttpServletRequest request) {
		Map<String, String[]> parmMap = request.getParameterMap();
		if (parmMap.get("from") != null && parmMap.get("from").length > 0) {
			String roomNumber = parmMap.get("from")[0];
			return roomNumber;
		}
		return null;
	}

}
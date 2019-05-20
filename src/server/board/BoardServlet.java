package lina.board;

import java.io.IOException;
import java.util.Map;
import java.util.PriorityQueue;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

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

		System.out.println("Inside board servelt haha!");

		Map<String, String[]> parmMap = request.getParameterMap();

		String sessionId = null;
		if (parmMap.get("roomNumber") != null && parmMap.get("roomNumber").length > 0) {
			String roomNumber = parmMap.get("roomNumber")[0];
			System.out.println("roomNumber in param : " + roomNumber);
		} else {
			System.out.println("no room Number in param");
			RequestDispatcher RequetsDispatcherObj = request.getRequestDispatcher("/whiteboard/login.jsp");
			RequetsDispatcherObj.forward(request, response);
			return;
		}

		RequestDispatcher RequetsDispatcherObj = request.getRequestDispatcher("/whiteboard/app.jsp");
		RequetsDispatcherObj.forward(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}
}

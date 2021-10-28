package lina.demo.smartframes;

import java.io.IOException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lina.climate.persistence.ClimateRepository;
import climate.model.DailyMeasure;
import climate.model.MonthlyMeasure;
import java.util.List;
import com.google.gson.Gson;
import java.io.PrintWriter;

@WebServlet(urlPatterns = {"/api/climate/getYearlyTrends"})
public class ClimateTrendsApiServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

    /**
     * @see HttpServlet#HttpServlet()
     */
    public ClimateTrendsApiServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String stationCode = request.getParameter("stationCode");
		String month = request.getParameter("month");
		String day = request.getParameter("day");

		System.out.println("stationCode = " + stationCode);
		System.out.println("month = " + month);
		System.out.println("day = " + day);

		try {
			Gson gson = new Gson();
			String jsonPayload = null;
			if (day != null) {
				List<DailyMeasure> measures = ClimateRepository.getDailyMeasures(stationCode, month, day);
				jsonPayload = gson.toJson(measures);

			} else {
				List<MonthlyMeasure> measures = ClimateRepository.getMonthlyMeasures(stationCode, month);
				jsonPayload = gson.toJson(measures);
			}

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
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}
}

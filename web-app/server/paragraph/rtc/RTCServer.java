import java.io.IOException;

import javax.websocket.EndpointConfig;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.OnError;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;
import java.util.ArrayList;
import java.util.Set;
import java.util.Collections;
import java.util.HashSet;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.websocket.server.HandshakeRequest;
import lina.board.athentication.AuthenticationUtils;
import lina.board.athentication.AuthenticationCookies;
import lina.board.athentication.AuthInfo;


@ServerEndpoint(value="/broadcast", configurator = GetHttpSessionConfigurator.class)
public class RTCServer {

    public static final String WS_KEEP_ALIVE_MESSAGE = "WS_KEEP_ALIVE_MESSAGE";
    private static Map<String, List<Session>> roomNumToWSSessionsMap = Collections.synchronizedMap(new HashMap<String, List<Session>>());
    private static Map<String, String> sessionIdToBoardNumMap = Collections.synchronizedMap(new HashMap<String, String>());

    @OnMessage
    public void onMessage(Session session, String msg) {
        System.out.println("got message : " + msg + " from session : " + session.getId());

        if (msg.equals(WS_KEEP_ALIVE_MESSAGE)) {
            System.out.println("Ignoring keep alive message");
            return;
        }

        String roomId = sessionIdToBoardNumMap.get(session.getId());
        System.out.println("Room number from session : " + roomId);

        try {
            for (Session peerSession : roomNumToWSSessionsMap.get(roomId)) {
                System.out.println("session id for peer : " + peerSession.getId());
                if (peerSession.isOpen()) {
                    if (!peerSession.equals(session)) {
                        peerSession.getBasicRemote().sendText(msg);
                    }                    
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @OnOpen
    public void open(Session session, EndpointConfig conf) {

        HandshakeRequest req = (HandshakeRequest) conf.getUserProperties()
                                                      .get("handshakereq");
        AuthenticationCookies authCookies = AuthenticationUtils.getAuthCookies(req);

        AuthInfo authInfo = AuthenticationUtils.authenticate(authCookies);

        if (authInfo == null) {
            try{
                session.close();
                return;
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        String roomId = getroomIdParam(req);
        System.out.println("Room number from param : " + roomId);

        sessionIdToBoardNumMap.put(session.getId(), roomId);

        if (roomId != null) {
            List<Session> roomSessions = roomNumToWSSessionsMap.get(roomId);
            if (roomSessions == null) {
                roomSessions = new ArrayList<Session>();
                roomNumToWSSessionsMap.put(roomId, roomSessions);
            }

            roomSessions.add(session);
        }
    }

    @OnClose
    public void onClose(Session closedSession) {
        System.out.println("Session " + closedSession.getId()+" has ended");

        String roomId = sessionIdToBoardNumMap.get(closedSession.getId());
        sessionIdToBoardNumMap.remove(closedSession.getId());

        List<Session> openSessions = new ArrayList<Session>();
        for (Session peerSession : roomNumToWSSessionsMap.get(roomId)) {
            if (!closedSession.getId().equals(peerSession.getId())) {
                openSessions.add(peerSession);
            }
        }

        roomNumToWSSessionsMap.put(roomId, openSessions);
    }

    @OnError
    public void error(Session session, Throwable t) {
        System.out.println(t);
    }

    private static String getroomIdParam(HandshakeRequest req) {
        System.out.println("params");
        Map<String,List<String>> params = req.getParameterMap();
        for (String key: params.keySet()) {
            if (key.equals("roomId")) {
                return params.get(key).get(0);
            }
        }

        return null;        
    }
}

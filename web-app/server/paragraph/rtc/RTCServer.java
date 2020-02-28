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


@ServerEndpoint(value="/broadcast", configurator = GetHttpSessionConfigurator.class)
public class RTCServer {

    public static final String WS_KEEP_ALIVE_MESSAGE = "WS_KEEP_ALIVE_MESSAGE";
    private static Map<Integer, List<Session>> roomNumToWSSessionsMap = Collections.synchronizedMap(new HashMap<Integer, List<Session>>());
    private static Map<String, Integer> sessionIdToBoardNumMap = Collections.synchronizedMap(new HashMap<String, Integer>());

    @OnMessage
    public void onMessage(Session session, String msg) {
        System.out.println("got message : " + msg + " from session : " + session.getId());

        if (msg.equals(WS_KEEP_ALIVE_MESSAGE)) {
            System.out.println("Ignoring keep alive message");
            return;
        }

        Integer roomNumber = sessionIdToBoardNumMap.get(session.getId());
        System.out.println("Room number from session : " + roomNumber);

        Set<String> closedSessionIds = new HashSet<String>();

        try {
            for (Session peerSession : roomNumToWSSessionsMap.get(roomNumber)) {
                System.out.println("session id for peer : " + peerSession.getId());
                if (peerSession.isOpen()) {
                if (!peerSession.equals(session)) {
                        peerSession.getBasicRemote().sendText(msg);
                    }                    
                } else {
                    closedSessionIds.add(peerSession.getId());
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        // remove closed sessions from maps
        for (String closedSessionId: closedSessionIds) {
            sessionIdToBoardNumMap.remove(closedSessionId);            
        }

        List<Session> openSessions = new ArrayList<Session>();
        for (Session peerSession : roomNumToWSSessionsMap.get(roomNumber)) {
            if (!closedSessionIds.contains(peerSession.getId())) {
                openSessions.add(peerSession);
            } 
        }
        roomNumToWSSessionsMap.put(roomNumber, openSessions);
    }

    @OnOpen
    public void open(Session session, EndpointConfig conf) {

        HandshakeRequest req = (HandshakeRequest) conf.getUserProperties()
                                                      .get("handshakereq");
        AuthenticationCookies authCookies = AuthenticationUtils.getAuthCookies(req);

        boolean isAuthentic = AuthenticationUtils.authenticate(authCookies);
        System.out.println("auth result : " + isAuthentic);

        if (!isAuthentic) {
            try{
                session.close();
                return;
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        Integer roomNumber = getRoomNumberParam(req);
        System.out.println("Room number from param : " + roomNumber);

        sessionIdToBoardNumMap.put(session.getId(), roomNumber);

        if (roomNumber != null) {
            List<Session> roomSessions = roomNumToWSSessionsMap.get(roomNumber);
            if (roomSessions == null) {
                roomSessions = new ArrayList<Session>();
                roomNumToWSSessionsMap.put(roomNumber, roomSessions);
            }

            roomSessions.add(session);
        }
    }

    @OnClose
    public void onClose(Session session){
        System.out.println("Session " + session.getId()+" has ended");
    }

    @OnError
    public void error(Session session, Throwable t) {
        System.out.println(t);
    }

    private static Integer getRoomNumberParam(HandshakeRequest req) {
        System.out.println("params");
        Map<String,List<String>> params = req.getParameterMap();
        for (String key: params.keySet()) {
            if (key.equals("roomNumber")) {
                return Integer.parseInt(params.get(key).get(0));
            }
        }

        return null;        
    }
}

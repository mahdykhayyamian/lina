import java.io.IOException;

import javax.websocket.EndpointConfig;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.OnError;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;
import java.util.Set;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpSession;
import javax.websocket.server.HandshakeRequest;


@ServerEndpoint(value="/broadcast", configurator = GetHttpSessionConfigurator.class)
public class RTCServer {

    private static Set<Session> peers = Collections.synchronizedSet(new HashSet<Session>());

    private Session wsSession;
    private HttpSession httpSession;

    @OnMessage
    public void onMessage(Session session, String msg) {
        System.out.println("got message : " + msg);
        System.out.println("peers size" + peers.size());

        try {
            for (Session peer : peers) {
                if (!peer.equals(session)) {
                    peer.getBasicRemote().sendText(msg);
                }
            }
        } catch (IOException e) {
            System.out.println(e);
        }
    }

    @OnOpen
    public void open(Session session, EndpointConfig conf) {

        HandshakeRequest req = (HandshakeRequest) conf.getUserProperties()
                                                      .get("handshakereq");
        System.out.println("headers ");
        Map<String,List<String>> headers = req.getHeaders();
        for (String key: headers.keySet()) {
            System.out.println(key);

            for (String value: headers.get(key)) {
                System.out.println("\t value = " + value);
            }
        }

        System.out.println("params");
        Map<String,List<String>> params = req.getParameterMap();
        for (String key: params.keySet()) {
            System.out.println(key);

            for (String value: params.get(key)) {
                System.out.println("\t value = " + value);
            }
        }

        peers.add(session);
    }

    @OnClose
    public void onClose(Session session){
        System.out.println("Session " +session.getId()+" has ended");
        peers.remove(session);
    }

    @OnError
    public void error(Session session, Throwable t) {
        System.out.println(t);
        peers.remove(session);
    }

}
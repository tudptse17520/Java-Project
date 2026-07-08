package vn.edu.ut.pbms.service;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Component
public class SseEmitterManager {

    // Map buildingId to a list of SSE clients
    private final Map<Long, CopyOnWriteArrayList<SseEmitter>> clients = new ConcurrentHashMap<>();

    public SseEmitter subscribe(Long buildingId) {
        SseEmitter emitter = new SseEmitter(600000L); // 10 minutes timeout
        
        Long key = buildingId != null ? buildingId : -1L; // -1L for global
        clients.computeIfAbsent(key, k -> new CopyOnWriteArrayList<>()).add(emitter);

        emitter.onCompletion(() -> removeEmitter(key, emitter));
        emitter.onTimeout(() -> removeEmitter(key, emitter));
        emitter.onError(e -> removeEmitter(key, emitter));

        return emitter;
    }

    private void removeEmitter(Long buildingId, SseEmitter emitter) {
        CopyOnWriteArrayList<SseEmitter> list = clients.get(buildingId);
        if (list != null) {
            list.remove(emitter);
            if (list.isEmpty()) {
                clients.remove(buildingId);
            }
        }
    }

    public void broadcastToBuilding(Long buildingId, Object eventData) {
        // Broadcast to specific building clients
        broadcastToKey(buildingId, eventData);
        // Broadcast to global clients (-1L)
        broadcastToKey(-1L, eventData);
    }

    private void broadcastToKey(Long key, Object eventData) {
        CopyOnWriteArrayList<SseEmitter> list = clients.get(key);
        if (list != null && !list.isEmpty()) {
            List<SseEmitter> deadEmitters = new ArrayList<>();
            for (SseEmitter emitter : list) {
                try {
                    emitter.send(SseEmitter.event()
                            .name("slot-availability")
                            .data(eventData));
                } catch (Exception e) {
                    deadEmitters.add(emitter);
                }
            }
            list.removeAll(deadEmitters);
            if (list.isEmpty()) {
                clients.remove(key);
            }
        }
    }
}

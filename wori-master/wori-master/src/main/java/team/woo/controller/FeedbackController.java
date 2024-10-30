package team.woo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import team.woo.algorithm.FeedbackService;

import java.util.Map;

@RestController
@RequestMapping("/api/task")  // 수정된 기본 경로
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    // 대안 경로: /api/task/{taskTypeName}/feedback
    @PostMapping("/{taskTypeName}/feedback")
    public ResponseEntity<String> submitFeedback(
            @PathVariable String taskTypeName,
            @RequestBody Map<String, Object> feedbackData) {

        double feedbackSum = ((Number) feedbackData.get("feedbackSum")).doubleValue();

        feedbackService.processFeedback(feedbackSum, taskTypeName);

        return ResponseEntity.ok("가중치가 성공적으로 업데이트되었습니다.");
    }
}

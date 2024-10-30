package team.woo.algorithm;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FeedbackService {

    @Autowired
    private TaskTypeRepository taskTypeRepository;

    @Transactional
    public void processFeedback(double feedbackSum, String taskTypeName) {
        // TaskType 가져오기
        TaskType taskType = taskTypeRepository.findByName(taskTypeName)
                .orElseThrow(() -> new IllegalArgumentException("Invalid task type: " + taskTypeName));

        Weight weight = taskType.getWeight();

        // WeightHistory에 기존 가중치 기록 (변경되기 전에)
        int updateCount = taskType.getWeightHistories().size() + 1;
        WeightHistory weightHistory = new WeightHistory(weight, taskType, updateCount);
        taskType.addWeightHistory(weightHistory);

        // 가중치 업데이트 로직
        double baseLearningRate = 0.05;  // 기본 학습률 설정
        double weightChange = baseLearningRate * Math.abs(feedbackSum);

        if (feedbackSum > 0) {
            // 시간이 부족한 경우, 긴급도와 난이도 가중치 증가
            weight.setUrgencyWeight(weight.getUrgencyWeight() + weightChange);
            weight.setDifficultyWeight(weight.getDifficultyWeight() + weightChange);
        }

        else if (feedbackSum < 0) {
            // 시간이 남은 경우, 스트레스와 중요도 가중치 감소
            weight.setStressWeight(weight.getStressWeight() - weightChange);
            weight.setImportanceWeight(weight.getImportanceWeight() - weightChange);
        }

        // 변경 사항 저장
        taskTypeRepository.save(taskType);
    }
}

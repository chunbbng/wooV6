document.addEventListener("DOMContentLoaded", function () {
    var gif = document.getElementById("myGif");
    var fallbackImage = document.getElementById("fallbackImage");

    // 페이지 로드 시 1회 자동 재생
    gif.style.display = "block";
    fallbackImage.style.display = "none";

    // 자동 재생 후 GIF 숨기기 (자동 반복 방지) 및 대체 이미지 표시
    setTimeout(function () {
        gif.style.display = "none";
        fallbackImage.style.display = "block"; // 대체 이미지 표시
    }, 3000); // GIF의 재생 시간에 맞춰 조정

    // 마우스를 갖다 댔을 때 재생
    document.querySelector('.animation-container').addEventListener("mouseenter", function () {
        gif.style.display = "block";
        fallbackImage.style.display = "none"; // 대체 이미지 숨기기
    });

    // 마우스를 떼었을 때 GIF 숨기기 및 대체 이미지 표시
    document.querySelector('.animation-container').addEventListener("mouseleave", function () {
        gif.style.display = "none";
        fallbackImage.style.display = "block"; // 대체 이미지 표시
    });
});

document.querySelectorAll('.schedule-box').forEach(box => {
    box.addEventListener('mouseenter', () => {
        console.log('Mouse entered');  // 로그 확인
        box.classList.add('blink');
    });

    box.addEventListener('mouseleave', () => {
        console.log('Mouse left');  // 로그 확인
        box.classList.remove('blink');
    });
});
const options = document.querySelectorAll('.task-option');

options.forEach(opt => {
    opt.addEventListener('click', function() {
        // 모든 옵션에서 selected 클래스를 제거
        options.forEach(o => o.classList.remove('selected'));
        // 선택한 옵션에 selected 클래스 추가
        this.classList.add('selected');
        // 선택된 작업 유형을 hidden 필드에 저장
        document.getElementById('taskType').value = this.getAttribute('data-task');

        // '해당 작업 유형의 평균 시간이 노란색으로 표시됩니다.' 문구를 서서히 나타나게 함
        const averageTimeNotice = document.getElementById('averageTimeNotice');
        averageTimeNotice.style.opacity = 1;

        // 3초 후에 서서히 사라지도록 설정
        setTimeout(() => {
            averageTimeNotice.style.opacity = 0;
        }, 2500);  // 3초 후 서서히 사라짐

    });
});

// 슬라이더 값 표시 업데이트
const difficultySlider = document.getElementById('difficulty');
const difficultyValue = document.getElementById('difficultyValue');
const stressSlider = document.getElementById('stress');
const stressValue = document.getElementById('stressValue');
const urgencySlider = document.getElementById('urgency');
const urgencyValue = document.getElementById('urgencyValue');
const importanceSlider = document.getElementById('importance');
const importanceValue = document.getElementById('importanceValue');

const sliders = [
    { slider: difficultySlider, value: difficultyValue },
    { slider: stressSlider, value: stressValue },
    { slider: urgencySlider, value: urgencyValue },
    { slider: importanceSlider, value: importanceValue }
];

sliders.forEach(({ slider, value }) => {
    if (slider && value) {
        value.textContent = slider.value;
        slider.addEventListener('input', () => {
            value.textContent = slider.value;
        });
    } else {
        console.error("Slider or value element not found.");
    }
});



// 첫 번째 시간예측 슬라이더
var predictSlider = document.getElementById('predictSlider');
predictSlider.style.width = '1000px';  // 슬라이더 너비 설정

noUiSlider.create(predictSlider, {
    start: 0,
    connect: [true, false],
    range: {
        'min': 0,
        'max': 180
    },
    step: 1,
    tooltips: true,
    format: {
        to: function (value) {
            return Math.round(value) + '분';
        },
        from: function (value) {
            return Number(value.replace('분', ''));
        }
    },
    pips: {
        mode: 'values',
        values: [30, 60, 90, 120, 150, 180],
        density: 4
    }
});

// 슬라이더 값 업데이트
predictSlider.noUiSlider.on('update', function (values, handle) {
    document.getElementById('timeValue').textContent = values[handle];
    document.getElementById('estimatedTime').value = values[handle].replace('분', '');
});

// 작업 유형에 따른 슬라이더 업데이트 및 배경에 평균 범위 표시
document.querySelectorAll('.task-type-preference .task-option').forEach(option => {
    option.addEventListener('click', () => {
        document.querySelectorAll('.task-type-preference .task-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        option.classList.add('selected');

        const taskType = option.getAttribute('data-task');
        document.getElementById('taskType').value = taskType;

        // 작업 유형에 따른 평균 시간 범위
        const timeRanges = {
            '운동': [30, 60],
            '회의': [30, 60],
            '보고서 작성': [120, 180],
            '학습': [90, 120],
            '가사일': [150, 180],
            '창의적인 작업': [60, 120]
        };

        const [minTime, maxTime] = timeRanges[taskType];

// 슬라이더 바의 배경에 평균 시간 구간 색상 표시
        let sliderBar = document.querySelector('.noUi-base');
        let backgroundStyle = `linear-gradient(
    to right,
    #ddd 0%,
    #ddd ${(minTime / 180) * 100}%,
    rgba(255, 255, 0, 1) ${(minTime / 180) * 100}%,
    rgba(255, 255, 0, 1) ${(maxTime / 180) * 100}%,
    #ddd ${(maxTime / 180) * 100}%,
    #ddd 100%
)`;

        sliderBar.style.background = backgroundStyle;
    });
});

// 슬라이더 업데이트 시 평균 시간 구간을 유지
predictSlider.noUiSlider.on('slide', function () {
    let taskType = document.getElementById('taskType').value;

    const timeRanges = {
        '운동': [30, 60],
        '회의': [30, 60],
        '보고서 작성': [120, 180],
        '학습': [90, 120],
        '가사일': [150, 180],
        '창의적인 작업': [60, 120]
    };

    const [minTime, maxTime] = timeRanges[taskType];

// 슬라이더 바의 배경에 평균 시간 구간 색상 표시
    let sliderBar = document.querySelector('.noUi-base');
    let backgroundStyle = `linear-gradient(
    to right,
    #ddd 0%,
    #ddd ${(minTime / 180) * 100}%,
    rgba(255, 255, 0, 1) ${(minTime / 180) * 100}%,
    rgba(255, 255, 0, 1) ${(maxTime / 180) * 100}%,
    #ddd ${(maxTime / 180) * 100}%,
    #ddd 100%
)`;

    sliderBar.style.background = backgroundStyle;
});

// 두 번째 슬라이더 생성
var secondSlider = document.getElementById('secondSlider');
secondSlider.style.width = '1000px';  // 슬라이더 너비 설정
noUiSlider.create(secondSlider, {
    start: 180,
    connect: [true, false],
    range: {
        'min': 180,
        'max': 360,
    },
    step: 1,
    tooltips: true,
    format: {
        to: function (value) {
            return Math.round(value) + '분';
        },
        from: function (value) {
            return Number(value.replace('분', ''));
        }
    },
    pips: {
        mode: 'values',
        values: [180, 210, 240, 270, 300, 330, 360],
        density: 4
    }
});

// 두 번째 슬라이더 값 업데이트
secondSlider.noUiSlider.on('update', function (values, handle) {
    // 첫 번째 슬라이더 값과 두 번째 슬라이더 값을 더해 하나의 값으로 표시
    let firstSliderValue = Number(predictSlider.noUiSlider.get().replace('분', ''));
    let combinedValue = firstSliderValue + Number(values[handle].replace('분', ''));
    document.getElementById('timeValue').textContent = combinedValue + '분';  // 두 슬라이더 값을 합한 시간 표시
    document.getElementById('secondEstimatedTime').value = values[handle].replace('분', '');  // 숨겨진 필드에 값 저장
});

// 확장 버튼
var expandButton = document.getElementById('expandButton');
var secondSliderContainer = document.getElementById('secondSliderContainer');

expandButton.addEventListener('click', function() {
    if (secondSliderContainer.style.display === 'none' || secondSliderContainer.style.display === '') {
        secondSliderContainer.style.display = 'block';
        expandButton.classList.add('up');  // 확장 시 버튼 상태 변경
    } else {
        secondSliderContainer.style.display = 'none';
        expandButton.classList.remove('up');  // 축소 시 버튼 상태 변경
        document.getElementById('timeValue').textContent = predictSlider.noUiSlider.get();  // 확장 취소 시 첫 번째 슬라이더 값으로 되돌림
    }
});
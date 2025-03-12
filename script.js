document.addEventListener('DOMContentLoaded', function() {
    const calculateButton = document.getElementById('calculate');
    const birthdateInput = document.getElementById('birthdate');
    const resultDiv = document.getElementById('age-result');
    const japaneseAgeSpan = document.getElementById('japanese-age');
    const japaneseEraSpan = document.getElementById('japanese-era');
    const eraAgeSpan = document.getElementById('era-age');

    // 일본 연호 정보 (시작일과 연호명)
    const japaneseEras = [
        { name: "레이와", kanji: "令和", startDate: new Date(2019, 4, 1) },  // 2019년 5월 1일부터
        { name: "헤이세이", kanji: "平成", startDate: new Date(1989, 0, 8) }, // 1989년 1월 8일부터
        { name: "쇼와", kanji: "昭和", startDate: new Date(1926, 11, 25) },  // 1926년 12월 25일부터
        { name: "다이쇼", kanji: "大正", startDate: new Date(1912, 6, 30) }, // 1912년 7월 30일부터
        { name: "메이지", kanji: "明治", startDate: new Date(1868, 0, 25) }  // 1868년 1월 25일부터
    ];

    // 숫자만 입력 가능하도록 제한
    birthdateInput.addEventListener('input', function(e) {
        this.value = this.value.replace(/[^0-9]/g, '');
    });

    calculateButton.addEventListener('click', function() {
        const birthdateValue = birthdateInput.value;
        
        // 입력 검증
        if (birthdateValue.length !== 8 || !/^\d{8}$/.test(birthdateValue)) {
            alert('생년월일을 8자리 숫자로 입력해주세요. (예: 20000413)');
            return;
        }
        
        // 8자리 숫자를 연, 월, 일로 분리
        const year = parseInt(birthdateValue.substring(0, 4));
        const month = parseInt(birthdateValue.substring(4, 6)) - 1; // JavaScript의 월은 0부터 시작
        const day = parseInt(birthdateValue.substring(6, 8));
        
        // 유효한 날짜인지 확인
        const birthdate = new Date(year, month, day);
        if (
            isNaN(birthdate.getTime()) || 
            birthdate.getFullYear() !== year || 
            birthdate.getMonth() !== month || 
            birthdate.getDate() !== day
        ) {
            alert('유효하지 않은 날짜입니다. 올바른 생년월일을 입력해주세요.');
            return;
        }

        // 현재 날짜
        const today = new Date();
        
        // 일본 나이 계산 (출생일 기준으로 1년이 지날 때마다 나이를 한 살씩 더하는 방식)
        // 현재 연도 - 출생 연도 = 만 나이
        let japaneseAge = today.getFullYear() - birthdate.getFullYear();
        
        // 생일이 지났는지 확인
        const isBirthdayPassed = 
            today.getMonth() > birthdate.getMonth() || 
            (today.getMonth() === birthdate.getMonth() && today.getDate() >= birthdate.getDate());
        
        // 생일이 지나지 않았다면 나이를 하나 줄임
        if (!isBirthdayPassed) {
            japaneseAge--;
        }

        // 연호 찾기
        let era = "해당 없음";
        let eraName = "";
        let eraYear = 0;
        
        for (const eraInfo of japaneseEras) {
            if (birthdate >= eraInfo.startDate) {
                era = `${eraInfo.name}(${eraInfo.kanji})`;
                eraName = eraInfo.name;
                
                // 연호 기준 나이 계산
                const yearDiff = birthdate.getFullYear() - eraInfo.startDate.getFullYear();
                const monthDiff = birthdate.getMonth() - eraInfo.startDate.getMonth();
                const dayDiff = birthdate.getDate() - eraInfo.startDate.getDate();
                
                if (monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0)) {
                    eraYear = yearDiff + 1;
                } else {
                    eraYear = yearDiff;
                }
                
                break;
            }
        }

        // 결과 표시
        japaneseAgeSpan.textContent = japaneseAge;
        japaneseEraSpan.textContent = era;
        
        // 연호 연도 표시 (예: 헤이세이 12년)
        if (eraName && eraYear > 0) {
            eraAgeSpan.textContent = `${eraName} ${eraYear}년`;
        } else {
            eraAgeSpan.textContent = eraYear;
        }
        
        resultDiv.classList.remove('hidden');
    });
}); 
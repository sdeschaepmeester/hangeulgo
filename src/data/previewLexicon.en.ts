export const previewLexiconEn: {
    native: string;
    ko: string;
    phonetic: string;
    difficulty: "easy" | "medium" | "hard";
    tags: string[];
}[] = [
        // Phrases
        { native: "Hello", ko: "안녕하세요", phonetic: "annyeonghaseyo", difficulty: "easy", tags: ["Phrases", "Common"] },
        { native: "Nice to meet you", ko: "반갑습니다", phonetic: "bangapseumnida", difficulty: "easy", tags: ["Phrases", "Formal"] },
        { native: "Thanks (gomawo)", ko: "고마워", phonetic: "gomawo", difficulty: "easy", tags: ["Phrases", "Informal"] },
        { native: "Thanks (gomapseumnida)", ko: "고맙습니다", phonetic: "gomapseumnida", difficulty: "easy", tags: ["Phrases", "Common"] },
        { native: "Thanks (gamsahamnida)", ko: "감사합니다", phonetic: "gamsahamnida", difficulty: "easy", tags: ["Phrases", "Formal"] },
        { native: "You're welcome", ko: "천만에요", phonetic: "cheonmaneyo", difficulty: "medium", tags: ["Phrases", "Formal"] },
        { native: "Sorry", ko: "미안해요", phonetic: "mianhaeyo", difficulty: "easy", tags: ["Phrases", "Common"] },
        { native: "Excuse me", ko: "죄송합니다", phonetic: "joesonghamnida", difficulty: "medium", tags: ["Phrases", "Formal"] },
        { native: "Goodbye", ko: "안녕히 가세요", phonetic: "annyeonghi gaseyo", difficulty: "easy", tags: ["Phrases", "Formal"] },
        { native: "Good night", ko: "안녕히 주무세요", phonetic: "annyeonghi jumuseyo", difficulty: "medium", tags: ["Phrases", "Formal"] },
        { native: "Yes", ko: "네", phonetic: "ne", difficulty: "easy", tags: ["Phrases"] },
        { native: "No", ko: "아니요", phonetic: "aniyo", difficulty: "easy", tags: ["Phrases"] },
        { native: "I don’t know", ko: "모르겠어요", phonetic: "moreugesseoyo", difficulty: "medium", tags: ["Phrases", "Common"] },
        { native: "It’s okay", ko: "괜찮아요", phonetic: "gwaenchanayo", difficulty: "easy", tags: ["Phrases", "Common"] },
        { native: "Congratulations", ko: "축하합니다", phonetic: "chukahamnida", difficulty: "medium", tags: ["Phrases", "Formal"] },

        // Family
        { native: "Mom", ko: "엄마", phonetic: "eomma", difficulty: "easy", tags: ["Family"] },
        { native: "Dad", ko: "아빠", phonetic: "appa", difficulty: "easy", tags: ["Family"] },
        { native: "Older brother (for male)", ko: "형", phonetic: "hyeong", difficulty: "medium", tags: ["Family"] },
        { native: "Older brother (for female)", ko: "오빠", phonetic: "oppa", difficulty: "medium", tags: ["Family"] },
        { native: "Older sister (for male)", ko: "누나", phonetic: "nuna", difficulty: "medium", tags: ["Family"] },
        { native: "Older sister (for female)", ko: "언니", phonetic: "eonni", difficulty: "medium", tags: ["Family"] },
        { native: "Parents", ko: "부모님", phonetic: "bumonim", difficulty: "medium", tags: ["Family"] },
        { native: "Cousin", ko: "사촌", phonetic: "sachon", difficulty: "medium", tags: ["Family"] },
        { native: "Grandfather", ko: "할아버지", phonetic: "harabeoji", difficulty: "medium", tags: ["Family"] },
        { native: "Grandmother", ko: "할머니", phonetic: "halmeoni", difficulty: "medium", tags: ["Family"] },

        // Food
        { native: "Rice", ko: "밥", phonetic: "bap", difficulty: "easy", tags: ["Food"] },
        { native: "Soup", ko: "국", phonetic: "guk", difficulty: "easy", tags: ["Food"] },
        { native: "Kimchi", ko: "김치", phonetic: "kimchi", difficulty: "easy", tags: ["Food"] },
        { native: "Fried chicken", ko: "치킨", phonetic: "chikin", difficulty: "easy", tags: ["Food"] },
        { native: "Korean BBQ", ko: "불고기", phonetic: "bulgogi", difficulty: "medium", tags: ["Food"] },
        { native: "Chili pepper", ko: "고추", phonetic: "gochu", difficulty: "medium", tags: ["Food"] },

        // Countries
        { native: "Korea", ko: "한국", phonetic: "hanguk", difficulty: "easy", tags: ["Countries"] },
        { native: "France", ko: "프랑스", phonetic: "peurangseu", difficulty: "easy", tags: ["Countries"] },
        { native: "Japan", ko: "일본", phonetic: "ilbon", difficulty: "easy", tags: ["Countries"] },
        { native: "China", ko: "중국", phonetic: "jungguk", difficulty: "easy", tags: ["Countries"] },
        { native: "USA", ko: "미국", phonetic: "miguk", difficulty: "easy", tags: ["Countries"] },

        // Dates
        { native: "Monday", ko: "월요일", phonetic: "woryoil", difficulty: "easy", tags: ["Days", "Date"] },
        { native: "Tuesday", ko: "화요일", phonetic: "hwayoil", difficulty: "easy", tags: ["Days", "Date"] },
        { native: "Wednesday", ko: "수요일", phonetic: "suyoil", difficulty: "easy", tags: ["Days", "Date"] },
        { native: "Thursday", ko: "목요일", phonetic: "mogyoil", difficulty: "easy", tags: ["Days", "Date"] },
        { native: "Friday", ko: "금요일", phonetic: "geumyoil", difficulty: "easy", tags: ["Days", "Date"] },
        { native: "Saturday", ko: "토요일", phonetic: "toyoil", difficulty: "easy", tags: ["Days", "Date"] },
        { native: "Sunday", ko: "일요일", phonetic: "iryoil", difficulty: "easy", tags: ["Days", "Date"] },
        { native: "January", ko: "1월", phonetic: "irwol", difficulty: "easy", tags: ["Months", "Date"] },
        { native: "February", ko: "2월", phonetic: "iwol", difficulty: "easy", tags: ["Months", "Date"] },
        { native: "March", ko: "3월", phonetic: "samwol", difficulty: "easy", tags: ["Months", "Date"] },
        { native: "April", ko: "4월", phonetic: "sawol", difficulty: "easy", tags: ["Months", "Date"] },
        { native: "May", ko: "5월", phonetic: "owol", difficulty: "easy", tags: ["Months", "Date"] },
        { native: "June", ko: "6월", phonetic: "yuwol", difficulty: "easy", tags: ["Months", "Date"] },
        { native: "July", ko: "7월", phonetic: "chirwol", difficulty: "easy", tags: ["Months", "Date"] },
        { native: "August", ko: "8월", phonetic: "parwol", difficulty: "easy", tags: ["Months", "Date"] },
        { native: "September", ko: "9월", phonetic: "guwol", difficulty: "easy", tags: ["Months", "Date"] },
        { native: "October", ko: "10월", phonetic: "sibwol", difficulty: "easy", tags: ["Months", "Date"] },
        { native: "November", ko: "11월", phonetic: "sibirwol", difficulty: "easy", tags: ["Months", "Date"] },
        { native: "December", ko: "12월", phonetic: "sibiwol", difficulty: "easy", tags: ["Months", "Date"] },
        { native: "Spring", ko: "봄", phonetic: "bom", difficulty: "easy", tags: ["Seasons", "Date"] },
        { native: "Summer", ko: "여름", phonetic: "yeoreum", difficulty: "easy", tags: ["Seasons", "Date"] },
        { native: "Autumn", ko: "가을", phonetic: "gaeul", difficulty: "easy", tags: ["Seasons", "Date"] },
        { native: "Winter", ko: "겨울", phonetic: "gyeoul", difficulty: "easy", tags: ["Seasons", "Date"] },
    ];
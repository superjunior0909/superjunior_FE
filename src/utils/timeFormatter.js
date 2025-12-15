/**
 * ISO 8601 형식의 날짜 문자열을 상대적인 시간으로 변환합니다.
 * @param {string} isoDateString - ISO 8601 형식의 날짜 문자열 (예: "2025-12-15T10:30:00+09:00")
 * @returns {string} 상대적인 시간 문자열 (예: "방금 전", "3분 전", "2시간 전")
 */
export function getRelativeTime(isoDateString) {
  if (!isoDateString) {
    return '알 수 없음'
  }

  try {
    const now = new Date()
    const past = new Date(isoDateString)

    // 밀리초 단위로 시간 차이 계산
    const diffInMs = now - past

    // 음수인 경우 (미래 시간) 방금 전으로 표시
    if (diffInMs < 0) {
      return '방금 전'
    }

    // 초 단위로 변환
    const diffInSeconds = Math.floor(diffInMs / 1000)

    // 1분 미만
    if (diffInSeconds < 60) {
      return '방금 전'
    }

    // 분 단위로 변환
    const diffInMinutes = Math.floor(diffInSeconds / 60)

    // 1시간 미만
    if (diffInMinutes < 60) {
      return `${diffInMinutes}분 전`
    }

    // 시간 단위로 변환
    const diffInHours = Math.floor(diffInMinutes / 60)

    // 24시간 미만
    if (diffInHours < 24) {
      return `${diffInHours}시간 전`
    }

    // 일 단위로 변환
    const diffInDays = Math.floor(diffInHours / 24)

    // 7일 미만
    if (diffInDays < 7) {
      return `${diffInDays}일 전`
    }

    // 30일 미만
    if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7)
      return `${weeks}주 전`
    }

    // 365일 미만
    if (diffInDays < 365) {
      const months = Math.floor(diffInDays / 30)
      return `${months}개월 전`
    }

    // 1년 이상
    const years = Math.floor(diffInDays / 365)
    return `${years}년 전`
  } catch (error) {
    console.error('시간 변환 중 오류:', error)
    return '알 수 없음'
  }
}

/**
 * ISO 8601 형식의 날짜 문자열을 읽기 쉬운 형식으로 변환합니다.
 * @param {string} isoDateString - ISO 8601 형식의 날짜 문자열
 * @returns {string} 포맷된 날짜 문자열 (예: "2025년 12월 15일 10:30")
 */
export function formatDateTime(isoDateString) {
  if (!isoDateString) {
    return ''
  }

  try {
    const date = new Date(isoDateString)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')

    return `${year}년 ${month}월 ${day}일 ${hours}:${minutes}`
  } catch (error) {
    console.error('날짜 포맷팅 중 오류:', error)
    return ''
  }
}

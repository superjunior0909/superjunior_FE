<template>
  <main class="application-page">
    <div class="container">
      <div class="application-card">
        <div class="application-header">
          <h1>판매자 신청</h1>
          <p>공구공구에서 판매자로 활동하시려면 아래 정보를 입력해주세요</p>
        </div>
        <form @submit.prevent="handleSubmit" class="application-form">
          <div class="form-section">
            <h3>기본 정보</h3>
            <div class="form-group">
              <label for="storeName">상점명 *</label>
              <input
                id="storeName"
                v-model="form.storeName"
                type="text"
                placeholder="상점명을 입력하세요"
                required
              />
            </div>
            <div class="form-group">
              <label for="businessNumber">사업자 등록번호 *</label>
              <input
                id="businessNumber"
                v-model="form.businessNumber"
                type="text"
                placeholder="000-00-00000"
                required
                maxlength="12"
              />
            </div>
            <div class="form-group">
              <label for="businessType">업종 *</label>
              <select id="businessType" v-model="form.businessType" required>
                <option value="">업종을 선택하세요</option>
                <option value="전자제품">전자제품</option>
                <option value="패션">패션</option>
                <option value="식품">식품</option>
                <option value="뷰티">뷰티</option>
                <option value="홈/리빙">홈/리빙</option>
                <option value="기타">기타</option>
              </select>
            </div>
          </div>

          <div class="form-section">
            <h3>연락처 정보</h3>
            <div class="form-group">
              <label for="contactPhone">연락처 *</label>
              <input
                id="contactPhone"
                v-model="form.contactPhone"
                type="tel"
                placeholder="010-0000-0000"
                required
              />
            </div>
            <div class="form-group">
              <label for="contactEmail">이메일 *</label>
              <input
                id="contactEmail"
                v-model="form.contactEmail"
                type="email"
                placeholder="이메일을 입력하세요"
                required
              />
            </div>
          </div>

          <div class="form-section">
            <h3>은행 정보</h3>
            <div class="form-row">
              <div class="form-group">
                <label for="bankName">은행명 *</label>
                <select id="bankName" v-model="form.bankName" required>
                  <option value="">은행을 선택하세요</option>
                  <option value="KB국민은행">KB국민은행</option>
                  <option value="신한은행">신한은행</option>
                  <option value="우리은행">우리은행</option>
                  <option value="하나은행">하나은행</option>
                  <option value="NH농협은행">NH농협은행</option>
                  <option value="카카오뱅크">카카오뱅크</option>
                  <option value="토스뱅크">토스뱅크</option>
                </select>
              </div>
              <div class="form-group">
                <label for="accountNumber">계좌번호 *</label>
                <input
                  id="accountNumber"
                  v-model="form.accountNumber"
                  type="text"
                  placeholder="계좌번호를 입력하세요"
                  required
                />
              </div>
            </div>
            <div class="form-group">
              <label for="accountHolder">예금주 *</label>
              <input
                id="accountHolder"
                v-model="form.accountHolder"
                type="text"
                placeholder="예금주명을 입력하세요"
                required
              />
            </div>
          </div>

          <div class="form-section">
            <h3>상점 소개</h3>
            <div class="form-group">
              <label for="description">상점 설명 *</label>
              <textarea
                id="description"
                v-model="form.description"
                rows="5"
                placeholder="상점에 대한 소개를 작성해주세요"
                required
              ></textarea>
            </div>
          </div>

          <div class="form-section">
            <h3>약관 동의</h3>
            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" v-model="form.agreeTerms" required />
                <span>판매자 이용약관에 동의합니다 *</span>
              </label>
              <label class="checkbox-label">
                <input type="checkbox" v-model="form.agreePrivacy" required />
                <span>개인정보 처리방침에 동의합니다 *</span>
              </label>
              <label class="checkbox-label">
                <input type="checkbox" v-model="form.agreeSettlement" required />
                <span>정산 약관에 동의합니다 *</span>
              </label>
            </div>
          </div>

          <button type="submit" class="btn btn-primary" :disabled="loading || !isFormValid">
            {{ loading ? '신청 중...' : '판매자 신청하기' }}
          </button>
        </form>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = ref({
  storeName: '',
  businessNumber: '',
  businessType: '',
  contactPhone: '',
  contactEmail: '',
  bankName: '',
  accountNumber: '',
  accountHolder: '',
  description: '',
  agreeTerms: false,
  agreePrivacy: false,
  agreeSettlement: false
})

const loading = ref(false)

const isFormValid = computed(() => {
  return (
    form.value.storeName &&
    form.value.businessNumber &&
    form.value.businessType &&
    form.value.contactPhone &&
    form.value.contactEmail &&
    form.value.bankName &&
    form.value.accountNumber &&
    form.value.accountHolder &&
    form.value.description &&
    form.value.agreeTerms &&
    form.value.agreePrivacy &&
    form.value.agreeSettlement
  )
})

const handleSubmit = async () => {
  if (!isFormValid.value) {
    alert('모든 필수 항목을 입력해주세요.')
    return
  }

  loading.value = true
  try {
    // TODO: 실제 API 호출로 교체
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 판매자 신청 정보 저장
    const applicationData = {
      ...form.value,
      submittedAt: new Date().toISOString(),
      status: 'pending'
    }
    localStorage.setItem('seller_application', JSON.stringify(applicationData))
    
    alert('판매자 신청이 완료되었습니다. 검토 후 연락드리겠습니다.')
    router.push('/me/profile')
  } catch (error) {
    alert('신청에 실패했습니다. 다시 시도해주세요.')
    console.error('Application error:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // 로그인 체크
  const token = localStorage.getItem('access_token')
  if (!token) {
    alert('로그인이 필요합니다.')
    router.push('/login')
  }
})
</script>

<style scoped>
.application-page {
  background: #0a0a0a;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.container {
  width: 100%;
  max-width: 800px;
}

.application-card {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  max-height: 90vh;
  overflow-y: auto;
}

.application-header {
  text-align: center;
  margin-bottom: 32px;
}

.application-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 8px;
}

.application-header p {
  color: #a0a0a0;
  font-size: 15px;
}

.application-form {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-bottom: 24px;
  border-bottom: 1px solid #2a2a2a;
}

.form-section:last-of-type {
  border-bottom: none;
}

.form-section h3 {
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 8px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  color: #e0e0e0;
  font-size: 14px;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 14px 16px;
  background: #0f0f0f;
  border: 2px solid #2a2a2a;
  border-radius: 12px;
  font-size: 15px;
  color: #ffffff;
  transition: border-color 0.2s;
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: #666;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #ffffff;
  background: #151515;
}

.form-group select {
  cursor: pointer;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #e0e0e0;
  font-size: 14px;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.btn {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #ffffff;
  color: #0a0a0a;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 255, 255, 0.2);
  background: #f0f0f0;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .application-card {
    padding: 32px 24px;
  }

  .application-header h1 {
    font-size: 28px;
  }
}
</style>





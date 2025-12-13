<template>
  <main class="signup-page">
    <div class="container">
      <div class="signup-card">
        <div class="signup-header">
          <h1>회원가입</h1>
          <p>GameMate와 함께 시작하세요</p>
        </div>
        <form @submit.prevent="handleSignup" class="signup-form">
          <div class="form-row">
            <div class="form-group">
              <label for="name">이름</label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                placeholder="이름을 입력하세요"
                required
              />
            </div>
            <div class="form-group">
              <label for="nickname">닉네임</label>
              <input
                id="nickname"
                v-model="form.nickname"
                type="text"
                placeholder="닉네임을 입력하세요"
                required
              />
            </div>
          </div>
          <div class="form-group">
            <label for="email">이메일</label>
            <div class="email-input-group">
              <input
                id="email"
                v-model="form.email"
                type="email"
                placeholder="이메일을 입력하세요"
                required
                :disabled="emailVerified"
              />
              <button
                type="button"
                class="btn-verify"
                :disabled="!isEmailValid || emailVerifying || emailVerified"
                @click="sendVerificationEmail"
              >
                {{ emailVerified ? '✓ 인증완료' : emailVerifying ? '전송 중...' : '인증하기' }}
              </button>
            </div>
            <div v-if="emailCodeSent && !emailVerified" class="verification-code-group">
              <input
                v-model="form.verificationCode"
                type="text"
                placeholder="인증 코드를 입력하세요"
                maxlength="6"
                class="code-input"
              />
              <button
                type="button"
                class="btn-verify-code"
                :disabled="!form.verificationCode || verifyingCode"
                @click="verifyEmailCode"
              >
                {{ verifyingCode ? '확인 중...' : '확인' }}
              </button>
            </div>
            <p v-if="emailVerified" class="form-success">✓ 이메일 인증이 완료되었습니다</p>
            <p v-else-if="emailCodeSent" class="form-hint">이메일로 전송된 인증 코드를 입력해주세요</p>
          </div>
          <div class="form-group">
            <label for="password">비밀번호</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              placeholder="8자 이상 입력하세요"
              required
              minlength="8"
            />
            <p class="form-hint">영문, 숫자, 특수문자를 포함하여 8자 이상</p>
          </div>
          <div class="form-group">
            <label for="passwordConfirm">비밀번호 확인</label>
            <input
              id="passwordConfirm"
              v-model="form.passwordConfirm"
              type="password"
              placeholder="비밀번호를 다시 입력하세요"
              required
            />
            <p v-if="form.passwordConfirm && form.password !== form.passwordConfirm" class="form-error">
              비밀번호가 일치하지 않습니다
            </p>
          </div>
          <div class="form-group">
            <label for="phone">전화번호</label>
            <input
              id="phone"
              v-model="form.phone"
              type="tel"
              placeholder="010-0000-0000"
              required
            />
          </div>
          <div class="form-group">
            <label>회원 유형</label>
            <div class="radio-group">
              <label class="radio-label">
                <input type="radio" v-model="form.userType" value="user" />
                <span>일반 사용자</span>
              </label>
              <label class="radio-label">
                <input type="radio" v-model="form.userType" value="seller" />
                <span>판매자</span>
              </label>
            </div>
          </div>
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="form.agreeTerms" required />
              <span>이용약관에 동의합니다</span>
            </label>
            <label class="checkbox-label">
              <input type="checkbox" v-model="form.agreePrivacy" required />
              <span>개인정보 처리방침에 동의합니다</span>
            </label>
            <label class="checkbox-label">
              <input type="checkbox" v-model="form.agreeMarketing" />
              <span>마케팅 정보 수신에 동의합니다 (선택)</span>
            </label>
          </div>
          <button type="submit" class="btn btn-primary" :disabled="loading || !isFormValid">
            {{ loading ? '가입 중...' : '회원가입' }}
          </button>
          <div class="login-link">
            <span>이미 계정이 있으신가요?</span>
            <router-link to="/UserLogin">로그인</router-link>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api/axios'

const router = useRouter()

const form = ref({
  name: '',
  nickname: '',
  email: '',
  verificationCode: '',
  password: '',
  passwordConfirm: '',
  phone: '',
  userType: 'user',
  agreeTerms: false,
  agreePrivacy: false,
  agreeMarketing: false
})

const loading = ref(false)
const emailCodeSent = ref(false)
const emailVerified = ref(false)
const emailVerifying = ref(false)
const verifyingCode = ref(false)

const isEmailValid = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(form.value.email)
})

const isFormValid = computed(() => {
  return (
    form.value.name &&
    form.value.nickname &&
    form.value.email &&
    emailVerified.value &&
    form.value.password &&
    form.value.password === form.value.passwordConfirm &&
    form.value.phone &&
    form.value.agreeTerms &&
    form.value.agreePrivacy
  )
})

const sendVerificationEmail = async () => {
  if (!isEmailValid.value) {
    alert('올바른 이메일 주소를 입력해주세요.')
    return
  }

  emailVerifying.value = true
  try {
    const response = await api.get(`/api/members/email/${encodeURIComponent(form.value.email)}`)
    console.log('이메일 인증 메일 전송 성공:', response.data)
    emailCodeSent.value = true
    alert('인증 메일이 전송되었습니다. 이메일에서 인증 코드를 확인해주세요.')
  } catch (error) {
    console.error('Email verification error:', error)
    if (error.response?.data?.message) {
      alert(error.response.data.message)
    } else {
      alert('인증 메일 전송에 실패했습니다. 다시 시도해주세요.')
    }
  } finally {
    emailVerifying.value = false
  }
}

const verifyEmailCode = async () => {
  if (!form.value.verificationCode) {
    alert('인증 코드를 입력해주세요.')
    return
  }

  verifyingCode.value = true
  try {
    const response = await api.get(`/api/members/email/verification/${form.value.verificationCode}`)
    console.log('이메일 인증 성공:', response.data)
    emailVerified.value = true
    alert('이메일 인증이 완료되었습니다.')
  } catch (error) {
    console.error('Code verification error:', error)
    if (error.response?.data?.message) {
      alert(error.response.data.message)
    } else {
      alert('인증 코드가 올바르지 않습니다. 다시 확인해주세요.')
    }
  } finally {
    verifyingCode.value = false
  }
}

const handleSignup = async () => {
  if (!isFormValid.value) {
    if (!emailVerified.value) {
      alert('이메일 인증을 완료해주세요.')
    } else {
      alert('모든 필수 항목을 입력해주세요.')
    }
    return
  }

  loading.value = true
  try {
    const signupData = {
      name: form.value.name,
      email: form.value.email,
      password: form.value.password,
      phoneNumber: form.value.phone
    }

    const response = await api.post('/api/members', signupData)
    console.log('회원가입 성공:', response.data)

    alert('회원가입이 완료되었습니다! 로그인해주세요.')
    router.push('/login')
  } catch (error) {
    console.error('Signup error:', error)
    if (error.response?.data?.message) {
      alert(error.response.data.message)
    } else if (error.response?.status === 409) {
      alert('이미 가입된 이메일입니다.')
    } else {
      alert('회원가입에 실패했습니다. 다시 시도해주세요.')
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.signup-page {
  background: #0a0a0a;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.container {
  width: 100%;
  max-width: 600px;
}

.signup-card {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  max-height: 90vh;
  overflow-y: auto;
}

.signup-header {
  text-align: center;
  margin-bottom: 32px;
}

.signup-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 8px;
}

.signup-header p {
  color: #a0a0a0;
  font-size: 15px;
}

.signup-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
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

.form-group input {
  padding: 14px 16px;
  background: #0f0f0f;
  border: 2px solid #2a2a2a;
  border-radius: 12px;
  font-size: 15px;
  color: #ffffff;
  transition: border-color 0.2s;
}

.form-group input::placeholder {
  color: #666;
}

.form-group input:focus {
  outline: none;
  border-color: #ffffff;
  background: #151515;
}

.form-group input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.email-input-group {
  display: flex;
  gap: 8px;
}

.email-input-group input {
  flex: 1;
}

.btn-verify {
  padding: 14px 20px;
  background: #ffffff;
  color: #0a0a0a;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
  min-width: 100px;
}

.btn-verify:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
  background: #f0f0f0;
}

.btn-verify:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.verification-code-group {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.code-input {
  flex: 1;
  padding: 14px 16px;
  background: #0f0f0f;
  border: 2px solid #2a2a2a;
  border-radius: 12px;
  font-size: 15px;
  text-align: center;
  letter-spacing: 4px;
  font-weight: 600;
  color: #ffffff;
}

.code-input:focus {
  outline: none;
  border-color: #ffffff;
  background: #151515;
}

.btn-verify-code {
  padding: 14px 24px;
  background: #ffffff;
  color: #0a0a0a;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}

.btn-verify-code:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
  background: #f0f0f0;
}

.btn-verify-code:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}


.form-hint {
  font-size: 12px;
  color: #888;
  margin-top: -4px;
}

.form-error {
  font-size: 12px;
  color: #ff6b6b;
  margin-top: -4px;
}

.form-success {
  font-size: 13px;
  color: #51cf66;
  margin-top: 4px;
  font-weight: 500;
}

.radio-group {
  display: flex;
  gap: 24px;
  margin-top: 8px;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #e0e0e0;
}

.radio-label input[type="radio"] {
  width: 18px;
  height: 18px;
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

.login-link {
  text-align: center;
  margin-top: 8px;
  font-size: 14px;
  color: #a0a0a0;
}

.login-link a {
  color: #ffffff;
  font-weight: 600;
  text-decoration: none;
  margin-left: 4px;
}

.login-link a:hover {
  text-decoration: underline;
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .signup-card {
    padding: 32px 24px;
  }

  .signup-header h1 {
    font-size: 28px;
  }

  .email-input-group {
    flex-direction: column;
  }

  .btn-verify {
    width: 100%;
  }

  .verification-code-group {
    flex-direction: column;
  }

  .btn-verify-code {
    width: 100%;
  }
}
</style>

